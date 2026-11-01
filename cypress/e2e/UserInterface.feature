Feature: User interface
  Scenario: I want see the visual elements to interact with the page
    When I open json tool
    Then I see buy me a coffee link

  Scenario: I want see the default values that json tool uses
    When I open json tool
    Then I see 2 as the default space size

  Scenario: I want to navigate to the settings
    When I open json tool
    And I go to settings
    Then I see the settings options

  Scenario: I want to open the documentation
    When I open json tool
    Then I see the docs link

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

  Scenario: toggle header options with the keyboard
    When I open json tool
    And I press the Alt+J shortcut
    Then validate json is disabled
    And I press the Alt+Y shortcut
    Then sync scroll is enabled
    And I press the Alt+M shortcut
    Then dark mode is enabled

  Scenario: focus an editor with the keyboard
    When I open json tool
    And I press the Alt+Shift+W shortcut
    Then the working editor has focus
    And I press the Alt+Shift+R shortcut
    Then the result editor has focus

  Scenario: close the history drawer with Escape
    When I open json tool
    And I open the history drawer
    And I press Escape
    Then the history drawer is closed
