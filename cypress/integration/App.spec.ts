/// <reference types="../support" />

describe("My First Test", () => {
  it("Opens the app", () => {
    cy.visit("/")
    cy.dataCy("app-container")
  })
})
