import test, { expect } from "@playwright/test";

test.describe("Import flow - FAILED quality check", () => {
  test("should create import sheet, fail quality check with reason/notes, and assign defect storage location", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

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
});
