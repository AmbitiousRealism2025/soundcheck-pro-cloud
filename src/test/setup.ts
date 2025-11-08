import { expect, afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// Create portal root element before each test
beforeEach(() => {
  const portalRoot = document.createElement('div')
  portalRoot.setAttribute('id', 'portal-root')
  document.body.appendChild(portalRoot)
})

// Run cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
  // Remove portal root
  const portalRoot = document.getElementById('portal-root')
  if (portalRoot) {
    document.body.removeChild(portalRoot)
  }
})
