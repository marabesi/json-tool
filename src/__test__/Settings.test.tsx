import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderEntireApp } from './__testutilities__/builder';

describe('Settings', () => {

  async function goToSettings() {
    renderEntireApp();

    await userEvent.click( screen.getByTestId('settings'));
  }

  it('renders editor title', async () => {
    await goToSettings();

    expect(await screen.findByText('Editor')).toBeInTheDocument();
  });

  it.each([
    ['foldGutter'],
    ['syntaxHighlighting'],
    ['history'],
    ['highlightActiveLine'],
    ['autocompletion'],
    ['closeBrackets'],
    ['history'],
    ['historyKeymap'],
  ])('should  renders option %s available for editors', async (option: string) => {
    await goToSettings();
    expect(screen.getByText(option)).toBeInTheDocument();
  });

  it.each([
    ['foldGutter'],
    ['syntaxHighlighting'],
    ['highlightActiveLine'],
    // ctrl z/cmd z
    ['history'],
    ['historyKeymap'],
  ])('should mark option %s as true by default', async (option: string) => {
    await goToSettings();

    expect(screen.getByLabelText(option)).toBeChecked();
  });

  it.each([
    ['autocompletion'],
    ['closeBrackets'],
  ])('check option %s that is unchecked by default', async (option) => {
    await goToSettings();

    expect(screen.getByLabelText(option)).not.toBeChecked();

    await userEvent.click( screen.getByText(option));

    expect(screen.getByLabelText(option)).toBeChecked();
  });

  describe('editors font size', () => {
    it('should use 12 as font size by default', async () => {
      await goToSettings();
      expect(screen.getByDisplayValue('12px')).toBeVisible();
    });

    it('should define font size to 18px to be used', async () => {
      await goToSettings();

      await userEvent.clear( screen.getByTestId('font-size'));
      await userEvent.type( screen.getByTestId('font-size'), '18px');
      await userEvent.click( screen.getByText('Save'));

      await userEvent.click( screen.getByTestId('to-home'));

      await waitFor(() => {
        expect(screen.getByTestId('json')).toHaveAttribute('style', expect.stringContaining('font-size: 18px'));
      });
    });
  });

  describe('features', () => {
    it('renders features title', async () => {
      await goToSettings();
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('renders option to use history', async () => {
      await goToSettings();
      expect(screen.getByTestId('json-history-setting')).toBeInTheDocument();
    });

    it('renders option to use history label', async () => {
      await goToSettings();
      expect(screen.getByLabelText('JSON History')).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('renders layout title', async () => {
      await goToSettings();
      expect(screen.getByText('Layout')).toBeInTheDocument();
    });

    it('renders horizontal layout option', async () => {
      await goToSettings();
      expect(screen.getByTestId('layout-horizontal')).toBeInTheDocument();
    });

    it('renders vertical layout option', async () => {
      await goToSettings();
      expect(screen.getByTestId('layout-vertical')).toBeInTheDocument();
    });

    it('should use horizontal layout by default', async () => {
      await goToSettings();
      expect(screen.getByTestId('layout-horizontal')).toBeChecked();
      expect(screen.getByTestId('layout-vertical')).not.toBeChecked();
    });

    it('should switch to vertical layout when selected', async () => {
      await goToSettings();

      await userEvent.click(screen.getByLabelText('Vertical'));

      expect(screen.getByTestId('layout-vertical')).toBeChecked();
      expect(screen.getByTestId('layout-horizontal')).not.toBeChecked();
    });

    it('should apply vertical layout to editor container when vertical is selected', async () => {
      await goToSettings();

      await userEvent.click(screen.getByLabelText('Vertical'));

      await userEvent.click(screen.getByTestId('to-home'));

      await waitFor(() => {
        expect(screen.getByTestId('editor-container')).toHaveClass('flex-col');
      });
    });

    it('should apply horizontal layout to editor container by default', async () => {
      renderEntireApp();

      expect(screen.getByTestId('editor-container')).toHaveClass('flex');
    });
  });
});
