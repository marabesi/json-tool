import Header from '../Header';
import Footer from '../Footer';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode
  onDarkThemeChanged: any
  darkModeEnabled: boolean
}

export default function DefaultLayout({ children, onDarkThemeChanged, darkModeEnabled }: Props) {
  return (
    <div className={`flex flex-col ${darkModeEnabled ? 'dark': ''}`}>
      <div className="bg-gray-500 h-screen text-gray-100 dark:text-gray-400 dark:bg-gray-600">
        <Header onDarkModeChanged={onDarkThemeChanged} darkModeEnabled={darkModeEnabled}/>
        { children }
        <Footer />
      </div>
    </div>
  );
}
