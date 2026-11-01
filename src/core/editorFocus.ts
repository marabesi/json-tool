const workingEditorSelector = [
  '[data-testid="json"] .cm-content',
  '[data-testid="table-json"] .cm-content',
  '[data-testid="schema-json"] .cm-content',
  '[data-testid="diff-json"] .cm-content',
].join(', ');

const resultEditorSelector = [
  '[data-testid="result"] .cm-content',
  '[data-testid="diff-compare-json"] .cm-content',
].join(', ');

export function focusWorkingEditor(): void {
  document.querySelector<HTMLElement>(workingEditorSelector)?.focus();
}

export function focusResultEditor(): void {
  document.querySelector<HTMLElement>(resultEditorSelector)?.focus();
}
