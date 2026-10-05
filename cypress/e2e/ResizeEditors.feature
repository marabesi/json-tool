Feature: Resize editors
  Scenario: resize the editors using the mouse
    When I open json tool
    And I drag the editor resizer to the right
    Then the editors are not split equally anymore

  Scenario: resize the editors using the keyboard
    When I open json tool
    And I press the left arrow on the editor resizer
    Then the left editor becomes narrower

  Scenario: keep the menus inside their editor when it gets narrow
    When I open json tool
    And I drag the editor resizer to the minimum
    Then the editor menus do not overlap

  Scenario: show only icons with a tooltip
    When I open json tool
    Then the editor menus show only icons
    And the menu actions have a title

  Scenario: resize the editors on the table page
    When I open json tool
    And I go to the table
    Then I see the editor resizer
    And I see the input editor menu

  Scenario: resize the editors on the shape page
    When I open json tool
    And I go to the shape
    Then I see the editor resizer
    And I see the input editor menu
