import { NextRequest, NextResponse } from 'next/server';
import { buildQuote } from '@/lib/checkout';
import { adminDb, currentUser } from '@/lib/supabase';
import { sellerToken } from '@/lib/mercadopago';
import { money } from '@/lib/types';

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_COMMERCE_ENABLED !== 'true') return NextResponse.json({ error: 'Compras online em preparação.' }, { status: 503 });
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: 'Entre na sua conta antes de pagar.' }, { status: 401 });
    const body = await req.json();
    if (body.confirmed !== true) throw new Error('Confirme o endereço e os valores.');
    const quote = await buildQuote(body);
    if (quote.groups.some(g => g.error || !g.options.length)) throw new Error('Uma das entregas não possui cotação válida. Consulte a equipe.');
    const choices = quote.groups.map(g => g.options.find(o => o.service === body.selected?.[g.artisan.id]));
    if (choices.some(o => !o)) throw new Error('Escolha uma entrega válida para cada artesã.');
    const tokens = await Promise.all(quote.groups.map(g => sellerToken(g.artisan.id)));
    const db = adminDb();
    const links: { artisan: string; url: string; orderId: string; total: string }[] = [];
    const errors: string[] = [];
    const processedProductIds: string[] = [];

    for (const [index, group] of quote.groups.entries()) {
      const option = choices[index]!;
      let orderId: string | null = null;
      try {
        const created = await db.rpc('create_order_atomic', {
          p_buyer: user.id, p_artisan: group.artisan.id, p_address: quote.address,
          p_delivery_kind: option.kind, p_delivery_service: option.label,
          p_delivery_days: option.days, p_shipping_cents: option.priceCents,
          p_items: group.items.map(i => ({ productId: i.product.id, quantity: i.quantity }))
        });
        if (created.error || !created.data) throw created.error || new Error('Pedido não criado.');
        orderId = created.data as string;
        const items = group.items.map(i => ({ id: i.product.id, title: i.product.name, quantity: i.quantity, currency_id: 'BRL', unit_price: i.product.price_cents / 100 }));
        if (option.priceCents) items.push({ id: 'shipping', title: `Frete ${option.label}`, quantity: 1, currency_id: 'BRL', unit_price: option.priceCents / 100 });
        const site = process.env.NEXT_PUBLIC_SITE_URL;
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
          method: 'POST',
          headers: { Authorization: `Bearer ${tokens[index]}`, 'Content-Type': 'application/json', 'X-Idempotency-Key': orderId },
          body: JSON.stringify({
            items, external_reference: orderId,
            back_urls: { success: `${site}/pedidos/${orderId}`, pending: `${site}/pedidos/${orderId}`, failure: `${site}/pedidos/${orderId}` },
            auto_return: 'approved', notification_url: `${site}/api/mercadopago/webhook`
          })
        });
        if (!response.ok) throw new Error('Mercado Pago não gerou o checkout.');
        const preference = await response.json();
        if (!preference.id || !preference.init_point) throw new Error('Resposta de pagamento incompleta.');
        const saved = await db.from('orders').update({ mp_preference_id: preference.id, mp_checkout_url: preference.init_point }).eq('id', orderId);
        if (saved.error) throw saved.error;
        links.push({ artisan: group.artisan.name, url: preference.init_point, orderId, total: money(group.itemsCents + option.priceCents) });
        processedProductIds.push(...group.items.map(i => i.product.id));
      } catch (error) {
        if (orderId) await db.from('orders').update({ status: 'exception' }).eq('id', orderId).eq('status', 'awaiting_payment');
        errors.push(`${group.artisan.name}: ${error instanceof Error ? error.message : 'falha no pagamento'}`);
      }
    }
    return NextResponse.json({ links, errors, processedProductIds });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Falha ao criar o pedido' }, { status: 400 });
  }
}
