export type Artisan = { id:string; user_id:string; name:string; slug:string; story:string; techniques:string; photo_path:string|null; posting_cep:string|null; status:string; featured_month:string|null; created_at:string };
export type Product = { id:string; artisan_id:string; name:string; slug:string; description:string; category:string; price_cents:number; stock:number; weight_g:number; length_cm:number; width_cm:number; height_cm:number; status:string; created_at:string; artisans?:Artisan; product_images?:{path:string;position:number}[] };
export type CartItem = { productId:string; quantity:number };
export type Address = { cep:string; street:string; number:string; complement:string; neighborhood:string; city:string; state:string; recipient:string; phone:string };
export type Quote = { service:string; label:string; priceCents:number; days:number|null; kind:'local'|'correios' };
export const money = (cents:number) => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(cents/100);
export const orderStatusLabel:Record<string,string>={awaiting_payment:'Aguardando pagamento',paid:'Pago',in_preparation:'Em preparação',posted:'Postado nos Correios',out_for_delivery:'Saiu para entrega',delivered:'Entregue',completed:'Concluído',cancelled:'Cancelado',exception:'Em atendimento'};
export const photoUrl = (path:string|null|undefined) => path ? `/api/image?path=${encodeURIComponent(path)}` : null;
