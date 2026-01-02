import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import { MergeSettings } from './MergeSettings'
import { MergeOptions } from '../../types'

describe('MergeSettings', () => {
  const defaultSettings: MergeOptions = {
    arrangement: 'horizontal',
    gap: 10,
  }

  const defaultProps = {
    settings: defaultSettings,
    onChange: vi.fn(),
    disabled: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正しくレンダリングされる', () => {
    render(<MergeSettings {...defaultProps} />)
    
    expect(screen.getByText('結合設定')).toBeInTheDocument()
    expect(screen.getByText('配置方法')).toBeInTheDocument()
    expect(screen.getByText('横並び')).toBeInTheDocument()
    expect(screen.getByText('縦並び')).toBeInTheDocument()
  })

  it('現在の設定が正しく反映される', () => {
    render(<MergeSettings {...defaultProps} />)
    
    const horizontalRadio = screen.getByDisplayValue('horizontal')
    const verticalRadio = screen.getByDisplayValue('vertical')
    
    expect(horizontalRadio).toBeChecked()
    expect(verticalRadio).not.toBeChecked()
  })

  it('縦並び設定が正しく反映される', () => {
    const verticalSettings = { ...defaultSettings, arrangement: 'vertical' as const }
    render(<MergeSettings {...defaultProps} settings={verticalSettings} />)
    
    const horizontalRadio = screen.getByDisplayValue('horizontal')
    const verticalRadio = screen.getByDisplayValue('vertical')
    
    expect(horizontalRadio).not.toBeChecked()
    expect(verticalRadio).toBeChecked()
  })

  it('配置方法の変更が正しく処理される', () => {
    const onChange = vi.fn()
    render(<MergeSettings {...defaultProps} onChange={onChange} />)
    
    const verticalRadio = screen.getByDisplayValue('vertical')
    fireEvent.click(verticalRadio)
    
    expect(onChange).toHaveBeenCalledWith({ arrangement: 'vertical' })
  })

  it('間隔設定が正しく表示される', () => {
    render(<MergeSettings {...defaultProps} />)
    
    expect(screen.getByText('画像間の間隔: 10px')).toBeInTheDocument()
  })

  it('間隔スライダーの変更が正しく処理される', () => {
    const onChange = vi.fn()
    render(<MergeSettings {...defaultProps} onChange={onChange} />)
    
    const slider = screen.getByDisplayValue('10')
    fireEvent.change(slider, { target: { value: '20' } })
    
    expect(onChange).toHaveBeenCalledWith({ gap: 20 })
  })

  it('間隔数値入力の変更が正しく処理される', () => {
    const onChange = vi.fn()
    render(<MergeSettings {...defaultProps} onChange={onChange} />)
    
    const numberInput = screen.getAllByDisplayValue('10')[1] // 2つ目のinput要素
    fireEvent.change(numberInput, { target: { value: '25' } })
    
    expect(onChange).toHaveBeenCalledWith({ gap: 25 })
  })

  it('無効な数値入力の場合0に設定される', () => {
    const onChange = vi.fn()
    render(<MergeSettings {...defaultProps} onChange={onChange} />)
    
    const numberInput = screen.getAllByDisplayValue('10')[1]
    fireEvent.change(numberInput, { target: { value: 'invalid' } })
    
    expect(onChange).toHaveBeenCalledWith({ gap: 0 })
  })

  it('disabled状態で正しく無効化される', () => {
    render(<MergeSettings {...defaultProps} disabled={true} />)
    
    const horizontalRadio = screen.getByDisplayValue('horizontal')
    const verticalRadio = screen.getByDisplayValue('vertical')
    const slider = screen.getByDisplayValue('10')
    const numberInput = screen.getAllByDisplayValue('10')[1]
    
    expect(horizontalRadio).toBeDisabled()
    expect(verticalRadio).toBeDisabled()
    expect(slider).toBeDisabled()
    expect(numberInput).toBeDisabled()
  })

  it('プレビュー説明が表示される', () => {
    render(<MergeSettings {...defaultProps} />)
    
    expect(screen.getByText('プレビュー')).toBeInTheDocument()
    expect(screen.getByText('設定変更時にリアルタイムで結合結果がプレビューされます。')).toBeInTheDocument()
  })

  it('間隔の説明が表示される', () => {
    render(<MergeSettings {...defaultProps} />)
    
    expect(screen.getByText('画像と画像の間の余白を設定します（0-50px）')).toBeInTheDocument()
  })
})