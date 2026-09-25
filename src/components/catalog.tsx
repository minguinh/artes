import Link from 'next/link';
import type { Artisan, Product } from '@/lib/types';
import { money, photoUrl } from '@/lib/types';

export function ProductCard({product}:{product:Product}) { const image=product.product_images?.sort((a,b)=>a.position-b.position)[0]; return <Link className="product-card" href={`/produtos/${product.slug}`}><div className="image">{image&&<img src={photoUrl(image.path)!} alt={product.name}/>}<span className="tag">{product.category}</span></div><h3>{product.name}</h3><p>por {product.artisans?.name}</p><span className="price">{money(product.price_cents)}</span></Link> }
export function ArtisanCard({artisan}:{artisan:Artisan}) { return <Link className="artisan-card" href={`/artesas/${artisan.slug}`}><div className="image">{artisan.photo_path ? <img src={photoUrl(artisan.photo_path)!} alt={artisan.name}/> : '✳'}</div><h3>{artisan.name}</h3><p>{artisan.techniques || 'Conheça sua história e suas criações.'}</p><span className="text-link">Conhecer artesã ↗</span></Link> }
