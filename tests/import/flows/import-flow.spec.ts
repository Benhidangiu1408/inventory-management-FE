import test, { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Import 3-step flow", () => {
  let sheetId: string;
  let sheetType: string;

  test.beforeAll(async ({ browser }) => {
    // Tạo context mới với auth state để đảm bảo đã đăng nhập
    const context = await browser.newContext({
      storageState: "playwright/.auth/user.json",
    });
    const page = await context.newPage();

    await page.goto("/import/new");

    await page.getByRole("button", { name: "New supplier" }).click();
    await page
      .getByRole("textbox", { name: "Supplier name *" })
      .waitFor({ state: "visible" });
    await page
      .getByRole("textbox", { name: "Supplier name *" })
      .fill(faker.company.name());
    await page
      .getByRole("textbox", { name: "Email *" })
      .fill(faker.internet.email());
    await page
      .getByRole("textbox", { name: "Phone number *" })
      .fill("09" + faker.string.numeric(8));
    await page
      .getByRole("textbox", { name: "Address *" })
      .fill(faker.location.streetAddress());

    // Chờ redirect về /import sau khi tạo thành công
    // (Server Action gọi API phía server nên không thể dùng waitForResponse)
    await Promise.all([
      page.waitForURL("**/import"),
      page.getByRole("button", { name: "Create" }).click(),
    ]);

    // Lấy ID của phiếu vừa tạo từ dòng cuối bảng
    await page.waitForSelector("[role=grid]");
    await page.locator(".flex.gap-1 > button:nth-child(2)").click();
    await page.waitForLoadState("networkidle");

    const lastRow = page
      .getByRole("row")
      .filter({ hasNot: page.getByRole("columnheader") })
      .last();
    sheetId =
      (await lastRow.getByRole("gridcell").first().textContent())?.trim() ?? "";
    sheetType = "supplier";

    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(`/import/process/${sheetType}/${sheetId}/quantity-check`);
  });

  test("should access Quantity Check page", async ({ page }) => {
    await expect(page).toHaveURL(
      `/import/process/${sheetType}/${sheetId}/quantity-check`,
    );
  });

  test("should complete Quantity Check step with zero variance", async ({
    page,
  }) => {
    // --- Add a product ---
    await page.getByRole("button", { name: "Add" }).click();

    // Wait for the product selection modal (identified by Save Changes button)
    const saveChangesButton = page.getByRole("button", {
      name: "Save Changes",
    });
    await saveChangesButton.waitFor({ state: "visible" });

    // The modal grid is uniquely identified by its "Pick Quantity" column header
    const modalGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    const firstProductRow = modalGrid.getByRole("row").nth(1);
    await firstProductRow.getByRole("gridcell").first().click();
    await firstProductRow.getByRole("spinbutton").fill("10");

    await saveChangesButton.click();
    await saveChangesButton.waitFor({ state: "hidden" });

    // --- Fill actual quantity to match expected (variance = 0) ---
    const quantityCheckGrid = page.locator("[role=grid]").nth(1);
    const actualQtyInput = quantityCheckGrid
      .locator("[col-id=actualQuantity] input[type=number]")
      .first();

    await actualQtyInput.scrollIntoViewIfNeeded();
    await actualQtyInput.click();
    await actualQtyInput.selectText();
    await actualQtyInput.fill("10");

    // Blur to trigger onBlur and update variance in React state
    await quantityCheckGrid
      .locator("[col-id=expectedQuantity]")
      .first()
      .click();

    // Variance should be 0
    await expect(
      quantityCheckGrid.locator("[role=gridcell][col-id=variance]").first(),
    ).toHaveText("0");

    // --- Confirm quantity check ---
    await page.getByRole("button", { name: "Confirm Check Quantity" }).click();

    // Confirmation dialog
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Should advance to quality-check step
    await expect(page).toHaveURL(
      `/import/process/${sheetType}/${sheetId}/quality-check`,
    );
  });

  test("should complete Quality Check with all Passed Batches", async ({
    page,
  }) => {});
});
