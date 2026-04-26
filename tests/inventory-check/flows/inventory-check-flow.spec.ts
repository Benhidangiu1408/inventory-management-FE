import test, { expect } from "@playwright/test";

test.describe("Inventory Check flow - schedule inventory check", () => {
  test("should create an inventory check with required fields and redirect to list", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/inventory-check/new");

    // --- Step 1: Select warehouse ---
    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse (WH-0003)" });

    // --- Step 2: Assign to tuanemtramtinh ---
    const assigneeSelect = page.locator("select[name='assignedUserId']");
    await expect(assigneeSelect).toBeEnabled({ timeout: 10_000 });
    await assigneeSelect.selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

    // --- Step 3: Set planned date ---
    await page.locator("input[name='plannedDate']").fill("2099-06-01T09:00");

    // --- Step 4: Submit ---
    await page.getByRole("button", { name: "Save" }).click();

    // --- Step 5: Assert success toast ---
    await expect(
      page.getByText("Inventory Check Scheduled!"),
    ).toBeVisible({ timeout: 10_000 });

    // --- Step 6: Assert redirect to list ---
    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });
    await expect(page).toHaveURL("/warehouse-management/inventory-check");

    // --- Step 7: Verify new record appears in the list with CREATED status ---
    await expect(
      page.getByRole("gridcell", { name: "tuanemtramtinh" }).first(),
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByRole("gridcell", { name: "Backup Warehouse (WH-0003)" }).first(),
    ).toBeVisible();
  });

  test("should create an inventory check with all fields (note, products, recurring cycle)", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/inventory-check/new");

    // --- Step 1: Select warehouse ---
    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    const firstWarehouse = await warehouseSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await warehouseSelect.selectOption({ value: firstWarehouse! });

    // --- Step 2: Assign to tuanemtramtinh ---
    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

    // --- Step 3: Set planned date ---
    await page.locator("input[name='plannedDate']").fill("2099-07-15T14:00");

    // --- Step 4: Add note ---
    await page
      .getByPlaceholder("e.g. Focus on Aisle 5 damaged goods...")
      .fill("Automated test: full-field schedule");

    // --- Step 5: Enable recurring cycle count ---
    await page
      .getByRole("checkbox", { name: "Enable Recurring Cycle Count" })
      .check();

    await expect(page.locator("input[name='cycleValue']")).toBeVisible();
    await page.locator("input[name='cycleValue']").fill("2");
    await page.locator("select[name='cycleUnit']").selectOption("WEEKS");

    // --- Step 6: Submit ---
    await page.getByRole("button", { name: "Save" }).click();

    // --- Step 7: Assert success toast ---
    await expect(
      page.getByText("Inventory Check Scheduled!"),
    ).toBeVisible({ timeout: 10_000 });

    // --- Step 8: Assert redirect to list ---
    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });
    await expect(page).toHaveURL("/warehouse-management/inventory-check");
  });

  test("should show validation errors and NOT redirect when required fields are missing", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/inventory-check/new");

    await page.getByRole("button", { name: "Save" }).click();

    // Still on the form page
    await expect(page).toHaveURL(
      "/warehouse-management/inventory-check/new",
    );

    // Validation messages visible
    await expect(page.getByText("Please select a warehouse")).toBeVisible();
    await expect(page.getByText("Please assign an employee")).toBeVisible();
    await expect(page.getByText("Date is required")).toBeVisible();
  });

  test("should show validation error when warehouse is missing but other fields filled", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/inventory-check/new");

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });
    await page.locator("input[name='plannedDate']").fill("2099-08-01T10:00");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Please select a warehouse")).toBeVisible();
    await expect(
      page.getByText("Please assign an employee"),
    ).not.toBeVisible();
    await expect(page.getByText("Date is required")).not.toBeVisible();
  });

  test("should show validation error when assignee is missing but other fields filled", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/inventory-check/new");

    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    const firstWarehouse = await warehouseSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await warehouseSelect.selectOption({ value: firstWarehouse! });

    await page.locator("input[name='plannedDate']").fill("2099-08-01T10:00");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Please assign an employee")).toBeVisible();
    await expect(
      page.getByText("Please select a warehouse"),
    ).not.toBeVisible();
    await expect(page.getByText("Date is required")).not.toBeVisible();
  });

  test("should show validation error when date is missing but other fields filled", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/inventory-check/new");

    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    const firstWarehouse = await warehouseSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await warehouseSelect.selectOption({ value: firstWarehouse! });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Date is required")).toBeVisible();
    await expect(
      page.getByText("Please select a warehouse"),
    ).not.toBeVisible();
    await expect(
      page.getByText("Please assign an employee"),
    ).not.toBeVisible();
  });

  test("should cancel and navigate back to the list page", async ({ page }) => {
    // Use a link click (SPA navigation) so Next.js router records a history entry.
    // page.goto() does a full load that router.back() doesn't recognise.
    await page.goto("/warehouse-management/inventory-check");
    await page.getByRole("link", { name: "Schedule Inventory Check" }).click();
    await expect(page).toHaveURL("/warehouse-management/inventory-check/new");

    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(page).toHaveURL("/warehouse-management/inventory-check");
  });
});
