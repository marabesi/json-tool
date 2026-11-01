Feature: Keyboard navigation
  Scenario: navigate between views with the keyboard
    When I open json tool
    And I press the Alt+2 shortcut
    Then I see the table view
    And I press the Alt+3 shortcut
    Then I see the shape view
    And I press the Alt+4 shortcut
    Then I see the diff view
    And I press the Alt+5 shortcut
    Then I see the settings options
    And I press the Alt+1 shortcut
    Then I see the home view

  Scenario: use the letter and Home shortcut aliases
    When I open json tool
    And I press the Alt+S shortcut
    Then I see the settings options
    And I press the Alt+Home shortcut
    Then I see the home view

  Scenario: see the keyboard shortcuts
    When I open json tool
    And I press the question mark key
    Then I see the keyboard shortcuts
    And I press Escape
    Then I do not see the keyboard shortcuts

  Scenario: open the shortcuts from the header
    When I open json tool
    And I open the keyboard shortcuts from the header
    Then I see the keyboard shortcuts
    And I close the keyboard shortcuts
    Then I do not see the keyboard shortcuts

  Scenario: close the history drawer with Escape
    When I open json tool
    And I open the history drawer
    And I press Escape
    Then the history drawer is closed

  Scenario: exit the table full screen with Escape
    When I open json tool
    And I go to the table
    And I expand the table
    Then I see the table in full screen
    And I press Escape
    Then I see the table in its regular size

  Scenario: toggle header options with the keyboard
    When I open json tool
    And I press the Alt+J shortcut
    Then validate json is disabled
    And I press the Alt+Y shortcut
    Then sync scroll is enabled
    And I press the Alt+M shortcut
    Then dark mode is enabled

  Scenario: clean the editor with the keyboard
    When I open json tool
    And I type a json in the input editor
    And I press the Alt+Delete shortcut
    Then the input editor is empty

  Scenario: clean spaces with the keyboard
    When I open json tool
    And I type a json in the input editor
    And I press the Alt+Shift+S shortcut
    Then the result is cleaned

  Scenario: use the table shortcuts
    When I open json tool with a json array
    And I go to the table
    And I press the Alt+G shortcut
    Then the table search has focus
    And I press the Alt+E shortcut
    Then exact match is enabled
    And I press the Alt+Enter shortcut
    Then I see the table in full screen

  Scenario: use the shape shortcuts
    When I open json tool with nested json
    And I go to the shape
    And I press the Alt+W shortcut
    Then I see all nested shapes collapsed
    And I press the Alt+E shortcut
    Then I see all nested shapes expanded

  Scenario: focus an editor with the keyboard
    When I open json tool
    And I press the Alt+Shift+W shortcut
    Then the working editor has focus
    And I press the Alt+Shift+R shortcut
    Then the result editor has focus
