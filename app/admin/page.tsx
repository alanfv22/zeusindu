'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      if (token === 'zeus-admin-authenticated') {
        router.replace('/admin/trabajos')
      } else {
        router.replace('/admin/login')
      }
    }
  }, [router])
  return null
}
