import test, { expect } from "@playwright/test";

const ATTR_URL = "/catalog/variant-attributes";

test.describe("Variant Attributes", () => {
  // ──────────────────────────────────────────────
  // Invalid Cases
  // ──────────────────────────────────────────────
  test.describe("Create Invalid Attribute", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(ATTR_URL);
      await page.getByRole("button", { name: "New Attribute" }).click();
    });

    test("should show error when attribute name is missing", async ({ page }) => {
      // Fill description but leave name empty
      await page
        .getByPlaceholder("Describe your attribute")
        .fill("Test description to trigger validation on name");

      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Attribute name is required")).toBeVisible();
    });
  });

  // ──────────────────────────────────────────────
  // Valid Case
  // ──────────────────────────────────────────────
  test("should create a new product attribute", async ({ page }) => {
    await page.goto(ATTR_URL);
    await page.getByRole("button", { name: "New Attribute" }).click();

    const timestamp = Date.now();
    const attrName = `AUTO-ATTR-TEST-${timestamp}`;
    const attrDesc = "Automated test attribute description";

    await page.getByPlaceholder("e.g. Color").fill(attrName);
    await page.getByPlaceholder("Describe your attribute").fill(attrDesc);

    await page.getByRole("button", { name: "Save" }).click();

    const newRow = page.getByRole("row", { name: attrName });
    await expect(newRow).toBeVisible({ timeout: 10_000 });
    await expect(newRow.getByText(attrDesc)).toBeVisible();
  });
});
