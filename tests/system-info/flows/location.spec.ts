import test, { expect } from "@playwright/test";

test.describe("Create Warehouse Location Flow", () => {
  test("should successfully navigate to a warehouse and create a single ROOM location", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/warehouse");

    const firstWarehouseLink = page
      .locator('a[href*="/warehouse-management/warehouse/detail/"]')
      .first();
    await expect(firstWarehouseLink).toBeVisible({ timeout: 10_000 });
    await firstWarehouseLink.click();

    await page.waitForURL(/\/warehouse-management\/warehouse\/detail\/\d+/, {
      timeout: 10_000,
    });

    await page.getByRole("button", { name: "New Location" }).click();

    await page.getByPlaceholder("ROOM (Default)").fill("ROOM-A");

    const quantityInput = page.locator('input[type="number"]').first();
    await quantityInput.click({ clickCount: 3 });
    await quantityInput.fill("2");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(
      page.getByText("Location(s) created successfully!"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("should successfully create a bulk nested location hierarchy", async ({
    page,
  }) => {
    await page.goto("/warehouse-management/warehouse");

    const firstWarehouseLink = page
      .locator('a[href*="/warehouse-management/warehouse/detail/"]')
      .first();
    await expect(firstWarehouseLink).toBeVisible({ timeout: 10_000 });
    await firstWarehouseLink.click();

    await page.waitForURL(/\/warehouse-management\/warehouse\/detail\/\d+/, {
      timeout: 10_000,
    });

    await page.getByRole("button", { name: "New Location" }).click();

    // Level 1: ROOM
    await page.getByPlaceholder("ROOM (Default)").fill("ROOM-B");
    await page.locator('input[type="number"]').nth(0).fill("1");

    // Level 2: ZONE
    await page.getByRole("button", { name: "Add Level: ZONE" }).click();
    await page.getByPlaceholder("ZONE (Default)").fill("ZONE-B");
    await page.locator('input[type="number"]').nth(1).fill("1");

    // Level 3: AISLE
    await page.getByRole("button", { name: "Add Level: AISLE" }).click();
    await page.getByPlaceholder("AISLE (Default)").fill("AISLE-B");
    await page.locator('input[type="number"]').nth(2).fill("1");

    // Level 4: RACK
    await page.getByRole("button", { name: "Add Level: RACK" }).click();
    await page.getByPlaceholder("RACK (Default)").fill("RACK-B");
    await page.locator('input[type="number"]').nth(3).fill("1");

    // Level 5: SHELF
    await page.getByRole("button", { name: "Add Level: SHELF" }).click();
    await page.getByPlaceholder("SHELF (Default)").fill("SHELF-B");
    await page.locator('input[type="number"]').nth(4).fill("1");

    // Level 6: BIN
    await page.getByRole("button", { name: "Add Level: BIN" }).click();
    await page.getByPlaceholder("BIN (Default)").fill("BIN-B");
    await page.locator('input[type="number"]').nth(5).fill("5");

    // Click 'Save' to submit the bulk creation
    await page.getByRole("button", { name: "Save" }).click();

    // Verify the success toast message
    await expect(
      page.getByText("Location(s) created successfully!"),
    ).toBeVisible({ timeout: 60_000 });
  });

  test("should create a ROOM location and then delete it", async ({ page }) => {
    const timestamp = Date.now();
    const roomName = `AUTO-ROOM-${timestamp}`;

    // ==========================================
    // 1. NAVIGATE TO THE FIRST WAREHOUSE
    // ==========================================
    await page.goto("/warehouse-management/warehouse");

    const firstWarehouseLink = page
      .locator('a[href*="/warehouse-management/warehouse/detail/"]')
      .first();
    await expect(firstWarehouseLink).toBeVisible({ timeout: 10_000 });
    await firstWarehouseLink.click();

    await page.waitForURL(/\/warehouse-management\/warehouse\/detail\/\d+/, {
      timeout: 10_000,
    });

    // ==========================================
    // 2. CREATE A ROOM LOCATION (qty = 1)
    // ==========================================
    await page.getByRole("button", { name: "New Location" }).click();

    // Fill the prefix name; with qty=1 the system will create "<roomName>-1"
    await page.getByPlaceholder("ROOM (Default)").fill(roomName);

    const quantityInput = page.locator('input[type="number"]').first();
    await quantityInput.click({ clickCount: 3 });
    await quantityInput.fill("1");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(
      page.getByText("Location(s) created successfully!"),
    ).toBeVisible({ timeout: 10_000 });

    // ==========================================
    // 3. FIND THE ROOM IN THE "ROOM" TAB
    // ==========================================
    // Tabs: Room | Zone | Aisle | Rack | Shelf | Bin — "Room" is active by default
    await page.getByRole("button", { name: "Room" }).click();

    // Wait for the AG Grid to be ready, then expand to 100 rows/page so all
    // rooms are visible without pagination
    await expect(page.locator(".ag-root-wrapper")).toBeVisible();
    const pageSizeSelect = page.locator("select").last();
    await pageSizeSelect.selectOption("100");

    // The backend appends " <NNN>" (space + sequential number) to the prefix,
    // so we match by the prefix alone — hasText does a substring match.
    const targetRow = page
      .locator(".ag-row", { hasText: roomName })
      .first();
    await expect(targetRow).toBeVisible({ timeout: 10_000 });

    // ==========================================
    // 4. DELETE THE LOCATION
    // ==========================================
    // The "Action" column renders a plain <button> with a red Trash2 SVG icon
    await targetRow.locator("button").click();

    // Confirm modal — title: "Delete this location?", confirm btn: "Confirm"
    await expect(
      page.getByRole("heading", { name: "Delete this location?" }),
    ).toBeVisible({ timeout: 5_000 });
    await page.getByRole("button", { name: "Confirm" }).click();

    // Assert success toast
    await expect(page.getByText("Delete Successfully!")).toBeVisible({
      timeout: 10_000,
    });

    // Assert the row no longer appears in the table (match by prefix)
    await expect(
      page.locator(".ag-row", { hasText: roomName }),
    ).not.toBeVisible({ timeout: 5_000 });
  });
});
