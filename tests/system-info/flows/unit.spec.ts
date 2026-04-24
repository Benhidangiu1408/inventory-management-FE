import test, { expect } from "@playwright/test";

const UNIT_URL = "/catalog/unit";

test.describe("Unit of Measurement (UOM)", () => {
  // ──────────────────────────────────────────────
  // Invalid Cases
  // ──────────────────────────────────────────────
  test.describe("Create Invalid Unit", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(UNIT_URL);
      await page.getByRole("button", { name: "New Unit" }).click();
    });

    test("should show error when unit name is missing", async ({ page }) => {
      // Fill valid abbreviation, leave name empty
      await page.getByPlaceholder("e.g. Kg").fill("g");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Unit name is required")).toBeVisible();
      await expect(page.getByText("Unit abbreviation is required")).not.toBeVisible();
    });

    test("should show error when unit abbreviation is missing", async ({ page }) => {
      // Fill valid name, leave abbreviation empty
      await page.getByPlaceholder("e.g. Kilogram").fill("Gram");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Unit abbreviation is required")).toBeVisible();
      await expect(page.getByText("Unit name is required")).not.toBeVisible();
    });
  });

  // ──────────────────────────────────────────────
  // Valid Case
  // ──────────────────────────────────────────────
  test("should create a new unit of measurement", async ({ page }) => {
    await page.goto(UNIT_URL);
    await page.getByRole("button", { name: "New Unit" }).click();

    const timestamp = Date.now();
    const unitName = `AUTO-UNIT-TEST-${timestamp}`;
    const unitAbbr = `AU${timestamp % 1000000}`;

    await page.getByPlaceholder("e.g. Kilogram").fill(unitName);
    await page.getByPlaceholder("e.g. Kg").fill(unitAbbr);
    await page.getByPlaceholder("Describe your unit").fill("Automated test unit description");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText(unitName)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(unitAbbr)).toBeVisible();
  });
});
