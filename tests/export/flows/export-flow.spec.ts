import test, { expect } from "@playwright/test";

test.describe("Export flow - create export sheet", () => {
  test("should create export sheet, pick product with quantity 1, auto scan and confirm", async ({
    page,
  }) => {
    // --- Step 1: Create export sheet for customer ---
    await page.goto("/export/new");

    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });

    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    await page.getByRole("button", { name: "Customer" }).click();

    const customerSelect = page.locator("select").nth(1);
    await expect(customerSelect).toBeEnabled({ timeout: 10_000 });

    const firstCustomerValue = await customerSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await customerSelect.selectOption({ value: firstCustomerValue! });

    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/export\/process\/customer\/\d+\/quantity-check/, {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(
      /\/export\/process\/customer\/\d+\/quantity-check/,
    );

    // --- Step 2: Add product with pick quantity 1 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    const firstProductRow = pickerGrid.locator("[role=row]").nth(8);
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("1");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Auto scan the product ---
    const qcGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Scan Item" }),
    });

    const firstQcRow = qcGrid.locator("[role=row]").nth(1);
    await firstQcRow.locator("[col-id=scanItem] button").click();

    // Scan panel appears
    const barCodeInput = page.getByPlaceholder("Scan Item BarCode");
    await expect(barCodeInput).toBeVisible();

    // Auto Scan fills barcode from active batch automatically
    await page.getByRole("button", { name: "Auto Scan" }).click();
    await expect(barCodeInput).not.toHaveValue("");

    // Submit the scan
    await page.getByRole("button", { name: "Scan", exact: true }).click();

    await expect(page.getByText("Scan Item Successfully")).toBeVisible();

    // Variance should be 0 after full scan
    await expect(firstQcRow.locator("[col-id=variance]")).toHaveText("0");

    // --- Step 4: Navigate to confirm page ---
    await page.getByRole("link", { name: "Confirm" }).first().click();

    await page.waitForURL(/\/export\/process\/customer\/\d+\/confirm/, {
      timeout: 15_000,
    });

    // --- Step 5: Confirm the export sheet ---
    await page.getByRole("button", { name: "Confirm" }).click();

    // Confirm modal appears — click modal's Confirm button
    await expect(
      page.getByRole("heading", { name: "Confirm Export Sheet" }),
    ).toBeVisible();
    await page
      .locator("button:not(a > button)", { hasText: "Confirm" })
      .first()
      .click();

    await expect(
      page.getByText("Confirm Export Sheet successfully"),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("should create transfer export sheet, pick product with quantity 1, auto scan and confirm", async ({
    page,
  }) => {
    // --- Step 1: Create export sheet for transfer ---
    await page.goto("/export/new");

    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });

    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    await page.getByRole("button", { name: "Transfer" }).click();

    const destinationSelect = page.locator("select").nth(1);
    await expect(destinationSelect).toBeEnabled({ timeout: 10_000 });

    const firstDestinationValue = await destinationSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await destinationSelect.selectOption({ value: firstDestinationValue! });

    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/export\/process\/internal\/\d+\/quantity-check/, {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(
      /\/export\/process\/internal\/\d+\/quantity-check/,
    );

    // --- Step 2: Add product with pick quantity 1 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    const firstProductRow = pickerGrid.locator("[role=row]").nth(8);
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("1");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Auto scan the product ---
    const qcGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Scan Item" }),
    });

    const firstQcRow = qcGrid.locator("[role=row]").nth(1);
    await firstQcRow.locator("[col-id=scanItem] button").click();

    const barCodeInput = page.getByPlaceholder("Scan Item BarCode");
    await expect(barCodeInput).toBeVisible();

    await page.getByRole("button", { name: "Auto Scan" }).click();
    await expect(barCodeInput).not.toHaveValue("");

    await page.getByRole("button", { name: "Scan", exact: true }).click();

    await expect(page.getByText("Scan Item Successfully")).toBeVisible();

    await expect(firstQcRow.locator("[col-id=variance]")).toHaveText("0");

    // --- Step 4: Navigate to confirm page ---
    await page.getByRole("link", { name: "Confirm" }).first().click();

    await page.waitForURL(/\/export\/process\/internal\/\d+\/confirm/, {
      timeout: 15_000,
    });

    // --- Step 5: Confirm the export sheet ---
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(
      page.getByRole("heading", { name: "Confirm Export Sheet" }),
    ).toBeVisible();
    await page
      .locator("button:not(a > button)", { hasText: "Confirm" })
      .first()
      .click();

    await expect(
      page.getByText("Confirm Export Sheet successfully"),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("should confirm export sheet with warning when items are not fully scanned", async ({
    page,
  }) => {
    // --- Step 1: Create export sheet for customer ---
    await page.goto("/export/new");

    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });

    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    await page.getByRole("button", { name: "Customer" }).click();

    const customerSelect = page.locator("select").nth(1);
    await expect(customerSelect).toBeEnabled({ timeout: 10_000 });

    const firstCustomerValue = await customerSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await customerSelect.selectOption({ value: firstCustomerValue! });

    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/export\/process\/customer\/\d+\/quantity-check/, {
      timeout: 15_000,
    });

    // --- Step 2: Add product with pick quantity 1 (skip scanning) ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    const firstProductRow = pickerGrid.locator("[role=row]").nth(8);
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("1");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Navigate to confirm WITHOUT scanning ---
    await page.getByRole("link", { name: "Confirm" }).first().click();

    await page.waitForURL(/\/export\/process\/customer\/\d+\/confirm/, {
      timeout: 15_000,
    });

    // --- Step 4: Confirm — expect warning message about incomplete scan ---
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(
      page.getByText(
        "Some items have not been fully scanned. Are you sure you want to confirm the Export Sheet?",
      ),
    ).toBeVisible();

    // Confirm anyway
    await page
      .locator("button:not(a > button)", { hasText: "Confirm" })
      .first()
      .click();

    await expect(
      page.getByText("Confirm Export Sheet successfully"),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("should create export sheet for customer", async ({ page }) => {
    await page.goto("/export/new");

    // --- Step 1: Select warehouse ---
    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });

    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    // --- Step 2: Choose Customer type ---
    await page.getByRole("button", { name: "Customer" }).click();

    // --- Step 3: Select an existing customer ---
    const customerSelect = page.locator("select").nth(1);
    await expect(customerSelect).toBeEnabled({ timeout: 10_000 });

    const firstCustomerValue = await customerSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await customerSelect.selectOption({ value: firstCustomerValue! });

    // --- Step 4: Create the export sheet ---
    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/export\/process\/customer\/\d+\/quantity-check/, {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(
      /\/export\/process\/customer\/\d+\/quantity-check/,
    );
  });

  test("should create export sheet for transfer", async ({ page }) => {
    await page.goto("/export/new");

    // --- Step 1: Select warehouse ---
    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });

    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    // --- Step 2: Choose Transfer type ---
    await page.getByRole("button", { name: "Transfer" }).click();

    // --- Step 3: Select destination warehouse ---
    const destinationSelect = page.locator("select").nth(1);
    await expect(destinationSelect).toBeEnabled({ timeout: 10_000 });

    const firstDestinationValue = await destinationSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await destinationSelect.selectOption({ value: firstDestinationValue! });

    // --- Step 4: Create the export sheet ---
    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/export\/process\/internal\/\d+\/quantity-check/, {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(
      /\/export\/process\/internal\/\d+\/quantity-check/,
    );
  });

  test("should create export sheet for customer and cancel it at quantity-check", async ({
    page,
  }) => {
    await page.goto("/export/new");

    // --- Step 1: Select warehouse ---
    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });

    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    // --- Step 2: Choose Customer type and select a customer ---
    await page.getByRole("button", { name: "Customer" }).click();

    const customerSelect = page.locator("select").nth(1);
    await expect(customerSelect).toBeEnabled({ timeout: 10_000 });

    const firstCustomerValue = await customerSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await customerSelect.selectOption({ value: firstCustomerValue! });

    // --- Step 3: Create the export sheet ---
    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/export\/process\/customer\/\d+\/quantity-check/, {
      timeout: 15_000,
    });

    // --- Step 4: Verify sheet status is CREATED ---
    await expect(page.getByText("CREATED", { exact: true })).toBeVisible();

    // --- Step 5: Click Cancel ---
    await page.getByRole("button", { name: "Cancel" }).click();

    // --- Step 6: Confirm the cancel modal ---
    await expect(
      page.getByRole("heading", { name: "Cancel sheet" }),
    ).toBeVisible();
    await expect(
      page.getByText("Are you want to cancel the sheet ?"),
    ).toBeVisible();
    // The page also has a "Confirm" button inside an <a> tag (step link).
    // The modal Confirm is NOT inside an <a>, so exclude a > button.
    await page
      .locator("button:not(a > button)", { hasText: "Confirm" })
      .click();

    // --- Step 7: Verify success toast and status update ---
    await expect(page.getByText("Cancel Sheet Successfully")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("REJECTED")).toBeVisible({ timeout: 10_000 });
  });

  test("should create export sheet for transfer and cancel it at quantity-check", async ({
    page,
  }) => {
    await page.goto("/export/new");

    // --- Step 1: Select warehouse ---
    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });

    await warehouseSelect.selectOption({ label: "Backup Warehouse" });

    // --- Step 2: Choose Transfer type and select destination warehouse ---
    await page.getByRole("button", { name: "Transfer" }).click();

    const destinationSelect = page.locator("select").nth(1);
    await expect(destinationSelect).toBeEnabled({ timeout: 10_000 });

    const firstDestinationValue = await destinationSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await destinationSelect.selectOption({ value: firstDestinationValue! });

    // --- Step 3: Create the export sheet ---
    await page.getByRole("button", { name: "Create" }).click();

    await page.waitForURL(/\/export\/process\/internal\/\d+\/quantity-check/, {
      timeout: 15_000,
    });

    // --- Step 4: Verify sheet status is CREATED ---
    await expect(page.getByText("CREATED", { exact: true })).toBeVisible();

    // --- Step 5: Click Cancel ---
    await page.getByRole("button", { name: "Cancel" }).click();

    // --- Step 6: Confirm the cancel modal ---
    await expect(
      page.getByRole("heading", { name: "Cancel sheet" }),
    ).toBeVisible();
    await expect(
      page.getByText("Are you want to cancel the sheet ?"),
    ).toBeVisible();
    await page
      .locator("button:not(a > button)", { hasText: "Confirm" })
      .click();

    // --- Step 7: Verify success toast and status update ---
    await expect(page.getByText("Cancel Sheet Successfully")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("REJECTED")).toBeVisible({ timeout: 10_000 });
  });
});
