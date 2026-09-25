import { publicDb } from './supabase';
import type { Artisan, Product } from './types';

const productSelect = '*, artisans!inner(*) , product_images(path,position)';
export async function publicProducts():Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const {data,error} = await publicDb().from('products').select(productSelect).eq('status','approved').eq('artisans.status','approved').gt('stock',0).order('created_at',{ascending:false});
  if (error) throw error;
  return (data||[]) as unknown as Product[];
}
export async function publicArtisans():Promise<Artisan[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const {data,error} = await publicDb().from('artisans').select('*').eq('status','approved').order('name');
  if (error) throw error;
  return (data||[]) as Artisan[];
}

