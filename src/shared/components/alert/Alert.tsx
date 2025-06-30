'use client';

import { tv } from 'tailwind-variants';
import { useEffect } from 'react';

type AlertVariant = 'error' | 'warning' | 'info' | 'success';

type AlertProps = {
  variant?: AlertVariant;
  message: string;
  onDismiss?: () => void;
  autoHideDuration?: number;
  className?: string;
};

const alertStyles = tv({
  base: 'px-4 py-3 rounded-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300',
  variants: {
    variant: {
      error: 'bg-red-50 text-red-900 border border-red-200',
      warning: 'bg-amber-50 text-amber-900 border border-amber-200',
      info: 'bg-blue-50 text-blue-900 border border-blue-200',
      success: 'bg-green-50 text-green-900 border border-green-200',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

const iconStyles = tv({
  base: 'w-5 h-5 flex-shrink-0',
  variants: {
    variant: {
      error: 'text-red-600',
      warning: 'text-amber-600',
      info: 'text-blue-600',
      success: 'text-green-600',
    },
  },
});

const icons: Record<AlertVariant, string> = {
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  success: '✓',
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  message,
  onDismiss,
  autoHideDuration,
  className,
}) => {
  useEffect(() => {
    if (autoHideDuration && onDismiss) {
      const timer = setTimeout(onDismiss, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onDismiss]);

  return (
    <div
      className={alertStyles({ variant, className })}
      role="alert"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-center gap-3">
        <span className={iconStyles({ variant })} aria-hidden="true">
          {icons[variant]}
        </span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-current opacity-70 hover:opacity-100 transition-opacity p-1"
          aria-label="閉じる"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};