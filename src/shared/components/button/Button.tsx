'use client';

import { tv } from 'tailwind-variants';

const buttonStyles = tv({
  base: 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg cursor-pointer',
  variants: {
    variant: {
      primary:
        'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-purple-500/25',
      secondary:
        'bg-white/80 text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-purple-300 hover:text-purple-600 shadow-gray-200/50',
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
