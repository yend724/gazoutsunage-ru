import React from 'react'

type LoadingSpinnerSize = 'sm' | 'md' | 'lg'

type LoadingSpinnerProps = {
  size: LoadingSpinnerSize
  className: string
  label: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size,
  className = '',
  label = '読み込み中...',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]',
  }

  const combinedClasses = [
    'animate-spin rounded-full border-solid border-current border-r-transparent',
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flex items-center space-x-2">
      <div className={combinedClasses} role="status" aria-label={label} />
      <span className="text-sm text-gray-11">{label}</span>
    </div>
  )
}

export { LoadingSpinner }
export type { LoadingSpinnerProps, LoadingSpinnerSize }