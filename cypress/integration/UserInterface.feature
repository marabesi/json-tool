Feature: User interface
  Scenario: I want see the visual elements to interact with the page
    When I open json tool
    Then I see label to inform where to place the json

    When I open json tool
    Then I see buy me a coffee link

    When I open json tool
    Then I see a label to inform the result of formatting

  Scenario: I want see the default values that json tool uses
    When I open json tool
    Then I see 2 as the default space size