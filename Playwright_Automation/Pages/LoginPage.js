// pageObjects/LoginPage.js
export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator(".uk-input");
    this.ddSelect = page.locator("#dd");
    this.mmSelect = page.locator("#mm");
    this.yyyySelect = page.locator("#yyyy");
    this.submitBtn = page.locator('input[type="submit"]');
  }

  async gotoLoginPage() {
    await this.page.goto("https://parents.kletech.ac.in/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,  // increase timeout to 60s
    });
    await this.usernameInput.waitFor({ state: "visible" });
  }

 async login(username, dd, mm, yyyy) {
  await this.usernameInput.fill(username);

  await this.ddSelect.waitFor({ state: "visible" });
  await this.ddSelect.selectOption(dd);

  await this.mmSelect.waitFor({ state: "visible" });
  await this.page.waitForTimeout(1000); // TEMP: 1s delay
  await this.mmSelect.selectOption(mm);

  await this.yyyySelect.waitFor({ state: "visible" });
  await this.yyyySelect.selectOption(yyyy);

  await this.submitBtn.click();
}
}
