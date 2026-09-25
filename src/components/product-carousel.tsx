'use client';
import { useRef } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './catalog';
export default function ProductCarousel({products,label}:{products:Product[];label:string}){const ref=useRef<HTMLDivElement>(null);return <div className="carousel-wrap"><div className="carousel-controls"><button aria-label={`Voltar em ${label}`} onClick={()=>ref.current?.scrollBy({left:-330,behavior:'smooth'})}>←</button><button aria-label={`Avançar em ${label}`} onClick={()=>ref.current?.scrollBy({left:330,behavior:'smooth'})}>→</button></div><div className="carousel" ref={ref} aria-label={label}>{products.map(p=><ProductCard key={p.id} product={p}/>)}</div></div>}
