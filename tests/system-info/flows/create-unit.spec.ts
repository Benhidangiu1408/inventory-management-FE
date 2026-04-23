import test, { expect } from "@playwright/test";

test.describe("Create Unit Flow", () => {
  test("should create a new unit of measurement", async ({ page }) => {
    // 1️⃣ Navigate to the Units page
    await page.goto("/catalog/unit");

    // 2️⃣ Open the "New Unit" modal
    await page.getByRole("button", { name: "New Unit" }).click();

    // 3️⃣ Fill required fields with unique values
    const timestamp = Date.now();
    const unitName = `AUTO-UNIT-TEST-${timestamp}`;
    const unitAbbr = `AU${timestamp % 1000000}`;
    const unitDesc = "Automated test unit description";

    await page.getByPlaceholder("e.g. Kilogram").fill(unitName);
    await page.getByPlaceholder("e.g. Kg").fill(unitAbbr);
    await page.getByPlaceholder("Describe your unit").fill(unitDesc);

    // 4️⃣ Submit the form
    await page.getByRole("button", { name: "Save" }).click();

    // 5️⃣ Verify the new unit appears in the table
    await expect(page.getByText(unitName)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(unitAbbr)).toBeVisible();
  });
});
