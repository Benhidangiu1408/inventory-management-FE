/**
 * Multi-user stocktaking flow
 *
 * Roles:
 *  - Admin  : nam3.nguyen
 *  - Staff  : tuanemtramtinh (the assigned inspector)
 *
 * Flow:
 *  1. Admin logs in → creates IC sheet assigned to tuanemtramtinh → logs out.
 *  2. Staff logs in → opens sheet → starts check → enters scanned qty → completes → logs out.
 *  3. Admin logs in → reviews completed sheet → approves.
 */

import { test, expect, Page } from "@playwright/test";

// ── Credentials ───────────────────────────────────────────────────────────────
const ADMIN = { username: "nam3.nguyen", password: "PlaintextForDemoOnly2" };
const STAFF = { username: "tuanemtramtinh", password: "Anh2004@nh" };

// ── Helpers ───────────────────────────────────────────────────────────────────
async function loginAs(
  page: Page,
  user: { username: string; password: string },
) {
  await page.goto("/login");
  await page.getByPlaceholder("Enter username").fill(user.username);
  await page.getByPlaceholder("Enter your password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/");
}

async function logout(page: Page) {
  // Clear session cookies — middleware will redirect to /login on next navigation
  await page.context().clearCookies();
}

/**
 * Returns a locator scoped to the value cell of a General Information field.
 * Avoids strict-mode violations when the same text appears in the header too.
 */
function generalInfoValue(page: Page, label: string) {
  return page
    .locator("div.text-gray-600", { hasText: label })
    .locator("..")
    .locator("div")
    .last();
}

