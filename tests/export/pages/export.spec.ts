import test, { expect } from "@playwright/test";

test.describe("Export Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/export");
  });

  test("should display all elements", async ({ page }) => {
    // Page title & breadcrumb
    await expect(
      page.getByRole("heading", { name: "Export Page", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      page.getByRole("navigation").getByText("Export Page"),
    ).toBeVisible();

    // New Export button
    await expect(page.getByRole("link", { name: "New Export" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "New Export" }),
    ).toHaveAttribute("href", "/export/new");

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
      page.getByRole("columnheader", { name: "Warehouse" }),
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

  test("should route to new export page", async ({ page }) => {
    const newExportButton = page.getByRole("link", { name: "New Export" });

    await newExportButton.click();

    await expect(page).toHaveURL("/export/new");
  });
});
