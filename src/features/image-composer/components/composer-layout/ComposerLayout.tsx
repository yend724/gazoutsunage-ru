'use client';

import { memo } from 'react';
import { tv } from 'tailwind-variants';
import { Alert } from '@/shared/components';
import { Header } from '@/shared/components/header';

const layoutStyles = tv({
  slots: {
    container: 'max-w-7xl mx-auto p-6 grid gap-8',
    mainSection: 'grid gap-8',
  },
});

interface ComposerLayoutProps {
  children: React.ReactNode;
  error?: string | null;
  onClearError?: () => void;
}

const ComposerLayoutComponent: React.FC<ComposerLayoutProps> = ({
  children,
  error,
  onClearError,
}) => {
  const styles = layoutStyles();

  return (
    <div className={styles.container()}>
      <Header />

      {error && (
        <Alert 
          variant="error" 
          message={error} 
          onDismiss={onClearError}
          className="mb-6"
        />
      )}

      <div className={styles.mainSection()}>
        {children}
      </div>
    </div>
  );
};

export const ComposerLayout = memo(ComposerLayoutComponent);