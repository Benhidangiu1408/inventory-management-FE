import test, { expect } from "@playwright/test";

test.describe("Create Warehouse Flow", () => {
  test("should successfully create a new warehouse", async ({ page }) => {
    // Navigate to the create warehouse page
    await page.goto("/warehouse-management/warehouse/new");

    // Fill in the Warehouse Name
    await page
      .getByPlaceholder("e.g. Export Storage")
      .fill("Test Automation Warehouse");

    // Fill in the Address
    await page
      .getByPlaceholder("Where is your warehouse?")
      .fill("123 Automation Lane, Tech City");

    // Select Warehouse Manager
    const managerSelect = page.locator("select").first();
    await expect(managerSelect).toBeEnabled({ timeout: 10_000 });

    // Select the first valid manager option
    const managerOptions = managerSelect.locator(
      "option[value]:not([value=''])",
    );
    const firstManagerValue = await managerOptions.last().getAttribute("value");
    if (firstManagerValue) {
      await managerSelect.selectOption({ value: firstManagerValue });
    }

    // Select Warehouse Type
    const typeSelect = page.locator("select").nth(1);
    await typeSelect.selectOption({ label: "STORAGE" });

    // Fill in Description
    await page
      .getByPlaceholder("Describe your warehouse")
      .fill("This warehouse was created by Playwright automation.");

    // Click Create button
    await page.getByRole("button", { name: "Create" }).click();

    // Verify success toast message
    await expect(page.getByText("Warehouse created successfully!")).toBeVisible(
      { timeout: 10_000 },
    );

    // Verify redirection to the warehouse list page
    await page.waitForURL(/\/warehouse-management\/warehouse/, {
      timeout: 10_000,
    });
    await expect(page).toHaveURL(/\/warehouse-management\/warehouse/);
  });
});
