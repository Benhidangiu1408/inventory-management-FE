import test, { expect } from "@playwright/test";

test.describe("Export flow - create export sheet", () => {
  test("should create export sheet for customer", async ({ page }) => {
    await page.goto("/export/new");

    // --- Step 1: Select warehouse ---
    const warehouseSelect = page.locator("select").nth(0);
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });

    const firstWarehouseValue = await warehouseSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await warehouseSelect.selectOption({ value: firstWarehouseValue! });

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

    const firstWarehouseValue = await warehouseSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await warehouseSelect.selectOption({ value: firstWarehouseValue! });

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

    const firstWarehouseValue = await warehouseSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await warehouseSelect.selectOption({ value: firstWarehouseValue! });

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

    const firstWarehouseValue = await warehouseSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await warehouseSelect.selectOption({ value: firstWarehouseValue! });

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
