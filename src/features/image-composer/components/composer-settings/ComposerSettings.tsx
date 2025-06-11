'use client';

import { useId } from 'react';
import { tv } from 'tailwind-variants';
import type { ComposedImageSettings } from '../../types';

const settingsStyles = tv({
  slots: {
    container: 'grid gap-4',
    group: 'grid gap-2',
    label: 'block text-sm font-bold text-gray-800',
    input:
      'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-300 bg-white/90 backdrop-blur-sm',
    select:
      'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-300 bg-white/90 backdrop-blur-sm',
  },
});

interface ComposerSettingsProps {
  settings: ComposedImageSettings;
  onChange: (settings: ComposedImageSettings) => void;
}

export const ComposerSettings: React.FC<ComposerSettingsProps> = ({
  settings,
  onChange,
}) => {
  const id = useId();
  const styles = settingsStyles();

  const handleChange = <K extends keyof ComposedImageSettings>(
    key: K,
    value: ComposedImageSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className={styles.container()}>
      <div className={styles.group()}>
        <label htmlFor={`${id}-layout`} className={styles.label()}>
          レイアウト
        </label>
        <select
          id={`${id}-layout`}
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
          <label htmlFor={`${id}-columns`} className={styles.label()}>
            列数
          </label>
          <input
            id={`${id}-columns`}
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
          <label htmlFor={`${id}-size-mode`} className={styles.label()}>
            サイズ調整
          </label>
          <select
            id={`${id}-size-mode`}
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
        <label htmlFor={`${id}-gap`} className={styles.label()}>
          画像間の余白 (px)
        </label>
        <input
          id={`${id}-gap`}
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
};
