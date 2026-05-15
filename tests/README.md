# Test Suite Documentation

## Overview

| Module | Files | Test Cases |
|---|---|---|
| Login | 1 | 5 |
| Import | 5 | 15 |
| Export | 5 | 19 |
| Inventory Check | 4 | 28 |
| System Info | 11 | 37 |
| **Total** | **26** | **104** |

**Browser:** Desktop Chrome  
**Framework:** Playwright  
**Config:** `playwright.config.ts`

---

## Login

**File:** `login.spec.ts`

| # | Test Case |
|---|---|
| 1 | should display all elements |
| 2 | should toggle password display or hidden when click |
| 3 | should login when input correct username and password |
| 4 | should give error when login with incorrect username |
| 5 | should give error when login with incorrect password |

---

## Import

### Pages

**`import/pages/import.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display all elements |
| 2 | should route to new import page |

**`import/pages/import-new.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display all elements |
| 2 | should display new supplier form fields when click New supplier |
| 3 | should switch back to supplier dropdown when click Select existing supplier |

**`import/pages/import.no-permission.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display all elements except New Import |

**`import/pages/import-new.no-permission.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display unauthorized message |
| 2 | should back to homepage when click button in unauthorized page |

### Flows

**`import/flows/import-flow.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should create import sheet and complete full flow |
| 2 | should create import sheet and show toast when actual quantity is less than expected on quantity check |
| 3 | should complete full flow when actual quantity is less than expected but reason is provided |
| 4 | should complete full flow when actual quantity is more than expected and reason is provided |
| 5 | should show toast when quality status is FAILED without reason and notes |
| 6 | should create import sheet, fail quality check with reason/notes, and assign defect storage location |
| 7 | should create import sheet and cancel it at quantity-check |

---

## Export

### Pages

**`export/pages/export.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display all elements |
| 2 | should route to new export page |

**`export/pages/export-new.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display all elements |
| 2 | should display customer section when Customer type is selected |
| 3 | should display destination warehouse when Transfer type is selected |
| 4 | should display new customer form fields when New customer is clicked |
| 5 | should switch back to customer dropdown when Select existing customer is clicked |
| 6 | should enable Create button when Customer type and customer are selected |
| 7 | should enable Create button when Transfer type and destination warehouse are selected |

**`export/pages/export.no-permission.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display all elements except New Export |

**`export/pages/export-new.no-permission.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display unauthorized message |
| 2 | should back to homepage when click button in unauthorized page |

### Flows

**`export/flows/export-flow.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should create export sheet, pick product with quantity 1, auto scan and confirm |
| 2 | should create transfer export sheet, pick product with quantity 1, auto scan and confirm |
| 3 | should confirm export sheet with warning when items are not fully scanned |
| 4 | should create export sheet for customer |
| 5 | should create export sheet for transfer |
| 6 | should create export sheet for customer and cancel it at quantity-check |
| 7 | should create export sheet for transfer and cancel it at quantity-check |

---

## Inventory Check

### Pages

**`inventory-check/pages/inventory-check.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display all page elements |
| 2 | should display table with correct column headers |
| 3 | should display pagination controls |
| 4 | should navigate to schedule form when Schedule Inventory Check is clicked |
| 5 | should navigate to detail page when a code link is clicked |

**`inventory-check/pages/inventory-check-new.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display all form elements |
| 2 | should list warehouse options in the dropdown |
| 3 | should list employee options in the Assignee dropdown |
| 4 | should show tuanemtramtinh in the Assignee dropdown |
| 5 | should show validation errors when submitting empty form |
| 6 | should clear validation errors once all required fields are filled |
| 7 | should show Repeat Every fields when Enable Recurring Cycle Count is checked |
| 8 | should hide Repeat Every fields when Enable Recurring Cycle Count is unchecked |
| 9 | should update cycle helper text when Repeat Every value or unit changes |
| 10 | should navigate back when Cancel is clicked |
| 11 | should select a product from Target Products multi-select |

### Flows

**`inventory-check/flows/inventory-check-flow.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should create an inventory check with required fields and redirect to list |
| 2 | should create an inventory check with all fields (note, products, recurring cycle) |
| 3 | should show validation errors and NOT redirect when required fields are missing |
| 4 | should show validation error when warehouse is missing but other fields filled |
| 5 | should show validation error when assignee is missing but other fields filled |
| 6 | should show validation error when date is missing but other fields filled |
| 7 | should cancel and navigate back to the list page |

**`inventory-check/flows/inventory-check-staff-flow.spec.ts`**

| # | Test Case |
|---|---|
| 1 | admin creates and assigns → staff starts and completes → admin approves |
| 2 | admin creates and assigns → staff starts and completes → admin rejects |
| 3 | staff cannot start a sheet assigned to someone else |
| 4 | staff full flow import -> inventory check -> input quantity < quantity-expected -> approve |
| 5 | staff full flow import -> inventory check -> check faulty -> approve |

---

## System Info

### Category

**`system-info/flows/category.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should display page title and breadcrumb |
| 2 | should catch validation errors when required fields are missing |
| 3 | should create a root category |
| 4 | should update the root category |
| 5 | should create a subcategory under the root |
| 6 | should delete the subcategory |
| 7 | should delete the root category |

**`system-info/flows/category.no-permission.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should show forbidden page when navigating to category list |
| 2 | should redirect back to home when clicking 'Back to Home Page' on category forbidden page |

### Warehouse

**`system-info/flows/warehouse.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should show error when warehouse name is null |
| 2 | should show error when address is null |
| 3 | should show error when manager is not selected |
| 4 | should successfully create a new warehouse |
| 5 | should navigate to existing warehouse and update its information |
| 6 | should create a warehouse and then delete it |

**`system-info/flows/warehouse.no-permission.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should show forbidden page when navigating to warehouse list |
| 2 | should show forbidden page when navigating to create warehouse |
| 3 | should redirect back to home when clicking 'Back to Home Page' on warehouse forbidden page |

### Product

**`system-info/flows/product.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should create a new product and then delete it |
| 2 | should create a product, add a variant, and then delete the product |
| 3 | should create a product, add a variant, delete the variant, and then delete the product |
| 4 | should create a product, update its information, and then delete it |

**`system-info/flows/product.no-permission.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should show forbidden page when navigating to product list |
| 2 | should show forbidden page when navigating to create product page |
| 3 | should redirect back to home when clicking 'Back to Home Page' on product forbidden page |

### Attribute

**`system-info/flows/attribute.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should show error when attribute name is missing |
| 2 | should create a new product attribute |

**`system-info/flows/attribute.no-permission.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should show forbidden page when navigating to variant attributes list |
| 2 | should redirect back to home when clicking 'Back to Home Page' on variant attributes forbidden page |

### Unit

**`system-info/flows/unit.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should show error when unit name is missing |
| 2 | should show error when unit abbreviation is missing |
| 3 | should create a new unit of measurement |

**`system-info/flows/unit.no-permission.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should show forbidden page when navigating to unit list |
| 2 | should redirect back to home when clicking 'Back to Home Page' on unit forbidden page |

### Location

**`system-info/flows/location.spec.ts`**

| # | Test Case |
|---|---|
| 1 | should successfully navigate to a warehouse and create a single ROOM location |
| 2 | should successfully create a bulk nested location hierarchy |
| 3 | should create a ROOM location and then delete it |
