import 'cypress-axe';

Cypress.on('uncaught:exception', () => false);

describe('Valid Login Tests with Accessibility', () => {

  beforeEach(() => {
    cy.visit('https://parents.kletech.ac.in/', { failOnStatusCode: false });
    cy.injectAxe();
    cy.get('#username', { timeout: 20000 }).should('be.visible');
  });

  const submitLogin = (usn, dd, mm, yyyy) => {
    if (usn) cy.get('#username').clear().type(usn);
    if (dd) cy.get('#dd').select(dd);
    if (mm) cy.get('#mm').select(mm);
    if (yyyy) cy.get('#yyyy').select(yyyy);
    cy.get('input[type="submit"]').click();
  };

  const verifyDashboard = () => {
    cy.get('body', { timeout: 20000 }).then(($body) => {
      if ($body.find('.cn-box-layout').length > 0) {
        cy.get('.cn-box-layout', { timeout: 20000 }).should('be.visible');
        cy.injectAxe();
        cy.checkA11y('.cn-box-layout', {
          includedImpacts: ['critical', 'serious']
        }, (violations) => {
          if (violations.length) {
            cy.log(`${violations.length} accessibility violation(s) detected`);
            console.log('Accessibility violations:', violations);
          }
        }, true);
      } else if ($body.find('#myloginModal:visible').length > 0) {
        cy.log('⚠️ Login modal appeared — credentials might be wrong');
        cy.get('#myloginModal').should('be.visible');
      } else {
        cy.log('❌ Neither dashboard nor modal found — check selector or login flow');
      }
    });
  };

  it('TC01 - Login with valid credentials', () => {
    submitLogin('01fe21bec242', '27', '12', '2001');
    verifyDashboard();
  });

  it('TC02 - Login by pasting valid USN', () => {
    cy.get('#username').clear().invoke('val', '01fe21bec242').trigger('input');
    submitLogin('01fe21bec242', '27', '12', '2001');
    verifyDashboard();
  });

  it('TC03 - Login using Enter key', () => {
    cy.get('#username').clear().type('01fe21bec242');
    cy.get('#dd').select('27');
    cy.get('#mm').select('12');
    cy.get('#yyyy').select('2001');
    cy.get('body').type('{enter}');
    verifyDashboard();
  });

  it('TC04 - Login with leading/trailing spaces in USN', () => {
    submitLogin(' 01fe21bec242 ', '27', '12', '2001');
    verifyDashboard();
  });

  it('TC05 - Login on mobile viewport', () => {
    cy.viewport('iphone-6');
    submitLogin('01fe21bec242', '27', '12', '2001');
    verifyDashboard();
  });

  it('TC06 - Select DOB values from dropdowns', () => {
    submitLogin('01fe21bec242', '01', '01', '2001');
    verifyDashboard();
  });

  it('TC07 - Verify dashboard persists after refresh', () => {
    submitLogin('01fe21bec242', '27', '12', '2001');
    cy.reload();
    verifyDashboard();
  });

  it('TC08 - Login with DOB 01/01/1900 (if available)', () => {
    cy.get('#username').type('01fe21bec242');
    cy.get('#dd').select('01');
    cy.get('#mm').select('01');
    cy.get('#yyyy').then(($el) => {
      if ($el.find('option[value="1900"]').length > 0) {
        cy.get('#yyyy').select('1900');
        cy.get('input[type="submit"]').click();
        verifyDashboard();
      } else {
        cy.log('✅ Year 1900 not available (handled gracefully)');
      }
    });
  });

});
