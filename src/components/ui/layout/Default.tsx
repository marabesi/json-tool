import Header from '../Header';
import Footer from '../Footer';
import { ReactNode, useState } from 'react';

interface Props {
  children?: ReactNode
}

export default function DefaultLayout({ children }: Props) {
  const [darkModeEnabled, setDarkMode] = useState<boolean>(false);
  const handleChange = (isChecked: boolean) => {
    setDarkMode(isChecked);
  };

  return (
    <div className={`flex flex-col ${darkModeEnabled ? 'dark': ''}`}>
      <div className="bg-gray-500 h-screen text-gray-100 dark:text-gray-400 dark:bg-gray-600">
        <Header onDarkModeChanged={handleChange} darkModeEnabled={darkModeEnabled}/>
        { children }
        <Footer />
      </div>
    </div>
  );
}
