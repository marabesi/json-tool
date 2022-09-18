Feature: Clipboard
  Scenario: Upload json file
    When I open json tool
    When I upload a json file in the left editor
    Then I see the uploaded json content in the right editor
