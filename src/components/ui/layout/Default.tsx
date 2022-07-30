import Header from '../Header';
import Footer from '../Footer';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode
}

export default function DefaultLayout({ children }: Props) {
  return (
    <div className="bg-gray-500 flex flex-col h-screen">
      <Header />
      { children }
      <Footer />
    </div>
  );
}
