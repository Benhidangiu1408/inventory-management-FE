import test, { expect } from "@playwright/test";

test.describe("Product Flows", () => {
  test("should create a new product and then delete it", async ({ page }) => {
    // ==========================================
    // 1. CREATE PRODUCT
    // ==========================================
    await page.goto("/catalog/product/new");

    const timestamp = Date.now();
    const prodName = `AUTO-PROD-${timestamp}`;
    
    await page.locator('input[placeholder="e.g. Coca Cola"]').fill(prodName);
    await page.locator('input[placeholder="Describe your product"]').fill("Test product to be deleted");

    const catSelect = page.locator("select").first();
    await expect(catSelect).toBeEnabled({ timeout: 10_000 });
    const catVal = await catSelect.locator("option[value]:not([value=''])").first().getAttribute("value");
    if (catVal) await catSelect.selectOption({ value: catVal });

    const unitSelect = page.locator("select").nth(1);
    await expect(unitSelect).toBeEnabled({ timeout: 10_000 });
    const unitVal = await unitSelect.locator("option[value]:not([value=''])").first().getAttribute("value");
    if (unitVal) await unitSelect.selectOption({ value: unitVal });

    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText("Product created successfully!")).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/catalog\/product$/);

    // ==========================================
    // 2. DELETE PRODUCT
    // ==========================================
    await expect(page.locator(".ag-root-wrapper")).toBeVisible();
    // Change page size to 100 so all items load on the first page client-side
    const pageSizeSelect = page.locator('select').last();
    await pageSizeSelect.selectOption('100');

    // Find the row containing the product name and click its Code link
    const targetRow = page.locator('.ag-row', { hasText: prodName }).first();
    await expect(targetRow).toBeVisible({ timeout: 5000 });
    await targetRow.getByRole('link').click();

    await page.getByRole("button", { name: "Delete Product" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page).toHaveURL(/\/catalog\/product$/);
    await expect(page.locator(".ag-root-wrapper")).toBeVisible();
    await page.locator('select').last().selectOption('100');
    
    await expect(page.getByText(prodName, { exact: true })).not.toBeVisible();
  });

  test("should create a product, add a variant, and then delete the product", async ({ page }) => {
    // ==========================================
    // 1. CREATE PRODUCT
    // ==========================================
    await page.goto("/catalog/product/new");

    const timestamp = Date.now();
    const prodName = `AUTO-VARIANT-PROD-${timestamp}`;
    
    await page.locator('input[placeholder="e.g. Coca Cola"]').fill(prodName);
    await page.locator('input[placeholder="Describe your product"]').fill("Product for testing variants");

    const catSelect = page.locator("select").first();
    await expect(catSelect).toBeEnabled({ timeout: 10_000 });
    const catVal = await catSelect.locator("option[value]:not([value=''])").first().getAttribute("value");
    if (catVal) await catSelect.selectOption({ value: catVal });

    const unitSelect = page.locator("select").nth(1);
    await expect(unitSelect).toBeEnabled({ timeout: 10_000 });
    const unitVal = await unitSelect.locator("option[value]:not([value=''])").first().getAttribute("value");
    if (unitVal) await unitSelect.selectOption({ value: unitVal });

    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText("Product created successfully!")).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/catalog\/product$/);

    // ==========================================
    // 2. CREATE PRODUCT VARIANT
    // ==========================================
    await expect(page.locator(".ag-root-wrapper")).toBeVisible();
    // Change page size to 100
    const pageSizeSelect = page.locator('select').last();
    await pageSizeSelect.selectOption('100');

    // Find the row containing the product name and click its Code link
    const targetRow = page.locator('.ag-row', { hasText: prodName }).first();
    await expect(targetRow).toBeVisible({ timeout: 5000 });
    await targetRow.getByRole('link').click();

    await page.getByRole("button", { name: "New Variant" }).click();

    // The form panel has no dialog role — wait for its unique input instead
    await expect(page.getByPlaceholder("e.g. Summer Collection 2025")).toBeVisible({ timeout: 5000 });

    const variantDesc = `Automated Variant ${timestamp}`;
    await page.getByPlaceholder("e.g. Summer Collection 2025").fill(variantDesc);

    await page.getByRole("button", { name: "Add Attribute" }).click();
    // Scope to the attribute <select> that has attribute options (not the pagination combobox)
    await page
      .locator('select')
      .filter({ has: page.locator('option', { hasText: 'Color' }) })
      .selectOption({ label: "Color" });
    await page.getByPlaceholder("e.g. Red, XL").fill("Blue");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText(variantDesc)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Color: Blue")).toBeVisible();

    // ==========================================
    // 3. DELETE PRODUCT
    // ==========================================
    // We are already on the product detail page!
    await page.getByRole("button", { name: "Delete Product" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page).toHaveURL(/\/catalog\/product$/);
    await expect(page.locator(".ag-root-wrapper")).toBeVisible();
    await page.locator('select').last().selectOption('100');
    
    await expect(page.getByText(prodName, { exact: true })).not.toBeVisible();
  });

  test("should create a product, add a variant, delete the variant, and then delete the product", async ({ page }) => {
    // ==========================================
    // 1. CREATE PRODUCT
    // ==========================================
    await page.goto("/catalog/product/new");

    const timestamp = Date.now();
    const prodName = `AUTO-DEL-VARIANT-${timestamp}`;

    await page.locator('input[placeholder="e.g. Coca Cola"]').fill(prodName);
    await page.locator('input[placeholder="Describe your product"]').fill("Product for testing variant deletion");

    const catSelect = page.locator("select").first();
    await expect(catSelect).toBeEnabled({ timeout: 10_000 });
    const catVal = await catSelect.locator("option[value]:not([value=''])").first().getAttribute("value");
    if (catVal) await catSelect.selectOption({ value: catVal });

    const unitSelect = page.locator("select").nth(1);
    await expect(unitSelect).toBeEnabled({ timeout: 10_000 });
    const unitVal = await unitSelect.locator("option[value]:not([value=''])").first().getAttribute("value");
    if (unitVal) await unitSelect.selectOption({ value: unitVal });

    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText("Product created successfully!")).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/catalog\/product$/);

    // ==========================================
    // 2. NAVIGATE TO PRODUCT DETAIL
    // ==========================================
    await expect(page.locator(".ag-root-wrapper")).toBeVisible();
    await page.locator('select').last().selectOption('100');

    const targetRow = page.locator('.ag-row', { hasText: prodName }).first();
    await expect(targetRow).toBeVisible({ timeout: 5000 });
    await targetRow.getByRole('link').click();

    // ==========================================
    // 3. CREATE A VARIANT
    // ==========================================
    await page.getByRole("button", { name: "New Variant" }).click();

    await expect(page.getByPlaceholder("e.g. Summer Collection 2025")).toBeVisible({ timeout: 5000 });

    const variantDesc = `Variant To Delete ${timestamp}`;
    await page.getByPlaceholder("e.g. Summer Collection 2025").fill(variantDesc);

    await page.getByRole("button", { name: "Add Attribute" }).click();
    await page
      .locator('select')
      .filter({ has: page.locator('option', { hasText: 'Color' }) })
      .selectOption({ label: "Color" });
    await page.getByPlaceholder("e.g. Red, XL").fill("Red");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText(variantDesc)).toBeVisible({ timeout: 10000 });

    // ==========================================
    // 4. DELETE THE VARIANT
    // ==========================================
    // Find the variant row and click its red trash button
    const variantRow = page.locator('.ag-row', { hasText: variantDesc }).first();
    await expect(variantRow).toBeVisible({ timeout: 5000 });
    await variantRow.locator('button.text-red-500').click();

    // Confirm the deletion modal
    await expect(page.getByRole("heading", { name: "Delete Variant" })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Confirm" }).click();

    // Verify the variant is gone from the table
    await expect(page.getByText(variantDesc)).not.toBeVisible({ timeout: 10000 });

    // ==========================================
    // 5. CLEAN UP — DELETE THE PRODUCT
    // ==========================================
    await page.getByRole("button", { name: "Delete Product" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page).toHaveURL(/\/catalog\/product$/);
  });
});
