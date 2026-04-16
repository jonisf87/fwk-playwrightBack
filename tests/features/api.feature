@api
Feature: DemoQA Bookstore API

  Scenario: Retrieve all books
    When I request all books from the API
    Then the response should have status 200
    And the response should contain a list of books

  Scenario: Generate a user token
    Given I have valid user credentials
    When I request a token from the API
    Then the response should have status 200
    And the response should contain a token

  Scenario: Call an authenticated API method
    Given I have a valid user token
    When I request my user account details
    Then the response should have status 200
    And the response should contain my user information
