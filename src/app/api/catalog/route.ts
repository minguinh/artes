import { NextResponse } from 'next/server';
import { availablePublicCatalog, publicProducts } from '@/lib/catalog';
export async function GET(){const products=await availablePublicCatalog(publicProducts);return products===null?NextResponse.json({error:'Catálogo temporariamente indisponível.'},{status:503}):NextResponse.json(products)}
