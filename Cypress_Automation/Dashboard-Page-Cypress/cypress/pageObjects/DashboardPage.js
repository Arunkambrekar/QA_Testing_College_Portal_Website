// cypress/pageObjects/DashboardPage.js

class DashboardPage {

  clickSidebarOption(optionName) {
    cy.contains("a", optionName).click();
  }
  // Verify dashboard main container
  verifyDashboardVisible() {
    cy.contains("Credits", { timeout: 20000 }).should("be.visible");
    cy.contains("Fees status").should("be.visible");
  }

  // Student name (top-left)
  getStudentName() {
    return cy.get("div").contains("ARUN SANJAY KAMBREKAR").first();
  }

  // Sidebar menu (HOME, PROCTORSHIP, etc.)
  verifySidebar(expectedMenuItems) {
    expectedMenuItems.forEach((item) => {
      cy.contains("a", item, { matchCase: false }).should("be.visible");
    });
  }

  // Verify credits earned
  verifyCredits(expectedCredits) {
  cy.contains(/credits earned/i, { timeout: 30000 })
    .should("be.visible")
    .invoke("text")
    .then((text) => {
      expect(text.toLowerCase()).to.include(expectedCredits.toLowerCase());
    });
}

  // Verify fees status
  verifyFees(expectedStatus) {
  cy.contains("Fees status")
    .parent()
    .invoke("text")
    .then((text) => {
      const cleanText = text.replace(/\s+/g, " ").trim().toLowerCase(); 
      expect(cleanText).to.include(expectedStatus.toLowerCase());
    });
}

  // Verify mentor details
  verifyMentorInfo(commentText, mentorName, designation) {
  cy.get("div.uk-grid.uk-grid-collapse.uk-flex.uk-flex-middle")
  .invoke("text")
  .then(text => {
    const normalized = text.replace(/\s+/g, " ").trim().toLowerCase();
    expect(normalized).to.include(commentText.toLowerCase());
    expect(normalized).to.include(mentorName.toLowerCase());
    expect(normalized).to.include(designation.toLowerCase().replace("assistant", "assisstant")); // optional tolerance
  });
}

  verifyMentorEmail(email) {
    cy.contains("Email:").next().should("contain.text", email);
  }
  // Attendance table
  verifyAttendanceTable() {
    cy.contains("Course registration").should("be.visible");
    cy.get("table").should("exist");
  }

  // Section check (generic for navigation validation)
  verifyDashboardVisible() {
    cy.contains("Credits", { timeout: 20000 }).should("be.visible");
    cy.contains("Fees status").should("be.visible");
  }

  verifyExamHistoryVisible() {
  cy.contains("Exam History", { timeout: 20000 }).should("be.visible");
  cy.contains("Subject").should("be.visible");  // adjust based on your UI
  cy.contains("Marks").should("be.visible");    // add other key labels
}

verifySectionVisible(sectionName) {
  switch (sectionName.toLowerCase()) {
    case "exam history":
      cy.contains("Credits Earned So Far").should("be.visible");
      cy.contains("Cumulative History").should("be.visible");
      break;

    case "placement":
      cy.contains("First Name").should("be.visible");
      cy.contains("Branch").should("be.visible");
      break;

    case "other links":
      cy.contains("Other Links").click();
      cy.contains("Library").should("be.visible");
      cy.contains("Exam Fees").should("be.visible");
      break;

    case "feedback":
      cy.contains("Feedback Dashboard").should("be.visible");
      cy.contains("Formative 2025").should("be.visible");
      break;

    case "fee":
  cy.contains(/fees status/i, { timeout: 20000 }).should("be.visible");  
  cy.contains(/total paid/i).should("be.visible"); // adjust if label differs
  break;

    case "time table":
      cy.contains("Day").should("be.visible");
      cy.contains("Subject").should("be.visible");
      break;

    case "home":
      cy.contains("Credits").should("be.visible");
      cy.contains("Fees status").should("be.visible");
      break;

    case "proctorship":
  cy.contains("Proctorial Notes", { timeout: 20000 }).should("be.visible");

  // Check table headers robustly
  cy.get("table").within(() => {
    cy.contains(/date/i).should("be.visible");
    cy.contains(/proctor/i).should("be.visible");
    cy.contains(/proctor notes/i).should("be.visible");
  });
  break;

    default:
      throw new Error(`No locator defined for section: ${sectionName}`);
  }
}



  verifyProctorshipPage() {
  // Verify key elements/texts on the Proctorship page
  cy.contains("Proctor Observations", { timeout: 20000 }).should("be.visible");
  cy.contains("Mentor Comments").should("be.visible");  
  cy.contains("Parent Comments").should("be.visible");  
  cy.contains("Student Comments").should("be.visible");  
}

  clickSidebarOption(optionText) {
    cy.contains(new RegExp(optionText, "i")).click({ force: true });
  }
  // Logout
  logout() {
    // Try by text (case insensitive)
    cy.contains(/logout/i, { timeout: 10000 }).click({ force: true }).then(($el) => {
      if ($el.length === 0) {
        // If not found, try common selectors
        cy.get("a[href*='logout'], button:contains('Logout')", { timeout: 10000 })
          .first()
          .click({ force: true });
      }
    });
  }
}

export default new DashboardPage();
