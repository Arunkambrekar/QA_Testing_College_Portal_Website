import { test, expect } from "@playwright/test";
import LoginPage from "../Pages/LoginPage";
import DashboardPage from "../pages/dashboardPage";

test.describe("Dashboard Page Tests - POM", () => {
  let dashboard;
  let loginPage;

  const user = {
    usn: "01FE21BEC242",
    dd: "27",
    mm: "12",
    yyyy: "2001",
    studentName: "Arun",
    credits: "150"
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboard = new DashboardPage(page);

    // Navigate to login and authenticate
    await loginPage.gotoLoginPage();
    await loginPage.login(user.usn, user.dd, user.mm, user.yyyy);

    // Wait for dashboard to load
    await dashboard.verifyDashboardVisible();
  });

  test("TC01 - Verify Dashboard page loads successfully", async () => {
    await dashboard.verifyDashboardVisible();
  });

  test("TC02 - Verify Student Name is displayed", async () => {
  const text = await dashboard.getStudentName(); // already string
  expect(text?.toLowerCase()).toContain(user.studentName.toLowerCase());
});

  test("TC03 - Verify Sidebar Navigation", async () => {
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
      "OTHER LINKS"
    ];
    await dashboard.verifySidebar(menuItems);
  });

  test("TC04 - Verify Credits Earned", async () => {
    await dashboard.verifyCredits(user.credits);
  });
  

  test("TC05 - Verify Logout Functionality", async () => {
    await dashboard.logout();
    await expect(loginPage.usernameInput).toBeVisible(); // ensure login screen is back
    await expect(loginPage.page).toHaveURL(/parents\.kletech\.ac\.in/);
  });
});
