Feature: Remove new lines from json
  Scenario: remove new lines with valid json
    When I open json tool
    When I place a valid json string with new lines
    When I click to remove new lines
    Then I see the json with new line in the left editor
    Then I see a json without new lines in the right editor