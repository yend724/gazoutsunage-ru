import { tv } from 'tailwind-variants';

import { Logo } from '@/assets/images/logo';

const composerStyles = tv({
  slots: {
    container: 'max-w-7xl mx-auto',
    header: 'text-center',
    title: 'text-2xl font-bold text-gray-800',
    subtitle: 'text-gray-600 font-medium',
  },
});

const styles = composerStyles();

export const Header: React.FC = () => {
  return (
    <header className={styles.header()}>
      <h1 className={styles.title()}>
        <span className="inline-flex items-center gap-3">
          <Logo />
          ガゾウツナゲール
        </span>
      </h1>
      <p className={styles.subtitle()}>複数の画像を1つにつなげます</p>
    </header>
  );
};
