// cypress/pageObjects/LoginPage.js

class LoginPage {
  // Visit login page
  visit() {
    cy.visit("https://parents.kletech.ac.in/");
  }

  // Enter USN
  enterUSN(usn) {
    cy.get("#username", { timeout: 10000 })
      .should("be.visible")
      .clear()
      .type(usn);
  }

  // Select Date of Birth
  selectDay(dd) {
    cy.get("#dd", { timeout: 10000 }).should("be.visible").select(dd);
  }

  selectMonth(mm) {
    cy.get("#mm", { timeout: 10000 }).should("be.visible").select(mm);
  }

  selectYear(yyyy) {
    cy.get("#yyyy", { timeout: 10000 }).should("be.visible").select(yyyy);
  }

  // Click Login
  clickLogin() {
    cy.get("input[type='submit'], button[type='submit']", { timeout: 10000 })
      .should("be.visible")
      .click();
  }

  // Composite login method (for tests)
  login(usn, dd, mm, yyyy) {
    this.visit();
    this.enterUSN(usn);
    this.selectDay(dd);
    this.selectMonth(mm);
    this.selectYear(yyyy);
    this.clickLogin();
  }
}

export default new LoginPage();
