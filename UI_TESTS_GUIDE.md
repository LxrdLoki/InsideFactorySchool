# UI Testing Guide - InsideFactory
## Cypress E2E Tests

!! Important: IN server.ts change rate limiters to allowing much more requests per minute else all tests fail because of too many requests!!
---
##  Running the UI Tests

### Open Cypress Interactive Mode
```bash
npm run cypress:open
```
Then select a test file to run visually in the browser.

### Run All Tests Headless
```bash
npm run cypress:run
```

### Run Specific Test File
```bash
npm run cypress:run -- --spec "cypress/e2e/authentication.cy.ts"
```

### Run with Specific Browser
```bash
npm run cypress:run -- --browser chrome
```

---

## Test Structure

### Before Each Test
- Clear localStorage
- Navigate to login page (for authenticated tests)

### Test Flow
1. **Setup:** Navigate to page, login if needed
2. **Action:** Click buttons, fill forms, submit
3. **Assert:** Check URL changes, elements appear, data displays

### Selectors Used
- `placeholder*="email"` - Find input by placeholder text
- `contains()` - Find element by visible text
- `button` - Find buttons
- `textarea` - Find text areas

---

## Security Testing Focus

### XSS Prevention Validation (UC03 - Risk 9)
The UI tests specifically check XSS protection:

```typescript
// Test 1: Script tag injection
cy.get('textarea').type("<script>alert('xss')</script>");
cy.get('button').contains('Submit').click();
// Verify script rendered as text, not executed
cy.contains("<script>alert('xss')</script>").should('be.visible');

// Test 2: Event handler injection
cy.get('textarea').type('<img onerror="alert(\'xss\')">');
cy.get('button').contains('Submit').click();
// Verify no alert fired
cy.on('window:alert', () => {
  throw new Error('XSS executed!');
});
```

### Authorization Testing (UC04 - Risk 6)
The moderation tests verify access control:

```typescript
// User B cannot delete User A's post
cy.login('userB@test.com', 'pass');
cy.viewPost('userA_post');
// Delete button should NOT be visible
cy.get('button').contains('Delete').should('not.exist');
```

## Simulated Test Scenarios

### Test Account Credentials
```
Email: test@test.com
Password: TestPass123

Email: admin@test.com
Password: AdminPass123
```
To create test accounts simply run npm run createTestUsers
---

## Testplan Integration

### 6.3 UI-testen

**Implemented Tests:**
- UC01: Authentication (9 tests)
  - Registration validation
  - Login flow
  - Session persistence

- UC03: Forum Posts (13 tests)
  - Create post validation
  - XSS attack prevention (3 critical tests)
  - Comment creation
  - Comment XSS prevention

- UC04: Moderation (10 tests)
  - Delete post authorization
  - Delete comment authorization
  - Admin privileges

- UC02: Data Display (7 tests)
  - Calendar display
  - Economic data rendering
  - Loading states

**Total UI Tests:** 38 tests

**Execution Method:**
```bash
npm run cypress:run
```

**Expected Results:**
- All tests pass
- No XSS alerts appear
- Authorization prevents unauthorized actions
- Data displays correctly

---
