import { render } from '@testing-library/react';
import App from '../../App';

jest.mock('react-router', () => {
  const { MemoryRouter, Route, Routes, ...rest } = jest.requireActual('react-router');
  // swap real router with in memory
  return { ...rest, HashRouter:  MemoryRouter, Route, Routes };
});

export function renderEntireApp() {
  return render(
    <App/>
  );
}
