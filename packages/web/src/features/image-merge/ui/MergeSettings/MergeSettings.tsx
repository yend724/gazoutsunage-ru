import React from 'react'

import { MergeOptions, ArrangementType } from '../../types'

type MergeSettingsProps = {
  readonly settings: MergeOptions
  readonly onChange: (settings: Partial<MergeOptions>) => void
  readonly disabled: boolean
}

const MergeSettings: React.FC<MergeSettingsProps> = React.memo(
  ({ settings, onChange, disabled }) => {
    const handleArrangementChange = (arrangement: ArrangementType) => {
      onChange({ arrangement })
    }

    const handleGapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const gap = parseInt(event.target.value, 10)
      onChange({ gap: isNaN(gap) ? 0 : gap })
    }

    return (
      <div className="space-y-8">
        <h3 className="text-lg font-medium text-gray-12">結合設定</h3>

        <div className="space-y-4">
          {/* 配置方法選択 */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-12">配置方法</h4>
            <div className="space-y-2 flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="arrangement"
                  value="horizontal"
                  checked={settings.arrangement === 'horizontal'}
                  onChange={() => handleArrangementChange('horizontal')}
                  disabled={disabled}
                  className="mr-3 h-4 w-4 border-gray-7 text-blue-9 focus:ring-blue-8 focus:ring-offset-0"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-12">横並び</span>
                  <p className="text-xs text-gray-11 mt-1">画像を左から右へ水平に配置します</p>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="arrangement"
                  value="vertical"
                  checked={settings.arrangement === 'vertical'}
                  onChange={() => handleArrangementChange('vertical')}
                  disabled={disabled}
                  className="mr-3 h-4 w-4 border-gray-7 text-blue-9 focus:ring-blue-8 focus:ring-offset-0"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-12">縦並び</span>
                  <p className="text-xs text-gray-11 mt-1">画像を上から下へ垂直に配置します</p>
                </div>
              </label>
            </div>
          </div>

          {/* サイズ揃え設定 */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-12">サイズ調整</h4>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.alignSize}
                onChange={e => onChange({ alignSize: e.target.checked })}
                disabled={disabled}
                className="mr-3 h-4 w-4 border-gray-7 text-blue-9 focus:ring-blue-8 focus:ring-offset-0 rounded"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-12">サイズを揃える</span>
                <p className="text-xs text-gray-11 mt-1">
                  {settings.arrangement === 'horizontal'
                    ? '横並び時: 高さを最小の画像に合わせる'
                    : '縦並び時: 幅を最小の画像に合わせる'}
                </p>
              </div>
            </label>
          </div>

          {/* 間隔設定 */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-12">
              画像間の間隔: {settings.gap}px
            </h4>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={settings.gap}
                onChange={handleGapChange}
                disabled={disabled}
                className="flex-1 h-2 bg-gray-4 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={settings.gap}
                  onChange={handleGapChange}
                  disabled={disabled}
                  className="w-16 px-2 py-1 text-sm border border-gray-7 rounded-md bg-gray-2 text-gray-12 focus:border-blue-8 focus:outline-none focus:ring-1 focus:ring-blue-8 disabled:bg-gray-3 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-11">px</span>
              </div>
            </div>
            <p className="text-xs text-gray-11 mt-2">画像と画像の間の余白を設定します（0-50px）</p>
          </div>
        </div>
      </div>
    )
  }
)

MergeSettings.displayName = 'MergeSettings'

export { MergeSettings }
export type { MergeSettingsProps }
