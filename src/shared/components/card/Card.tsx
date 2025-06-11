'use client';

import { memo } from 'react';
import { tv } from 'tailwind-variants';

const cardStyles = tv({
  slots: {
    container: 'bg-white rounded-2xl shadow-xl p-6 grid gap-4',
    title: 'text-lg font-semibold text-gray-800',
  },
});

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const CardComponent: React.FC<CardProps> = ({ title, children }) => {
  const styles = cardStyles();

  return (
    <section className={styles.container()}>
      {title && <h2 className={styles.title()}>{title}</h2>}
      {children}
    </section>
  );
};

export const Card = memo(CardComponent);