// ── Tests ─────────────────────────────────────────────────────────────────────
test.describe("Inventory Check - full stocktaking flow (multi-user)", () => {
  test("admin creates and assigns → staff starts and completes → admin approves", async ({
    page,
  }) => {
    // ── PHASE 1: Admin creates IC and assigns to tuanemtramtinh ──────────
    // await loginAs(page, ADMIN);

    await page.goto("/warehouse-management/inventory-check/new");

    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({
      label: "Backup Warehouse (WH-0003)",
    });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

    await page.locator("input[name='plannedDate']").fill("2099-10-01T09:00");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Inventory Check Scheduled!")).toBeVisible({
      timeout: 10_000,
    });

    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    // Grab the detail link of the newest CREATED row assigned to tuanemtramtinh
    const newIcRow = page
      .getByRole("row")
      .filter({ hasText: "tuanemtramtinh" })
      .filter({ hasText: "CREATED" })
      .first();
    const icDetailHref = await newIcRow.getByRole("link").getAttribute("href");
    expect(icDetailHref).toMatch(
      /\/warehouse-management\/inventory-check\/detail\/\d+/,
    );

    await logout(page);

    // ── PHASE 2: Staff opens sheet and starts the inventory check ─────────
    await loginAs(page, STAFF);

    await page.goto(icDetailHref!);

    // Verify sheet details (scoped to General Information — avoids header clash)
    await expect(generalInfoValue(page, "Assignee")).toHaveText(
      "tuanemtramtinh",
    );
    await expect(generalInfoValue(page, "Status")).toHaveText("CREATED");
    await expect(
      page.getByRole("heading", { name: "Ready to Start?" }),
    ).toBeVisible();

    // Only the assignee can start
    await page.getByRole("button", { name: "Start Inventory Check" }).click();

    await expect(page.getByText("Inventory Check Started!")).toBeVisible({
      timeout: 10_000,
    });
    await expect(generalInfoValue(page, "Status")).toHaveText("IN_PROGRESS", {
      timeout: 10_000,
    });
    await expect(
      page.getByRole("button", { name: "Complete Check" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Code" }),
    ).toBeVisible();

    // ── PHASE 2b: Staff enters scanned quantity for first batch ───────────
    // Expand first product row (expand toggle is in col-id "0")
    const firstProductRow = page.getByRole("row").nth(1);
    await firstProductRow.locator("[col-id='0']").click();

    // Scanned-qty input (placeholder "0") appears in the batch sub-row
    const scannedQtyInput = page.getByPlaceholder("0").first();
    await expect(scannedQtyInput).toBeVisible({ timeout: 10_000 });

    await scannedQtyInput.fill("5");
    await scannedQtyInput.blur(); // triggers draftQuantity onChange

    // Save icon becomes enabled once isDirty = true
    const batchSaveBtn = page.locator("[col-id='detailId'] button").first();
    await expect(batchSaveBtn).toBeEnabled({ timeout: 5_000 });
    await batchSaveBtn.click();

    await expect(
      page.getByText("Inventory Check Detail Submitted"),
    ).toBeVisible({ timeout: 10_000 });

    // ── PHASE 2c: Staff completes the check ──────────────────────────────
    await page.getByRole("button", { name: "Complete Check" }).click();

    await expect(
      page.getByRole("heading", { name: "Confirm Stocktaking Completion" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(
      page.getByText("Inventory Check Completed! Ready for review."),
    ).toBeVisible({ timeout: 10_000 });

    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    await logout(page);

    // ── PHASE 3: Admin reviews and approves ───────────────────────────────
    await loginAs(page, ADMIN);

    await page.goto(icDetailHref!);

    await expect(generalInfoValue(page, "Status")).toHaveText("COMPLETED", {
      timeout: 10_000,
    });
    await expect(
      page.getByRole("heading", { name: "Review Required" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Approve" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reject" })).toBeVisible();

    await page.getByRole("button", { name: "Approve" }).click();

    await expect(
      page.getByRole("heading", { name: "Approve Inventory Check Result" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page.getByText("Sheet Approved")).toBeVisible({
      timeout: 10_000,
    });
    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });
  });

  test("staff cannot start a sheet assigned to someone else", async ({
    page,
  }) => {
    // Admin creates IC assigned to nam3.nguyen (not tuanemtramtinh)
    // await loginAs(page, ADMIN);

    await page.goto("/warehouse-management/inventory-check/new");

    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse (WH-0003)" });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "nam3.nguyen (Nguyen nam3)" });

    await page.locator("input[name='plannedDate']").fill("2099-11-01T09:00");

    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    const newRow = page
      .getByRole("row")
      .filter({ hasText: "nam3.nguyen" })
      .filter({ hasText: "CREATED" })
      .first();
    const icHref = await newRow.getByRole("link").getAttribute("href");

    await logout(page);

    // Staff tries to start it
    await loginAs(page, STAFF);
    await page.goto(icHref!);
    await page.getByRole("button", { name: "Start Inventory Check" }).click();

    await expect(
      page.getByText("You're not the assigned employee!"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("only admin (creator) can approve a completed sheet", async ({
    page,
  }) => {
    // Admin creates IC assigned to self so admin can also start/complete it
    // await loginAs(page, ADMIN);

    await page.goto("/warehouse-management/inventory-check/new");

    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Backup Warehouse (WH-0003)" });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "nam3.nguyen (Nguyen nam3)" });

    await page.locator("input[name='plannedDate']").fill("2099-12-01T09:00");

    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    const newRow = page
      .getByRole("row")
      .filter({ hasText: "nam3.nguyen" })
      .filter({ hasText: "CREATED" })
      .first();
    const icHref = await newRow.getByRole("link").getAttribute("href");

    // Admin starts and completes
    await page.goto(icHref!);
    await page.getByRole("button", { name: "Start Inventory Check" }).click();
    await expect(page.getByText("Inventory Check Started!")).toBeVisible({
      timeout: 10_000,
    });
    await page.getByRole("button", { name: "Complete Check" }).click();
    await expect(
      page.getByRole("heading", { name: "Confirm Stocktaking Completion" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(
      page.getByText("Inventory Check Completed! Ready for review."),
    ).toBeVisible({ timeout: 10_000 });
    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    await logout(page);

    // Staff tries to approve — should be denied
    await loginAs(page, STAFF);
    await page.goto(icHref!);
    await expect(page.getByRole("button", { name: "Approve" })).toBeVisible({
      timeout: 10_000,
    });
    await page.getByRole("button", { name: "Approve" }).click();

    await expect(page.getByText("Only the manager can approve!")).toBeVisible({
      timeout: 10_000,
    });
  });
});
