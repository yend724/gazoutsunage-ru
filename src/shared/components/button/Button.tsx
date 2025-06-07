'use client';

import { tv } from 'tailwind-variants';

const buttonStyles = tv({
  base: 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg cursor-pointer',
  variants: {
    variant: {
      primary:
        'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-slate-500/25',
      secondary:
        'bg-white/80 text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-slate-300 hover:text-slate-600 shadow-gray-200/50',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({
  variant,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, className })} {...props}>
      {children}
    </button>
  );
}
