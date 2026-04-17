'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'

type AdminCategory = {
  id: string
  name: string
  slug: string
  sort_order: number
}

const AUTH_HEADER = { Authorization: 'Bearer zeus-admin-authenticated' }

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function DeleteModal({
  itemName,
  onConfirm,
  onCancel,
  loading,
  error,
}: {
  itemName: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
  error: string
}) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4">
      <div className="bg-zinc-900 rounded-2xl p-8 max-w-sm w-full">
        <h3 className="text-white font-display text-2xl mb-2">¿Eliminar &quot;{itemName}&quot;?</h3>
        <p className="text-zinc-400 text-sm mb-2">Esta acción no se puede deshacer.</p>
        {error && <p className="text-[#FF0009] text-sm mt-2 mb-2">{error}</p>}
        <div className="flex gap-3 mt-4">
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

export default function CategoriasPage() {
  useAdminAuth()

  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)

  const [addName, setAddName] = useState('')
  const [addSlug, setAddSlug] = useState('')
  const [addOrder, setAddOrder] = useState(0)
  const [addError, setAddError] = useState('')
  const [adding, setAdding] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<AdminCategory>>({})

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function fetchCategories() {
    try {
      const res = await fetch('/api/admin/categories', { headers: AUTH_HEADER })
      const json = await res.json()
      const data: AdminCategory[] = json.data ?? []
      setCategories(data)
      const max = data.reduce((m, c) => Math.max(m, c.sort_order), -1)
      setAddOrder(max + 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  async function handleAdd() {
    if (!addName.trim()) {
      setAddError('El nombre es obligatorio')
      return
    }
    setAdding(true)
    setAddError('')
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
        body: JSON.stringify({
          name: addName,
          slug: addSlug || generateSlug(addName),
          sort_order: addOrder,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error al crear')
      setAddName('')
      setAddSlug('')
      await fetchCategories()
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Error al crear')
    } finally {
      setAdding(false)
    }
  }

  function startEdit(cat: AdminCategory) {
    setEditingId(cat.id)
    setEditValues({ name: cat.name, slug: cat.slug, sort_order: cat.sort_order })
  }

  async function handleSaveEdit(id: string) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
        body: JSON.stringify(editValues),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error)
      }
      setEditingId(null)
      await fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    setDeleteError('')
    try {
      const res = await fetch(`/api/admin/categories/${deleteId}`, {
        method: 'DELETE',
        headers: AUTH_HEADER,
      })
      const json = await res.json()
      if (!res.ok) {
        setDeleteError(json.error ?? 'Error al eliminar')
        return
      }
      setDeleteId(null)
      await fetchCategories()
    } catch {
      setDeleteError('Error de conexión')
    } finally {
      setDeleting(false)
    }
  }

  const deletingCategory = categories.find((c) => c.id === deleteId)

  return (
    <div>
      {/* Add form */}
      <div className="bg-zinc-900 rounded-xl p-6 mb-6">
        <h3 className="text-white font-display text-xl mb-4">NUEVA CATEGORÍA</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-zinc-400 text-xs mb-1">Nombre *</label>
            <input
              type="text"
              value={addName}
              onChange={(e) => {
                setAddName(e.target.value)
                setAddSlug(generateSlug(e.target.value))
              }}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#FF0009] focus:outline-none text-white rounded-lg px-4 py-3"
              placeholder="Ej: Sublimado"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-xs mb-1">Slug (auto)</label>
            <input
              type="text"
              value={addSlug}
              onChange={(e) => setAddSlug(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#FF0009] focus:outline-none text-white rounded-lg px-4 py-3"
              placeholder="sublimado"
            />
          </div>
          <div>
            <label className="block text-zinc-400 text-xs mb-1">Orden</label>
            <input
              type="number"
              value={addOrder}
              onChange={(e) => setAddOrder(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-[#FF0009] focus:outline-none text-white rounded-lg px-4 py-3"
            />
          </div>
        </div>
        {addError && <p className="text-[#FF0009] text-sm mt-2">{addError}</p>}
        <button
          onClick={handleAdd}
          disabled={adding}
          className="mt-4 flex items-center gap-2 bg-[#FF0009] text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
        >
          <Plus size={16} />
          {adding ? 'Guardando...' : 'Agregar categoría'}
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-zinc-500 text-center">Cargando...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-zinc-500 text-center">No hay categorías todavía</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-zinc-500 text-xs font-medium px-6 py-3">NOMBRE</th>
                <th className="text-left text-zinc-500 text-xs font-medium px-6 py-3">SLUG</th>
                <th className="text-left text-zinc-500 text-xs font-medium px-6 py-3">ORDEN</th>
                <th className="text-right text-zinc-500 text-xs font-medium px-6 py-3">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isEditing = editingId === cat.id
                return (
                  <tr key={cat.id} className="border-b border-zinc-800 last:border-0">
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.name ?? ''}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, name: e.target.value }))
                          }
                          className="bg-zinc-800 border border-zinc-600 focus:border-[#FF0009] focus:outline-none text-white rounded px-3 py-1.5 text-sm w-full"
                        />
                      ) : (
                        <span className="text-white text-sm">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.slug ?? ''}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, slug: e.target.value }))
                          }
                          className="bg-zinc-800 border border-zinc-600 focus:border-[#FF0009] focus:outline-none text-white rounded px-3 py-1.5 text-sm w-full"
                        />
                      ) : (
                        <span className="text-zinc-400 text-sm font-mono">{cat.slug}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.sort_order ?? 0}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, sort_order: Number(e.target.value) }))
                          }
                          className="bg-zinc-800 border border-zinc-600 focus:border-[#FF0009] focus:outline-none text-white rounded px-3 py-1.5 text-sm w-20"
                        />
                      ) : (
                        <span className="text-zinc-400 text-sm">{cat.sort_order}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(cat.id)}
                              className="p-1.5 text-green-400 hover:bg-zinc-700 rounded transition-colors"
                              title="Guardar"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-zinc-400 hover:bg-zinc-700 rounded transition-colors"
                              title="Cancelar"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(cat)}
                              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(cat.id)
                                setDeleteError('')
                              }}
                              className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {deleteId && deletingCategory && (
        <DeleteModal
          itemName={deletingCategory.name}
          onConfirm={handleDelete}
          onCancel={() => {
            setDeleteId(null)
            setDeleteError('')
          }}
          loading={deleting}
          error={deleteError}
        />
      )}
    </div>
  )
}
