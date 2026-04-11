import test, { expect } from "@playwright/test";

test.describe("Export Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/export");
  });

  test("should display all elements except New Export", async ({ page }) => {
    // Page title & breadcrumb
    await expect(
      page.getByRole("heading", { name: "Export Page", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      page.getByRole("navigation").getByText("Export Page"),
    ).toBeVisible();

    // New Import button should not be visible for users without permission
    await expect(page.getByRole("link", { name: "New Export" })).toBeHidden();

    // Summary cards
    await expect(page.getByText("Total Stock-Ins")).toBeVisible();
    await expect(page.getByText("Pending Approvals")).toBeVisible();

    // Table column headers
    await expect(
      page.getByRole("columnheader", { name: "Export Sheet ID" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Type" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Status" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Created At" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Actions" }),
    ).toBeVisible();

    // Pagination controls
    await expect(page.getByRole("button", { name: "1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Go" })).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
  });
});
