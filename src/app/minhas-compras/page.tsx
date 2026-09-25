import Link from 'next/link';
import { redirect } from 'next/navigation';
import { adminDb,currentUser } from '@/lib/supabase';
import { money,orderStatusLabel } from '@/lib/types';
export const dynamic='force-dynamic';
export default async function MyOrders(){const user=await currentUser();if(!user)redirect('/entrar');const {data:orders}=await adminDb().from('orders').select('id,status,total_cents,created_at,artisans(name)').eq('buyer_id',user.id).order('created_at',{ascending:false});return <div className="panel"><span className="eyebrow">Minha conta</span><h1>Minhas compras</h1>{orders?.length?<div className="card-box table-wrap"><table><thead><tr><th>Pedido</th><th>Artesã</th><th>Valor</th><th>Situação</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><Link className="text-link" href={`/pedidos/${o.id}`}>{o.id.slice(0,8)}</Link><br/>{new Date(o.created_at).toLocaleDateString('pt-BR')}</td><td>{(o.artisans as unknown as {name:string})?.name}</td><td>{money(o.total_cents)}</td><td>{orderStatusLabel[o.status]}</td></tr>)}</tbody></table></div>:<div className="empty">Você ainda não fez compras. <Link className="text-link" href="/produtos">Conheça as peças</Link></div>}</div>}

