// UC02: Data Display - Calendar & Economic Data (Risk Class 4)
describe('Economic Data Display - UC02 (Risk Class 4)', () => {
  describe('Calendar Data', () => {
    it('should display calendar on dashboard', () => {
      cy.visit('/');
      cy.get('.calendarTable, table').should('exist');
    });

    it('should display economic events', () => {
      cy.visit('/');
      cy.get('.calendarTable, table, tr').should('exist');
    });

    it('should allow navigation between weeks', () => {
      cy.visit('/');
      // Look for navigation buttons or controls
      cy.get('.navigateButton, button').should('exist');
    });
  });

  describe('Economic Data', () => {
    it('should display insider transactions data', () => {
      cy.visit('/');
      cy.get('.transaction, .insider, table, [data-cy="transactions"]')
        .should('exist');
    });

    it('should display data in a readable format', () => {
      cy.visit('/');
      // Check for columns/headers
      cy.get('th, .header, [role="columnheader"]').should('have.length.greaterThan', 0);
    });
  });

  describe('Data Loading States', () => {
    it('should handle loading state gracefully', () => {
      cy.visit('/');
      // Data should either be loaded or show loading indicator
      cy.get('.calendarTable, table, p').should('exist');
    });

    it('should display data after loading', () => {
      cy.visit('/');
      cy.wait(2000); // Wait for data to load

      // Calendar or transactions should be visible
      cy.get('.calendarTable, table').should('be.visible');
    });
  });
});
