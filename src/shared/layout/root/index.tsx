import '@/shared/style/globals.css';
import styles from './index.module.css';
import { Header } from '@/shared/ui/header';
import { Footer } from '@/shared/ui/footer';
import { Size } from '@/shared/ui/size';

export const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
        />
      </head>
      <body className={styles.body}>
        <Size />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};
