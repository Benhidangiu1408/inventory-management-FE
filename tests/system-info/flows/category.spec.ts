import test, { expect } from "@playwright/test";

const CATEGORY_URL = "/catalog/category";

test.describe("System Info - Category Management", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test.beforeEach(async ({ page }) => {
    await page.goto(CATEGORY_URL);

    // Wait for the AG Grid to appear on the screen to ensure the page is fully loaded
    await expect(page.locator(".ag-root-wrapper")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("should display page title and breadcrumb", async ({ page }) => {
    // Verify the PageBreadcrumb component rendered correctly
    await expect(
      page.getByRole("heading", { name: "Category", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
  });

  test("should catch validation errors when required fields are missing", async ({
    page,
  }) => {
    // 1. Open the modal
    await page.getByRole("button", { name: "New Category" }).click();

    // Wait for the modal's input field to appear
    await expect(page.getByPlaceholder("Describe your category")).toBeVisible();

    // 2. We intentionally leave "Category Name" completely empty.

    // 3. We fill out the Description to make `isDirty === true`
    await page
      .getByPlaceholder("Describe your category")
      .fill("Making the form dirty to test validation");

    // 4. Now we can click Save
    await page.getByRole("button", { name: "Save", exact: true }).click();

    // 5. Verify react-hook-form catches the empty name and shows the error
    await expect(page.getByText("Category name is required")).toBeVisible();
  });

  // ⭐️ THE MEGA LIFECYCLE: Create -> Update -> Subcategory -> Delete All
  test.describe.serial("Category & Subcategory Complete Lifecycle", () => {
    let rootName: string;
    let updatedRootName: string;
    let subName: string;

    test("1. should create a root category", async ({ page }) => {
      rootName = `Root ${Date.now()}`;

      await page.getByRole("button", { name: "New Category" }).click();
      await expect(page.getByPlaceholder("e.g. Electronics")).toBeVisible();

      await page.getByPlaceholder("e.g. Electronics").fill(rootName);
      await page
        .getByPlaceholder("Describe your category")
        .fill("Initial description");

      await page.getByRole("button", { name: "Save", exact: true }).click();

      await expect(
        page.getByText("Category created successfully!"),
      ).toBeVisible();
      await expect(
        page.locator(".ag-cell-value", { hasText: rootName }).first(),
      ).toBeVisible();
      await expect(
        page.getByText("Category created successfully!"),
      ).toBeHidden();
    });

    test("2. should update the root category", async ({ page }) => {
      updatedRootName = `${rootName} - Edited`;

      // Find the row and click the Pencil icon (the first button in the actions cell)
      const targetRow = page.locator(".ag-row", { hasText: rootName }).first();
      await targetRow.locator("button").first().click();

      // Verify modal opens with existing data
      const nameInput = page.getByPlaceholder("e.g. Electronics");
      await expect(nameInput).toHaveValue(rootName);

      // Update the name
      await nameInput.fill(updatedRootName);
      await page.getByRole("button", { name: "Save", exact: true }).click();

      await expect(
        page.getByText("Category updated successfully!"),
      ).toBeVisible();
      await expect(
        page.locator(".ag-cell-value", { hasText: updatedRootName }).first(),
      ).toBeVisible();
      await expect(
        page.getByText("Category updated successfully!"),
      ).toBeHidden();
    });

    test("3. should create a subcategory under the root", async ({ page }) => {
      subName = `Sub ${Date.now()}`;

      await page.getByRole("button", { name: "New Category" }).click();
      await expect(page.getByPlaceholder("e.g. Electronics")).toBeVisible();

      await page.getByPlaceholder("e.g. Electronics").fill(subName);

      // Select the parent category from the dropdown
      // Assuming your <Select> wraps a native HTML select, we locate it and select by label
      const parentSelect = page.locator('select[name="parentCategoryId"]');
      await parentSelect.selectOption({ label: updatedRootName });

      await page.getByRole("button", { name: "Save", exact: true }).click();

      await expect(
        page.getByText("Category created successfully!"),
      ).toBeVisible();
      await expect(
        page.getByText("Category created successfully!"),
      ).toBeHidden();

      // ⭐️ EXPAND AG GRID TO SEE SUBCATEGORY ⭐️
      const parentRow = page
        .locator(".ag-row", { hasText: updatedRootName })
        .first();

      // Click the AG Grid expander arrow to open the Master/Detail view
      await parentRow.locator(".ag-group-contracted").click();

      // Verify the subcategory appears inside the expanded detail grid
      const detailGrid = page.locator(".ag-details-row");
      await expect(
        detailGrid.locator(".ag-cell-value", { hasText: subName }).first(),
      ).toBeVisible();
    });

    test("4. should delete the subcategory", async ({ page }) => {
      // First, expand the parent row again because the grid resets between tests
      const parentRow = page
        .locator(".ag-row", { hasText: updatedRootName })
        .first();
      await parentRow.locator(".ag-group-contracted").click();

      // Find the subcategory row inside the details grid and click its Trash icon
      const detailGrid = page.locator(".ag-details-row");
      const subRow = detailGrid
        .locator(".ag-row", { hasText: subName })
        .first();
      await subRow.locator("button.text-red-500").first().click();

      await expect(
        page.getByRole("heading", { name: "Delete Category" }),
      ).toBeVisible();
      await page
        .locator("button:not(a > button)", { hasText: "Confirm" })
        .click();

      await expect(
        page.getByText("Category deleted successfully!"),
      ).toBeVisible();

      // Ensure subcategory is gone from the detail grid
      await expect(
        detailGrid.locator(".ag-cell-value", { hasText: subName }),
      ).toBeHidden();
      await expect(
        page.getByText("Category deleted successfully!"),
      ).toBeHidden();
    });

    test("5. should delete the root category", async ({ page }) => {
      const targetRow = page
        .locator(".ag-row", { hasText: updatedRootName })
        .first();

      // Click the Trash icon (red button)
      await targetRow.locator("button.text-red-500").first().click();

      await expect(
        page.getByRole("heading", { name: "Delete Category" }),
      ).toBeVisible();
      await page
        .locator("button:not(a > button)", { hasText: "Confirm" })
        .click();

      await expect(
        page.getByText("Category deleted successfully!"),
      ).toBeVisible();
      await expect(
        page.locator(".ag-cell-value", { hasText: updatedRootName }).first(),
      ).toBeHidden();
    });
  });
});
