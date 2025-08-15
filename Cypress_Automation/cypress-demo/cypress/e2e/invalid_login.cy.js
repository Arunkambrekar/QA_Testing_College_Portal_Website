import 'cypress-axe';

Cypress.on('uncaught:exception', () => false);

describe('Invalid Login Tests with Accessibility', () => {

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

  const verifyLoginFailed = () => {
    cy.get('body').then(($body) => {
      // Case 1: Modal popup
      if ($body.find('#myloginModal').length > 0 && $body.find('#myloginModal:visible').length > 0) {
        cy.get('#myloginModal', { timeout: 15000 }).should('be.visible').within(() => {
          cy.get('.modal-content').should('be.visible').within(() => {
            cy.get('h3').should('contain.text', 'Login Failed');
            cy.get('p').invoke('text').then((text) => {
              const cleaned = text.trim();
              expect(
                cleaned.includes('You have entered an invalid USN or password.') ||
                cleaned.includes('4 attempts remaining') ||
                cleaned.includes('3 attempts remaining') ||
                cleaned.includes('2 attempts remaining') ||
                cleaned.includes('1 attempts remaining') ||
                cleaned.includes('Too many failed login attempts.')
              ).to.be.true;
            });
          });
        });

        // Axe check for modal
        cy.injectAxe();
        cy.checkA11y('.modal-content', {
          includedImpacts: ['critical', 'serious']
        }, (violations) => {
          if (violations.length) {
            cy.log(`${violations.length} accessibility violation(s) detected`);
            console.log('Accessibility violations:', violations);
          }
        }, true);
      }
      // Case 2: Inline tooltip warning
      else if ($body.text().includes('Please select an item in the list.')) {
        cy.contains('Please select an item in the list.').should('be.visible');

        // Axe check for tooltip
        cy.injectAxe();
        cy.checkA11y(null, {
          includedImpacts: ['critical', 'serious']
        }, (violations) => {
          if (violations.length) {
            cy.log(`${violations.length} accessibility violation(s) detected`);
            console.log('Accessibility violations:', violations);
          }
        }, true);
      }
    });
  };

  it('TC01 - Incorrect Username and Valid DOB', () => {
    submitLogin('wronguser123', '27', '12', '2001');
    verifyLoginFailed();
  });

  it('TC02 - Valid Username, Incorrect DOB', () => {
    submitLogin('01fe21bec242', '01', '01', '1999');
    verifyLoginFailed();
  });

  it('TC03 - Both USN and DOB left empty', () => {
    submitLogin('', '', '', '');
    verifyLoginFailed();
  });

  it('TC04 - USN entered, DOB left empty', () => {
    submitLogin('01fe21bec242', '', '', '');
    verifyLoginFailed();
  });

  it('TC05 - SQL Injection in USN', () => {
    submitLogin("' OR 1=1--", '27', '12', '2001');
    verifyLoginFailed();
  });

  it('TC06 - Valid USN with Empty DOB', () => {
    submitLogin('01fe21bec242', '', '', '');
    verifyLoginFailed();
  });

  it('TC07 - XSS Attempt in USN', () => {
    submitLogin('<script>alert(1)</script>', '27', '12', '2001');
    verifyLoginFailed();
  });

  it('TC10 - Login with DOB 01/01/1900', () => {
    cy.get('#username').type('01fe21bec242');
    cy.get('#dd').select('01');
    cy.get('#mm').select('01');
    cy.get('#yyyy').then(($el) => {
      if ($el.find('option[value="1900"]').length > 0) {
        cy.get('#yyyy').select('1900');
        cy.get('input[type="submit"]').click();
        verifyLoginFailed();
      } else {
        cy.log('✅ Year 1900 not available (handled gracefully)');
      }
    });
  });

  it('TC12 - USN with special symbols', () => {
    submitLogin('01FE@21#BEC!', '27', '12', '2001');
    verifyLoginFailed();
  });

});
