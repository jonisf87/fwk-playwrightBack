@ui
Feature: User Registration
  As a new user
  I want to register on the DemoQA website
  So that I can log in and use the application

  Scenario: Successful registration with valid data
    Given I navigate to the registration page
    When I fill in the registration form with valid data
    Then I should see a success message

  Scenario: Registration fails with invalid password
    Given I navigate to the registration page
    When I fill in the registration form with an invalid password
    Then I should see a validation error message
