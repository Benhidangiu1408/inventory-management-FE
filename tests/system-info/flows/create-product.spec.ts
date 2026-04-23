import test, { expect } from "@playwright/test";

test.describe("Create Product Flow", () => {
  test("should create a new product", async ({ page }) => {
    // 1️⃣ Open the product creation page
    await page.goto("/catalog/product/new");

    // 2️⃣ Fill required inputs
    const prodName = `AUTO-PROD-TEST-${Date.now()}`;
    await page
      .locator('input[placeholder="e.g. Coca Cola"]')
      .fill(prodName);
    await page
      .locator('input[placeholder="Describe your product"]')
      .fill("Automated test product");

    // 3️⃣ Choose Category (first select)
    const catSelect = page.locator("select").first();
    await expect(catSelect).toBeEnabled({ timeout: 10_000 });
    const catVal = await catSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    if (catVal) await catSelect.selectOption({ value: catVal });

    // 4️⃣ Choose Base Unit (second select)
    const unitSelect = page.locator("select").nth(1);
    await expect(unitSelect).toBeEnabled({ timeout: 10_000 });
    const unitVal = await unitSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    if (unitVal) await unitSelect.selectOption({ value: unitVal });

    // 5️⃣ Submit the form
    await page.getByRole("button", { name: "Create" }).click();

    // 6️⃣ Verify success toast and redirect
    await expect(page.getByText("Product created successfully!")).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/catalog\/product$/);
  });
});
