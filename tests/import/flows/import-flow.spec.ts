import test, { expect } from "@playwright/test";

test.describe("Import flow - full flow", () => {
  test("should create import sheet and complete quantity check", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    // Wait for supplier dropdown to load
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

    const firstProductRow = pickerGrid.locator("[role=row]").nth(1);
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
    await page.waitForURL(/\/import\/process\/supplier\/\d+\/storage-location/, {
      timeout: 15_000,
    });

    // --- Step 7: Pick the last available location for the passed batch ---
    const passedGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Storage Location" }),
    }).first();

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
    await expect(
      page.getByText("Storage Location Successfully"),
    ).toBeVisible();
  });
});
