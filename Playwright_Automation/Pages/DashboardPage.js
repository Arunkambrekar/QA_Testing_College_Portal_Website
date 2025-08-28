// playwright/pageObjects/DashboardPage.js
class DashboardPage {
  constructor(page) {
    this.page = page;

    // Dashboard main container
    this.dashboardLocator = page.locator(".cn-box-layout");

    // Student Name
    this.studentNameLocator = page.locator(".cn-stu-data.cn-stu-data1");

    // Sidebar links (list items in sidebar)
    this.sidebarLocator = page.locator("ul.uk-nav.uk-nav-primary.uk-navbar-nav.cn-nav-bar-list");

    // Credits section
    this.creditsLocator = page.locator('.uk-card-header', { hasText: "Credits Earned" });

    // Logout (ul > li > a inside top-right navbar)
    this.logoutBtn = page.locator(
      "div.uk-navbar-left.uk-float-right ul li a:text('Logout')"
    );
  }


  
  // Verify dashboard page is visible
  async verifyDashboardVisible() {
    await this.dashboardLocator.waitFor({ state: "visible", timeout: 15000 });
  }

  // Get student name element
  async getStudentName() {
    await this.studentNameLocator.waitFor({ state: "visible", timeout: 10000 });
    return this.studentNameLocator.textContent();
  }

  // Verify sidebar links
  async verifySidebar(menuItems) {
    // Wait until sidebar is visible
    await this.sidebarLocator.waitFor({ state: "visible", timeout: 20000 });

    // Get all sidebar link texts
    const sidebarLinks = await this.sidebarLocator.allTextContents();

    // Assertion: Check all expected menu items exist
    for (const item of menuItems) {
      if (!sidebarLinks.some(link => link.toLowerCase().includes(item.toLowerCase()))) {
        throw new Error(`Menu item "${item}" not found in sidebar`);
      }
    }
  }

  // Verify credits
  async verifyCredits(expectedCredits) {
    await this.dashboardLocator.waitFor({ state: "visible", timeout: 15000 });
    await this.creditsLocator.waitFor({ state: "visible", timeout: 15000 });

    const credits = (await this.creditsLocator.textContent()).trim();

    if (credits !== expectedCredits) {
      throw new Error(`❌ Expected credits: ${expectedCredits}, Found: ${credits}`);
    }
    console.log("✅ Credits verified");
  }

  // Logout
  async logout() {
    await this.dashboardLocator.waitFor({ state: "visible", timeout: 15000 });
    await this.logoutBtn.waitFor({ state: "visible", timeout: 15000 });
    await this.logoutBtn.click();
    console.log("✅ Successfully logged out");
  }
}

module.exports = DashboardPage;
