import { createCipheriv,createDecipheriv,randomBytes } from 'node:crypto';
import { adminDb } from './supabase';

export function marketplaceConnectionReady() {
  return Boolean(
    process.env.NEXT_PUBLIC_SITE_URL &&
    process.env.MERCADO_PAGO_CLIENT_ID &&
    process.env.MERCADO_PAGO_CLIENT_SECRET &&
    /^[a-f0-9]{64}$/i.test(process.env.TOKEN_ENCRYPTION_KEY || '')
  );
}
function key(){const raw=process.env.TOKEN_ENCRYPTION_KEY;if(!raw||!/^[a-f0-9]{64}$/i.test(raw))throw new Error('TOKEN_ENCRYPTION_KEY deve ter 32 bytes em hexadecimal');return Buffer.from(raw,'hex')}
export function encrypt(value:string){const iv=randomBytes(12);const cipher=createCipheriv('aes-256-gcm',key(),iv);const payload=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${payload.toString('hex')}`}
export function decrypt(value:string){const [iv,tag,payload]=value.split(':');const decipher=createDecipheriv('aes-256-gcm',key(),Buffer.from(iv,'hex'));decipher.setAuthTag(Buffer.from(tag,'hex'));return Buffer.concat([decipher.update(Buffer.from(payload,'hex')),decipher.final()]).toString('utf8')}
export async function sellerToken(artisanId:string){const db=adminDb();const {data}=await db.from('seller_connections').select('*').eq('artisan_id',artisanId).maybeSingle();if(!data?.access_token_encrypted)throw new Error('Artesã ainda não conectou a conta Mercado Pago.');if(data.expires_at&&new Date(data.expires_at).getTime()>Date.now()+5*60*1000)return decrypt(data.access_token_encrypted);if(!data.refresh_token_encrypted)throw new Error('Conexão de recebimento expirada.');const res=await fetch('https://api.mercadopago.com/oauth/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:process.env.MERCADO_PAGO_CLIENT_ID||'',client_secret:process.env.MERCADO_PAGO_CLIENT_SECRET||'',grant_type:'refresh_token',refresh_token:decrypt(data.refresh_token_encrypted)})});if(!res.ok){await db.from('seller_connections').update({status:'expired'}).eq('artisan_id',artisanId);throw new Error('Conexão Mercado Pago expirada. A artesã precisa reconectar.')}const fresh=await res.json();await db.from('seller_connections').update({access_token_encrypted:encrypt(fresh.access_token),refresh_token_encrypted:encrypt(fresh.refresh_token),expires_at:new Date(Date.now()+fresh.expires_in*1000).toISOString(),status:'connected',updated_at:new Date().toISOString()}).eq('artisan_id',artisanId);return fresh.access_token}
