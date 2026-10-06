Feature: Sync editors scroll
  Scenario: scroll the json editor and the result editor follows
    When I open json tool with a large json file
    And I enable scroll synchronization
    And I scroll the json editor to the bottom
    Then the result editor is scrolled

  Scenario: scroll the result editor and the json editor follows
    When I open json tool with a large json file
    And I enable scroll synchronization
    And I scroll the result editor to the bottom
    Then the json editor is scrolled

  Scenario: do not sync when the option is off
    When I open json tool with a large json file
    And I scroll the json editor to the bottom
    Then the result editor is not scrolled
