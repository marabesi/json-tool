Feature: JSON as a table
  Scenario: see a json array as a table
    When I open json tool with a json array
    And I go to the table
    Then I see the json array as a table

  Scenario: expand the table to full screen
    When I open json tool with a json array
    And I go to the table
    And I expand the table
    Then I see the table in full screen
    And I collapse the table
    Then I see the table in its regular size

  Scenario: filter the table rows using the search
    When I open json tool with a json array
    And I go to the table
    And I search the table for "Mouse"
    Then I see "Mouse" in the table
    And I do not see "Laptop" in the table

  Scenario: search with no matching rows
    When I open json tool with a json array
    And I go to the table
    And I search the table for "unexisting product"
    Then I see no matching data
