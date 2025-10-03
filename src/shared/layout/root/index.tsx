import 'destyle.css';
import '@/shared/style/globals.css';
import styles from './index.module.css';
import { Header } from '@/shared/ui/header';
import { Footer } from '@/shared/ui/footer';

export const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja" data-theme="dark">
      <body className={styles.body}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};
