import test, { expect } from "@playwright/test";

test.describe("Import Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/import");
  });

  test("should display all elements", async ({ page }) => {
    // Page title & breadcrumb
    await expect(
      page.getByRole("heading", { name: "Import Page", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      page.getByRole("navigation").getByText("Import Page"),
    ).toBeVisible();

    // New Import button
    await expect(page.getByRole("link", { name: "New Import" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "New Import" }),
    ).toHaveAttribute("href", "/import/new");

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

  test("should route to new import page", async ({ page }) => {
    const newImportButton = page.getByRole("link", {
      name: "New Import",
    });

    await newImportButton.click();

    await expect(page).toHaveURL("/import/new");
  });
});
