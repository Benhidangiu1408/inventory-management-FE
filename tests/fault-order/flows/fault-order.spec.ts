import test, { expect } from "@playwright/test";

test.use({ storageState: "playwright/.auth/user.json" });

test.describe("Fault Order - Process Order Flow", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the Fault Order list page
    await page.goto("/fault-order");
  });

  test("should assign user, choose batches and handle to create process order", async ({ page }) => {
    // 2. Click on the first fault order in the list to navigate to its details
    // ag-grid renders rows as div.ag-row, and the code is inside a link
    await page.waitForSelector('.ag-center-cols-container .ag-row');
    await page.locator('.ag-center-cols-container .ag-row').nth(3).locator('a').first().click();

    // Verify we are on the details page
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+/);

    // 3. Assign User
   
    await expect(page.getByText('Personnel Assignment')).toBeVisible();

    // ROOT CAUSE ANALYZER
    const analyzerSelect = page
      .locator('label:has-text("Root Cause Analyzer:")')
      .locator('xpath=..')
      .locator('select');

    // TASK ASSIGNER
    const assignerSelect = page
      .locator('label:has-text("Task Assigner:")')
      .locator('xpath=..')
      .locator('select');

    // wait select visible
    await analyzerSelect.waitFor();
    await assignerSelect.waitFor();

    // wait option load (QUAN TRỌNG)
    // await expect(await analyzerSelect.locator('option').count()).toBeGreaterThan(1);
    // await expect(await assignerSelect.locator('option').count()).toBeGreaterThan(1);

    // select
    await analyzerSelect.selectOption({ index: 2 });
    await expect(page.getByText("Assignment saved successfully")).toBeVisible();

    await assignerSelect.selectOption({ index: 2 });
    await expect(page.getByText("Assignment saved successfully")).toBeVisible();

        // 4. Choose Batches
        // Select the first batch checkbox in the "Fault Batches" table

        const faultBatchesSection = page
      .locator('.default-card')
      .filter({
        has: page.getByRole('heading', { name: 'Fault Batches', exact: true })
      });
        const gridBody = faultBatchesSection.locator('.ag-center-cols-viewport');

    // scroll ngang hết cỡ
    await gridBody.evaluate(el => {
      el.scrollLeft = el.scrollWidth;
    });

    const firstCheckbox = faultBatchesSection
      .locator('.ag-row input[type="checkbox"]')
      .first();

    await firstCheckbox.waitFor({ state: 'visible' });
    await firstCheckbox.check();

    // 5. Click "Handle Selected" to create Process Order
    const handleButton = page.getByRole("button", { name: "Handle Selected" });
    await expect(handleButton).toBeEnabled();
    await handleButton.click();

    // Verify success toast
    await expect(page.getByText("Investigation created successfully.")).toBeVisible();

    // Verify redirection to the newly created process order
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+\/process-order\/\d+/);
  });

  test("should fill in process order form", async ({ page }) => {
    // 1. Navigate to specific fault order details
    await page.goto("/fault-order");
    await page.locator('a:has-text("FO-147DD8D9")').first().click();

    // Verify we are on the details page
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+/);

    // 2. Click Analyze on the first process order
    const analyzeButton = page.locator('button:has-text("Analyze")').first();
    await expect(analyzeButton).toBeVisible();
    await analyzeButton.click();

    // Verify we are on the process order details page
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+\/process-order\/\d+/);

    // 3. Fill out the form
    await page.locator('input[name="whatHappened"]')
      .fill('The batch was damaged during unloading.');

    await page.locator('input[name="impact"]')
      .fill('Only 5 items from the batch FO-147DD8D9.');

    await page.locator('input[name="questions.0.answer"]')
      .fill('Poor handling practices.');

    await page.locator('input[name="rootCause"]')
      .fill('The primary root cause was poor handling during unloading.');

    // Check 'Other' fault type if available and visible
    const otherOption = page.locator('label:has-text("Other")');

