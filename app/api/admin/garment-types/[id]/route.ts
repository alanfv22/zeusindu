import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const STORE_ID = '9972a532-5c63-422d-a320-7f1c93bbf695'

function checkAuth(request: NextRequest): boolean {
  return request.headers.get('Authorization') === 'Bearer zeus-admin-authenticated'
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('garment_types')
    .update(body)
    .eq('id', id)
    .eq('store_id', STORE_ID)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const { data: garmentType, error: fetchError } = await supabaseAdmin
    .from('garment_types')
    .select('slug')
    .eq('id', id)
    .single()

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })

  const { data: products, error: checkError } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('store_id', STORE_ID)
    .eq('garment_type', garmentType.slug)
    .limit(1)

  if (checkError) return NextResponse.json({ error: checkError.message }, { status: 500 })

  if (products && products.length > 0) {
    return NextResponse.json(
      { error: 'Este tipo de prenda tiene trabajos asociados. Reasignalos antes de eliminar.' },
      { status: 400 }
    )
  }

  const { error } = await supabaseAdmin
    .from('garment_types')
    .delete()
    .eq('id', id)
    .eq('store_id', STORE_ID)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: { ok: true } })
}
