export const viewShortcutRoutes: Record<string, string | undefined> = {
  Digit1: '/',
  Digit2: '/table',
  Digit3: '/schema',
  Digit4: '/diff',
  Digit5: '/settings',
  Numpad1: '/',
  Numpad2: '/table',
  Numpad3: '/schema',
  Numpad4: '/diff',
  Numpad5: '/settings',
  Home: '/',
  KeyS: '/settings',
};

export function viewShortcutRouteFor(event: KeyboardEvent): string | undefined {
  const fromCode = viewShortcutRoutes[event.code];

  if (fromCode !== undefined) {
    return fromCode;
  }

  if (/^[1-5]$/.test(event.key)) {
    return viewShortcutRoutes[`Digit${event.key}`];
  }

  if (event.key === 'Home') {
    return viewShortcutRoutes.Home;
  }

  if (/^[a-z]$/i.test(event.key)) {
    return viewShortcutRoutes[`Key${event.key.toUpperCase()}`];
  }

  return undefined;
}

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  const editable = target.closest('input, textarea, select, [contenteditable="true"]');

  if (!(editable instanceof HTMLElement)) {
    return false;
  }

  if (editable instanceof HTMLInputElement) {
    return !['button', 'checkbox', 'color', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit'].includes(editable.type);
  }

  return true;
}

export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (container === null) {
    return [];
  }

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}
