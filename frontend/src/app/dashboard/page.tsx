'use client'
import { AuthContext } from '@/components/Providers'
import { Button } from '@/components/ui/button'
import React, { useContext } from 'react'

export default function Page() {
	const { sidebarCollapsed, setSidebarCollapsed } = useContext(AuthContext)
	return <main>main</main>
}
