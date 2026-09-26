import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'node:crypto';
import { adminDb, currentUser } from '@/lib/supabase';
import { marketplaceConnectionReady } from '@/lib/mercadopago';

export async function GET() {
  if (!marketplaceConnectionReady()) {
    return NextResponse.json({ error: 'Conexão de pagamentos em preparação.' }, { status: 503 });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  const user = await currentUser();
  if (!user) return NextResponse.redirect(`${site}/entrar`);

  const db = adminDb();
  const { data: artisan, error: artisanError } = await db.from('artisans')
    .select('id,status').eq('user_id', user.id).maybeSingle();
  if (artisanError) return NextResponse.json({ error: 'Falha ao consultar a artesã.' }, { status: 500 });
  if (!artisan || artisan.status !== 'approved') {
    return NextResponse.redirect(`${site}/painel?erro=aprovacao`);
  }

  const state = randomBytes(32).toString('hex');
  const stateHash = createHash('sha256').update(state).digest('hex');
  const { error: stateError } = await db.from('oauth_states').insert({
    state_hash: stateHash,
    artisan_id: artisan.id,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
  });
  if (stateError) return NextResponse.json({ error: 'Falha ao iniciar a conexão.' }, { status: 500 });

  const url = new URL('https://auth.mercadopago.com.br/authorization');
  url.searchParams.set('client_id', process.env.MERCADO_PAGO_CLIENT_ID!);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('platform_id', 'mp');
  url.searchParams.set('redirect_uri', `${site}/api/mercadopago/callback`);
  url.searchParams.set('state', state);
  return NextResponse.redirect(url);
}
