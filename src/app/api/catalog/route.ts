import { NextResponse } from 'next/server';
import { publicProducts } from '@/lib/catalog';
export async function GET(){return NextResponse.json(await publicProducts())}
