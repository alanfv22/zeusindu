import { supabase } from './supabase'

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID!

export type Store = {
  id: string
  name: string
  slug: string
  whatsapp_number: string
  whatsapp_message_template: string
  primary_color: string
  logo_url: string | null
  active: boolean
  cash_discount_percent: number
}

export type Category = {
  id: string
  store_id: string
  name: string
  slug: string
  icon_url: string | null
  sort_order: number
}

export type GarmentType = {
  id: string
  store_id: string
  name: string
  slug: string
  sort_order: number
}

export type ProductImage = {
  id: string
  product_id: string
  url: string
  is_primary: boolean
  sort_order: number
}

export type PortfolioItem = {
  id: string
  name: string
  description: string | null
  garment_type: string | null
  active: boolean
  sort_order: number
  categories: Category | null
  product_images: ProductImage[]
}

export async function getStore(): Promise<Store> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', STORE_ID)
    .single()
  if (error) throw error
  return data
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', STORE_ID)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function getGarmentTypes(): Promise<GarmentType[]> {
  const { data, error } = await supabase
    .from('garment_types')
    .select('*')
    .eq('store_id', STORE_ID)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      garment_type,
      active,
      sort_order,
      categories(id, store_id, name, slug, icon_url, sort_order),
      product_images(id, product_id, url, is_primary, sort_order)
    `)
    .eq('store_id', STORE_ID)
    .eq('active', true)
    .order('sort_order')
  if (error) throw error
  return (data as unknown as PortfolioItem[]) ?? []
}

export function getPrimaryImage(images: ProductImage[]): string | null {
  if (!images?.length) return null
  const primary = images.find(img => img.is_primary)
  if (primary) return primary.url
  return [...images].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null
}
