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

    // Wait for create dialog to close / list view to be ready.
    await expect(page.getByRole("button", { name: "Save" })).not.toBeVisible({
      timeout: 15_000,
    });

    // Make the new row easier to find (pagination / grid virtualization).
    const rowsPerPageSelect = page.locator("select").last();
    await rowsPerPageSelect.selectOption("100");

    const unitNameCell = page.getByRole("gridcell", { name: unitName });
    const unitAbbrCell = page.getByRole("gridcell", { name: unitAbbr });

    // The new unit may land on a different page depending on sorting.
    for (const pageNum of ["1", "2", "3", "4", "5"]) {
      const pageBtn = page.getByRole("button", { name: pageNum });
      if (await pageBtn.isVisible()) {
        await pageBtn.click();
      }
      if ((await unitNameCell.count()) > 0) break;
    }

    await expect(unitNameCell).toBeVisible({ timeout: 15_000 });
    await expect(unitAbbrCell).toBeVisible();
  });
});
