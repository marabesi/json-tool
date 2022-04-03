Feature: Remove white spaces from json
  Scenario: remove white spaces with valid json
    When I open json tool with valid json with white spaces
    When I click to remove white spaces
    Then I see a json without white spaces