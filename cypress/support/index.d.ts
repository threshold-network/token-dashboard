/* eslint-disable no-unused-vars */
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    dataCy(value: string): Chainable<Element>
  }
}
