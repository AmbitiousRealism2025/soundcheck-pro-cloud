import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
  containerId?: string
}

/**
 * Portal component for rendering children outside the main DOM tree
 * Used for modals, toasts, and other overlays
 */
export function Portal({ children, containerId = 'portal-root' }: PortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  const container = document.getElementById(containerId)
  if (!container) {
    console.warn(`Portal container #${containerId} not found`)
    return null
  }

  return createPortal(children, container)
}
