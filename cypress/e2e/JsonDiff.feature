Feature: JSON diff
  Scenario: see the differences between two json documents
    When I open json tool with the original json to diff
    And I go to the diff
    And I compare with a changed json
    Then I see the json differences
    And I see 1 added difference
    And I see 1 removed difference
    And I see 1 changed difference

  Scenario: see a placeholder when there is no json to compare
    When I open json tool
    And I go to the diff
    Then I see the diff placeholder

  Scenario: see a message when both json documents are identical
    When I open json tool with the original json to diff
    And I go to the diff
    And I compare with the same json
    Then I see that both documents are identical

  Scenario: see an error when the compared json is invalid
    When I open json tool with the original json to diff
    And I go to the diff
    And I compare with an invalid json
    Then I see the diff error

  Scenario: focus the compare editor with the keyboard
    When I open json tool with the original json to diff
    And I go to the diff
    And I press the Alt+Shift+R shortcut
    Then the compare editor has focus
