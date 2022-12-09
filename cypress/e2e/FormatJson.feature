Feature: Format json
  Scenario: format valid json string
    When I open json tool with valid json string
    Then I see the same json in the right editor

  Scenario: invalid json string
    When I open json tool with an invalid json string
    Then I see an error message