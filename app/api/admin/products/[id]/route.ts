import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const STORE_ID = '9972a532-5c63-422d-a320-7f1c93bbf695'
const BUCKET = 'zeusindu'

function checkAuth(request: NextRequest): boolean {
  return request.headers.get('Authorization') === 'Bearer zeus-admin-authenticated'
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const body = await request.json()
  const { data, error } = await supabaseAdmin
    .from('products')
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
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params

  const { data: storageFiles } = await supabaseAdmin.storage
    .from(BUCKET)
    .list(`${STORE_ID}/${id}`)

  if (storageFiles && storageFiles.length > 0) {
    const paths = storageFiles.map((f) => `${STORE_ID}/${id}/${f.name}`)
    await supabaseAdmin.storage.from(BUCKET).remove(paths)
  }

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)
    .eq('store_id', STORE_ID)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: { ok: true } })
}
