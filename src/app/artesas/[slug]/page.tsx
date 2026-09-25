import { notFound } from 'next/navigation';
import { publicArtisans,publicProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/catalog';
import { photoUrl } from '@/lib/types';
export const dynamic='force-dynamic';
export default async function ArtisanDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const artisan=(await publicArtisans()).find(a=>a.slug===slug);if(!artisan)notFound();const products=(await publicProducts()).filter(p=>p.artisan_id===artisan.id);return <><div className="detail"><div className="detail-image">{artisan.photo_path?<img src={photoUrl(artisan.photo_path)!} alt={artisan.name}/>: '✳'}</div><div><span className="eyebrow">Artesã de Xexéu</span><h1>{artisan.name}</h1><p>{artisan.story}</p><dl><dt>Técnicas</dt><dd>{artisan.techniques||'Não informadas'}</dd></dl></div></div><section className="section"><div className="section-head"><div><span className="eyebrow">Feito por {artisan.name}</span><h2>Suas criações</h2></div></div>{products.length?<div className="cards">{products.map(p=><ProductCard product={p} key={p.id}/>)}</div>:<div className="empty">O catálogo desta artesã está sendo preparado.</div>}</section></>}
