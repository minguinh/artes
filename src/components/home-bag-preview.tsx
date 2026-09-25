'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CartItem, Product } from '@/lib/types';
import { money, photoUrl } from '@/lib/types';

export default function HomeBagPreview({ commerceEnabled }: { commerceEnabled: boolean }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('xexeu-cart') || '[]');
      if (Array.isArray(saved)) setItems(saved);
    } catch {
      setItems([]);
    }
    fetch('/api/catalog')
      .then(response => response.ok ? response.json() : [])
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const rows = items.flatMap(item => {
    const product = products.find(candidate => candidate.id === item.productId);
    return product && Number.isInteger(item.quantity) && item.quantity > 0
      ? [{ product, quantity: item.quantity }]
      : [];
  });
  const subtotal = rows.reduce((total, row) => total + row.product.price_cents * row.quantity, 0);

  return <aside className="home-bag" aria-labelledby="bag-title">
    <div className="home-bag-head"><span className="bag-sparkle" aria-hidden="true">✿</span><div><span className="eyebrow">Seu espaço</span><h2 id="bag-title">Sua sacola</h2></div></div>
    <div className="bag-steps" aria-label="Etapas da compra"><span className="current">Peças</span><span>Entrega</span><span>Pagamento</span></div>
    <div className="bag-content">
      <h3>Peças escolhidas</h3>
      {rows.length ? <div className="bag-items">{rows.map(({ product, quantity }) => {
        const image = product.product_images?.[0];
        return <div className="bag-item" key={product.id}>
          <div className="bag-item-image">{image ? <img src={photoUrl(image.path)!} alt="" /> : <span aria-hidden="true">✿</span>}</div>
          <div><strong>{product.name}</strong><small>{product.artisans?.name} · {quantity} un.</small><b>{money(product.price_cents * quantity)}</b></div>
        </div>;
      })}</div> : <div className="bag-empty"><span aria-hidden="true">♡</span><p>Seu carrinho está vazio.</p><Link href="/produtos">Conhecer as peças ↗</Link></div>}
    </div>
    <div className="bag-delivery"><h3>Entrega</h3><p>O endereço, as opções de frete e os valores serão confirmados antes de qualquer pagamento.</p></div>
    <div className="bag-bottom">
      {rows.length > 0 && <div className="bag-subtotal"><span>Subtotal das peças</span><strong>{money(subtotal)}</strong></div>}
      {commerceEnabled ? <Link className="button" href="/carrinho">Ver carrinho ↗</Link> : <><div className="bag-unavailable">Compras online em preparação</div><p>Enquanto isso, conheça as artesãs e suas peças.</p></>}
    </div>
  </aside>;
}
