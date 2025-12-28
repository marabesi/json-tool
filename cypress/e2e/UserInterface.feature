Feature: User interface
  Scenario: I want see the visual elements to interact with the page
    When I open json tool
    Then I see buy me a coffee link

  Scenario: I want see the default values that json tool uses
    When I open json tool
    Then I see 2 as the default space size

  Scenario: I want to navigate to the settings
    When I open json tool
    And I go to settings
    Then I see the settings options
