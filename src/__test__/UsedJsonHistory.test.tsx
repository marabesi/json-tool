import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderEntireApp } from './__testutilities__/builder';

async function goToSettings() {
  renderEntireApp();
  await userEvent.click(screen.getByTestId('settings'));
}

async function clickHistorySetting() {
  await userEvent.click(screen.getByTestId('json-history-setting'));
}

describe('Used Json History', () => {
  describe('when history is disabled', () => {
    it('should not render drawer', async () => {
      await goToSettings();

      expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });
  });

  describe('when history is enabled', () => {

    afterEach(async () => {
      // restore to false, for some reason testing library is storing it between tests
      // once it is enabled it will keep enabled, leaking to the next test. This is
      // a workaround until a final solution is found.
      await clickHistorySetting();
    });

    it('should render drawer', async () => {
      await goToSettings();
      await clickHistorySetting();

      await userEvent.click(screen.getByTestId('json-drawer-history-button'));

      expect(await screen.findByTestId('drawer')).toBeInTheDocument();
    });

    it('when opening drawer it show show for the user', async () => {
      await goToSettings();
      await clickHistorySetting();

      await userEvent.click(screen.getByTestId('json-drawer-history-button'));

      expect(await screen.findByTestId('drawer')).toHaveClass('opacity-100');
    });
  });
});
