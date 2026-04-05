import test, { expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display all elements", async ({ page }) => {
    // Heading and subtitle
    await expect(
      page.getByRole("heading", { name: "Sign In", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText("Enter your username and password to sign in!"),
    ).toBeVisible();

    // Username field
    await expect(page.getByText("Username *")).toBeVisible();
    await expect(page.getByPlaceholder("Enter username")).toBeVisible();

    // Password field
    await expect(page.getByText("Password *")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();

    // Password toggle icon
    await expect(
      page.locator('input[name="password"] + span svg'),
    ).toBeVisible();

    // Submit button
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();

    // Brand panel: logo, app name, tagline
    await expect(page.getByRole("img", { name: "Logo" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Stockify", level: 3 }),
    ).toBeVisible();
    await expect(page.getByText("Efficiency at Every Aisle")).toBeVisible();

    // Logo link navigates to home
    await expect(
      page.getByRole("link", { name: "Logo Stockify" }),
    ).toHaveAttribute("href", "/");
  });

  test("should toggle password display or hidden when click", async ({
    page,
  }) => {
    const passwordInput = page.locator('input[name="password"]');
    const toggleBtn = page.locator('input[name="password"] ~ span');

    await expect(passwordInput).toHaveAttribute("type", "password");

    await toggleBtn.click();

    await expect(passwordInput).toHaveAttribute("type", "text");

    await toggleBtn.click();

    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should login when input correct username and password", async ({
    page,
  }) => {
    const usernameInput = page.getByPlaceholder("Enter username");
    const passwordInput = page.getByPlaceholder("Enter your password");

    await usernameInput.fill("nam3.nguyen");
    await passwordInput.fill("PlaintextForDemoOnly2");

    const signInButton = page.getByRole("button", {
      name: "Sign in",
    });
    await signInButton.click();

    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("should give error when login with incorrect username", async ({
    page,
  }) => {
    const usernameInput = page.getByPlaceholder("Enter username");
    const passwordInput = page.getByPlaceholder("Enter your password");

    await usernameInput.fill("nam3.nguye");
    await passwordInput.fill("PlaintextForDemoOnly2");

    const signInButton = page.getByRole("button", {
      name: "Sign in",
    });
    await signInButton.click();

    await expect(page.getByText("User not found or deleted")).toBeVisible({
      timeout: 5000,
    });
  });

  test("should give error when login with incorrect password", async ({
    page,
  }) => {
    const usernameInput = page.getByPlaceholder("Enter username");
    const passwordInput = page.getByPlaceholder("Enter your password");

    await usernameInput.fill("nam3.nguyen");
    await passwordInput.fill("PlaintextForDemoOnly");

    const signInButton = page.getByRole("button", {
      name: "Sign in",
    });
    await signInButton.click();

    await expect(page.getByText("Invalid credentials")).toBeVisible({
      timeout: 5000,
    });
  });
});
