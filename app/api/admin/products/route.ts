import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const STORE_ID = '9972a532-5c63-422d-a320-7f1c93bbf695'

function checkAuth(request: NextRequest): boolean {
  return request.headers.get('Authorization') === 'Bearer zeus-admin-authenticated'
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, categories(*), product_images(*)')
    .eq('store_id', STORE_ID)
    .order('sort_order')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const { name, category_id, garment_type, description, active } = body
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name,
      category_id: category_id || null,
      garment_type: garment_type || null,
      description: description || null,
      active: active ?? true,
      store_id: STORE_ID,
      sort_order: 0,
      is_made_to_order: true,
      base_price: 0,
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
