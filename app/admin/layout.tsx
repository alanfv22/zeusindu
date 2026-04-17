'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutGrid, Tag, Shirt, ExternalLink, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { icon: LayoutGrid, label: 'Trabajos', href: '/admin/trabajos' },
  { icon: Tag, label: 'Categorías', href: '/admin/categorias' },
  { icon: Shirt, label: 'Prendas', href: '/admin/prendas' },
]

const pageTitles: Record<string, string> = {
  '/admin/trabajos': 'TRABAJOS',
  '/admin/categorias': 'CATEGORÍAS',
  '/admin/prendas': 'TIPOS DE PRENDA',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const isPublicPage = pathname === '/admin/login' || pathname === '/admin'

  useEffect(() => {
    if (isPublicPage) {
      setIsReady(true)
      return
    }
    const token = localStorage.getItem('admin_token')
    if (token !== 'zeus-admin-authenticated') {
      router.replace('/admin/login')
    } else {
      setIsReady(true)
    }
  }, [isPublicPage, router])

  if (isPublicPage) return <>{children}</>
  if (!isReady) return null

  function handleLogout() {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const pageTitle = pageTitles[pathname] ?? 'ADMIN'

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 border-b border-zinc-800">
        <p className="font-display text-2xl text-[#FF0009]">ZEUS INDU</p>
        <p className="text-zinc-500 text-xs mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 py-3 text-sm transition-colors ${
                isActive
                  ? 'ml-0 mr-2 pl-4 pr-4 rounded-r-lg bg-zinc-800 text-white border-l-2 border-[#FF0009]'
                  : 'mx-2 px-4 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="py-4 border-t border-zinc-800 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 mx-2 px-4 py-3 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ExternalLink size={18} />
          Ver sitio
        </a>
        <button
          onClick={handleLogout}
          className="w-[calc(100%-16px)] mx-2 flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Desktop sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 w-60 h-screen bg-[#111] border-r border-zinc-800 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 w-60 h-screen bg-[#111] border-r border-zinc-800">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="md:ml-60 min-h-screen p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-zinc-400 hover:text-white transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-display text-3xl text-white">{pageTitle}</h1>
          </div>
          <span className="bg-zinc-800 text-zinc-300 text-sm px-3 py-1 rounded-full">
            Zeus Indu
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
