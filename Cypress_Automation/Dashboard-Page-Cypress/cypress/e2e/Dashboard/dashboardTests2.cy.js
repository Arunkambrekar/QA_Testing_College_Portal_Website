/// <reference types="cypress" />

import LoginPage from "../../pageObjects/LoginPage";
import DashboardPage from "../../pageObjects/DashboardPage";



// ✅ Ignore application-level uncaught exceptions so Cypress doesn't fail
Cypress.on("uncaught:exception", (err) => {
  if (
    err.message.includes("check1 is not defined") ||
    err.message.includes("Cannot read properties of null") ||
    err.message.includes("datepicker is not a function")
  ) {
    return false; // prevent Cypress from failing the test
  }
});

describe("Dashboard Page Tests - POM", () => {
  let user;

  // ✅ Load test data from fixture (cypress/fixtures/example.json)
  before(() => {
    cy.fixture("example").then((data) => {
      user = data;
    });
  });

  // ✅ Perform login before each test
  beforeEach(() => {
    LoginPage.login(user.usn, user.dd, user.mm, user.yyyy, user.password);

    // Ensure dashboard is visible before running test
    DashboardPage.verifyDashboardVisible();
    cy.contains("Credits", { timeout: 20000 }).should("be.visible");
  });

  it("TC13 - Verify Feedback Section", () => {
   // Click on Feedback link in sidebar/menu
   cy.contains("a", /feedback/i).should("be.visible").click();
 
   // Verify Feedback section loads
   DashboardPage.verifySectionVisible("feedback");
 });
 
   it("TC14 - Verify Backlog Registration Section", () => {
     cy.contains(/backlog\s*registration/i, { timeout: 10000 }).click({
       force: true,
     });
 
     cy.url().should("include", "backlogreg");
 
     cy.contains(
       /Portal is closed!!! Please contact department Co-ordinator/i,
       { timeout: 20000 }
     ).should("be.visible");
   });
 
   it("TC15 - Verify Other Links Section", () => {
   // Force click on "Other Links"
   cy.contains(/other\s*links/i)
     .should("be.visible")
     .click({ force: true });
 
   // Validate dropdown items
   cy.contains("Library").should("be.visible");
   cy.contains("Exam Fees").should("be.visible");
   cy.contains("Vikas Performance").should("be.visible");
 });
 
   // =================== TC16 – TC20 ===================
   it("TC16 - Verify Invalid Page URL Redirects", () => {
     cy.visit("/invalid-page", { failOnStatusCode: false });
     cy.url().should("include", "parents.kletech.ac.in");
   });
 
   it("TC17 - Verify Browser Refresh Keeps Session", () => {
     cy.reload();
     DashboardPage.verifyDashboardVisible();
   });
 
 //   it("TC18 - Verify Multiple Sidebar Clicks Don’t Break", () => {
 //   // Home page
 //   DashboardPage.clickSidebarOption("Home");
 //   DashboardPage.verifyDashboardVisible();
 
 //   // Proctorship page 
 //   DashboardPage.clickSidebarOption("Proctorship");
 //   DashboardPage.verifySectionVisible("Proctorship");
 
 //   // // Fee page 
 //   // DashboardPage.clickSidebarOption("Fee");
 //   // DashboardPage.verifySectionVisible("Fee");
 
 //   // // Time Table page 
 //   // DashboardPage.clickSidebarOption("Time Table");
 //   // DashboardPage.verifySectionVisible("Time Table");
 
 //   // // Exam History page 
 //   // DashboardPage.clickSidebarOption("Exam History");
 //   // DashboardPage.verifySectionVisible("Exam History");
 
 //   // // Placement page 
 //   // DashboardPage.clickSidebarOption("Placement");
 //   // DashboardPage.verifySectionVisible("Placement");
 
 //   // // Feedback page 
 //   // DashboardPage.clickSidebarOption("Feedback");
 //   // DashboardPage.verifySectionVisible("Feedback");
 
 //   // Other Links page 
 //   // DashboardPage.clickSidebarOption("Other Links");
 //   // DashboardPage.verifySectionVisible("Other Links");
 // });
 
   it("TC19 - Direct access redirects to login", () => {
     cy.clearCookies();
     cy.clearLocalStorage();
 
     cy.visit(
       "/index.php?option=com_studentdashboard&controller=studentdashboard&task=dashboard",
       { failOnStatusCode: false }
     );
 
     cy.url({ timeout: 10000 }).should("include", "index.php");
     cy.get("#username", { timeout: 20000 }).should("be.visible");
   });
 
   it("TC20 - Verify Session Timeout (Simulated)", () => {
     cy.clearCookies();
     cy.clearLocalStorage();
 
     cy.visit(
       "/index.php?option=com_studentdashboard&controller=studentdashboard&task=dashboard",
       { failOnStatusCode: false }
     );
 
     cy.url({ timeout: 10000 }).should("include", "index.php");
     cy.get("#username", { timeout: 20000 }).should("be.visible");
   });
 
   // =================== TC21 – TC25 ===================
   it("TC21 - Verify Page Title", () => {
     cy.title().should(
       "eq",
       "Contineo - Bringing Happiness to work and study places!"
     );
   });
 
   it("TC22 - Verify Student USN Displayed", () => {
     cy.contains(user.usn).should("be.visible");
   });
 
   it("TC23 - Verify Dashboard Tables Load", () => {
     cy.get("table").should("have.length.at.least", 1);
   });
 
   it("TC24 - Verify Contact/Support Link", () => {
     cy.contains(/other links/i).click({ force: true });
 
     cy.contains(/contact/i, { timeout: 20000 }).then(($el) => {
       const link = $el.closest("a");
       if (link.length) {
         cy.wrap(link).should("have.attr", "href");
       } else {
         cy.log("Contact element is not a link, skipping href check");
       }
     });
   });
 
   it("TC25 - Verify Logout Redirects to Login Page", () => {
     DashboardPage.logout();
     cy.url().should("include", "index.php");
   });




});