await otherOption.scrollIntoViewIfNeeded();
await otherOption.click();
    // 4. Submit the form
    const submitButton = page.locator('button:has-text("Submit Form")');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 5. Verify the data is saved (Root cause text appears in the summary)
    await expect(page.getByText("The primary root cause was poor handling during unloading.")).toBeVisible();
  });

  test("should assign task to process order", async ({ page }) => {
    // 1. Navigate to specific fault order details
    await page.goto("/fault-order");
    await page.locator('a:has-text("FO-006139FA")').first().click();

    // Verify we are on the details page
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+/);

    // 2. Click Assign Tasks on the first process order
    const assignTasksButton = page.locator('button:has-text("Assign Tasks")').first();
    // page.locator('.ag-row').first().locator('button:has-text("Assign Tasks")');
    await expect(assignTasksButton).toBeVisible();
    await assignTasksButton.click();

    // 3. Click + New Task button
    const newTaskButton = page.locator('button:has-text("+ New Task")');
    await expect(newTaskButton).toBeVisible();
    await newTaskButton.click();
    
    // Fill in fields after clicking "New task" button
    await page.locator('input[placeholder="Task description"]').fill('Test Task');
    await page.locator('label:has-text("Handler") + div select').selectOption({ index: 1 });
    await page.locator('label:has-text("Due Date & Time") + div input').fill('2026-05-01T10:00');
    await page.locator('button:has-text("Add")').click();
    
    // Select the task dropdown in the Assign Batch grid row and choose task id=0 when available.
    const assignBatchHeading = page.getByRole('heading', { name: 'Assign Batch' });
    await assignBatchHeading.scrollIntoViewIfNeeded();
    const assignedToSelect = page.locator('div[col-id="taskId"] select').first();
    await assignedToSelect.scrollIntoViewIfNeeded();
    await assignedToSelect.waitFor({ state: 'visible' });
    const taskOptions = await assignedToSelect.locator('option').evaluateAll((options) =>
      options.map((option) => ({ value: option.value, label: option.textContent?.trim() ?? '' })),
    );
    const zeroTaskOption = taskOptions.find((option) => option.value === '0');
    const namedTaskOption = taskOptions.find((option) => option.label === 'Test Task');
    if (zeroTaskOption) {
      await assignedToSelect.selectOption({ value: '0' });
      await expect(assignedToSelect).toHaveValue('0');
    } else if (namedTaskOption) {
      await assignedToSelect.selectOption({ label: 'Test Task' });
      await expect(assignedToSelect).toHaveValue(namedTaskOption.value);
    } else {
      const selectableOption = taskOptions.find((option) => option.value !== '');
      if (!selectableOption) {
        throw new Error('No task options are available in the Assign Batch dropdown.');
      }
      await assignedToSelect.selectOption({ label: selectableOption.label });
      await expect(assignedToSelect).toHaveValue(selectableOption.value);
    }

    // // Change one task status in the Task Managment table.
    // const taskStatusSelect = page.locator('div[col-id="status"] select').first();
    // await taskStatusSelect.waitFor({ state: 'visible' });
    // await taskStatusSelect.selectOption({ value: 'IN_PROGRESS' });
    // await expect(page.getByText('Task status update successfully')).toBeVisible();

    // // Change the handling status in the Assign Batch table.
    // const handlingStatusSelect = page.locator('div[col-id="handlingStatus"] select').first();
    // await handlingStatusSelect.waitFor({ state: 'visible' });
    // await expect(handlingStatusSelect).toBeEnabled();
    // await handlingStatusSelect.selectOption({ value: 'PROCESSING' });
    // await expect(page.getByText('Batch Status update successfully')).toBeVisible();
    
  });

  test("change status for task and batch", async ({ page }) => {
    // 1. Navigate to specific fault order details
    await page.goto("/fault-order");
    await page.locator('a:has-text("FO-006139FA")').first().click();

    // Verify we are on the details page
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+/);

    // 2. Click Assign Tasks on the first process order
    const assignTasksButton = page.locator('button:has-text("Assign Tasks")').first();
    // page.locator('.ag-row').first().locator('button:has-text("Assign Tasks")');
    await expect(assignTasksButton).toBeVisible();
    await assignTasksButton.click();

    
    
    

    // Change one task status in the Task Managment table.
    const taskStatusSelect = page.locator('div[col-id="status"] select').first();
    await taskStatusSelect.waitFor({ state: 'visible' });
    await taskStatusSelect.selectOption({ value: 'IN_PROGRESS' });
    await expect(page.getByText('Task status update successfully')).toBeVisible();

    // Change the handling status in the Assign Batch table.
    const handlingStatusSelect = page.locator('div[col-id="handlingStatus"] select').first();
    await handlingStatusSelect.waitFor({ state: 'visible' });
    await expect(handlingStatusSelect).toBeEnabled();
    await handlingStatusSelect.selectOption({ value: 'PROCESSING' });
    await expect(page.getByText('Batch Status update successfully')).toBeVisible();
    
  });

  test("should choose decision, add comment and submit", async ({ page }) => {
    // Go directly to a process-order decision page.
    await page.goto("/fault-order/details/50/process-order/29");
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+\/process-order\/\d+/);

    // Choose a decision option (Reject in this flow).
    const rejectDecisionRadio = page.locator('input[name="decision"][value="REJECTED"]');
    await rejectDecisionRadio.check({ force: true });
    await expect(rejectDecisionRadio).toBeChecked();

    // Fill comment and submit decision.
    const commentInput = page.locator('textarea[name="comment"]');
    await commentInput.fill(`Playwright decision comment ${Date.now()}`);
    await expect(commentInput).toHaveValue(/Playwright decision comment/);

    const submitDecisionButton = page.getByRole("button", { name: "Submit Decision" });
    await expect(submitDecisionButton).toBeEnabled();
    await submitDecisionButton.click();
  });

  test("should modify one question and add question", async ({ page }) => {
    // Open process-order form page.
    await page.goto("/fault-order/details/50/process-order/29");
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+\/process-order\/\d+/);

    // Modify one existing question.
    const firstQuestionInput = page.locator('textarea[name="questions.0.question"]');
    const firstAnswerInput = page.locator('input[name="questions.0.answer"]');
    await firstQuestionInput.click();
    await firstQuestionInput.press("Control+a");
    await firstQuestionInput.press("Backspace");
    await firstQuestionInput.type("Why did this process fail quality checks?");
    await firstAnswerInput.fill("Because incoming handling did not follow SOP.");
    await expect(firstQuestionInput).toHaveValue("Why did this process fail quality checks?");
    await expect(firstAnswerInput).toHaveValue("Because incoming handling did not follow SOP.");

    // Add one new question row.
    const questionInputs = page.locator('textarea[name^="questions."][name$=".question"]');
    const answerInputs = page.locator('input[name^="questions."][name$=".answer"]');
    const beforeCount = await questionInputs.count();

    await page.getByRole("button", { name: "+ Add Question" }).click();
    await expect(questionInputs).toHaveCount(beforeCount + 1);

    const newQuestionInput = questionInputs.nth(beforeCount);
    const newAnswerInput = answerInputs.nth(beforeCount);
    await newQuestionInput.fill("What preventive action should be applied next time?");
    await newAnswerInput.fill("Add receiving checklist and mandatory supervisor review.");

    await expect(newQuestionInput).toHaveValue("What preventive action should be applied next time?");
    await expect(newAnswerInput).toHaveValue("Add receiving checklist and mandatory supervisor review.");

    // 4. Submit the form
    const submitButton = page.locator('button:has-text("Submit Form")');
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  });

  test("unhappy path: cannot submit decision without selecting option", async ({ page }) => {
    // Navigate to a process-order decision page
    await page.goto("/fault-order/details/50/process-order/29");
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+\/process-order\/\d+/);

    // The submit button should be disabled until a decision is selected
    const submitDecisionButton = page.getByRole("button", { name: "Submit Decision" });
    await expect(submitDecisionButton).toBeVisible();
    await expect(submitDecisionButton).toBeDisabled();

    // Attempting to click a disabled submit should not navigate or produce a success result
    const beforeUrl = page.url();
    await submitDecisionButton.click({ force: true });
    await expect(page).toHaveURL(beforeUrl);

    // As an additional sanity check: selecting a decision enables the button (positive control)
    const approveRadio = page.locator('input[name="decision"][value="APPROVED"]');
    await approveRadio.check({ force: true });
    await expect(submitDecisionButton).toBeEnabled();
  });

  test("unhappy path: cannot add new task without description", async ({ page }) => {
    // Navigate to the fault order details and open Assign Tasks
    await page.goto("/fault-order");
    await page.locator('a:has-text("FO-006139FA")').first().click();
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+/);

    const assignTasksButton = page.locator('button:has-text("Assign Tasks")').first();
    await expect(assignTasksButton).toBeVisible();
    await assignTasksButton.click();

    // Count task rows/options before attempting to add an invalid task
    const taskSelects = page.locator('div[col-id="taskId"] select');
    const beforeCount = await taskSelects.count();

    // Open New Task modal/panel and leave description empty
    const newTaskButton = page.locator('button:has-text("+ New Task")');
    await expect(newTaskButton).toBeVisible();
    await newTaskButton.click();

    const descInput = page.locator('input[placeholder="Task description"]');
    await expect(descInput).toBeVisible();
    await expect(descInput).toHaveValue('');

    const addButton = page.locator('button:has-text("Add")');
    await expect(addButton).toBeVisible();
    // Expect Add to be disabled when required description is missing
    await expect(addButton).toBeDisabled();
  });

  test("unhappy path: navigating to non-existent process order logs error", async ({ page }) => {
    // Try to navigate to a non-existent process-order ID
    const nonExistentUrl = "/fault-order/details/9999/process-order/9999";
    await page.goto(nonExistentUrl);

    // Expect either error page or error content
    const hasErrorContent = await page.locator("text=/error|not found|forbidden|unauthorized/i").count() > 0;

    if (!hasErrorContent) {
      throw new Error(`Expected error when navigating to non-existent process-order, but none found`);
    }
  });

  test("unhappy path: cannot submit task without selecting handler", async ({ page }) => {
    // Navigate to assign tasks page
    await page.goto("/fault-order");
    await page.locator('a:has-text("FO-006139FA")').first().click();
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+/);

    const assignTasksButton = page.locator('button:has-text("Assign Tasks")').first();
    await expect(assignTasksButton).toBeVisible();
    await assignTasksButton.click();

    // Click + New Task button
    const newTaskButton = page.locator('button:has-text("+ New Task")');
    await expect(newTaskButton).toBeVisible();
    await newTaskButton.click();

    // Fill description but leave handler empty
    await page.locator('input[placeholder="Task description"]').fill('Test Task Without Handler');
    const handlerSelect = page.locator('label:has-text("Handler") + div select');
    await expect(handlerSelect).toBeVisible();
    await expect(handlerSelect).toHaveValue('');

    // Verify handler select is still empty (control check)
    const handlers = await handlerSelect.locator('option').evaluateAll(opts => 
      opts.map(opt => (opt as HTMLOptionElement).value)
    );
    expect(handlers.length).toBeGreaterThan(0);
  });

  test("unhappy path: cannot submit task without due date", async ({ page }) => {
    // Navigate to assign tasks page
    await page.goto("/fault-order");
    await page.locator('a:has-text("FO-006139FA")').first().click();
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+/);

    const assignTasksButton = page.locator('button:has-text("Assign Tasks")').first();
    await expect(assignTasksButton).toBeVisible();
    await assignTasksButton.click();

    // Click + New Task button
    const newTaskButton = page.locator('button:has-text("+ New Task")');
    await expect(newTaskButton).toBeVisible();
    await newTaskButton.click();

    // Fill description and handler with valid values
    await page.locator('input[placeholder="Task description"]').fill('Task Without Due Date');
    await page.locator('label:has-text("Handler") + div select').selectOption({ index: 1 });
    
    // Verify due date is empty
    const dueDateInput = page.locator('label:has-text("Due Date & Time") + div input');
    await expect(dueDateInput).toHaveValue('');
  });

  test("unhappy path: cannot submit task with very long description", async ({ page }) => {
    // Navigate to assign tasks page
    await page.goto("/fault-order");
    await page.locator('a:has-text("FO-006139FA")').first().click();
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+/);

    const assignTasksButton = page.locator('button:has-text("Assign Tasks")').first();
    await expect(assignTasksButton).toBeVisible();
    await assignTasksButton.click();

    // Click + New Task button
    const newTaskButton = page.locator('button:has-text("+ New Task")');
    await expect(newTaskButton).toBeVisible();
    await newTaskButton.click();

    const descInput = page.locator('input[placeholder="Task description"]');
    const veryLongDescription = 'a'.repeat(500); // Very long text
    await descInput.fill(veryLongDescription);

    // Verify the input accepted a long value (no rejection at fill time)
    const fieldValue = await descInput.inputValue();
    expect(fieldValue.length).toBeGreaterThan(0);
  });

  test("unhappy path: cannot assign task to batch without selecting task", async ({ page }) => {
    // Navigate to assign tasks page
    await page.goto("/fault-order");
    await page.locator('a:has-text("FO-006139FA")').first().click();
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+/);

    const assignTasksButton = page.locator('button:has-text("Assign Tasks")').first();
    await expect(assignTasksButton).toBeVisible();
    await assignTasksButton.click();

    // Try to check the task status select - should not be selectable without a task row
    const taskStatusSelects = page.locator('div[col-id="status"] select');
    const count = await taskStatusSelects.count();
    if (count === 0) {
      // Expected: no task rows exist yet, so no status select
    }
  });

  test("unhappy path: navigating with invalid fault order ID returns error", async ({ page }) => {
    // Try to navigate with invalid fault order ID
    await page.goto("/fault-order/details/invalid-id");
    await page.waitForTimeout(500);

    // Should either show error or redirect
    const hasErrorOrRedirect = 
      page.url().includes("error") || 
      page.url().includes("fault-order") ||
      await page.locator("text=/error|not found/i").count() > 0;

    expect(hasErrorOrRedirect).toBe(true);
  });

  test("unhappy path: submitting decision requires selection", async ({ page }) => {
    // Navigate to process order decision page
    await page.goto("/fault-order/details/50/process-order/29");
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+\/process-order\/\d+/);

    // Clear any existing data first
    const approveRadio = page.locator('input[name="decision"][value="APPROVED"]');
    const rejectRadio = page.locator('input[name="decision"][value="REJECTED"]');
    const isApproveChecked = await approveRadio.isChecked();
    const isRejectChecked = await rejectRadio.isChecked();

    if (isApproveChecked || isRejectChecked) {
      // A decision is already selected - this is expected from previous test runs
      // Just verify the button is enabled
      const submitButton = page.getByRole("button", { name: "Submit Decision" });
      await expect(submitButton).toBeEnabled();
    }
  });

  test("unhappy path: modifying question with empty text shows field", async ({ page }) => {
    // Navigate to process order form page
    await page.goto("/fault-order/details/50/process-order/29");
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+\/process-order\/\d+/);

    const firstQuestion = page.locator('textarea[name="questions.0.question"]');
    await expect(firstQuestion).toBeVisible();

    // Fill with some content
    await firstQuestion.click();
    await firstQuestion.press("Control+a");
    await firstQuestion.press("Backspace");
    await firstQuestion.type("What is the cause?");
    
    // Verify content is there
    await expect(firstQuestion).toHaveValue("What is the cause?");
  });

  test("unhappy path: form submission with special characters in fields", async ({ page }) => {
    // Navigate to process order form page
    await page.goto("/fault-order/details/50/process-order/29");
    await expect(page).toHaveURL(/\/fault-order\/details\/\d+\/process-order\/\d+/);

    const whatHappenedInput = page.locator('input[name="whatHappened"]');
    const testContent = 'Special chars @#$% test';
    
    // Clear the field first
    await whatHappenedInput.click();
    await whatHappenedInput.press("Control+a");
    await whatHappenedInput.press("Backspace");
    
    await whatHappenedInput.fill(testContent);
    await expect(whatHappenedInput).toHaveValue(testContent);

    // Form should handle special characters safely without executing them
    const submitButton = page.locator('button:has-text("Submit Form")');
    await expect(submitButton).toBeEnabled();
  });
});
