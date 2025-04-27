import App from '../../App';
import { render } from '@testing-library/react';

export function renderEntireApp() {
  return render(
    <App />
  );
}
