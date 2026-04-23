import test, { expect } from "@playwright/test";

test.describe("Create Product Attribute Flow", () => {
  // Use the stored authentication state for all tests in this file
  test.use({ storageState: "playwright/.auth/user.json" });

  test("should create a new product attribute", async ({ page }) => {
    // 1️⃣ Navigate to the Variant Attributes page
    await page.goto("/catalog/variant-attributes");

    // 2️⃣ Open the "New Attribute" modal
    await page.getByRole("button", { name: "New Attribute" }).click();

    // 3️⃣ Fill required fields with unique values
    const timestamp = Date.now();
    const attrName = `AUTO-ATTR-TEST-${timestamp}`;
    const attrDesc = "Automated test attribute description";

    // Attribute Name (placeholder like "e.g. Color")
    await page.getByPlaceholder("e.g. Color").fill(attrName);
    // Attribute Description (placeholder like "Describe your attribute")
    await page.getByPlaceholder("Describe your attribute").fill(attrDesc);

    // 4️⃣ Submit the form
    await page.getByRole("button", { name: "Save" }).click();

    // 5️⃣ Verify the new attribute appears in the table
    const newRow = page.getByRole("row", { name: attrName });
    await expect(newRow).toBeVisible({ timeout: 10_000 });
    await expect(newRow.getByText(attrDesc)).toBeVisible();
  });
});
