import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AppWithoutRouter } from '../../App';

export function renderEntireApp() {
  return render(
    <MemoryRouter>
      <AppWithoutRouter/>
    </MemoryRouter>
  );
}
