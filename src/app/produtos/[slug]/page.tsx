import { notFound } from 'next/navigation';
import { publicProducts } from '@/lib/catalog';
import { money,photoUrl } from '@/lib/types';
import AddCart from '@/components/add-cart';
import Link from 'next/link';
export const dynamic='force-dynamic';
export default async function ProductDetail({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const product=(await publicProducts()).find(p=>p.slug===slug);if(!product)notFound();const image=product.product_images?.sort((a,b)=>a.position-b.position)[0];return <div className="detail"><div className="detail-image">{image?<img src={photoUrl(image.path)!} alt={product.name}/>: '✳'}</div><div><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><p>Feito por <Link className="text-link" href={`/artesas/${product.artisans?.slug}`}>{product.artisans?.name}</Link></p><div className="price">{money(product.price_cents)}</div><p>{product.description}</p><p><span className="pill">{product.stock} disponível{product.stock===1?'':'is'}</span></p><AddCart id={product.id}/><dl><dt>Embalagem</dt><dd>{product.weight_g} g · {product.length_cm} × {product.width_cm} × {product.height_cm} cm</dd><dt>Entrega</dt><dd>Calculada após informar e confirmar o endereço.</dd></dl></div></div>}
