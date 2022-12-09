Feature: Remove space and new lines
  Scenario: removes spaces and new lines from valid json string
    When I open json tool
    When I place a json string with new lines and white spaces
    When I click to clean white spaces and new lines
    Then I see the json with new lines and white spaces in the left editor
    Then I see the json without new lines and white spaces in the right editor