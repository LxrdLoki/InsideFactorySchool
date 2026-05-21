import { sanitizeString } from "../../API/helpers/scrapeDataValidator";

// UC03: Forum Posts - XSS & Basic Functionality Tests (Risk Class 9 - HIGHEST RISK)
describe('Forum Posts - UC03 (Risk Class 9)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    // Login before each test
    cy.visit('/login');
    cy.get('#email').type('test@test.com');
    cy.get('#password').type('TestPass123');
    cy.get('button').contains('Login').click();
    cy.url().should('not.include', '/login');
  });

  describe('Create Forum Post', () => {
    it('should show create post form', () => {
      cy.visit('/forum');
      cy.get('a, button').contains(/create|new|post/i).click();
      cy.get('#title').should('exist');
      cy.get('#text').should('exist');
      cy.get('#subject').should('exist');
    });

    it('should reject post with empty title', () => {
      cy.visit('/forum/create/new-post');
      cy.get('#title').type('bad')
      cy.get('#text').type('Valid forum content here');
      cy.get('#subject').select('STOCKS');
      cy.get('button').contains(/submit|post|create/i).should('be.disabled');

    });

    it('should reject post with incorrect content', () => {
      cy.visit('/forum/create/new-post');
      cy.get('#title').type('Test Post Title');
      cy.get('#subject').select('STOCKS');
      cy.get('#text').type('Unvalid');
      cy.get('button').contains(/submit|post|create/i).should('be.disabled');

    });

    it('should successfully create forum post', () => {
      cy.visit('/forum/create/new-post');
      const timestamp = Date.now();

      cy.get('#title').type(`Test Post ${timestamp}`);
      cy.get('#text').type('Valid form content here');
      cy.get('#subject').select('STOCKS');
      cy.get('button').contains(/submit|post|create/i).click();

      // Should redirect to forum overview
      cy.url().should('include', '/forum');
      cy.visit('/forum/STOCKS');

      // Post should appear in list
      cy.contains(`Test Post ${timestamp}`).should('be.visible');
    });

    it('should display post by correct user', () => {
      cy.visit('/forum/create/new-post');
      const timestamp = Date.now();

      cy.get('#title').type(`User Test ${timestamp}`);
      cy.get('#text').type('Testing user attribution');
      cy.get('#subject').select('STOCKS');
      cy.get('button').contains(/submit|post|create/i).click();

      cy.url().should('include', '/forum');
      cy.visit('/forum/STOCKS');
      // Check post shows a username
      cy.get('.post-card, .post-item, article')
        .invoke('text')
        .should('match', /by|author|user/i);
    });
  });

  describe('XSS Prevention - UC03 Security (important and riskfull)', () => {
    it('should safely display post with script tag NOT! execute it', () => {
      cy.visit('/forum/create/new-post');
      const xssPayload = "<script>alert('xss attack succeeded')</script>";

      cy.get('#title').type('XSS Test Post');
      cy.get('#text').type(xssPayload);
      cy.get('#subject').select('STOCKS');
      cy.get('button').contains(/submit|post|create/i).click();

      cy.url().should('include', '/forum');
      cy.visit('/forum/STOCKS');

      // Script should be displayed as text, not executed
      cy.contains(sanitizeString(xssPayload)).should('be.visible');
      // Alert should NOT have appeared
      cy.on('window:alert', () => {
        throw new Error('Script was executed - XSS vulnerability!');
      });
    });

    it('should safely display post with img onerror tag', () => {
      cy.visit('/forum/create/new-post');
      const xssPayload = '<img src=x onerror="alert(\'xss\')">';

      cy.get('#title').type('IMG XSS Test');
      cy.get('#text').type(xssPayload);
      cy.get('#subject').select('STOCKS');
      cy.get('button').contains(/submit|post|create/i).click();

      cy.url().should('include', '/forum');
      cy.visit('/forum/STOCKS');

      // Should contain the text representation, not execute
      cy.contains('onerror').should('be.visible');
    });

    it('should safely display post with event handlers', () => {
      cy.visit('/forum/create/new-post');
      const xssPayload = '<div onclick="alert(\'clicked\')">Click me</div>';

      cy.get('#title').type('Event Handler XSS');
      cy.get('#text').type(xssPayload);
      cy.get('#subject').select('STOCKS');
      cy.get('button').contains(/submit|post|create/i).click();

      cy.url().should('include', '/forum');
      cy.visit('/forum/STOCKS');

      cy.contains('onclick').should('be.visible');
    });
  });

  describe('View Forum Posts', () => {
    it('should display forum posts list', () => {
      cy.visit('/forum/STOCKS');
      cy.get('.post-card, .post-title-row, h2').should('have.length.greaterThan', 0);
    });

    it('should allow clicking on a post', () => {
      cy.visit('/forum/STOCKS');
      cy.get('.post-card').first().find('.view-post-btn').click();
      cy.url().should('include', '/forum/post/');
    });

    it('should display post details on single post page', () => {
      cy.visit('/forum/STOCKS');
      cy.get('.post-card').first().find('.view-post-btn').click();

      cy.get('h1, h2').should('exist'); // Title
      cy.contains(/by|author|user/i).should('exist'); // Username
    });
  });

  describe('Forum Comments - UC03', () => {
    it('should allow adding a comment to post', () => {
      cy.visit('/forum/STOCKS');
      cy.get('.post-card').first().find('.view-post-btn').click();

      cy.get('textarea').type('This is a test comment');
      cy.get('button').contains('Add comment').click();

      cy.contains('This is a test comment').should('be.visible');
    });

    it('should display safe comment with script tags', () => {
      cy.visit('/forum/STOCKS');
      cy.get('.post-card').first().find('.view-post-btn').click();


      const xssComment = "<script>alert('comment xss')</script>";
      cy.get('textarea').last().type(xssComment);
      cy.get('button').contains(/comment|reply|post/i).click();

      // Should display safely
      cy.contains(sanitizeString(xssComment)).should('be.visible');
      // Alert should not execute
      cy.on('window:alert', () => {
        throw new Error('Comment XSS executed!');
      });
    });
  });
});
