Feature: JSON shape
  Scenario: see the shape of a json array with property percentages
    When I open json tool with a json array
    And I go to the shape
    Then I see the json shape with property percentages

  Scenario: see a placeholder when there is no json
    When I open json tool
    And I go to the shape
    Then I see the shape placeholder

  Scenario: see the same statistics for nested shapes
    When I open json tool with nested json
    And I go to the shape
    Then I see the nested shapes statistics