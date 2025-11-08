/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom'
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import type { Assertion } from 'vitest'

declare module 'vitest' {
  interface Assertion<T = any> extends TestingLibraryMatchers<ReturnType<typeof expect.stringContaining>, T> {}
}
