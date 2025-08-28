// tests/login.spec.js
import { test, expect } from "@playwright/test";

test.describe("Login Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://parents.kletech.ac.in/");
  });

  // ✅ Valid login tests

  test("Valid Login - Correct USN + DOB (case-insensitive)", async ({ page }) => {
  await page.goto("https://parents.kletech.ac.in/");

  await page.fill(".uk-input", "01fe21bec242"); // lowercase
  await page.selectOption("#dd", "27");
  await page.selectOption("#mm", "12");
  await page.selectOption("#yyyy", "2001");
  await page.click('input[type="submit"]', { force: true });

  // Wait for dashboard to load
  const dashboard = page.locator(".cn-box-layout");
  await dashboard.waitFor({ state: "visible", timeout: 15000 });

  // Verify dashboard loaded
  await expect(dashboard).toContainText(/Arun/i);
  await expect(dashboard).toContainText(/Kambrekar/i);
});

 test("Valid Login - Correct USN + DOB", async ({ page }) => {
  // Go to login page
  await page.goto("https://parents.kletech.ac.in/");

  // Fill login form
  await page.fill(".uk-input", "01FE21BEC242");
  await page.selectOption("#dd", "27");
  await page.selectOption("#mm", "12");
  await page.selectOption("#yyyy", "2001");
  await page.click('input[type="submit"]');

  // Wait for the dashboard to appear
  const dashboard = page.locator(".cn-box-layout");
  await dashboard.waitFor({ state: "visible" });

  // Verify URL contains 'studentdashboard'
  await expect(page).toHaveURL(/.*studentdashboard.*/);

  // Verify dashboard contains the student's name (partial match to avoid regex issues)
  await expect(dashboard).toContainText(/Arun/i);
  await expect(dashboard).toContainText(/Kambrekar/i);

  // Optional: pause for debugging
  // await page.pause();
});


  test("Invalid Login - Wrong DOB", async ({ page }) => {
  await page.goto("https://parents.kletech.ac.in/");

  await page.fill(".uk-input", "01FE21BEC242");
  await page.selectOption("#dd", "01"); // wrong DOB
  await page.selectOption("#mm", "01");
  await page.selectOption("#yyyy", "2000");
  await page.click('input[type="submit"]', { force: true });

  const dashboard = page.locator(".cn-box-layout");
  const errorMsg = page.locator(".uk-alert-danger");
  const ddInput = page.locator("#dd");

  if (await dashboard.isVisible()) {
    throw new Error("Login succeeded unexpectedly with wrong DOB");
  } 
  else if (await errorMsg.isVisible()) {
    const text = await errorMsg.textContent();
    expect(
      text.includes('You have entered an invalid USN or password') ||
      text.includes('attempts remaining') ||
      text.includes('Too many failed login attempts')
    ).toBeTruthy();
  } 
  else if (!(await ddInput.evaluate(input => input.validity.valid))) {
    console.log("Login blocked by browser validation: Please fill required field correctly");
  } 
  else {
    throw new Error("Neither dashboard nor error message appeared");
  }
});





  // ❌ Invalid login tests
  test("Invalid Login - Wrong USN with attempt countdown", async ({ page }) => {
  await page.fill(".uk-input", "wronguser123");
  await page.selectOption("#dd", "27");
  await page.selectOption("#mm", "12");
  await page.selectOption("#yyyy", "2001");
  await page.click('input[type="submit"]');

  const bodyText = await page.textContent('body');

  // Check for dynamic attempt messages or final lockout
  const attemptRegex = /You have entered an invalid USN or password|attempts remaining: \d|Too many failed login attempts/i;

  expect(attemptRegex.test(bodyText)).toBeTruthy();

  // Optionally log the current remaining attempts number
  const match = bodyText.match(/attempts remaining: (\d)/);
  if (match) {
    console.log(`Remaining attempts: ${match[1]}`);
  }
});



  test("Invalid Login - Wrong DOB with dynamic attempts", async ({ page }) => {
  await page.goto("https://parents.kletech.ac.in/");

  // Fill credentials
  await page.fill(".uk-input", "01FE21BEC242");
  await page.selectOption("#dd", "01"); // Wrong DOB
  await page.selectOption("#mm", "01");
  await page.selectOption("#yyyy", "2000");
  await page.click('input[type="submit"]', { force: true });

  const usernameInput = page.locator(".uk-input");
  const isValid = await usernameInput.evaluate(input => input.validity.valid);

  const dashboard = page.locator(".cn-box-layout");
  const errorMsg = page.locator(".uk-alert-danger");

  // Wait for either dashboard or error to appear
  await Promise.race([
    dashboard.waitFor({ state: "visible", timeout: 5000 }).catch(() => {}),
    errorMsg.waitFor({ state: "visible", timeout: 5000 }).catch(() => {})
  ]);

  if (await dashboard.isVisible()) {
    throw new Error("Login succeeded unexpectedly with wrong DOB");
  } else if (!isValid) {
    console.log("Login blocked by browser: 'Please fill out this field'");
  } else if (await errorMsg.isVisible()) {
    const bodyText = await errorMsg.textContent();
    expect(
      /Invalid credentials|Too many failed login attempts|attempts remaining/i.test(bodyText)
    ).toBeTruthy();
  } else {
    throw new Error("Neither dashboard nor error message appeared");
  }
});




  test("Invalid Login - Empty fields", async ({ page }) => {
  await page.goto("https://parents.kletech.ac.in/index.php");

  // Click submit without filling anything
  await page.click('input[type="submit"]');

  // Assert that the username field is invalid (required)
  await expect(page.locator(".uk-input:invalid")).toHaveCount(1);

  // Optionally, you can also check DOB fields
  await expect(page.locator("#dd:invalid")).toHaveCount(1);
  await expect(page.locator("#mm:invalid")).toHaveCount(1);
  await expect(page.locator("#yyyy:invalid")).toHaveCount(1);
});


  test("Invalid Login - Only USN filled", async ({ page }) => {
  await page.goto("https://parents.kletech.ac.in/index.php");

  // Fill only USN
  await page.fill(".uk-input", "01FE21BEC242");

  // Click submit without selecting DOB
  await page.click('input[type="submit"]');

  // Assert that the DOB fields are invalid
  await expect(page.locator("#dd:invalid")).toHaveCount(1);
  await expect(page.locator("#mm:invalid")).toHaveCount(1);
  await expect(page.locator("#yyyy:invalid")).toHaveCount(1);
});

 test("Invalid Login - Only DOB filled", async ({ page }) => {
    await page.goto("https://parents.kletech.ac.in/");

    // Fill only DOB
    await page.selectOption("#dd", "27");
    await page.selectOption("#mm", "12");
    await page.selectOption("#yyyy", "2001");

    // Click submit
    await page.click('input[type="submit"]');

    // Assert that the username field is invalid (required)
    await expect(page.locator("#username:invalid")).toHaveCount(1);
});



  test("Invalid Login - Special characters in USN", async ({ page }) => {
  await page.goto("https://parents.kletech.ac.in/");

  await page.fill(".uk-input", "@@@###");
  await page.selectOption("#dd", "27");
  await page.selectOption("#mm", "12");
  await page.selectOption("#yyyy", "2001");
  await page.click('input[type="submit"]', { force: true });

  const dashboard = page.locator(".cn-box-layout"); // dashboard element
  const errorMsg = page.locator(".uk-alert-danger"); // server error message
  const usernameInput = page.locator("#username"); // to check browser validation

  if (await dashboard.isVisible()) {
    throw new Error("Login succeeded unexpectedly with invalid USN");
  } 
  else if (await errorMsg.isVisible()) {
    const text = await errorMsg.textContent();
    expect(
      text.includes('You have entered an invalid USN or password') ||
      text.includes('attempts remaining') ||
      text.includes('Too many failed login attempts')
    ).toBeTruthy();
  } 
  else if (!(await usernameInput.evaluate(input => input.validity.valid))) {
    console.log("Login blocked by browser: 'Please fill out this field'");
  } 
  else {
    throw new Error("Neither dashboard nor error message appeared");
  }
});


});
