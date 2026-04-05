import { test as setup } from "@playwright/test";

setup("login", async ({ page }) => {
  await page.goto("/");
  const usernameInput = page.getByPlaceholder("Enter username");
  const passwordInput = page.getByPlaceholder("Enter your password");

  await usernameInput.fill("nam3.nguyen");
  await passwordInput.fill("PlaintextForDemoOnly2");

  const signInButton = page.getByRole("button", {
    name: "Sign in",
  });
  await signInButton.click();

  await page.waitForURL("http://localhost:3000/");
  await page.context().storageState({ path: "playwright/.auth/user.json" });
});
