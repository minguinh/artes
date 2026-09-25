import { ArtisanCard } from '@/components/catalog';
import { publicArtisans } from '@/lib/catalog';
export const dynamic='force-dynamic';
export default async function Artisans(){const artisans=await publicArtisans();return <><div className="page-hero"><span className="eyebrow">As mãos que criam</span><h1>Conheça nossas artesãs</h1><p>Descubra histórias, técnicas e criações que revelam a riqueza artesanal de Xexéu.</p></div><section className="section">{artisans.length?<div className="artisan-grid">{artisans.map(a=><ArtisanCard artisan={a} key={a.id}/>)}</div>:<div className="empty">As primeiras artesãs aparecerão aqui depois da aprovação.</div>}</section></>}
