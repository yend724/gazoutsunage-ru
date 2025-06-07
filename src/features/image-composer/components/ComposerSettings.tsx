'use client';

import { tv } from 'tailwind-variants';
import type { ComposedImageSettings } from '../types';

const settingsStyles = tv({
  slots: {
    container: 'bg-gray-50 rounded-lg p-6 space-y-4',
    group: 'space-y-2',
    label: 'block text-sm font-medium text-gray-700',
    input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
    select: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
    colorInput: 'h-10 cursor-pointer'
  }
});

interface ComposerSettingsProps {
  settings: ComposedImageSettings;
  onChange: (settings: ComposedImageSettings) => void;
}

export function ComposerSettings({ settings, onChange }: ComposerSettingsProps) {
  const styles = settingsStyles();

  const handleChange = <K extends keyof ComposedImageSettings>(
    key: K,
    value: ComposedImageSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className={styles.container()}>
      <h3 className="text-lg font-semibold mb-4">合成設定</h3>
      
      <div className={styles.group()}>
        <label className={styles.label()}>レイアウト</label>
        <select
          className={styles.select()}
          value={settings.layout}
          onChange={(e) => handleChange('layout', e.target.value as ComposedImageSettings['layout'])}
        >
          <option value="horizontal">横並び</option>
          <option value="vertical">縦並び</option>
          <option value="grid">グリッド</option>
        </select>
      </div>

      {settings.layout === 'grid' && (
        <div className={styles.group()}>
          <label className={styles.label()}>列数</label>
          <input
            type="number"
            className={styles.input()}
            value={settings.columns || 2}
            min={1}
            max={10}
            onChange={(e) => handleChange('columns', Number(e.target.value))}
          />
        </div>
      )}

      {(settings.layout === 'horizontal' || settings.layout === 'vertical') && (
        <div className={styles.group()}>
          <label className={styles.label()}>サイズ調整</label>
          <select
            className={styles.select()}
            value={settings.sizeMode || 'default'}
            onChange={(e) => handleChange('sizeMode', e.target.value as 'default' | 'minimum')}
          >
            <option value="default">
              {settings.layout === 'horizontal' ? '最大高さに合わせる' : '最大幅に合わせる'}
            </option>
            <option value="minimum">
              {settings.layout === 'horizontal' ? '最小高さに合わせる' : '最小幅に合わせる'}
            </option>
          </select>
        </div>
      )}

      <div className={styles.group()}>
        <label className={styles.label()}>画像間の余白 (px)</label>
        <input
          type="number"
          className={styles.input()}
          value={settings.gap}
          min={0}
          max={100}
          onChange={(e) => handleChange('gap', Number(e.target.value))}
        />
      </div>

      <div className={styles.group()}>
        <label className={styles.label()}>背景色</label>
        <input
          type="color"
          className={`${styles.input()} ${styles.colorInput()}`}
          value={settings.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
        />
      </div>

    </div>
  );
}