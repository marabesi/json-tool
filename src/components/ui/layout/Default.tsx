import Header from '../Header';
import Footer from '../Footer';

export default function DefaultLayout({ children }: any) {
  return (
    <div className="bg-gray-500 flex flex-col h-screen">
      <Header />
      { children }
      <Footer />
    </div>
  );
}
