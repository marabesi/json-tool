const { When } = require('cypress-cucumber-preprocessor/steps');
const { pressKey } = require('../keyboard');

When(/^I press the Alt\+(\d) shortcut$/, function (number) {
  pressKey(number, { code: `Digit${number}`, altKey: true });
});

When(/^I press the Alt\+([A-Z]) shortcut$/, function (letter) {
  pressKey(letter.toLowerCase(), { code: `Key${letter}`, altKey: true });
});

When(/^I press the Alt\+Shift\+([A-Z]) shortcut$/, function (letter) {
  pressKey(letter.toLowerCase(), { code: `Key${letter}`, altKey: true, shiftKey: true });
});

When(/^I press the Alt\+Enter shortcut$/, function () {
  pressKey('Enter', { code: 'Enter', altKey: true });
});

When(/^I press the Alt\+Delete shortcut$/, function () {
  pressKey('Delete', { code: 'Delete', altKey: true });
});

When(/^I press the Alt\+Home shortcut$/, function () {
  pressKey('Home', { code: 'Home', altKey: true });
});

When(/^I press the question mark key$/, function () {
  pressKey('?', { code: 'Slash', shiftKey: true });
});

When(/^I press Escape$/, function () {
  pressKey('Escape', { code: 'Escape' });
});
