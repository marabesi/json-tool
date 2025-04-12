Feature: Clean up editors
  Scenario: Editor with content should be cleaned
    When I open json tool
    When I place a json string in the editor
    When I click to clean the editor
    Then I see both editors empty

  Scenario: Editor with content should be cleaned via keymap
    When I open json tool
    When I place a json string in the editor
    When I click to clean the editor with ctrl z
    Then I see both editors empty