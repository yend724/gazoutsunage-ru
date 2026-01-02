import { describe, it, expect } from 'vitest'

import { 
  calculateCanvasSize, 
  calculateDrawPositions, 
  validateCanvasSize 
} from './canvas'
import { LoadedImage, MergeOptions, IMAGE_CONSTRAINTS } from '../../types'

describe('Canvas Utilities', () => {
  const mockLoadedImages: LoadedImage[] = [
    {
      image: new Image(),
      width: 100,
      height: 50,
    },
    {
      image: new Image(), 
      width: 200,
      height: 150,
    },
    {
      image: new Image(),
      width: 150,
      height: 100,
    },
  ]

  const defaultOptions: MergeOptions = {
    arrangement: 'horizontal',
    gap: 10,
  }

  describe('calculateCanvasSize', () => {
    it('空の配列の場合は 0x0 を返す', () => {
      const result = calculateCanvasSize([], defaultOptions)
      expect(result).toEqual({ width: 0, height: 0 })
    })

    it('横並びの場合、幅は合計+間隔、高さは最大値', () => {
      const result = calculateCanvasSize(mockLoadedImages, defaultOptions)
      // 幅: 100 + 200 + 150 + gap*2 = 450 + 20 = 470
      // 高さ: max(50, 150, 100) = 150
      expect(result).toEqual({ width: 470, height: 150 })
    })

    it('縦並びの場合、高さは合計+間隔、幅は最大値', () => {
      const verticalOptions: MergeOptions = { ...defaultOptions, arrangement: 'vertical' }
      const result = calculateCanvasSize(mockLoadedImages, verticalOptions)
      // 幅: max(100, 200, 150) = 200
      // 高さ: 50 + 150 + 100 + gap*2 = 300 + 20 = 320
      expect(result).toEqual({ width: 200, height: 320 })
    })

    it('間隔が0の場合も正しく計算される', () => {
      const noGapOptions: MergeOptions = { ...defaultOptions, gap: 0 }
      const result = calculateCanvasSize(mockLoadedImages, noGapOptions)
      expect(result).toEqual({ width: 450, height: 150 })
    })
  })

  describe('calculateDrawPositions', () => {
    it('横並びの場合、正しい位置を計算する', () => {
      const canvasSize = { width: 470, height: 150 }
      const result = calculateDrawPositions(mockLoadedImages, canvasSize, defaultOptions)
      
      expect(result).toEqual([
        { x: 0, y: 50 },      // 最初の画像: 垂直中央揃え (150-50)/2 = 50
        { x: 110, y: 0 },     // 2番目: 100+10=110, 高さ最大なのでy=0
        { x: 320, y: 25 },    // 3番目: 100+10+200+10=320, (150-100)/2 = 25
      ])
    })

    it('縦並びの場合、正しい位置を計算する', () => {
      const verticalOptions: MergeOptions = { ...defaultOptions, arrangement: 'vertical' }
      const canvasSize = { width: 200, height: 320 }
      const result = calculateDrawPositions(mockLoadedImages, canvasSize, verticalOptions)
      
      expect(result).toEqual([
        { x: 50, y: 0 },      // 最初: 水平中央揃え (200-100)/2 = 50
        { x: 0, y: 60 },      // 2番目: 50+10=60, 幅最大なのでx=0  
        { x: 25, y: 220 },    // 3番目: 50+10+150+10=220, (200-150)/2 = 25
      ])
    })
  })

  describe('validateCanvasSize', () => {
    it('有効なサイズの場合trueを返す', () => {
      const validSize = { width: 1000, height: 800 }
      expect(validateCanvasSize(validSize)).toBe(true)
    })

    it('幅が制限を超える場合falseを返す', () => {
      const oversizedWidth = { width: IMAGE_CONSTRAINTS.CANVAS_MAX_SIZE + 1, height: 100 }
      expect(validateCanvasSize(oversizedWidth)).toBe(false)
    })

    it('高さが制限を超える場合falseを返す', () => {
      const oversizedHeight = { width: 100, height: IMAGE_CONSTRAINTS.CANVAS_MAX_SIZE + 1 }
      expect(validateCanvasSize(oversizedHeight)).toBe(false)
    })

    it('幅が0以下の場合falseを返す', () => {
      const zeroWidth = { width: 0, height: 100 }
      expect(validateCanvasSize(zeroWidth)).toBe(false)
      
      const negativeWidth = { width: -10, height: 100 }
      expect(validateCanvasSize(negativeWidth)).toBe(false)
    })

    it('高さが0以下の場合falseを返す', () => {
      const zeroHeight = { width: 100, height: 0 }
      expect(validateCanvasSize(zeroHeight)).toBe(false)
      
      const negativeHeight = { width: 100, height: -10 }
      expect(validateCanvasSize(negativeHeight)).toBe(false)
    })
  })
})