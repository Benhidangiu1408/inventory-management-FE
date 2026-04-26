import test, { expect } from "@playwright/test";

test.describe("Schedule Inventory Check Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/warehouse-management/inventory-check/new");
  });

  test("should display all form elements", async ({ page }) => {
    // Page title & breadcrumb
    await expect(
      page.getByRole("heading", { name: "Schedule Inventory Check", level: 2 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
      page
        .getByRole("navigation")
        .getByRole("link", { name: "inventory check" }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation").getByText("Schedule Inventory Check"),
    ).toBeVisible();

    // Sheet Detail section
    await expect(
      page.getByRole("heading", { name: "Sheet Detail", level: 3 }),
    ).toBeVisible();
    await expect(page.locator("label").filter({ hasText: /^Warehouse$/ })).toBeVisible();
    await expect(page.locator("select[name='warehouseId']")).toBeVisible();
    await expect(page.locator("label").filter({ hasText: /^Assignee$/ })).toBeVisible();
    await expect(page.locator("select[name='assignedUserId']")).toBeVisible();
    await expect(page.getByText("Planned Date & Time")).toBeVisible();
    await expect(page.locator("input[name='plannedDate']")).toBeVisible();
    await expect(page.getByText("Target Products (Optional)")).toBeVisible();
    await expect(page.locator("label").filter({ hasText: /^Note$/ })).toBeVisible();
    await expect(
      page.getByPlaceholder("e.g. Focus on Aisle 5 damaged goods..."),
    ).toBeVisible();

    // Cycle Settings section
    await expect(
      page.getByRole("heading", { name: "Cycle Settings", level: 3 }),
    ).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: "Enable Recurring Cycle Count" }),
    ).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: "Enable Recurring Cycle Count" }),
    ).not.toBeChecked();

    // Action buttons
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
  });

  test("should list warehouse options in the dropdown", async ({ page }) => {
    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });

    const options = await warehouseSelect
      .locator("option[value]:not([value=''])")
      .count();
    expect(options).toBeGreaterThan(0);
  });

  test("should list employee options in the Assignee dropdown", async ({
    page,
  }) => {
    const assigneeSelect = page.locator("select[name='assignedUserId']");
    await expect(assigneeSelect).toBeEnabled({ timeout: 10_000 });

    const options = await assigneeSelect
      .locator("option[value]:not([value=''])")
      .count();
    expect(options).toBeGreaterThan(0);
  });

  test("should show tuanemtramtinh in the Assignee dropdown", async ({
    page,
  }) => {
    const assigneeSelect = page.locator("select[name='assignedUserId']");
    await expect(assigneeSelect).toBeEnabled({ timeout: 10_000 });

    const option = assigneeSelect.locator("option", {
      hasText: "tuanemtramtinh",
    });
    await expect(option).toHaveCount(1);
  });

  test("should show validation errors when submitting empty form", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Please select a warehouse")).toBeVisible();
    await expect(page.getByText("Please assign an employee")).toBeVisible();
    await expect(page.getByText("Date is required")).toBeVisible();
  });

  test("should clear validation errors once all required fields are filled", async ({
    page,
  }) => {
    // Trigger validation by submitting empty form first
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Please select a warehouse")).toBeVisible();
    await expect(page.getByText("Please assign an employee")).toBeVisible();
    await expect(page.getByText("Date is required")).toBeVisible();

    // Now fill all required fields
    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    const firstWarehouseValue = await warehouseSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await warehouseSelect.selectOption({ value: firstWarehouseValue! });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

    await page.locator("input[name='plannedDate']").fill("2099-05-01T09:00");

    // Errors should disappear as fields become valid (React Hook Form re-validates on change)
    await expect(page.getByText("Please select a warehouse")).not.toBeVisible();
    await expect(page.getByText("Please assign an employee")).not.toBeVisible();
    await expect(page.getByText("Date is required")).not.toBeVisible();
  });

  test("should show Repeat Every fields when Enable Recurring Cycle Count is checked", async ({
    page,
  }) => {
    await page
      .getByRole("checkbox", { name: "Enable Recurring Cycle Count" })
      .check();

    await expect(page.getByText("Repeat Every")).toBeVisible();
    await expect(page.locator("input[name='cycleValue']")).toBeVisible();
    await expect(page.locator("select[name='cycleUnit']")).toBeVisible();

    // Default values
    await expect(page.locator("input[name='cycleValue']")).toHaveValue("1");
    await expect(page.locator("select[name='cycleUnit']")).toHaveValue("WEEKS");

    // Helper text
    await expect(
      page.getByText(/Next check created automatically/),
    ).toBeVisible();
  });

  test("should hide Repeat Every fields when Enable Recurring Cycle Count is unchecked", async ({
    page,
  }) => {
    const checkbox = page.getByRole("checkbox", {
      name: "Enable Recurring Cycle Count",
    });
    await checkbox.check();
    await expect(page.getByText("Repeat Every")).toBeVisible();

    await checkbox.uncheck();
    await expect(page.getByText("Repeat Every")).not.toBeVisible();
  });

  test("should update cycle helper text when Repeat Every value or unit changes", async ({
    page,
  }) => {
    await page
      .getByRole("checkbox", { name: "Enable Recurring Cycle Count" })
      .check();

    await page.locator("input[name='cycleValue']").fill("3");
    await page.locator("select[name='cycleUnit']").selectOption("MONTHS");

    await expect(
      page.getByText(
        "Next check created automatically 3 months after completion.",
      ),
    ).toBeVisible();
  });

  test("should navigate back when Cancel is clicked", async ({ page }) => {
    // Use a link click (SPA navigation) so Next.js router records a history entry.
    // page.goto() does a full load that router.back() doesn't recognise.
    await page.goto("/warehouse-management/inventory-check");
    await page.getByRole("link", { name: "Schedule Inventory Check" }).click();
    await expect(page).toHaveURL("/warehouse-management/inventory-check/new");

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL("/warehouse-management/inventory-check");
  });

  test("should select a product from Target Products multi-select", async ({
    page,
  }) => {
    // Open the multi-select dropdown
    await page.getByText("Select options...").click();

    // Wait for product options and capture the first one's name
    const firstProduct = page.getByText(/\(PRD-/).first();
    await expect(firstProduct).toBeVisible({ timeout: 10_000 });
    const productName = (await firstProduct.textContent())!.trim();

    // Select it
    await firstProduct.click();

    // Close the dropdown then verify the product name appears as a selected item in the trigger
    await page.keyboard.press("Escape");
    await expect(page.getByText(productName).first()).toBeVisible();
  });
});
