import test, { expect } from "@playwright/test";

// These tests run under the "no-permission" project which uses a restricted
// user account (no VIEW_PRODUCT / EDIT_PRODUCT permission).
// The middleware performs a NextResponse.rewrite to /forbidden, so the URL
// stays unchanged while the 403 page content is served.

test.describe("Product – 403 Forbidden (no permission)", () => {
  test("should show forbidden page when navigating to product list", async ({
    page,
  }) => {
    await page.goto("/catalog/product");

    // URL stays the same (rewrite, not redirect)
    await expect(page).toHaveURL(/\/catalog\/product/);

    await expect(
      page.getByText("Forbidden: You are not authorize for this page!"),
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByRole("heading", { name: "ERROR" })).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Back to Home Page" }),
    ).toBeVisible();
  });

  test("should show forbidden page when navigating to create product page", async ({
    page,
  }) => {
    await page.goto("/catalog/product/new");

    await expect(page).toHaveURL(/\/catalog\/product\/new/);

    await expect(
      page.getByText("Forbidden: You are not authorize for this page!"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("should redirect back to home when clicking 'Back to Home Page' on product forbidden page", async ({
    page,
  }) => {
    await page.goto("/catalog/product");

    await expect(
      page.getByRole("link", { name: "Back to Home Page" }),
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole("link", { name: "Back to Home Page" }).click();

    await expect(page).toHaveURL("http://localhost:3000/", { timeout: 10_000 });
  });
});
