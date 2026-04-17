import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const STORE_ID = '9972a532-5c63-422d-a320-7f1c93bbf695'
const BUCKET = 'zeusindu'

function checkAuth(request: NextRequest): boolean {
  return request.headers.get('Authorization') === 'Bearer zeus-admin-authenticated'
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as Blob | null
  const productId = formData.get('productId') as string | null

  if (!file || !productId) {
    return NextResponse.json({ error: 'Missing file or productId' }, { status: 400 })
  }

  const timestamp = Date.now()
  const path = `${STORE_ID}/${productId}/${timestamp}.webp`

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, { contentType: 'image/webp', upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)

  const { error: dbError } = await supabaseAdmin.from('product_images').insert({
    product_id: productId,
    url: urlData.publicUrl,
    is_primary: true,
    sort_order: 0,
  })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ url: urlData.publicUrl })
}
