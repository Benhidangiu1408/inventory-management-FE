import test, { expect } from "@playwright/test";

test.describe("Import flow - full flow", () => {
  test("should create import sheet and complete full flow", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    // Wait for supplier dropdown to load
    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    const supplierSelect = page.locator("select").nth(1);
    await expect(supplierSelect).toBeEnabled({ timeout: 10_000 });

    // Select the first real supplier (skip both placeholder entries)
    const firstSupplierValue = await supplierSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await supplierSelect.selectOption({ value: firstSupplierValue! });

    await page.getByRole("button", { name: "Create" }).click();

    // Should redirect to quantity-check step
    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quantity-check/, {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(
      /\/import\/process\/supplier\/\d+\/quantity-check/,
    );

    // --- Step 2: Add first product with pick quantity 10 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    const firstProductRow = pickerGrid.locator("[role=row]").nth(8);
    // Click the cell — AG Grid's click handler lives on the wrapper, not the <input>
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("10");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Set actual quantity equal to expected (variance = 0) ---
    const qtyCheckGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Actual Quantity" }),
    });

    const firstCheckRow = qtyCheckGrid.locator("[role=row]").nth(1);
    const actualQtyInput = firstCheckRow.locator(
      "[col-id=actualQuantity] input",
    );

    await actualQtyInput.scrollIntoViewIfNeeded();
    await actualQtyInput.click({ clickCount: 3 });
    await actualQtyInput.fill("10");

    // Blur to trigger variance calculation
    await firstCheckRow.locator("[col-id=expectedQuantity]").click();

    await expect(firstCheckRow.locator("[col-id=variance]")).toHaveText("0");

    // --- Step 4: Confirm quantity check ---
    await page.getByRole("button", { name: "Confirm Check Quantity" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Should advance to quality-check step
    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quality-check/, {
      timeout: 15_000,
    });

    // --- Step 5: Set quality status to PASSED for all batches ---
    const qcGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Quality Status" }),
    });

    const firstBatchRow = qcGrid.locator("[role=row]").nth(1);
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .scrollIntoViewIfNeeded();
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .selectOption("PASSED");

    // --- Step 6: Confirm quality check ---
    await page.getByRole("button", { name: "Confirm Check Quality" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Should advance to storage-location step
    await page.waitForURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
      {
        timeout: 15_000,
      },
    );

    // --- Step 7: Pick the last available location for the passed batch ---
    const passedGrid = page
      .locator("[role=grid]")
      .filter({
        has: page.getByRole("columnheader", { name: "Storage Location" }),
      })
      .first();

    const firstPassedRow = passedGrid.locator("[role=row]").nth(1);
    const locationSelect = firstPassedRow.locator(
      "[col-id=storageLocation] select",
    );
    await locationSelect.scrollIntoViewIfNeeded();

    // Select the last non-placeholder option
    const locationOptions = locationSelect.locator(
      "option[value]:not([value=''])",
    );
    const lastValue = await locationOptions.last().getAttribute("value");
    await locationSelect.selectOption(lastValue!);

    // --- Step 8: Confirm storage location ---
    await page
      .getByRole("button", { name: "Confirm Storage Location" })
      .click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Page remains on storage-location after completion
    await expect(page).toHaveURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
    );

    // Success toast should appear
    await expect(page.getByText("Storage Location Successfully")).toBeVisible();
  });

  test("should create import sheet and show toast when actual quantity is less than expected on quantity check", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    const supplierSelect = page.locator("select").nth(1);
    await expect(supplierSelect).toBeEnabled({ timeout: 10_000 });

    const firstSupplierValue = await supplierSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await supplierSelect.selectOption({ value: firstSupplierValue! });

    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quantity-check/, {
      timeout: 15_000,
    });

    // --- Step 2: Add first product with pick quantity 10 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    const firstProductRow = pickerGrid.locator("[role=row]").nth(1);
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("10");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Set actual quantity LESS than expected (e.g. 5 < 10) ---
    const qtyCheckGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Actual Quantity" }),
    });

    const firstCheckRow = qtyCheckGrid.locator("[role=row]").nth(1);
    const actualQtyInput = firstCheckRow.locator(
      "[col-id=actualQuantity] input",
    );

    await actualQtyInput.scrollIntoViewIfNeeded();
    await actualQtyInput.click({ clickCount: 3 });
    await actualQtyInput.fill("5");

    // Blur to trigger variance calculation
    await firstCheckRow.locator("[col-id=expectedQuantity]").click();

    // Variance should be negative (-5)
    await expect(firstCheckRow.locator("[col-id=variance]")).toHaveText("-5");

    // --- Step 4: Attempt to confirm without providing a reason → validation toast ---
    await page.getByRole("button", { name: "Confirm Check Quantity" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await expect(
      page.getByText(
        /\d+ batches have extra or missing quantities\. Please provide a reason\./,
      ),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("should complete full flow when actual quantity is less than expected but reason is provided", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    const supplierSelect = page.locator("select").nth(1);
    await expect(supplierSelect).toBeEnabled({ timeout: 10_000 });

    const firstSupplierValue = await supplierSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await supplierSelect.selectOption({ value: firstSupplierValue! });

    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quantity-check/, {
      timeout: 15_000,
    });

    // --- Step 2: Add first product with pick quantity 10 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    const firstProductRow = pickerGrid.locator("[role=row]").nth(1);
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("10");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Set actual quantity LESS than expected (5 < 10) ---
    const qtyCheckGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Actual Quantity" }),
    });

    const firstCheckRow = qtyCheckGrid.locator("[role=row]").nth(1);
    const actualQtyInput = firstCheckRow.locator(
      "[col-id=actualQuantity] input",
    );

    await actualQtyInput.scrollIntoViewIfNeeded();
    await actualQtyInput.click({ clickCount: 3 });
    await actualQtyInput.fill("5");

    // Blur to trigger variance calculation
    await firstCheckRow.locator("[col-id=expectedQuantity]").click();
    await expect(firstCheckRow.locator("[col-id=variance]")).toHaveText("-5");

    // --- Step 4: Fill in reason for the variance ---
    const reasonInput = firstCheckRow.locator("[col-id=reason] input");
    await reasonInput.scrollIntoViewIfNeeded();
    await reasonInput.click();
    await reasonInput.fill("Short delivery from supplier");
    await reasonInput.blur();

    // --- Step 5: Confirm quantity check ---
    await page.getByRole("button", { name: "Confirm Check Quantity" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quality-check/, {
      timeout: 15_000,
    });

    // --- Step 6: Set quality status to PASSED ---
    const qcGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Quality Status" }),
    });

    const firstBatchRow = qcGrid.locator("[role=row]").nth(1);
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .scrollIntoViewIfNeeded();
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .selectOption("PASSED");

    // --- Step 7: Confirm quality check ---
    await page.getByRole("button", { name: "Confirm Check Quality" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await page.waitForURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
      {
        timeout: 15_000,
      },
    );

    // --- Step 8: Pick the last available storage location ---
    const passedGrid = page
      .locator("[role=grid]")
      .filter({
        has: page.getByRole("columnheader", { name: "Storage Location" }),
      })
      .first();

    const firstPassedRow = passedGrid.locator("[role=row]").nth(1);
    const locationSelect = firstPassedRow.locator(
      "[col-id=storageLocation] select",
    );
    await locationSelect.scrollIntoViewIfNeeded();

    const locationOptions = locationSelect.locator(
      "option[value]:not([value=''])",
    );
    const lastValue = await locationOptions.last().getAttribute("value");
    await locationSelect.selectOption(lastValue!);

    // --- Step 9: Confirm storage location ---
    await page
      .getByRole("button", { name: "Confirm Storage Location" })
      .click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await expect(page).toHaveURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
    );

    await expect(page.getByText("Storage Location Successfully")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("should complete full flow when actual quantity is more than expected and reason is provided", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    const supplierSelect = page.locator("select").nth(1);
    await expect(supplierSelect).toBeEnabled({ timeout: 10_000 });

    const firstSupplierValue = await supplierSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await supplierSelect.selectOption({ value: firstSupplierValue! });

    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quantity-check/, {
      timeout: 15_000,
    });

    // --- Step 2: Add first product with pick quantity 10 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    const firstProductRow = pickerGrid.locator("[role=row]").nth(1);
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("10");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Set actual quantity MORE than expected (15 > 10) ---
    const qtyCheckGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Actual Quantity" }),
    });

    const firstCheckRow = qtyCheckGrid.locator("[role=row]").nth(1);
    const actualQtyInput = firstCheckRow.locator(
      "[col-id=actualQuantity] input",
    );

    await actualQtyInput.scrollIntoViewIfNeeded();
    await actualQtyInput.click({ clickCount: 3 });
    await actualQtyInput.fill("15");

    // Blur to trigger variance calculation
    await firstCheckRow.locator("[col-id=expectedQuantity]").click();
    await expect(firstCheckRow.locator("[col-id=variance]")).toHaveText("+ 5");

    // --- Step 4: Fill in reason for the variance ---
    const reasonInput = firstCheckRow.locator("[col-id=reason] input");
    await reasonInput.scrollIntoViewIfNeeded();
    await reasonInput.click();
    await reasonInput.fill("Supplier sent extra items");
    await reasonInput.blur();

    // --- Step 5: Confirm quantity check ---
    await page.getByRole("button", { name: "Confirm Check Quantity" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quality-check/, {
      timeout: 15_000,
    });

    // --- Step 6: Set quality status to PASSED ---
    const qcGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Quality Status" }),
    });

    const firstBatchRow = qcGrid.locator("[role=row]").nth(1);
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .scrollIntoViewIfNeeded();
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .selectOption("PASSED");

    // --- Step 7: Confirm quality check ---
    await page.getByRole("button", { name: "Confirm Check Quality" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await page.waitForURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
      { timeout: 15_000 },
    );

    // --- Step 8: Pick the last available storage location ---
    const passedGrid = page
      .locator("[role=grid]")
      .filter({
        has: page.getByRole("columnheader", { name: "Storage Location" }),
      })
      .first();

    const firstPassedRow = passedGrid.locator("[role=row]").nth(1);
    const locationSelect = firstPassedRow.locator(
      "[col-id=storageLocation] select",
    );
    await locationSelect.scrollIntoViewIfNeeded();

    const locationOptions = locationSelect.locator(
      "option[value]:not([value=''])",
    );
    const lastValue = await locationOptions.last().getAttribute("value");
    await locationSelect.selectOption(lastValue!);

    // --- Step 9: Confirm storage location ---
    await page
      .getByRole("button", { name: "Confirm Storage Location" })
      .click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await expect(page.getByText("Storage Location Successfully")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("should show toast when quality status is FAILED without reason and notes", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    const supplierSelect = page.locator("select").nth(1);
    await expect(supplierSelect).toBeEnabled({ timeout: 10_000 });

    const firstSupplierValue = await supplierSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await supplierSelect.selectOption({ value: firstSupplierValue! });

    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quantity-check/, {
      timeout: 15_000,
    });

    // --- Step 2: Add first product with pick quantity 10 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    const firstProductRow = pickerGrid.locator("[role=row]").nth(1);
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("10");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Set actual quantity equal to expected (variance = 0) ---
    const qtyCheckGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Actual Quantity" }),
    });

    const firstCheckRow = qtyCheckGrid.locator("[role=row]").nth(1);
    const actualQtyInput = firstCheckRow.locator(
      "[col-id=actualQuantity] input",
    );

    await actualQtyInput.scrollIntoViewIfNeeded();
    await actualQtyInput.click({ clickCount: 3 });
    await actualQtyInput.fill("10");

    await firstCheckRow.locator("[col-id=expectedQuantity]").click();
    await expect(firstCheckRow.locator("[col-id=variance]")).toHaveText("0");

    // --- Step 4: Confirm quantity check ---
    await page.getByRole("button", { name: "Confirm Check Quantity" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quality-check/, {
      timeout: 15_000,
    });

    // --- Step 5: Set quality status to FAILED ---
    const qcGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Quality Status" }),
    });

    const firstBatchRow = qcGrid.locator("[role=row]").nth(1);
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .scrollIntoViewIfNeeded();
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .selectOption("FAILED");

    // --- Step 6: Attempt confirm without reason/notes → validation toast ---
    await page.getByRole("button", { name: "Confirm Check Quality" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await expect(
      page.getByText(
        /Please provide reason and notes for all FAILED or SKIPPED items/,
      ),
    ).toBeVisible({ timeout: 5_000 });
  });

  test("should create import sheet, fail quality check with reason/notes, and assign defect storage location", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    const supplierSelect = page.locator("select").nth(1);
    await expect(supplierSelect).toBeEnabled({ timeout: 10_000 });

    const firstSupplierValue = await supplierSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await supplierSelect.selectOption({ value: firstSupplierValue! });

    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quantity-check/, {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(
      /\/import\/process\/supplier\/\d+\/quantity-check/,
    );

    // --- Step 2: Add first product with pick quantity 10 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    const firstProductRow = pickerGrid.locator("[role=row]").nth(1);
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("10");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Set actual quantity equal to expected (variance = 0) ---
    const qtyCheckGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Actual Quantity" }),
    });

    const firstCheckRow = qtyCheckGrid.locator("[role=row]").nth(1);
    const actualQtyInput = firstCheckRow.locator(
      "[col-id=actualQuantity] input",
    );

    await actualQtyInput.scrollIntoViewIfNeeded();
    await actualQtyInput.click({ clickCount: 3 });
    await actualQtyInput.fill("10");

    await firstCheckRow.locator("[col-id=expectedQuantity]").click();
    await expect(firstCheckRow.locator("[col-id=variance]")).toHaveText("0");

    // --- Step 4: Confirm quantity check ---
    await page.getByRole("button", { name: "Confirm Check Quantity" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quality-check/, {
      timeout: 15_000,
    });

    // --- Step 5: Set quality status to FAILED ---
    const qcGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Quality Status" }),
    });

    const firstBatchRow = qcGrid.locator("[role=row]").nth(1);
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .scrollIntoViewIfNeeded();
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .selectOption("FAILED");

    // --- Step 6: Attempt confirm without reason/notes → validation toast ---
    await page.getByRole("button", { name: "Confirm Check Quality" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await expect(
      page.getByText(
        /Please provide reason and notes for all FAILED or SKIPPED items/,
      ),
    ).toBeVisible({ timeout: 5_000 });

    // --- Step 7: Fill in required reason and notes ---
    const reasonInput = firstBatchRow.locator("[col-id=reason] input");
    await reasonInput.scrollIntoViewIfNeeded();
    await reasonInput.click();
    await reasonInput.fill("Broken");
    await reasonInput.blur();

    const notesInput = firstBatchRow.locator("[col-id=notes] input");
    await notesInput.scrollIntoViewIfNeeded();
    await notesInput.click();
    await notesInput.fill("Broken");
    await notesInput.blur();

    // --- Step 8: Confirm quality check ---
    await page.getByRole("button", { name: "Confirm Check Quality" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await page.waitForURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
      {
        timeout: 15_000,
      },
    );

    // --- Step 9: Verify Failed Batches section is present ---
    await expect(
      page.getByRole("heading", { name: "Failed Batches", level: 3 }),
    ).toBeVisible();

    // --- Step 10: Select defect warehouse ---
    // Navigate from the <label> up to its direct parent div, then find the sibling <select>.
    // Using .locator("div").filter(...) would match all ancestor divs (strict mode violation).
    const defectWarehouseSelect = page
      .locator("label", { hasText: "Defect Warehouse" })
      .locator("..")
      .locator("select");
    await expect(defectWarehouseSelect).toBeEnabled({ timeout: 10_000 });

    const firstDefectWarehouseValue = await defectWarehouseSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await defectWarehouseSelect.selectOption({
      value: firstDefectWarehouseValue!,
    });

    // --- Step 11: Pick defect storage location for the failed batch ---
    // The failed batches grid is the last grid with a "Storage Location" column
    const failedBatchesGrid = page
      .locator("[role=grid]")
      .filter({
        has: page.getByRole("columnheader", { name: "Storage Location" }),
      })
      .last();

    const firstFailedBatchRow = failedBatchesGrid.locator("[role=row]").nth(1);
    const defectLocationSelect = firstFailedBatchRow.locator(
      "[col-id=storageLocation] select",
    );
    await defectLocationSelect.scrollIntoViewIfNeeded();

    const defectLocationOptions = defectLocationSelect.locator(
      "option[value]:not([value=''])",
    );
    const lastDefectValue = await defectLocationOptions
      .last()
      .getAttribute("value");
    await defectLocationSelect.selectOption({ value: lastDefectValue! });

    // --- Step 12: Confirm storage location ---
    await page
      .getByRole("button", { name: "Confirm Storage Location" })
      .click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    await expect(page).toHaveURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
    );

    await expect(page.getByText("Storage Location Successfully")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("should create import sheet and cancel it at quantity-check", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    const supplierSelect = page.locator("select").nth(1);
    await expect(supplierSelect).toBeEnabled({ timeout: 10_000 });

    const firstSupplierValue = await supplierSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await supplierSelect.selectOption({ value: firstSupplierValue! });

    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quantity-check/, {
      timeout: 15_000,
    });

    // --- Step 2: Verify sheet status is CREATED ---
    await expect(page.getByText("CREATED", { exact: true })).toBeVisible();

    // --- Step 3: Click Cancel ---
    await page.getByRole("button", { name: "Cancel" }).click();

    // --- Step 4: Confirm the cancel modal ---
    await expect(
      page.getByRole("heading", { name: "Cancel sheet" }),
    ).toBeVisible();
    await expect(
      page.getByText("Are you want to cancel the sheet ?"),
    ).toBeVisible();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // --- Step 5: Verify success toast and status update ---
    await expect(page.getByText("Cancel Sheet Successfully")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("REJECTED")).toBeVisible({ timeout: 10_000 });
  });
});
