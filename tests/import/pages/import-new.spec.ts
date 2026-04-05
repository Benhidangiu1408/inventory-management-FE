import test, { expect } from "@playwright/test";

test.describe("New Import Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/import/new");
  });

  test("should display all elements", async ({ page }) => {
    // Page title & breadcrumb
    await expect(
      page.getByRole("heading", { name: "New Import", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      page
        .getByRole("navigation")
        .getByRole("link", { name: "import", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation").getByText("New Import"),
    ).toBeVisible();

    // Warehouse selector
    await expect(page.getByText("Warehouse:")).toBeVisible();
    await expect(page.getByRole("combobox").first()).toBeVisible();

    // Supplier information section
    await expect(
      page.getByRole("heading", { name: "Supplier information", level: 3 }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Select existing supplier" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "New supplier" }),
    ).toBeVisible();

    // Supplier dropdown (default: select existing)
    await expect(
      page.locator("label").filter({ hasText: "Supplier" }),
    ).toBeVisible();
    await expect(page.getByRole("combobox").nth(1)).toBeVisible();

    // Create button (disabled by default)
    await expect(page.getByRole("button", { name: "Create" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create" })).toBeDisabled();
  });

  test("should display new supplier form fields when click New supplier", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "New supplier" }).click();

    await expect(page.getByPlaceholder("Enter name")).toBeVisible();
    await expect(page.getByPlaceholder("email@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("Phone number")).toBeVisible();
    await expect(page.getByPlaceholder("Address")).toBeVisible();
  });

  test("should switch back to supplier dropdown when click Select existing supplier", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "New supplier" }).click();
    await page
      .getByRole("button", { name: "Select existing supplier" })
      .click();

    await expect(page.getByRole("combobox").nth(1)).toBeVisible();
    await expect(page.getByPlaceholder("Enter name")).not.toBeVisible();
  });
});
