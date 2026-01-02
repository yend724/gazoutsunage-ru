import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: React.ReactNode
  variant: ButtonVariant
  size: ButtonSize
  disabled: boolean
  loading: boolean
  onClick: () => void
  type: 'button' | 'submit' | 'reset'
  className: string
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  disabled,
  loading,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' ')

  const variantClasses = {
    primary: 'bg-blue-9 text-white hover:bg-blue-10 focus:ring-blue-8',
    secondary: 'bg-gray-4 text-gray-11 hover:bg-gray-5 focus:ring-gray-8',
    danger: 'bg-red-9 text-white hover:bg-red-10 focus:ring-red-8',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClasses}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
          読み込み中...
        </>
      ) : (
        children
      )}
    </button>
  )
}

export { Button }
export type { ButtonProps, ButtonVariant, ButtonSize }