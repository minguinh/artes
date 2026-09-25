import { NextRequest,NextResponse } from 'next/server';
import { buildQuote } from '@/lib/checkout';
export async function POST(req:NextRequest){if(process.env.NEXT_PUBLIC_COMMERCE_ENABLED!=='true')return NextResponse.json({error:'Compras online em preparação.'},{status:503});try{return NextResponse.json(await buildQuote(await req.json()))}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Falha na cotação'},{status:400})}}

