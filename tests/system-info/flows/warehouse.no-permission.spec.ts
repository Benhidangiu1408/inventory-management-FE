import test, { expect } from "@playwright/test";

// These tests run under the "no-permission" project which uses a restricted
// user account (no VIEW_WAREHOUSE / EDIT_WAREHOUSE permission).
// The middleware performs a NextResponse.rewrite to /forbidden, so the URL
// stays unchanged while the 403 page content is served.

test.describe("Warehouse – 403 Forbidden (no permission)", () => {
  test("should show forbidden page when navigating to warehouse list", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/warehouse");

    // URL stays the same (rewrite, not redirect)
    await expect(page).toHaveURL(/\/warehouse-management\/warehouse/);

    await expect(
      page.getByText("Forbidden: You are not authorize for this page!"),
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByRole("heading", { name: "ERROR" })).toBeVisible();

    // The page should offer a way back to home
    await expect(
      page.getByRole("link", { name: "Back to Home Page" }),
    ).toBeVisible();
  });

  test("should show forbidden page when navigating to create warehouse", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/warehouse/new");

    await expect(page).toHaveURL(/\/warehouse-management\/warehouse\/new/);

    await expect(
      page.getByText("Forbidden: You are not authorize for this page!"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("should redirect back to home when clicking 'Back to Home Page' on warehouse forbidden page", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/warehouse");

    await expect(
      page.getByRole("link", { name: "Back to Home Page" }),
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole("link", { name: "Back to Home Page" }).click();

    await expect(page).toHaveURL("http://localhost:3000/", { timeout: 10_000 });
  });
});
