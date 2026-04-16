@ui
Feature: Parallel user simulation for Practice Form and Sortable Grid

  Scenario: Two users interact with different pages in parallel
    When user 1 fills and submits the automation practice form with valid data
    And user 2 shuffles the sortable grid items
    Then user 1 should see the form submission confirmation
    And user 2 should see the grid items reordered

  Scenario: User 1 submits the form with an invalid email
    When user 1 fills the automation practice form with an invalid email
    Then user 1 should see an email validation error
