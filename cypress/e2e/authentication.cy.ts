// UC01: Login & Registration Tests
describe('Authentication - UC01 (Risk Class 6)', () => {
  beforeEach(() => {
    // Start fresh for each test
    cy.clearLocalStorage();
  });

  describe('Registration Flow', () => {
    it('should show registration form', () => {
      cy.visit('/register');
      cy.get('#username').should('exist');
      cy.get('#email').should('exist');
      cy.get('#password').should('exist');
      cy.get('button').contains('Create account').should('exist');
    });

    it('should successfully register with valid credentials', () => {
      cy.visit('/register');
      const randomUser = `user_${Date.now()}`;
      const randomEmail = `${randomUser}@test.com`;

      cy.get('#username').type(randomUser);
      cy.get('#email').type(randomEmail);
      cy.get('#password').type('ValidPass123');
      cy.get('#confirmPassword').type('ValidPass123');
      cy.get('button').contains('Create account').click();

      // Should redirect to login page
      cy.url().should('include', '/login');
    });
  });

  describe('Login Flow', () => {
    it('should show login form', () => {
      cy.visit('/login');
      cy.get('#email').should('exist');
      cy.get('#password').should('exist');
      cy.get('button').contains('Login').should('exist');
    });

    it('should login with valid credentials', () => {
      cy.visit('/login');
      cy.get('#email').type('test@test.com');
      cy.get('#password').type('TestPass123');
      cy.get('button').contains('Login').click();

      // Should redirect to dashboard/home
      cy.url().should('not.include', '/login');
      // Token should be in localStorage
      cy.window().then(win => {
        expect(win.localStorage.getItem('token')).to.exist;
      });
    });

    it('should show error for invalid credentials', () => {
      cy.visit('/login');
      cy.get('#email').type('wrong@test.com');
      cy.get('#password').type('WrongPass123');
      cy.get('button').contains('Login').click();

      cy.contains(/invalid|error|credentials/i).should('be.visible');
    });

    it('should maintain login after page refresh', () => {
      // Assuming we can login with test account
      cy.visit('/login');
      cy.get('#email').type('test@test.com');
      cy.get('#password').type('TestPass123');
      cy.get('button').contains('Login').click();

      cy.url().should('not.include', '/login');

      // Refresh page
      cy.reload();

      // Should still be logged in
      cy.window().then(win => {
        expect(win.localStorage.getItem('token')).to.exist;
      });
      cy.url().should('not.include', '/login');
    });
  });
});
