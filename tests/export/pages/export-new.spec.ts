import test, { expect } from "@playwright/test";

test.describe("New Export Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/export/new");
  });

  test("should display all elements", async ({ page }) => {
    // Page title & breadcrumb
    await expect(
      page.getByRole("heading", { name: "New Export", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      page
        .getByRole("navigation")
        .getByRole("link", { name: "export", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation").getByText("New Export"),
    ).toBeVisible();

    // Warehouse selector
    await expect(page.getByText("Warehouse:")).toBeVisible();
    await expect(page.getByRole("combobox").first()).toBeVisible();

    // Export type section
    await expect(
      page.getByRole("heading", { name: "Please Choose Your Type Of Export" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Transfer" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Customer" })).toBeVisible();

    // Create button (disabled by default — no type selected)
    await expect(page.getByRole("button", { name: "Create" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create" })).toBeDisabled();
  });

  test("should display customer section when Customer type is selected", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Customer" }).click();

    await expect(
      page.getByRole("heading", { name: "Customer information", level: 3 }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Select existing customer" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "New customer" }),
    ).toBeVisible();

    // Customer dropdown visible by default (existing mode)
    await expect(
      page.locator("label").filter({ hasText: "Customer" }),
    ).toBeVisible();
    await expect(page.getByRole("combobox").nth(1)).toBeVisible();
  });

  test("should display destination warehouse when Transfer type is selected", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Transfer" }).click();

    await expect(page.getByText("Destination warehouse:")).toBeVisible();
    await expect(page.getByRole("combobox").nth(1)).toBeVisible();
  });

  test("should display new customer form fields when New customer is clicked", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Customer" }).click();
    await page.getByRole("button", { name: "New customer" }).click();

    await expect(page.getByPlaceholder("Enter name")).toBeVisible();
    await expect(page.getByPlaceholder("email@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("Phone number")).toBeVisible();
    await expect(page.getByPlaceholder("Address")).toBeVisible();
  });

  test("should switch back to customer dropdown when Select existing customer is clicked", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Customer" }).click();
    await page.getByRole("button", { name: "New customer" }).click();
    await page
      .getByRole("button", { name: "Select existing customer" })
      .click();

    await expect(page.getByRole("combobox").nth(1)).toBeVisible();
    await expect(page.getByPlaceholder("Enter name")).not.toBeVisible();
  });

  test("should enable Create button when Customer type and customer are selected", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Customer" }).click();

    const customerSelect = page.getByRole("combobox").nth(1);
    await expect(customerSelect).toBeEnabled({ timeout: 10_000 });

    const firstCustomerValue = await customerSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await customerSelect.selectOption({ value: firstCustomerValue! });

    await expect(page.getByRole("button", { name: "Create" })).toBeEnabled();
  });

  test("should enable Create button when Transfer type and destination warehouse are selected", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Transfer" }).click();

    const destinationSelect = page.getByRole("combobox").nth(1);
    await expect(destinationSelect).toBeEnabled({ timeout: 10_000 });

    const firstDestValue = await destinationSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await destinationSelect.selectOption({ value: firstDestValue! });

    await expect(page.getByRole("button", { name: "Create" })).toBeEnabled();
  });
});
