import test, { expect } from "@playwright/test";

const WAREHOUSE_NEW_URL = "/warehouse-management/warehouse/new";
const WAREHOUSE_LIST_URL = "/warehouse-management/warehouse";

test.describe("Warehouse Management", () => {
  // ──────────────────────────────────────────────
  // Invalid Cases
  // ──────────────────────────────────────────────
  test.describe("Create Invalid Warehouse", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(WAREHOUSE_NEW_URL);
      await expect(page.getByPlaceholder("e.g. Export Storage")).toBeVisible({
        timeout: 10_000,
      });
    });

    test("should show error when warehouse name is null", async ({ page }) => {
      // Leave Warehouse Name empty, fill the rest of the required fields
      await page
        .getByPlaceholder("Where is your warehouse?")
        .fill("123 Test Street");

      const managerSelect = page.locator("select").first();
      await expect(managerSelect).toBeEnabled({ timeout: 10_000 });
      const firstManagerValue = await managerSelect
        .locator("option[value]:not([value=''])")
        .first()
        .getAttribute("value");
      if (firstManagerValue)
        await managerSelect.selectOption({ value: firstManagerValue });

      await page.getByRole("button", { name: "Create" }).click();

      await expect(
        page.getByText("Warehouse name is required"),
      ).toBeVisible();
    });

    test("should show error when address is null", async ({ page }) => {
      // Fill Warehouse Name, leave Address empty
      await page
        .getByPlaceholder("e.g. Export Storage")
        .fill("Test Warehouse No Address");

      const managerSelect = page.locator("select").first();
      await expect(managerSelect).toBeEnabled({ timeout: 10_000 });
      const firstManagerValue = await managerSelect
        .locator("option[value]:not([value=''])")
        .first()
        .getAttribute("value");
      if (firstManagerValue)
        await managerSelect.selectOption({ value: firstManagerValue });

      await page.getByRole("button", { name: "Create" }).click();

      await expect(
        page.getByText("Please specify warehouse address"),
      ).toBeVisible();
    });

    test("should show error when manager is not selected", async ({ page }) => {
      // Fill Warehouse Name and Address, leave Manager unselected
      await page
        .getByPlaceholder("e.g. Export Storage")
        .fill("Test Warehouse No Manager");
      await page
        .getByPlaceholder("Where is your warehouse?")
        .fill("456 Test Avenue");

      await page.getByRole("button", { name: "Create" }).click();

      await expect(page.getByText("Please select a manager")).toBeVisible();
    });
  });

  // ──────────────────────────────────────────────
  // Create
  // ──────────────────────────────────────────────
  test("should successfully create a new warehouse", async ({ page }) => {
    await page.goto(WAREHOUSE_NEW_URL);

    await page
      .getByPlaceholder("e.g. Export Storage")
      .fill("Test Automation Warehouse");

    await page
      .getByPlaceholder("Where is your warehouse?")
      .fill("123 Automation Lane, Tech City");

    // Select Warehouse Manager
    const managerSelect = page.locator("select").first();
    await expect(managerSelect).toBeEnabled({ timeout: 10_000 });
    const firstManagerValue = await managerSelect
      .locator("option[value]:not([value=''])")
      .last()
      .getAttribute("value");
    if (firstManagerValue)
      await managerSelect.selectOption({ value: firstManagerValue });

    // Select Warehouse Type
    await page.locator("select").nth(1).selectOption({ label: "STORAGE" });

    // Fill Description
    await page
      .getByPlaceholder("Describe your warehouse")
      .fill("This warehouse was created by Playwright automation.");

    await page.getByRole("button", { name: "Create" }).click();

    await expect(
      page.getByText("Warehouse created successfully!"),
    ).toBeVisible({ timeout: 10_000 });

    await page.waitForURL(/\/warehouse-management\/warehouse/, {
      timeout: 10_000,
    });
    await expect(page).toHaveURL(/\/warehouse-management\/warehouse/);
  });

  // ──────────────────────────────────────────────
  // Update
  // ──────────────────────────────────────────────
  test("should navigate to existing warehouse and update its information", async ({
    page,
  }) => {
    await page.goto(WAREHOUSE_LIST_URL);

    // Find the warehouse named "Test Update Warehouse" and navigate to it
    const warehouseLink = page
      .getByRole("link", { name: "Test Update Warehouse", exact: true })
      .first();
    await expect(warehouseLink).toBeVisible({ timeout: 10_000 });
    await warehouseLink.click();

    await page.waitForURL(/\/warehouse-management\/warehouse\/detail\/\d+/, {
      timeout: 10_000,
    });

    // Click the pencil edit button
    const editPencilBtn = page.locator("button:has(svg.lucide-pencil)").first();
    await editPencilBtn.click();

    // Modify the address and description
    const timestamp = Date.now();
    await page
      .locator('input[name="address"]')
      .fill(`Updated Address ${timestamp}`);
    await page
      .locator('input[name="description"]')
      .fill(`This description has been updated by Playwright at ${timestamp}`);

    await page.getByRole("button", { name: "Save" }).click();

    await expect(
      page.getByText("Warehouse update successfully!"),
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByText(`Updated Address ${timestamp}`),
    ).toBeVisible({ timeout: 5_000 });
  });

  // ──────────────────────────────────────────────
  // Delete
  // ──────────────────────────────────────────────
  test("should create a warehouse and then delete it", async ({ page }) => {
    // 1. Create a temporary warehouse
    await page.goto(WAREHOUSE_NEW_URL);

    const uniqueName = `Auto Delete Warehouse ${Date.now()}`;
    await page.getByPlaceholder("e.g. Export Storage").fill(uniqueName);
    await page
      .getByPlaceholder("Where is your warehouse?")
      .fill("123 Delete Lane");

    const managerSelect = page.locator("select").first();
    await expect(managerSelect).toBeEnabled({ timeout: 10_000 });
    const firstManagerValue = await managerSelect
      .locator("option[value]:not([value=''])")
      .last()
      .getAttribute("value");
    if (firstManagerValue)
      await managerSelect.selectOption({ value: firstManagerValue });

    await page.locator("select").nth(1).selectOption({ label: "STORAGE" });
    await page.getByRole("button", { name: "Create" }).click();

    await expect(
      page.getByText("Warehouse created successfully!"),
    ).toBeVisible({ timeout: 10_000 });
    await page.waitForURL(/\/warehouse-management\/warehouse/, {
      timeout: 10_000,
    });

    // 2. Find and navigate to the newly created warehouse
    const warehouseLinks = page.locator(
      'a[href*="/warehouse-management/warehouse/detail/"]',
    );
    await expect(warehouseLinks.first()).toBeVisible({ timeout: 10_000 });
    await warehouseLinks.last().click();

    await page.waitForURL(/\/warehouse-management\/warehouse\/detail\/\d+/, {
      timeout: 10_000,
    });

    // 3. Delete it
    await page.getByRole("button", { name: "Delete Warehouse" }).click();

    await expect(
      page.getByRole("heading", { name: "Delete this warehouse?" }),
    ).toBeVisible({ timeout: 5_000 });
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // 4. Verify redirect back to the list
    await page.waitForURL(/\/warehouse-management\/warehouse/, {
      timeout: 10_000,
    });
    await expect(page).toHaveURL(/\/warehouse-management\/warehouse/);
  });
});
