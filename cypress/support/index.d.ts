/* eslint-disable no-unused-vars */
/// <reference types="cypress" />

declare namespace Cypress {
  /**
   * A helper method provided by the cypress documentation:
   * https://docs.cypress.io/guides/tooling/typescript-support#Types-for-custom-commands
   * Custom command to select DOM element by data-cy attribute.
   * @example cy.dataCy('greeting')
   */
  interface Chainable<Subject> {
    dataCy(value: string): Chainable<Element>
  }
}
