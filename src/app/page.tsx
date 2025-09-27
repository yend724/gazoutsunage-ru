import type { Metadata } from 'next';
import { Home } from '@/view/home';

export const metadata: Metadata = {
  title: 'ガゾウツナゲール',
};

const HomePage = () => {
  return <Home />;
};

export default HomePage;
