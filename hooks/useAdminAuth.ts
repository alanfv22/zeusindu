'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAdminAuth() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      if (token !== 'zeus-admin-authenticated') {
        router.replace('/admin/login')
      }
    }
  }, [router])
}
