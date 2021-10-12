function dataCy(identifier: string) {
  return cy.get(`[data-cy=${identifier}]`)
}

Cypress.Commands.add("dataCy", dataCy)
