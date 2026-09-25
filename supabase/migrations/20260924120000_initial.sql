create extension if not exists pgcrypto;
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, role text not null default 'buyer' check(role in ('buyer','admin')), created_at timestamptz not null default now());
create table public.artisans (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade, name text not null, slug text not null unique, story text not null default '', techniques text not null default '', photo_path text, posting_cep text check(posting_cep ~ '^[0-9]{8}$'), status text not null default 'pending' check(status in ('pending','approved','rejected')), featured_month date unique, created_at timestamptz not null default now());
create table public.products (id uuid primary key default gen_random_uuid(), artisan_id uuid not null references public.artisans(id) on delete cascade, name text not null, slug text not null unique, description text not null default '', category text not null, price_cents integer not null check(price_cents>0), stock integer not null check(stock>=0), weight_g integer not null check(weight_g>0), length_cm numeric(6,1) not null check(length_cm>0), width_cm numeric(6,1) not null check(width_cm>0), height_cm numeric(6,1) not null check(height_cm>0), status text not null default 'pending' check(status in ('pending','approved','rejected')), created_at timestamptz not null default now());
create table public.product_images (id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade, path text not null, position integer not null default 0, unique(product_id,path));
create table public.seller_connections (artisan_id uuid primary key references public.artisans(id) on delete cascade, mp_user_id text, access_token_encrypted text, refresh_token_encrypted text, expires_at timestamptz, status text not null default 'disconnected' check(status in ('disconnected','connected','expired')), updated_at timestamptz not null default now());
create table public.orders (id uuid primary key default gen_random_uuid(), buyer_id uuid not null references auth.users(id), artisan_id uuid not null references public.artisans(id), status text not null default 'awaiting_payment' check(status in ('awaiting_payment','paid','in_preparation','posted','out_for_delivery','delivered','completed','cancelled','exception')), delivery_kind text not null check(delivery_kind in ('local','correios')), delivery_service text not null, delivery_days integer, shipping_cents integer not null check(shipping_cents>=0), items_cents integer not null check(items_cents>0), total_cents integer generated always as (items_cents+shipping_cents) stored, address jsonb not null, tracking_code text, mp_preference_id text, mp_checkout_url text, mp_payment_id text unique, created_at timestamptz not null default now(), paid_at timestamptz);
create table public.order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade, product_id uuid not null references public.products(id), product_name text not null, unit_price_cents integer not null check(unit_price_cents>0), quantity integer not null check(quantity>0), subtotal_cents integer generated always as (unit_price_cents*quantity) stored);
create table public.oauth_states (state_hash text primary key, artisan_id uuid not null references public.artisans(id) on delete cascade, expires_at timestamptz not null);
create table public.support_requests (id uuid primary key default gen_random_uuid(), name text not null, email text not null, message text not null, created_at timestamptz not null default now(), resolved_at timestamptz);
create index on public.products(artisan_id,status);
create index on public.orders(artisan_id,created_at desc);
create index on public.orders(buyer_id,created_at desc);
create index on public.order_items(order_id);

alter table public.profiles enable row level security;
alter table public.artisans enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.seller_connections enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.oauth_states enable row level security;
alter table public.support_requests enable row level security;

create policy profiles_self on public.profiles for select to authenticated using (id=(select auth.uid()));
create policy artisans_public_or_owner on public.artisans for select to anon,authenticated using (status='approved' or user_id=(select auth.uid()));
create policy artisans_insert on public.artisans for insert to authenticated with check(user_id=(select auth.uid()) and status='pending' and featured_month is null);
create policy products_public_or_owner on public.products for select to anon,authenticated using ((status='approved' and exists(select 1 from public.artisans a where a.id=artisan_id and a.status='approved')) or exists(select 1 from public.artisans a where a.id=artisan_id and a.user_id=(select auth.uid())));
create policy images_public_or_owner on public.product_images for select to anon,authenticated using (exists(select 1 from public.products p join public.artisans a on a.id=p.artisan_id where p.id=product_id and ((p.status='approved' and a.status='approved') or a.user_id=(select auth.uid()))));
create policy orders_buyer_or_seller on public.orders for select to authenticated using (buyer_id=(select auth.uid()) or exists(select 1 from public.artisans a where a.id=artisan_id and a.user_id=(select auth.uid())));
create policy items_buyer_or_seller on public.order_items for select to authenticated using (exists(select 1 from public.orders o join public.artisans a on a.id=o.artisan_id where o.id=order_id and (o.buyer_id=(select auth.uid()) or a.user_id=(select auth.uid()))));
-- Writes with sensitive status and monetary fields go through server routes with explicit authorization.
-- The service role alone can read seller tokens and OAuth states.

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('catalog','catalog',false,5242880,array['image/jpeg','image/png','image/webp']) on conflict (id) do nothing;
-- Uploads are performed by authenticated server routes after verifying ownership.

create or replace function public.create_order_atomic(p_buyer uuid,p_artisan uuid,p_address jsonb,p_delivery_kind text,p_delivery_service text,p_delivery_days integer,p_shipping_cents integer,p_items jsonb)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_order uuid; v_item jsonb; v_product record; v_total integer:=0; v_qty integer;
begin
  if p_shipping_cents<0 or p_delivery_kind not in ('local','correios') then raise exception 'invalid delivery'; end if;
  if jsonb_array_length(p_items)=0 then raise exception 'empty order'; end if;
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty:=(v_item->>'quantity')::integer;
    if v_qty<1 then raise exception 'invalid quantity'; end if;
    select id,name,price_cents,stock into v_product from public.products where id=(v_item->>'productId')::uuid and artisan_id=p_artisan and status='approved' for update;
    if not found or v_product.stock<v_qty then raise exception 'unavailable product'; end if;
    v_total:=v_total+v_product.price_cents*v_qty;
  end loop;
  insert into public.orders(buyer_id,artisan_id,address,delivery_kind,delivery_service,delivery_days,shipping_cents,items_cents) values(p_buyer,p_artisan,p_address,p_delivery_kind,p_delivery_service,p_delivery_days,p_shipping_cents,v_total) returning id into v_order;
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty:=(v_item->>'quantity')::integer;
    select id,name,price_cents into v_product from public.products where id=(v_item->>'productId')::uuid;
    insert into public.order_items(order_id,product_id,product_name,unit_price_cents,quantity) values(v_order,v_product.id,v_product.name,v_product.price_cents,v_qty);
    update public.products set stock=stock-v_qty where id=v_product.id;
  end loop;
  return v_order;
end $$;
revoke all on function public.create_order_atomic(uuid,uuid,jsonb,text,text,integer,integer,jsonb) from public,anon,authenticated;
grant execute on function public.create_order_atomic(uuid,uuid,jsonb,text,text,integer,integer,jsonb) to service_role;

create or replace function public.restore_cancelled_stock() returns trigger language plpgsql set search_path=public as $$
begin
  if old.status='awaiting_payment' and new.status in ('cancelled','exception') then
    update public.products p set stock=p.stock+i.quantity from public.order_items i where i.order_id=new.id and i.product_id=p.id;
  end if;
  return new;
end $$;
create trigger restore_cancelled_stock after update of status on public.orders for each row execute function public.restore_cancelled_stock();
