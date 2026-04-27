import test, { expect } from "@playwright/test";

test.describe("Inventory Check List Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/warehouse-management/inventory-check");
  });

  test("should display all page elements", async ({ page }) => {
    // Page title
    await expect(
      page.getByRole("heading", { name: "Inventory Check", level: 2 }),
    ).toBeVisible();

    // Breadcrumb
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      page.getByRole("navigation").getByText("Inventory Check"),
    ).toBeVisible();

    // Schedule button
    await expect(
      page.getByRole("button", { name: "Schedule Inventory Check" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Schedule Inventory Check" }),
    ).toHaveAttribute("href", "/warehouse-management/inventory-check/new");
  });

  test("should display table with correct column headers", async ({ page }) => {
    await expect(
      page.getByRole("columnheader", { name: "Code" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Warehouse" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Assignee" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Planned Date" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Status" }),
    ).toBeVisible();
  });

  test("should display pagination controls", async ({ page }) => {
    await expect(page.getByRole("button", { name: "1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Go" })).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("should navigate to schedule form when Schedule Inventory Check is clicked", async ({
    page,
  }) => {
    await page
      .getByRole("link", { name: "Schedule Inventory Check" })
      .click();
    await expect(page).toHaveURL(
      "/warehouse-management/inventory-check/new",
    );
  });

  test("should navigate to detail page when a code link is clicked", async ({
    page,
  }) => {
    const firstCodeLink = page
      .getByRole("grid")
      .getByRole("link")
      .first();

    await expect(firstCodeLink).toBeVisible({ timeout: 10_000 });
    await firstCodeLink.click();

    await expect(page).toHaveURL(
      /\/warehouse-management\/inventory-check\/detail\/\d+/,
    );
  });
});
