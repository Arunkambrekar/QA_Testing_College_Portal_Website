// cypress/support/commands.js

// ✅ Example: Custom login command
Cypress.Commands.add("login", (username, dd, mm, yyyy, password) => {
  cy.visit("/"); // baseUrl will handle full URL if set in cypress.config.js

  cy.get("#username").clear().type(username);
  cy.get("#dd").select(dd);
  cy.get("#mm").select(mm);
  cy.get("#yyyy").select(yyyy);
  cy.get("#password").clear().type(password, { log: false }); // hide password in logs
  cy.get("input[type='submit']").click();
});

// ✅ Example: Logout command
Cypress.Commands.add("logout", () => {
  cy.contains("Logout").click();
});

// ✅ Example: Helper for asserting error messages
Cypress.Commands.add("checkError", (message) => {
  cy.contains(message).should("be.visible");
});
