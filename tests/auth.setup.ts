import { test as setup } from "@playwright/test";
import path from "path";
import fs from "fs";

setup("login", async ({ page }, testInfo) => {
  // Lấy browser name từ project name (vd: "setup-chromium" → "chromium")
  const browser = testInfo.project.name.replace("setup-", "");
  const authDir = path.join(__dirname, "../../playwright/.auth");
  const authFile = path.join(authDir, `user-${browser}.json`);

  // Tạo thư mục nếu chưa có
  fs.mkdirSync(authDir, { recursive: true });

  await page.goto("/");
  const usernameInput = page.getByPlaceholder("Enter username");
  const passwordInput = page.getByPlaceholder("Enter your password");

  await usernameInput.fill("nam3.nguyen");
  await passwordInput.fill("PlaintextForDemoOnly2");

  const signInButton = page.getByRole("button", { name: "Sign in" });
  await signInButton.click();

  await page.waitForURL("http://localhost:3000/");

  // Lưu đúng file theo browser
  await page.context().storageState({ path: authFile });
});
