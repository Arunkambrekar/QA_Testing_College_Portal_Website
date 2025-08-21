export const submitLogin = (usn, dd, mm, yyyy) => {
  if (usn) cy.get('#username').clear().type(usn);
  if (dd) cy.get('#dd').select(dd);
  if (mm) cy.get('#mm').select(mm);
  if (yyyy) cy.get('#yyyy').select(yyyy);
  cy.get('input[type="submit"]').click();
};

export const verifyDashboard = () => {
  cy.get('.cn-box-layout', { timeout: 20000 }).should('be.visible').within(() => {
    cy.get('h1').should('contain.text', 'Welcome');
  });
  cy.injectAxe();
  cy.checkA11y('.cn-box-layout', {
    includedImpacts: ['critical', 'serious']
  });
};

export const verifyLoginFailedModal = () => {
  cy.get('.modal-content', { timeout: 10000 }).should('be.visible').within(() => {
    cy.get('h3').should('contain.text', 'Login Failed');
    cy.get('p').invoke('text').then((text) => {
      const cleaned = text.trim();
      expect(
        cleaned.includes('You have entered an invalid USN or password.') ||
        cleaned.includes('4 attempts remaining') ||
        cleaned.includes('3 attempts remaining') ||
        cleaned.includes('2 attempts remaining') ||
        cleaned.includes('1 attempts remaining') ||
        cleaned.includes('Too many failed login attempts.') ||
        cleaned.includes('Please try again after 5 minutes.') ||
        cleaned.includes('Please select an item in the list.')
      ).to.be.true;
    });
  });
  cy.injectAxe();
  cy.checkA11y('.modal-content', {
    includedImpacts: ['critical', 'serious']
  });
};
