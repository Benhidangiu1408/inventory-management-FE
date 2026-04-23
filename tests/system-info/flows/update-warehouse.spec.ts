import test, { expect } from "@playwright/test";

test.describe("Update Warehouse Flow", () => {
  test("should navigate to existing warehouse and update its information", async ({
    page,
  }) => {
    // 1. Navigate directly to the warehouse list
    await page.goto("/warehouse-management/warehouse");

    // 2. Find the warehouse named exactly "Test Update Warehouse" and click it
    // Using exact match to ensure we click the correct link
    const warehouseLink = page
      .getByRole("link", { name: "Test Update Warehouse", exact: true })
      .first();
    await expect(warehouseLink).toBeVisible({ timeout: 10_000 });
    await warehouseLink.click();

    // 3. Ensure we are on the warehouse detail page
    await page.waitForURL(/\/warehouse-management\/warehouse\/detail\/\d+/, {
      timeout: 10_000,
    });

    // 4. Click the pencil edit button (it's inside the General Information section)
    const editPencilBtn = page.locator("button:has(svg.lucide-pencil)").first();
    await editPencilBtn.click();

    // 5. Modal is open. Modify the address and description
    const timestamp = Date.now();
    await page
      .locator('input[name="address"]')
      .fill(`Updated Address ${timestamp}`);
    await page
      .locator('input[name="description"]')
      .fill(`This description has been updated by Playwright at ${timestamp}`);

    // 6. Click Save
    await page.getByRole("button", { name: "Save" }).click();

    // 7. Verify the success toast message
    await expect(page.getByText("Warehouse update successfully!")).toBeVisible({
      timeout: 10_000,
    });

    // Verify the updated values are reflected on the page
    await expect(page.getByText(`Updated Address ${timestamp}`)).toBeVisible({
      timeout: 5_000,
    });
  });
});
