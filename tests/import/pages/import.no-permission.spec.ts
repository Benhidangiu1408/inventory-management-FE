import test, { expect } from "@playwright/test";

test.describe("Import Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/import");
  });

  test("should display all elements except New Import", async ({ page }) => {
    // Page title & breadcrumb
    await expect(
      page.getByRole("heading", { name: "Import Page", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      page.getByRole("navigation").getByText("Import Page"),
    ).toBeVisible();

    // New Import button should not be visible for users without permission
    await expect(page.getByRole("link", { name: "New Import" })).toBeHidden();

    // Summary cards
    await expect(page.getByText("Total Stock-Ins")).toBeVisible();
    await expect(page.getByText("Pending Approvals")).toBeVisible();

    // Table column headers
    await expect(
      page.getByRole("columnheader", { name: "Import Sheet ID" }),
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
