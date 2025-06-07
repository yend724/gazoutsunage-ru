'use client';

import { tv } from 'tailwind-variants';

const cardStyles = tv({
  slots: {
    container: 'bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 transition-all duration-300 hover:shadow-2xl',
    title: 'text-lg font-semibold mb-6 text-gray-800'
  }
});

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  const styles = cardStyles();
  
  return (
    <section className={`${styles.container()} ${className || ''}`}>
      {title && <h2 className={styles.title()}>{title}</h2>}
      {children}
    </section>
  );
}