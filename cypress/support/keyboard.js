function pressKey(key, options = {}) {
  cy.window().then((win) => {
    const activeElement = win.document.activeElement;
    const target = activeElement !== null && activeElement !== win.document.body
      ? activeElement
      : win.document.body;

    target.dispatchEvent(new win.KeyboardEvent('keydown', {
      key,
      code: options.code,
      altKey: options.altKey ?? false,
      shiftKey: options.shiftKey ?? false,
      ctrlKey: options.ctrlKey ?? false,
      metaKey: options.metaKey ?? false,
      bubbles: true,
      cancelable: true,
    }));
  });
}

module.exports = { pressKey };
