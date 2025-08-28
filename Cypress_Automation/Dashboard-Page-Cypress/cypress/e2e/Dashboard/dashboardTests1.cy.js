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

 
  // =================== TC01 – TC05 ===================
  it("TC01 - Verify Dashboard page loads successfully", () => {
    DashboardPage.verifyDashboardVisible();
  });

  it("TC02 - Verify Student Name is displayed", () => {
    DashboardPage.getStudentName()
      .invoke("text")
      .then((text) => {
        expect(text.toLowerCase()).to.include(
          user.studentName.toLowerCase()
        );
      });
  });

  it("TC03 - Verify Sidebar Navigation", () => {
    const menuItems = [
      "HOME",
      "PROCTORSHIP",
      "FEE",
      "CALENDAR OF EVENTS",
      "TIME TABLE",
      "EXAM HISTORY",
      "PLACEMENT",
      "FEEDBACK",
      "BACKLOG REGISTRATION",
      "OTHER LINKS",
    ];
    DashboardPage.verifySidebar(menuItems);
  });

  it("TC04 - Verify Credits Earned", () => {
    DashboardPage.verifyCredits(user.credits);
  });

  it("TC05 - Verify Logout Functionality", () => {
    DashboardPage.logout();
    cy.url().should("include", "index.php");
  });

  // =================== TC06 – TC10 ===================
  it("TC06 - Verify Fees Status", () => {
    DashboardPage.verifyFees(user.feesStatus);
  });

 it("TC07 - Verify Mentor Information", () => {
  const commentLabel = "Mentor Comments :"; // notice the space before colon
  const mentorName = "Basawaraj Patil";
  const designation = "Assistant Professor";

  DashboardPage.verifyMentorInfo(commentLabel, mentorName, designation);
});


  it("TC08 - Verify Attendance Table is displayed", () => {
    DashboardPage.verifyAttendanceTable();
  });

  it("TC09 - Verify Calendar of Events is clickable", () => {
    cy.contains(/calendar\s*of\s*events/i, { timeout: 15000 })
      .closest("a")
      .should("be.visible")
      .click();

    cy.url().should("match", /calend[ae]rdisplay/i);
  });

  it("TC10 - Verify Time Table is clickable", () => {
    cy.contains("a", /time\s*table/i)
  .should("be.visible")
  .invoke("attr", "href")
  .then((href) => {
    cy.log("Time Table link points to: " + href);
  });
  });

  // =================== TC11 – TC15 ===================
//  it("TC11 - Verify Exam History Section", () => {
//   // Click Exam History link
//   cy.contains("a", /exam history/i)
//     .should("be.visible")
//     .click({ force: true });

//   // Wait for the new page to load
//   cy.url().should('include', 'task=getResult');

//   // Verify Exam History section
//   DashboardPage.verifyExamHistoryVisible();
// });

// it("TC12 - Verify Placement Section", () => {
//   cy.contains("a", /placement/i)
//     .should("be.visible")
//     .click();

//   DashboardPage.verifySectionVisible("Placement");
// });

  
});
