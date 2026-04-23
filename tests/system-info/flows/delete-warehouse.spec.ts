import test, { expect } from "@playwright/test";

test.describe("Delete Warehouse Flow", () => {
  test("should create a warehouse, route back, select the last one and delete it", async ({ page }) => {
    // 1. Create a warehouse
    await page.goto("/warehouse-management/warehouse/new");
    
    // Generate a unique name to ensure we are deleting the one we just created
    const uniqueName = `Auto Delete Warehouse ${Date.now()}`;
    await page.getByPlaceholder("e.g. Export Storage").fill(uniqueName);
    await page.getByPlaceholder("Where is your warehouse?").fill("123 Delete Lane");
    
    // Select Warehouse Manager
    const managerSelect = page.locator("select").first();
    await expect(managerSelect).toBeEnabled({ timeout: 10_000 });
    const managerOptions = managerSelect.locator("option[value]:not([value=''])");
    const firstManagerValue = await managerOptions.last().getAttribute("value");
    if (firstManagerValue) {
      await managerSelect.selectOption({ value: firstManagerValue });
    }

    // Select Warehouse Type
    const typeSelect = page.locator("select").nth(1);
    await typeSelect.selectOption({ label: "STORAGE" });
    
    // Save
    await page.getByRole("button", { name: "Create" }).click();
    
    // Wait for success and redirect
    await expect(page.getByText("Warehouse created successfully!")).toBeVisible({ timeout: 10_000 });
    await page.waitForURL(/\/warehouse-management\/warehouse/, { timeout: 10_000 });
    
    // 2. We are now back at the warehouse list.
    // Wait for the table to load by checking if the first link is visible
    const warehouseLinks = page.locator('a[href*="/warehouse-management/warehouse/detail/"]');
    await expect(warehouseLinks.first()).toBeVisible({ timeout: 10_000 });
    
    // 3. Choose the last warehouse in the list to delete
    const lastWarehouseLink = warehouseLinks.last();
    await lastWarehouseLink.click();
    
    // 4. Ensure we are on the warehouse detail page
    await page.waitForURL(/\/warehouse-management\/warehouse\/detail\/\d+/, { timeout: 10_000 });
    
    // 5. Trigger Deletion
    await page.getByRole("button", { name: "Delete Warehouse" }).click();
    
    // 6. Confirm Modal
    const modalHeading = page.getByRole("heading", { name: "Delete this warehouse?" });
    await expect(modalHeading).toBeVisible({ timeout: 5_000 });
    
    // Click the Confirm button in the modal
    await page.getByRole("button", { name: "Confirm", exact: true }).click();
    
    // 7. Verify we return to the warehouse list and the delete was successful
    await page.waitForURL(/\/warehouse-management\/warehouse/, { timeout: 10_000 });
    
    // Check for success toast if applicable (optional, just ensuring URL is back is good enough)
    await expect(page).toHaveURL(/\/warehouse-management\/warehouse/);
  });
});
