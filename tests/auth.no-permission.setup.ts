import { test as setup } from "@playwright/test";
import path from "path";
import fs from "fs";

setup("login as restricted user", async ({ page }) => {
  const authDir = path.join(__dirname, "../playwright/.auth");
  const authFile = path.join(authDir, "no-permission-user.json");

  fs.mkdirSync(authDir, { recursive: true });

  await page.goto("/");
  const usernameInput = page.getByPlaceholder("Enter username");
  const passwordInput = page.getByPlaceholder("Enter your password");

  // Replace with an account that has no/limited permissions
  await usernameInput.fill("tuanemtramtinh");
  await passwordInput.fill("Anh2004@nh");

  const signInButton = page.getByRole("button", { name: "Sign in" });
  await signInButton.click();

  await page.waitForURL("http://localhost:3000/");

  await page.context().storageState({ path: authFile });
});
