'use client';
import { useRouter } from 'next/navigation';
import type { CartItem } from '@/lib/types';
export default function AddCart({id}:{id:string}){const router=useRouter();if(process.env.NEXT_PUBLIC_COMMERCE_ENABLED!=='true')return <div className="notice">As compras online serão ativadas após a integração de pagamentos e entregas. Conheça as peças e as artesãs enquanto isso.</div>;return <button className="button" onClick={()=>{const cart:CartItem[]=JSON.parse(localStorage.getItem('xexeu-cart')||'[]');const item=cart.find(i=>i.productId===id);if(item)item.quantity++;else cart.push({productId:id,quantity:1});localStorage.setItem('xexeu-cart',JSON.stringify(cart));router.push('/carrinho')}}>Adicionar e ver carrinho ↗</button>}
