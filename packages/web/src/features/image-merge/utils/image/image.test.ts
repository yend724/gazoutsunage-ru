import { describe, it, expect } from 'vitest'

import { formatFileSize, generateImageId, cleanupImageFiles } from './image'
import { ImageFile } from '../../types'

describe('Image Utilities', () => {
  describe('formatFileSize', () => {
    it('バイトサイズを正しくフォーマットする', () => {
      expect(formatFileSize(512)).toBe('512 B')
      expect(formatFileSize(0)).toBe('0 B')
      expect(formatFileSize(1)).toBe('1 B')
    })

    it('キロバイトサイズを正しくフォーマットする', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(2048)).toBe('2.0 KB')
      expect(formatFileSize(1500)).toBe('1.5 KB')
    })

    it('メガバイトサイズを正しくフォーマットする', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB')
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB')
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
    })

    it('ギガバイトサイズを正しくフォーマットする', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB')
      expect(formatFileSize(1024 * 1024 * 1024 * 1.5)).toBe('1.5 GB')
    })

    it('負の値の場合は0として扱う', () => {
      expect(formatFileSize(-100)).toBe('0 B')
    })

    it('小数点以下を適切に丸める', () => {
      expect(formatFileSize(1024 * 1.234)).toBe('1.2 KB')
      expect(formatFileSize(1024 * 1.999)).toBe('2.0 KB')
    })
  })

  describe('generateImageId', () => {
    it('文字列のIDを生成する', () => {
      const id = generateImageId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('連続で呼び出した場合、異なるIDを生成する', () => {
      const id1 = generateImageId()
      const id2 = generateImageId()
      expect(id1).not.toBe(id2)
    })

    it('UUIDv4の形式に似たパターンを生成する', () => {
      const id = generateImageId()
      // 36文字（ハイフンを含む）のUUIDパターンをチェック
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    })
  })

  describe('cleanupImageFiles', () => {
    // URL.revokeObjectURLのモック
    const originalRevokeObjectURL = global.URL.revokeObjectURL
    let revokeObjectURLCalls: string[] = []

    beforeEach(() => {
      revokeObjectURLCalls = []
      global.URL.revokeObjectURL = (url: string) => {
        revokeObjectURLCalls.push(url)
      }
    })

    afterEach(() => {
      global.URL.revokeObjectURL = originalRevokeObjectURL
    })

    it('画像ファイルのpreview URLを解放する', () => {
      const mockImages: ImageFile[] = [
        {
          id: '1',
          file: new File([''], 'test1.jpg'),
          preview: 'blob:test-url-1',
          dimensions: { width: 100, height: 100 },
          order: 0,
        },
        {
          id: '2',
          file: new File([''], 'test2.jpg'),
          preview: 'blob:test-url-2',
          dimensions: { width: 200, height: 200 },
          order: 1,
        },
      ]

      cleanupImageFiles(mockImages)

      expect(revokeObjectURLCalls).toEqual(['blob:test-url-1', 'blob:test-url-2'])
    })

    it('空の配列の場合何もしない', () => {
      cleanupImageFiles([])
      expect(revokeObjectURLCalls).toEqual([])
    })

    it('readonly配列も適切に処理する', () => {
      const mockImages: readonly ImageFile[] = [
        {
          id: '1',
          file: new File([''], 'test.jpg'),
          preview: 'blob:test-url',
          dimensions: { width: 100, height: 100 },
          order: 0,
        },
      ]

      cleanupImageFiles(mockImages)
      expect(revokeObjectURLCalls).toEqual(['blob:test-url'])
    })
  })
})