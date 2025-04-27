import { DirectOptions } from '@testing-library/user-event/setup/directApi';
import { UserEventApi } from '@testing-library/user-event/setup/setup';
import  userEvent from '@testing-library/user-event';

export const customType = (
  element: Element,
  text: string, options?: DirectOptions & Parameters<UserEventApi['type']>[2]
): Promise<void> => {
  return userEvent.type(
    element, text, {
      ...options,
      delay: 20
    }
  );
};
