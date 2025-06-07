'use client';

import { tv } from 'tailwind-variants';
import type { ComposedImageSettings } from '../../types';

const settingsStyles = tv({
  slots: {
    container: 'space-y-6',
    group: 'space-y-3',
    label: 'block text-sm font-bold text-gray-800',
    input:
      'w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/90 backdrop-blur-sm',
    select:
      'w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/90 backdrop-blur-sm',
  },
});

interface ComposerSettingsProps {
  settings: ComposedImageSettings;
  onChange: (settings: ComposedImageSettings) => void;
}

export function ComposerSettings({
  settings,
  onChange,
}: ComposerSettingsProps) {
  const styles = settingsStyles();

  const handleChange = <K extends keyof ComposedImageSettings>(
    key: K,
    value: ComposedImageSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className={styles.container()}>
      <h3 className="text-lg font-semibold mb-6">合成設定</h3>

      <div className={styles.group()}>
        <label htmlFor="layout" className={styles.label()}>
          レイアウト
        </label>
        <select
          id="layout"
          className={styles.select()}
          value={settings.layout}
          onChange={e =>
            handleChange(
              'layout',
              e.target.value as ComposedImageSettings['layout']
            )
          }
        >
          <option value="horizontal">横並び</option>
          <option value="vertical">縦並び</option>
          <option value="grid">グリッド</option>
        </select>
      </div>

      {settings.layout === 'grid' && (
        <div className={styles.group()}>
          <label htmlFor="columns" className={styles.label()}>
            列数
          </label>
          <input
            id="columns"
            type="number"
            className={styles.input()}
            value={settings.columns || 2}
            min={1}
            max={10}
            onChange={e => handleChange('columns', Number(e.target.value))}
          />
        </div>
      )}

      {(settings.layout === 'horizontal' || settings.layout === 'vertical') && (
        <div className={styles.group()}>
          <label htmlFor="sizeMode" className={styles.label()}>
            サイズ調整
          </label>
          <select
            id="sizeMode"
            className={styles.select()}
            value={settings.sizeMode || 'default'}
            onChange={e =>
              handleChange('sizeMode', e.target.value as 'default' | 'minimum')
            }
          >
            <option value="default">
              {settings.layout === 'horizontal'
                ? '最大高さに合わせる'
                : '最大幅に合わせる'}
            </option>
            <option value="minimum">
              {settings.layout === 'horizontal'
                ? '最小高さに合わせる'
                : '最小幅に合わせる'}
            </option>
          </select>
        </div>
      )}

      <div className={styles.group()}>
        <label htmlFor="gap" className={styles.label()}>
          画像間の余白 (px)
        </label>
        <input
          id="gap"
          type="number"
          className={styles.input()}
          value={settings.gap}
          min={0}
          max={100}
          onChange={e => handleChange('gap', Number(e.target.value))}
        />
      </div>
    </div>
  );
}
