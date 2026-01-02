import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock window.URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = vi.fn()

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  drawImage: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  setTransform: vi.fn(),
})) as unknown as typeof HTMLCanvasElement.prototype.getContext

// Mock OffscreenCanvas
class MockOffscreenCanvas {
  width: number
  height: number
  
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }
  
  getContext = vi.fn(() => ({
    drawImage: vi.fn(),
    clearRect: vi.fn(),
  }))
  
  convertToBlob = vi.fn(() => 
    Promise.resolve(new Blob(['mock-image-data'], { type: 'image/png' }))
  )
}

global.OffscreenCanvas = MockOffscreenCanvas as unknown as typeof OffscreenCanvas

// Mock FileReader
global.FileReader = vi.fn(() => ({
  readAsDataURL: vi.fn(),
  addEventListener: vi.fn((event, handler) => {
    if (event === 'load') {
      setTimeout(() => {
        handler({ target: { result: 'data:image/png;base64,mockdata' } })
      }, 0)
    }
  }),
})) as unknown as typeof FileReader