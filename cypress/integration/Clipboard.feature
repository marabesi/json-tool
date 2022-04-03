Feature: Clipboard
  Scenario: Place text from clipboard
    When I open json tool
    When I copy text into the clipboard
    When I click paste from clipboard
    Then I see the copied content in the left editor
    Then I see the copied content in the right editor

  Scenario: Copy text from clipboard
    When I open json tool
    When I place a json string in the left editor
    When I click copy json to clipboard
    Then I see the copied content in the clipboard