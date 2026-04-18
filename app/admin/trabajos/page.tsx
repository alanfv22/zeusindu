'use client'

import { useEffect, useState, useRef } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Pencil, Trash2, Plus, X, Upload } from 'lucide-react'

type AdminProduct = {
  id: string
  name: string
  description: string | null
  garment_type: string | null
  active: boolean
  sort_order: number
  category_id: string | null
  categories: { id: string; name: string; slug: string } | null
  product_images: { id: string; url: string; is_primary: boolean; sort_order: number }[]
}

type AdminCategory = {
  id: string
  name: string
  slug: string
  sort_order: number
}

type AdminGarmentType = {
  id: string
  name: string
  slug: string
  sort_order: number
}

const AUTH_HEADER = { Authorization: 'Bearer zeus-admin-authenticated' }

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const MAX_WIDTH = 1200
      const ratio = Math.min(1, MAX_WIDTH / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * ratio)
      canvas.height = Math.round(img.height * ratio)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => resolve(blob!), 'image/webp', 0.85)
    }
    img.src = url
  })
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

function getPrimaryImageUrl(images: AdminProduct['product_images']): string | null {
  if (!images?.length) return null
  const primary = images.find((i) => i.is_primary)
  return primary?.url ?? images[0]?.url ?? null
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-green-500' : 'bg-zinc-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

// ── Image Uploader ────────────────────────────────────────────────────────────
function ImageUploader({
  onFileSelect,
  preview,
  sizes,
  uploading,
}: {
  onFileSelect: (file: File) => void
  preview: string | null
  sizes: { original: number; compressed: number } | null
  uploading: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    onFileSelect(file)
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-[#FF0009] bg-zinc-800'
            : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview}
              alt="Vista previa"
              className="w-[200px] h-[200px] object-cover rounded-lg"
            />
            {sizes && (
              <p className="text-xs text-zinc-400">
                {formatBytes(sizes.original)} → {formatBytes(sizes.compressed)}
              </p>
            )}
            {uploading && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                Subiendo...
              </div>
            )}
            <p className="text-xs text-zinc-500">Hacer click para cambiar</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-zinc-500">
            <Upload size={32} />
            <p className="text-sm">Arrastrá una imagen o hacé click</p>
            <p className="text-xs">JPG, PNG o WebP</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 rounded-2xl p-8 max-w-sm w-full">
        <h3 className="text-white font-display text-2xl mb-2">¿Eliminar trabajo?</h3>
        <p className="text-zinc-400 text-sm mb-6">Esta acción no se puede deshacer.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-zinc-800 text-white py-3 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-900 text-white py-3 rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function ProductModal({
  product,
  categories,
  garmentTypes,
  onClose,
  onSaved,
}: {
  product: AdminProduct | null
  categories: AdminCategory[]
  garmentTypes: AdminGarmentType[]
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = product !== null
  const [form, setForm] = useState({
    category_id: product?.category_id ?? '',
    garment_type: product?.garment_type ?? '',
    active: product?.active ?? true,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageSizes, setImageSizes] = useState<{ original: number; compressed: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')

  async function handleFileSelect(file: File) {
    const preview = URL.createObjectURL(file)
    setImagePreview(preview)
    setImageFile(file)
    const compressed = await compressImage(file)
    setCompressedBlob(compressed)
    setImageSizes({ original: file.size, compressed: compressed.size })
  }

  async function handleSave() {
    setSaving(true)
    setError('')

    try {
      let productId = product?.id

      if (isEdit) {
        const res = await fetch(`/api/admin/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
          body: JSON.stringify({
            category_id: form.category_id || null,
            garment_type: form.garment_type || null,
            active: form.active,
          }),
        })
        if (!res.ok) {
          const json = await res.json()
          throw new Error(json.error ?? 'Error al guardar')
        }
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
          body: JSON.stringify({
            category_id: form.category_id || null,
            garment_type: form.garment_type || null,
            active: form.active,
          }),
        })
        if (!res.ok) {
          const json = await res.json()
          throw new Error(json.error ?? 'Error al crear')
        }
        const json = await res.json()
        productId = json.data.id
      }

      if ((imageFile || compressedBlob) && productId) {
        setUploadingImage(true)
        const blob = compressedBlob ?? (await compressImage(imageFile!))
        const fd = new FormData()
        fd.append('file', blob, 'image.webp')
        fd.append('productId', productId)
        const imgRes = await fetch('/api/admin/images', {
          method: 'POST',
          headers: AUTH_HEADER,
          body: fd,
        })
        if (!imgRes.ok) {
          const json = await imgRes.json()
          throw new Error(json.error ?? 'Error al subir imagen')
        }
      }

      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSaving(false)
      setUploadingImage(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
      <div className="bg-zinc-900 rounded-2xl p-8 max-w-lg w-full my-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-display text-2xl">
            {isEdit ? 'EDITAR TRABAJO' : 'NUEVO TRABAJO'}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-1">Categoría</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#FF0009] focus:outline-none text-white rounded-lg px-4 py-3"
            >
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-1">Tipo de prenda</label>
            <select
              value={form.garment_type}
              onChange={(e) => setForm((f) => ({ ...f, garment_type: e.target.value }))}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#FF0009] focus:outline-none text-white rounded-lg px-4 py-3"
            >
              <option value="">Sin tipo</option>
              {garmentTypes.map((g) => (
                <option key={g.id} value={g.slug}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <ToggleSwitch
              checked={form.active}
              onChange={(v) => setForm((f) => ({ ...f, active: v }))}
            />
            <span className="text-zinc-400 text-sm">Activo (visible en el sitio)</span>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-2">Imagen</label>
            <ImageUploader
              onFileSelect={handleFileSelect}
              preview={imagePreview}
              sizes={imageSizes}
              uploading={uploadingImage}
            />
          </div>
        </div>

        {error && <p className="text-[#FF0009] text-sm mt-4">{error}</p>}

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 text-white py-3 rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#FF0009] text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear trabajo'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TrabajosPage() {
  useAdminAuth()

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [garmentTypes, setGarmentTypes] = useState<AdminGarmentType[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchAll() {
    try {
      const [prodRes, catRes, garRes] = await Promise.all([
        fetch('/api/admin/products', { headers: AUTH_HEADER }),
        fetch('/api/admin/categories', { headers: AUTH_HEADER }),
        fetch('/api/admin/garment-types', { headers: AUTH_HEADER }),
      ])
      const [prodJson, catJson, garJson] = await Promise.all([
        prodRes.json(),
        catRes.json(),
        garRes.json(),
      ])
      setProducts(prodJson.data ?? [])
      setCategories(catJson.data ?? [])
      setGarmentTypes(garJson.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  async function handleToggleActive(product: AdminProduct) {
    const newActive = !product.active
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: newActive } : p))
    )
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
      body: JSON.stringify({ active: newActive }),
    })
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await fetch(`/api/admin/products/${deleteId}`, {
        method: 'DELETE',
        headers: AUTH_HEADER,
      })
      setProducts((prev) => prev.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  function openAdd() {
    setEditingProduct(null)
    setModalOpen(true)
  }

  function openEdit(product: AdminProduct) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-zinc-400 text-sm">{products.length} trabajos en total</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#FF0009] text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={16} />
          Nuevo trabajo
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 animate-pulse rounded-xl h-64" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-zinc-500">
          <p className="text-lg mb-2">No hay trabajos todavía</p>
          <p className="text-sm">Hacé click en &quot;Nuevo trabajo&quot; para agregar el primero</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const imageUrl = getPrimaryImageUrl(product.product_images)
            return (
              <div key={product.id} className="rounded-xl overflow-hidden bg-zinc-900">
                <div className="aspect-[4/3] bg-zinc-700 relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Upload size={32} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-medium truncate mb-2">{product.name}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.categories && (
                      <span className="bg-red-900/50 text-red-300 text-xs px-2 py-0.5 rounded">
                        {product.categories.name}
                      </span>
                    )}
                    {product.garment_type && (
                      <span className="bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded capitalize">
                        {product.garment_type}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <ToggleSwitch
                      checked={product.active}
                      onChange={() => handleToggleActive(product)}
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          garmentTypes={garmentTypes}
          onClose={() => setModalOpen(false)}
          onSaved={fetchAll}
        />
      )}

      {deleteId && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
