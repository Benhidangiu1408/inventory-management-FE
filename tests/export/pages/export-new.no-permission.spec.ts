import test, { expect } from "@playwright/test";

test.describe("New Export Page without Permission", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/export/new");
  });

  test("should display unauthorized message", async ({ page }) => {
    // Page title & breadcrumb
    await expect(
      page.getByText("Forbidden: You are not authorize for this page!"),
    ).toBeVisible();
  });

  test("should back to homepage when click button in unauthorized page", async ({
    page,
  }) => {
    const button = page.getByRole("link", { name: "Back to Home Page" });
    await button.click();

    await expect(page).toHaveURL("/");
  });
});
