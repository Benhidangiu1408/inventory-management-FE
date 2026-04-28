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
import { addMinutes, format, startOfMinute } from "date-fns";

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
    // Retry: a re-render triggered by subsequent field interactions can reset
    // the controlled <select> back to its default before RHF commits the value.
    await expect(async () => {
      await warehouseSelect.selectOption({ label: "Test Warehouse (WH-0006)" });
      await expect(warehouseSelect).not.toHaveValue("");
    }).toPass({ timeout: 10_000 });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

    // Target Products (Optional) — pick a deterministic test product
    const targetProductsField = page
      .locator("label", { hasText: "Target Products (Optional)" })
      .locator("..");
    await targetProductsField.getByText("Select options...").click();
    await page.getByText("Test Product (PRD-0052)").click();

    const planned = addMinutes(new Date(), 20);
    const formatted = format(planned, "yyyy-MM-dd'T'HH:mm"); // datetime-local rejects seconds
    // Grid stores the value with no seconds → appends "Z" → displays ":00" seconds.
    // startOfMinute zeroes seconds so displayedPlanned matches the grid exactly.
    const displayedPlanned = format(
      startOfMinute(planned),
      "MMM d, yyyy h:mm:ss a",
    );

    await page.locator("input[name='plannedDate']").fill(formatted);

    await page.getByRole("button", { name: "Save" }).click();

    // await expect(page.getByText("Inventory Check Scheduled!")).toBeVisible({
    //   timeout: 30_000,
    // });

    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    // AG Grid pagination: show more rows so the newly created sheet is visible
    await expect(page.locator(".ag-root-wrapper")).toBeVisible({
      timeout: 20_000,
    });
    await page.locator("select").last().selectOption("100");

    // Filter by the computed display date — unique per test-run minute
    const newIcRow = page
      .getByRole("row")
      .filter({ hasText: displayedPlanned })
      .first();
    await expect(newIcRow).toBeVisible({ timeout: 15_000 });
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
      timeout: 30_000,
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

    await scannedQtyInput.fill("20");
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

  test("admin creates and assigns → staff starts and completes → admin rejects", async ({
    page,
  }) => {
    // ── PHASE 1: Admin creates IC and assigns to tuanemtramtinh ──────────
    // await loginAs(page, ADMIN);

    await page.goto("/warehouse-management/inventory-check/new");

    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    // Retry: a re-render triggered by subsequent field interactions can reset
    // the controlled <select> back to its default before RHF commits the value.
    await expect(async () => {
      await warehouseSelect.selectOption({ label: "Test Warehouse (WH-0006)" });
      await expect(warehouseSelect).not.toHaveValue("");
    }).toPass({ timeout: 10_000 });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

    // Target Products (Optional) — pick a deterministic test product
    const targetProductsField = page
      .locator("label", { hasText: "Target Products (Optional)" })
      .locator("..");
    await targetProductsField.getByText("Select options...").click();
    await page.getByText("Test Product (PRD-0052)").click();

    const planned = addMinutes(new Date(), 10);
    const formatted = format(planned, "yyyy-MM-dd'T'HH:mm");
    const displayedPlanned = format(
      startOfMinute(planned),
      "MMM d, yyyy h:mm:ss a",
    );

    await page.locator("input[name='plannedDate']").fill(formatted);

    await page.getByRole("button", { name: "Save" }).click();
    // await expect(page.getByText("Inventory Check Scheduled!")).toBeVisible({
    //   timeout: 30_000,
    // });
    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    // AG Grid pagination: show more rows so the newly created sheet is visible
    await expect(page.locator(".ag-root-wrapper")).toBeVisible({
      timeout: 10_000,
    });
    await page.locator("select").last().selectOption("100");

    // Filter by the computed display date — unique per test-run minute
    const newIcRow = page
      .getByRole("row")
      .filter({ hasText: displayedPlanned })
      .first();
    await expect(newIcRow).toBeVisible({ timeout: 15_000 });
    const icDetailHref = await newIcRow.getByRole("link").getAttribute("href");
    expect(icDetailHref).toMatch(
      /\/warehouse-management\/inventory-check\/detail\/\d+/,
    );

    await logout(page);

    // ── PHASE 2: Staff opens sheet and completes the inventory check ─────
    await loginAs(page, STAFF);
    await page.goto(icDetailHref!);

    await expect(generalInfoValue(page, "Assignee")).toHaveText(
      "tuanemtramtinh",
    );
    await expect(generalInfoValue(page, "Status")).toHaveText("CREATED");

    await page.getByRole("button", { name: "Start Inventory Check" }).click();
    await expect(page.getByText("Inventory Check Started!")).toBeVisible({
      timeout: 30_000,
    });
    await expect(generalInfoValue(page, "Status")).toHaveText("IN_PROGRESS", {
      timeout: 10_000,
    });
    await expect(
      page.getByRole("columnheader", { name: "Code" }),
    ).toBeVisible();

    // Expand first product row and submit scanned quantity
    const firstProductRow = page.getByRole("row").nth(1);
    await firstProductRow.locator("[col-id='0']").click();
    const scannedQtyInput = page.getByPlaceholder("0").first();
    await expect(scannedQtyInput).toBeVisible({ timeout: 10_000 });
    await scannedQtyInput.fill("20");
    await scannedQtyInput.blur();

    const batchSaveBtn = page.locator("[col-id='detailId'] button").first();
    await expect(batchSaveBtn).toBeEnabled({ timeout: 5_000 });
    await batchSaveBtn.click();
    await expect(
      page.getByText("Inventory Check Detail Submitted"),
    ).toBeVisible({ timeout: 10_000 });

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

    // ── PHASE 3: Admin reviews and rejects ───────────────────────────────
    await loginAs(page, ADMIN);
    await page.goto(icDetailHref!);

    await expect(generalInfoValue(page, "Status")).toHaveText("COMPLETED", {
      timeout: 10_000,
    });
    await expect(
      page.getByRole("heading", { name: "Review Required" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Reject" }).click();
    await expect(
      page.getByRole("heading", { name: "Reject Inventory Check Result" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page.getByText("Sheet Rejected")).toBeVisible({
      timeout: 10_000,
    });
    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });
  });

  // test("admin creates and assigns → staff starts and completes → check has faulty → admin rejects", async ({
  //   page,
  // }) => {
  //   // ── PHASE 1: Admin creates IC and assigns to tuanemtramtinh ──────────
  //   // await loginAs(page, ADMIN);

  //   await page.goto("/warehouse-management/inventory-check/new");

  //   const warehouseSelect = page.locator("select[name='warehouseId']");
  //   await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
  //   // Retry: a re-render triggered by subsequent field interactions can reset
  //   // the controlled <select> back to its default before RHF commits the value.
  //   await expect(async () => {
  //     await warehouseSelect.selectOption({ label: "Test Warehouse (WH-0006)" });
  //     await expect(warehouseSelect).not.toHaveValue("");
  //   }).toPass({ timeout: 10_000 });

  //   await page
  //     .locator("select[name='assignedUserId']")
  //     .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

  //   // Target Products (Optional) — pick a deterministic test product
  //   const targetProductsField = page
  //     .locator("label", { hasText: "Target Products (Optional)" })
  //     .locator("..");
  //   await targetProductsField.getByText("Select options...").click();
  //   await page.getByText("Test Product (PRD-0052)").click();

  //   const planned = addMinutes(new Date(), 11);
  //   const formatted = format(planned, "yyyy-MM-dd'T'HH:mm");
  //   const displayedPlanned = format(
  //     startOfMinute(planned),
  //     "MMM d, yyyy h:mm:ss a",
  //   );

  //   await page.locator("input[name='plannedDate']").fill(formatted);

  //   await page.getByRole("button", { name: "Save" }).click();
  //   // await expect(page.getByText("Inventory Check Scheduled!")).toBeVisible({
  //   //   timeout: 30_000,
  //   // });
  //   await page.waitForURL("/warehouse-management/inventory-check", {
  //     timeout: 15_000,
  //   });

  //   // AG Grid pagination: show more rows so the newly created sheet is visible
  //   await expect(page.locator(".ag-root-wrapper")).toBeVisible({
  //     timeout: 10_000,
  //   });
  //   await page.locator("select").last().selectOption("100");

  //   // Filter by the computed display date — unique per test-run minute
  //   const newIcRow = page
  //     .getByRole("row")
  //     .filter({ hasText: displayedPlanned })
  //     .first();
  //   await expect(newIcRow).toBeVisible({ timeout: 15_000 });
  //   const icDetailHref = await newIcRow.getByRole("link").getAttribute("href");
  //   expect(icDetailHref).toMatch(
  //     /\/warehouse-management\/inventory-check\/detail\/\d+/,
  //   );

  //   await logout(page);

  //   // ── PHASE 2: Staff opens sheet and completes the inventory check ─────
  //   await loginAs(page, STAFF);
  //   await page.goto(icDetailHref!);

  //   await expect(generalInfoValue(page, "Assignee")).toHaveText(
  //     "tuanemtramtinh",
  //   );
  //   await expect(generalInfoValue(page, "Status")).toHaveText("CREATED");

  //   await page.getByRole("button", { name: "Start Inventory Check" }).click();
  //   await expect(page.getByText("Inventory Check Started!")).toBeVisible({
  //     timeout: 30_000,
  //   });
  //   await expect(generalInfoValue(page, "Status")).toHaveText("IN_PROGRESS", {
  //     timeout: 10_000,
  //   });
  //   await expect(
  //     page.getByRole("columnheader", { name: "Code" }),
  //   ).toBeVisible();

  //   // Expand first product row and submit scanned quantity
  //   const firstProductRow = page.getByRole("row").nth(1);
  //   await firstProductRow.locator("[col-id='0']").click();

  //   // const scannedQtyInput = page.getByPlaceholder("0").first();
  //   // await expect(scannedQtyInput).toBeVisible({ timeout: 10_000 });
  //   // await scannedQtyInput.fill("20");
  //   // await scannedQtyInput.blur();

  //   const hasFaulty = page.getByRole("checkbox").first();
  //   await hasFaulty.check();

  //   const batchSaveBtn = page.locator("[col-id='detailId'] button").first();
  //   await expect(batchSaveBtn).toBeEnabled({ timeout: 5_000 });
  //   await batchSaveBtn.click();
  //   await expect(
  //     page.getByText("Inventory Check Detail Submitted"),
  //   ).toBeVisible({ timeout: 10_000 });

  //   await page.getByRole("button", { name: "Complete Check" }).click();
  //   await expect(
  //     page.getByRole("heading", { name: "Confirm Stocktaking Completion" }),
  //   ).toBeVisible();
  //   await page.getByRole("button", { name: "Confirm" }).click();
  //   await expect(
  //     page.getByText("Inventory Check Completed! Ready for review."),
  //   ).toBeVisible({ timeout: 10_000 });
  //   await page.waitForURL("/warehouse-management/inventory-check", {
  //     timeout: 15_000,
  //   });

  //   await logout(page);

  //   // ── PHASE 3: Admin reviews and rejects ───────────────────────────────
  //   await loginAs(page, ADMIN);
  //   await page.goto(icDetailHref!);

  //   await expect(generalInfoValue(page, "Status")).toHaveText("COMPLETED", {
  //     timeout: 10_000,
  //   });
  //   await expect(
  //     page.getByRole("heading", { name: "Review Required" }),
  //   ).toBeVisible();

  //   await page.getByRole("button", { name: "Reject" }).click();
  //   await expect(
  //     page.getByRole("heading", { name: "Reject Inventory Check Result" }),
  //   ).toBeVisible();
  //   await page.getByRole("button", { name: "Confirm" }).click();

  //   await expect(page.getByText("Sheet Rejected")).toBeVisible({
  //     timeout: 10_000,
  //   });
  //   await page.waitForURL("/warehouse-management/inventory-check", {
  //     timeout: 15_000,
  //   });
  // });

  test("staff cannot start a sheet assigned to someone else", async ({
    page,
  }) => {
    // Admin creates IC assigned to nam3.nguyen (not tuanemtramtinh)
    // await loginAs(page, ADMIN);

    await page.goto("/warehouse-management/inventory-check/new");

    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect.selectOption({ label: "Test Warehouse (WH-0006)" });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "nam3.nguyen (Nguyen nam3)" });

    await page.locator("input[name='plannedDate']").fill("2099-11-01T09:00");

    await page.getByRole("button", { name: "Save" }).click();
    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    await expect(page.locator(".ag-root-wrapper")).toBeVisible({
      timeout: 10_000,
    });
    const pageSizeSelect = page.locator("select").last();
    await pageSizeSelect.selectOption("100");

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

  test("staff full flow import -> inventory check -> input quantity < quantity-expected -> approve", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    // Wait for supplier dropdown to load
    const warehouseSelect1 = page.locator("select").nth(0);
    await expect(warehouseSelect1).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect1.selectOption({ label: "Test Warehouse" });

    const supplierSelect = page.locator("select").nth(1);
    await expect(supplierSelect).toBeEnabled({ timeout: 10_000 });

    // Select the first real supplier (skip both placeholder entries)
    const firstSupplierValue = await supplierSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await supplierSelect.selectOption({ value: firstSupplierValue! });

    await page.getByRole("button", { name: "Create" }).click();

    // Should redirect to quantity-check step
    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quantity-check/, {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(
      /\/import\/process\/supplier\/\d+\/quantity-check/,
    );

    // --- Step 2: Add first product with pick quantity 10 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    // Expand page size so row index 15 is rendered.
    // The pagination <select> is a sibling of [role=grid], not inside it, so
    // pickerGrid.locator("select") would resolve to the Unit selects in the rows.
    // Use CSS :has() to target the page-size select by its numeric options instead.
    await page
      .locator('select:has(option[value="100"])')
      .first()
      .selectOption("100");

    const firstProductRow = pickerGrid.locator("[role=row]").nth(17);
    // Click the cell — AG Grid's click handler lives on the wrapper, not the <input>
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("10");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Set actual quantity equal to expected (variance = 0) ---
    const qtyCheckGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Actual Quantity" }),
    });

    const firstCheckRow = qtyCheckGrid.locator("[role=row]").nth(1);
    const actualQtyInput = firstCheckRow.locator(
      "[col-id=actualQuantity] input",
    );

    await actualQtyInput.scrollIntoViewIfNeeded();
    await actualQtyInput.click({ clickCount: 3 });
    await actualQtyInput.fill("10");

    // Blur to trigger variance calculation
    await firstCheckRow.locator("[col-id=expectedQuantity]").click();

    await expect(firstCheckRow.locator("[col-id=variance]")).toHaveText("0");

    // --- Step 4: Confirm quantity check ---
    await page.getByRole("button", { name: "Confirm Check Quantity" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Should advance to quality-check step
    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quality-check/, {
      timeout: 15_000,
    });

    // --- Step 5: Set quality status to PASSED for all batches ---
    const qcGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Quality Status" }),
    });

    const firstBatchRow = qcGrid.locator("[role=row]").nth(1);
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .scrollIntoViewIfNeeded();
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .selectOption("PASSED");

    // --- Step 6: Confirm quality check ---
    await page.getByRole("button", { name: "Confirm Check Quality" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Should advance to storage-location step
    await page.waitForURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
      {
        timeout: 15_000,
      },
    );

    // --- Step 7: Pick the last available location for the passed batch ---
    const passedGrid = page
      .locator("[role=grid]")
      .filter({
        has: page.getByRole("columnheader", { name: "Storage Location" }),
      })
      .first();

    const firstPassedRow = passedGrid.locator("[role=row]").nth(1);
    const locationSelect = firstPassedRow.locator(
      "[col-id=storageLocation] select",
    );
    await locationSelect.scrollIntoViewIfNeeded();

    // Select the last non-placeholder option
    const locationOptions = locationSelect.locator(
      "option[value]:not([value=''])",
    );
    const lastValue = await locationOptions.last().getAttribute("value");
    await locationSelect.selectOption(lastValue!);

    // --- Step 8: Confirm storage location ---
    await page
      .getByRole("button", { name: "Confirm Storage Location" })
      .click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Page remains on storage-location after completion
    await expect(page).toHaveURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
    );

    // Success toast should appear
    await expect(page.getByText("Storage Location Successfully")).toBeVisible();

    // ── PHASE 1: Admin creates IC and assigns to tuanemtramtinh ──────────
    // await loginAs(page, ADMIN);

    await page.goto("/warehouse-management/inventory-check/new");

    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    // Retry: a re-render triggered by subsequent field interactions can reset
    // the controlled <select> back to its default before RHF commits the value.
    await expect(async () => {
      await warehouseSelect.selectOption({ label: "Test Warehouse (WH-0006)" });
      await expect(warehouseSelect).not.toHaveValue("");
    }).toPass({ timeout: 10_000 });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

    // Target Products (Optional) — pick a deterministic test product
    const targetProductsField = page
      .locator("label", { hasText: "Target Products (Optional)" })
      .locator("..");
    await targetProductsField.getByText("Select options...").click();
    await page.getByText("Test image (PRD-0046)").click();

    const planned = addMinutes(new Date(), 20);
    const formatted = format(planned, "yyyy-MM-dd'T'HH:mm"); // datetime-local rejects seconds
    // Grid stores the value with no seconds → appends "Z" → displays ":00" seconds.
    // startOfMinute zeroes seconds so displayedPlanned matches the grid exactly.
    const displayedPlanned = format(
      startOfMinute(planned),
      "MMM d, yyyy h:mm:ss a",
    );

    await page.locator("input[name='plannedDate']").fill(formatted);

    await page.getByRole("button", { name: "Save" }).click();

    // await expect(page.getByText("Inventory Check Scheduled!")).toBeVisible({
    //   timeout: 30_000,
    // });

    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    // AG Grid pagination: show more rows so the newly created sheet is visible
    await expect(page.locator(".ag-root-wrapper")).toBeVisible({
      timeout: 20_000,
    });
    await page.locator("select").last().selectOption("100");

    // Filter by the computed display date — unique per test-run minute
    const newIcRow = page
      .getByRole("row")
      .filter({ hasText: displayedPlanned })
      .first();
    await expect(newIcRow).toBeVisible({ timeout: 15_000 });
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
      timeout: 30_000,
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
    const firstProductRow1 = page.getByRole("row").nth(1);
    await firstProductRow1.locator("[col-id='0']").click();

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

  test("staff full flow import -> inventory check -> check faulty -> approve", async ({
    page,
  }) => {
    // --- Step 1: Create import sheet with existing supplier ---
    await page.goto("/import/new");

    // Wait for supplier dropdown to load
    const warehouseSelect1 = page.locator("select").nth(0);
    await expect(warehouseSelect1).toBeEnabled({ timeout: 10_000 });
    await warehouseSelect1.selectOption({ label: "Test Warehouse" });

    const supplierSelect = page.locator("select").nth(1);
    await expect(supplierSelect).toBeEnabled({ timeout: 10_000 });

    // Select the first real supplier (skip both placeholder entries)
    const firstSupplierValue = await supplierSelect
      .locator("option[value]:not([value=''])")
      .first()
      .getAttribute("value");
    await supplierSelect.selectOption({ value: firstSupplierValue! });

    await page.getByRole("button", { name: "Create" }).click();

    // Should redirect to quantity-check step
    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quantity-check/, {
      timeout: 15_000,
    });
    await expect(page).toHaveURL(
      /\/import\/process\/supplier\/\d+\/quantity-check/,
    );

    // --- Step 2: Add first product with pick quantity 10 ---
    await page.getByRole("button", { name: "Add" }).click();

    const pickerGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Pick Quantity" }),
    });
    await pickerGrid.waitFor({ state: "visible" });

    // Expand page size so row index 15 is rendered.
    // The pagination <select> is a sibling of [role=grid], not inside it, so
    // pickerGrid.locator("select") would resolve to the Unit selects in the rows.
    // Use CSS :has() to target the page-size select by its numeric options instead.
    await page
      .locator('select:has(option[value="100"])')
      .first()
      .selectOption("100");

    const firstProductRow = pickerGrid.locator("[role=row]").nth(17);
    // Click the cell — AG Grid's click handler lives on the wrapper, not the <input>
    await firstProductRow.locator("[col-id=checkBox]").click();

    const pickQtyInput = firstProductRow.locator("[col-id=pickQuantity] input");
    await pickQtyInput.click({ clickCount: 3 });
    await pickQtyInput.fill("10");

    await page.getByRole("button", { name: "Save Changes" }).click();
    await pickerGrid.waitFor({ state: "hidden" });

    // --- Step 3: Set actual quantity equal to expected (variance = 0) ---
    const qtyCheckGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Actual Quantity" }),
    });

    const firstCheckRow = qtyCheckGrid.locator("[role=row]").nth(1);
    const actualQtyInput = firstCheckRow.locator(
      "[col-id=actualQuantity] input",
    );

    await actualQtyInput.scrollIntoViewIfNeeded();
    await actualQtyInput.click({ clickCount: 3 });
    await actualQtyInput.fill("10");

    // Blur to trigger variance calculation
    await firstCheckRow.locator("[col-id=expectedQuantity]").click();

    await expect(firstCheckRow.locator("[col-id=variance]")).toHaveText("0");

    // --- Step 4: Confirm quantity check ---
    await page.getByRole("button", { name: "Confirm Check Quantity" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Should advance to quality-check step
    await page.waitForURL(/\/import\/process\/supplier\/\d+\/quality-check/, {
      timeout: 15_000,
    });

    // --- Step 5: Set quality status to PASSED for all batches ---
    const qcGrid = page.locator("[role=grid]").filter({
      has: page.getByRole("columnheader", { name: "Quality Status" }),
    });

    const firstBatchRow = qcGrid.locator("[role=row]").nth(1);
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .scrollIntoViewIfNeeded();
    await firstBatchRow
      .locator("[col-id=qualityStatus] select")
      .selectOption("PASSED");

    // --- Step 6: Confirm quality check ---
    await page.getByRole("button", { name: "Confirm Check Quality" }).click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Should advance to storage-location step
    await page.waitForURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
      {
        timeout: 15_000,
      },
    );

    // --- Step 7: Pick the last available location for the passed batch ---
    const passedGrid = page
      .locator("[role=grid]")
      .filter({
        has: page.getByRole("columnheader", { name: "Storage Location" }),
      })
      .first();

    const firstPassedRow = passedGrid.locator("[role=row]").nth(1);
    const locationSelect = firstPassedRow.locator(
      "[col-id=storageLocation] select",
    );
    await locationSelect.scrollIntoViewIfNeeded();

    // Select the last non-placeholder option
    const locationOptions = locationSelect.locator(
      "option[value]:not([value=''])",
    );
    const lastValue = await locationOptions.last().getAttribute("value");
    await locationSelect.selectOption(lastValue!);

    // --- Step 8: Confirm storage location ---
    await page
      .getByRole("button", { name: "Confirm Storage Location" })
      .click();
    await page.getByRole("button", { name: "Confirm", exact: true }).click();

    // Page remains on storage-location after completion
    await expect(page).toHaveURL(
      /\/import\/process\/supplier\/\d+\/storage-location/,
    );

    // Success toast should appear
    await expect(page.getByText("Storage Location Successfully")).toBeVisible();

    // ── PHASE 1: Admin creates IC and assigns to tuanemtramtinh ──────────
    // await loginAs(page, ADMIN);

    await page.goto("/warehouse-management/inventory-check/new");

    const warehouseSelect = page.locator("select[name='warehouseId']");
    await expect(warehouseSelect).toBeEnabled({ timeout: 10_000 });
    // Retry: a re-render triggered by subsequent field interactions can reset
    // the controlled <select> back to its default before RHF commits the value.
    await expect(async () => {
      await warehouseSelect.selectOption({ label: "Test Warehouse (WH-0006)" });
      await expect(warehouseSelect).not.toHaveValue("");
    }).toPass({ timeout: 10_000 });

    await page
      .locator("select[name='assignedUserId']")
      .selectOption({ label: "tuanemtramtinh (Nguyen Anh)" });

    // Target Products (Optional) — pick a deterministic test product
    const targetProductsField = page
      .locator("label", { hasText: "Target Products (Optional)" })
      .locator("..");
    await targetProductsField.getByText("Select options...").click();
    await page.getByText("Test image (PRD-0046)").click();

    const planned = addMinutes(new Date(), 15);
    const formatted = format(planned, "yyyy-MM-dd'T'HH:mm"); // datetime-local rejects seconds
    // Grid stores the value with no seconds → appends "Z" → displays ":00" seconds.
    // startOfMinute zeroes seconds so displayedPlanned matches the grid exactly.
    const displayedPlanned = format(
      startOfMinute(planned),
      "MMM d, yyyy h:mm:ss a",
    );

    await page.locator("input[name='plannedDate']").fill(formatted);

    await page.getByRole("button", { name: "Save" }).click();

    // await expect(page.getByText("Inventory Check Scheduled!")).toBeVisible({
    //   timeout: 30_000,
    // });

    await page.waitForURL("/warehouse-management/inventory-check", {
      timeout: 15_000,
    });

    // AG Grid pagination: show more rows so the newly created sheet is visible
    await expect(page.locator(".ag-root-wrapper")).toBeVisible({
      timeout: 20_000,
    });
    await page.locator("select").last().selectOption("100");

    // Filter by the computed display date — unique per test-run minute
    const newIcRow = page
      .getByRole("row")
      .filter({ hasText: displayedPlanned })
      .first();
    await expect(newIcRow).toBeVisible({ timeout: 15_000 });
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
      timeout: 30_000,
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
    const firstProductRow1 = page.getByRole("row").nth(1);
    await firstProductRow1.locator("[col-id='0']").click();

    // // Scanned-qty input (placeholder "0") appears in the batch sub-row
    // const scannedQtyInput = page.getByPlaceholder("0").first();
    // await expect(scannedQtyInput).toBeVisible({ timeout: 10_000 });

    // await scannedQtyInput.fill("5");
    // await scannedQtyInput.blur(); // triggers draftQuantity onChange

    const hasFaulty = page.getByRole("checkbox").first();
    await hasFaulty.check();

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
});
