export function grabEditor(container: HTMLElement, testId: string): HTMLElement {
  const editor = container.querySelector(`[data-testid="${testId}"] .cm-content`);

  if (!editor) {
    throw new Error(`Could not find editor ${testId}`);
  }

  return editor as HTMLElement;
}

export function grabCurrentEditor(container: HTMLElement): HTMLElement {
  return grabEditor(container, 'json');
}

export function grabResultEditor(container: HTMLElement): HTMLElement {
  return grabEditor(container, 'result');
}
