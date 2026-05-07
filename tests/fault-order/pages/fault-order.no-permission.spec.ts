import test, { expect } from "@playwright/test";

test.describe("Fault Order - 403 Forbidden (no permission)", () => {
  const assertForbiddenPage = async (page: Parameters<typeof test>[0]["page"], route: string) => {
    await page.goto(route);

    await expect(page).toHaveURL(new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await expect(
      page.getByText("Forbidden: You are not authorize for this page!"),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("heading", { name: "ERROR" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Home Page" })).toBeVisible();
  };

  test("should show forbidden page for fault order list", async ({ page }) => {
    await assertForbiddenPage(page, "/fault-order");
  });

  test("should show forbidden page for fault order details", async ({ page }) => {
    await assertForbiddenPage(page, "/fault-order/details/24");
  });

  test("should show forbidden page for process order details", async ({ page }) => {
    await assertForbiddenPage(page, "/fault-order/details/24/process-order/18");
  });

  test("should show forbidden page for assign task page", async ({ page }) => {
    await assertForbiddenPage(page, "/fault-order/details/24/assign-task/18");
  });

  test("should redirect back home from forbidden page", async ({ page }) => {
    await page.goto("/fault-order");

    const backLink = page.getByRole("link", { name: "Back to Home Page" });
    await expect(backLink).toBeVisible({ timeout: 10_000 });

    await backLink.click();
    await expect(page).toHaveURL("http://localhost:3000/", { timeout: 10_000 });
  });
});
