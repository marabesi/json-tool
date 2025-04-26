import App from '../../App';
import { render } from '@testing-library/react';

export const renderEntireApp = () => {
  return render(
    <App />
  );
};
