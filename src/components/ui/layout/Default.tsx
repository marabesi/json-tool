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
    <div className={`bg-gray-500 flex flex-col h-screen ${darkModeEnabled ? 'dark': ''}`}>
      <Header onDarkModeChanged={handleChange} darkModeEnabled={darkModeEnabled}/>
      { children }
      <Footer />
    </div>
  );
}
