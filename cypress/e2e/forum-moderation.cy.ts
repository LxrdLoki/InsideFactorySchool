// UC03: Forum Posts - XSS & Basic Functionality Tests (Risk Class 9 - HIGHEST RISK)

describe('Forum Posts - UC03 (Risk Class 9)', () => {

  beforeEach(() => {
    cy.clearLocalStorage();

    cy.visit('/login');

    cy.get('#email').type('test@test.com');
    cy.get('#password').type('TestPass123');

    cy.contains('button', 'Login').click();

    cy.url().should('not.include', '/login');
  });

  describe('Create Forum Post', () => {

    it('should show create post form', () => {

      cy.visit('/forum');

      cy.contains('a, button', /create|new|post/i)
        .click();

      cy.get('#title').should('exist');
      cy.get('#text').should('exist');
      cy.get('#subject').should('exist');
    });

    it('should reject post with empty title', () => {

      cy.visit('/forum/create/new-post');
      cy.get('#title').type('bad');
      cy.get('#text').type('Valid forum content here');
      cy.get('#subject').select('STOCKS');

      // Form invalid -> button disabled
      cy.contains('button', /submit|post|create/i).should('be.disabled');
    });

    it('should reject post with incorrect content', () => {

      cy.visit('/forum/create/new-post');

      cy.get('#title')
        .type('Test Post Title');

      cy.get('#subject')
        .select('STOCKS');

      cy.get('#text')
        .type('Unvalid');

      // Form invalid -> button disabled
      cy.contains('button', /submit|post|create/i)
        .should('be.disabled');
    });

    it('should display post by correct user', () => {

      cy.visit('/forum/create/new-post');

      const timestamp = Date.now();

      cy.get('#title')
        .type(`User Test ${timestamp}`);

      cy.get('#text')
        .type('Testing user attribution with enough content in thjis field');

      cy.get('#subject')
        .select('STOCKS');

      cy.contains('button', /submit|post|create/i)
        .click();

      cy.url().should('include', '/forum');

      // go to page where the post is at based on subject
      cy.visit('/forum/STOCKS');

      cy.get('.post-card').first().should('contain.text', 'By');
    });

  });

  describe('XSS Prevention - UC03 Security (CRITICAL)', () => {

    it('should safely display post with script tag - NOT execute it', () => {

      cy.visit('/forum/create/new-post');

      const xssPayload = "<script>alert('xss attack succeeded')</script>";

      cy.on('window:alert', () => {
        throw new Error('Script executed - XSS vulnerability');
      });

      cy.get('#title').type('XSS Test Post');

      cy.get('#text').type(xssPayload);

      cy.get('#subject').select('STOCKS');

      cy.contains('button', /submit|post|create/i).click();

      cy.url().should('include', '/forum');
      cy.visit('/forum/STOCKS');

      // Sanitized output
      cy.contains("scriptalert('xss attack succeeded')/script").should('exist');
    });

    it('should safely display post with img onerror tag', () => {

      cy.visit('/forum/create/new-post');

      const xssPayload = '<img src=x onerror="alert(\'xss\')">';

      cy.on('window:alert', () => {
        throw new Error('IMG XSS executed');
      });

      cy.get('#title').type('IMG XSS Test');

      cy.get('#text').type(xssPayload);
      cy.get('#subject').select('STOCKS');
      cy.contains('button', /submit|post|create/i).click();

      cy.url().should('include', '/forum');
      cy.visit('/forum/STOCKS');
      cy.contains('onerror').should('exist');
    });

    it('should safely display post with event handlers', () => {

      cy.visit('/forum/create/new-post');

      const xssPayload = '<div onclick="alert(\'clicked\')">Click me</div>';

      cy.on('window:alert', () => {
        throw new Error('onclick XSS executed');
      });

      cy.get('#title').type('Event Handler XSS');
      cy.get('#text').type(xssPayload);

      cy.get('#subject').select('STOCKS');
      cy.contains('button', /submit|post|create/i).click();

      cy.url().should('include', '/forum');
      cy.visit('/forum/STOCKS');

      cy.contains('onclick').should('exist');
    });

  });

  describe('View Forum Posts', () => {

    it('should display forum posts list', () => {

      cy.visit('/forum/STOCKS');

      cy.get('.post-card')
        .should('have.length.greaterThan', 0);
    });

    it('should allow clicking on a post', () => {

      cy.visit('/forum/STOCKS');

      cy.get('.post-card')
        .first()
        .find('.view-post-btn')
        .click();

      cy.url().should('include', '/forum/post/');
    });

    it('should display post details on single post page', () => {

      cy.visit('/forum/STOCKS');

      cy.get('.post-card')
        .first()
        .find('.view-post-btn')
        .click();

      cy.get('h1')
        .should('exist');

      cy.contains(/by/i)
        .should('exist');
    });

  });

  describe('Forum Comments - UC03', () => {

    it('should allow adding a comment to post', () => {

      cy.visit('/forum/STOCKS');

      cy.get('.post-card').first().find('.view-post-btn').click();

      const comment = `This is a test comment ${Date.now()}`;

      cy.get('textarea')
        .type(comment);

      cy.contains('button', /comment|reply|post|add comment/i)
        .click();

      cy.contains(comment)
        .should('be.visible');
    });

    it('should display safe comment with script tags', () => {

      cy.visit('/forum/STOCKS');

      cy.get('.post-card')
        .first()
        .find('.view-post-btn')
        .click();

      cy.on('window:alert', () => {
        throw new Error('Comment XSS executed!');
      });

      const xssComment = "<script>alert('comment xss')</script>";

      cy.get('textarea')
        .type(xssComment);

      cy.contains('button', /comment|reply|post|add comment/i)
        .click();

      // Sanitized output
      cy.contains("scriptalert('comment xss')/script")
        .should('exist');
    });
  });
});
