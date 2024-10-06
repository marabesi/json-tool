import Header from '../Header';
import Footer from '../Footer';
import { ReactNode, useState } from 'react';
import Drawer from './Drawer';

interface Props {
  children?: ReactNode
  onDarkThemeChanged: any
  darkModeEnabled: boolean
}

export default function DefaultLayout({ children, onDarkThemeChanged, darkModeEnabled }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div data-testid="app-container" className={`flex flex-col ${darkModeEnabled ? 'dark': ''}`}>
      {/* <button onClick={() => setOpen(!open)}>open</button> */}
      <div className="bg-blue-400 h-screen text-gray-100 dark:text-gray-400 dark:bg-gray-600">
        <Header onDarkModeChanged={onDarkThemeChanged} darkModeEnabled={darkModeEnabled}/>
        { children }
        <Footer />
        <Drawer open={open} setOpen={setOpen}>
          <p></p>
        </Drawer>
      </div>
    </div>
  );
}
