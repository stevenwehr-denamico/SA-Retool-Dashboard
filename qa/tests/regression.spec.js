import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// ── QA scope guardrail ─────────────────────────────────────────────
// Every test must run against ONLY the Denamico Dev Sandbox.
const SANDBOX_NAME = "Denamico Dev Sandbox";
const SANDBOX_HUB_ID = "22481956";

// Hub IDs that must NEVER appear as the active portal during these tests.
const FORBIDDEN_HUB_IDS = ["44012785", "39281047", "51093826"];

const SHOT_DIR = path.join(process.cwd(), "screenshots");
fs.mkdirSync(SHOT_DIR, { recursive: true });

// Collect runtime errors per test.
let consoleErrors;
let pageErrors;

test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });

  await page.goto("/");
  await expect(page.getByText("Denamico SA toolkit")).toBeVisible();

  // ── Select the Denamico Dev Sandbox from the connected-portals dropdown ──
  // Open the dropdown via the active-portal pill (shows an 8-digit Hub ID),
  // then click the sandbox option (uniquely identified by its "Hub ID: …"
  // subtitle, which only renders inside the dropdown). Idempotent even when
  // the sandbox is already the default active portal.
  await page.getByText(/\(\d{8}\)/).first().click();
  await page.getByText(`Hub ID: ${SANDBOX_HUB_ID}`).click();

  // Confirm the active portal is the sandbox.
  await expect(page.locator(`text=(${SANDBOX_HUB_ID})`).first()).toBeVisible();
});

test.afterEach(async () => {
  // Guardrail: ensure no production hub was ever active and no runtime errors.
  expect(pageErrors, `Uncaught page errors:\n${pageErrors.join("\n")}`).toHaveLength(0);
  expect(consoleErrors, `Console errors:\n${consoleErrors.join("\n")}`).toHaveLength(0);
});

async function shot(page, name) {
  await page.screenshot({ path: path.join(SHOT_DIR, name), fullPage: true });
}

// Sidebar navigation helper.
async function nav(page, label) {
  await page.getByRole("button", { name: label, exact: true }).click();
}

test("01 Dashboard home shows sandbox context (Hub 22481956)", async ({ page }) => {
  await expect(
    page.getByText(`Connected to ${SANDBOX_NAME} (Hub ${SANDBOX_HUB_ID}).`)
  ).toBeVisible();
  // Hub ID stat card.
  await expect(page.getByText(SANDBOX_HUB_ID).first()).toBeVisible();
  // Environment should read Sandbox for the dev portal.
  await expect(page.getByText("Sandbox", { exact: true })).toBeVisible();
  await shot(page, "01-dashboard.png");
});

test("02 Data mapping studio: auto-map and clear", async ({ page }) => {
  await nav(page, "Data mapping studio");
  await expect(page.getByText(`Map source system fields to HubSpot properties for ${SANDBOX_NAME}.`, { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Auto-map fields" }).click();
  await expect(page.getByText(/Active mappings \(\d+\)/)).toBeVisible();
  await shot(page, "02-data-mapping-automapped.png");

  await page.getByRole("button", { name: "Clear all" }).click();
  await expect(page.getByText(/Active mappings/)).toHaveCount(0);
});

test("03 File import: run mock import to completion", async ({ page }) => {
  await nav(page, "File import");
  await expect(page.getByText(`Upload CSV files to import records into ${SANDBOX_NAME}`, { exact: false })).toBeVisible();

  await page.getByText("Click to select CSV file").click();
  await expect(page.getByText("acme-contacts-export.csv")).toBeVisible();
  await page.getByRole("button", { name: "Start import" }).click();

  // Progress runs on an interval; wait for completion.
  await expect(page.getByText("Complete", { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText("Created", { exact: true })).toBeVisible();
  await shot(page, "03-file-import-complete.png");
});

test("04 Bulk record manager: purge flow with IDs", async ({ page }) => {
  await nav(page, "Bulk record manager");
  await expect(page.getByText(`Archive or purge records in bulk for ${SANDBOX_NAME}`, { exact: false })).toBeVisible();

  await page.locator("select").nth(1).selectOption("purge");
  await expect(page.getByText(/Purge is permanent/)).toBeVisible();

  await page.locator("textarea").fill("12345\n67890\n24680");
  await expect(page.getByText("3 IDs detected · 1 API calls needed")).toBeVisible();

  await page.getByRole("button", { name: /Purge 3 records/ }).click();
  await expect(page.getByText("Results")).toBeVisible();
  await shot(page, "04-bulk-records-results.png");
});

test("05 Record explorer: search returns results", async ({ page }) => {
  await nav(page, "Record explorer");
  await expect(page.getByText(`Search and browse CRM records in ${SANDBOX_NAME}`, { exact: false })).toBeVisible();

  await page.getByPlaceholder("Search by name, email, or use filters...").fill("jane");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page.getByText(/\d+ results/)).toBeVisible();
  await expect(page.getByText("jane.smith@acme.com")).toBeVisible();
  await shot(page, "05-record-explorer-results.png");
});

test("06 Property architect: build and create a property", async ({ page }) => {
  await nav(page, "Property architect");
  await expect(page.getByText(`Build and create HubSpot properties for ${SANDBOX_NAME}`, { exact: false })).toBeVisible();

  await page.getByPlaceholder("e.g. Source system").fill("QA Test Property");
  await expect(page.getByText("Internal name: qa_test_property")).toBeVisible();
  await page.getByRole("button", { name: "Create property" }).click();
  await expect(page.getByText(/Created this session \(1\)/)).toBeVisible();
  await shot(page, "06-property-architect-created.png");
});

test("07 Schema explorer: filter to custom-only", async ({ page }) => {
  await nav(page, "Schema explorer");
  await expect(page.getByText(`Browse and audit all properties for ${SANDBOX_NAME}`, { exact: false })).toBeVisible();

  await expect(page.getByText(/\d+ properties/)).toBeVisible();
  // Scope filter is the 2nd select (object type is 1st).
  await page.locator("select").nth(1).selectOption("custom");
  // After filtering, every visible table row must be a custom property:
  // at least one "custom" Scope badge and zero "default" badges.
  await expect(page.locator("tbody").getByText("custom", { exact: true }).first()).toBeVisible();
  await expect(page.locator("tbody").getByText("default", { exact: true })).toHaveCount(0);
  await shot(page, "07-schema-explorer-custom.png");
});

test("08 Batch property creator: add and edit a row", async ({ page }) => {
  await nav(page, "Batch property creator");
  await expect(page.getByText(`Create multiple properties at once for ${SANDBOX_NAME}`, { exact: false })).toBeVisible();

  const rowsBefore = await page.locator("tbody tr").count();
  await page.getByRole("button", { name: "Add row" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(rowsBefore + 1);

  await page.locator('tbody tr:last-child input').first().fill("QA Batch Prop");
  await shot(page, "08-batch-properties.png");
});

test("09 Integration designer: add a step and inspect spec", async ({ page }) => {
  await nav(page, "Integration designer");
  await expect(page.getByText(`Design and document integration flows for ${SANDBOX_NAME}`, { exact: false })).toBeVisible();

  // Spec preview must reflect the sandbox hub id.
  await expect(page.getByText(`"hubId": "${SANDBOX_HUB_ID}"`)).toBeVisible();
  await page.getByRole("button", { name: "Add step" }).click();
  await shot(page, "09-integration-designer.png");
});

test("10 Workflow templates: open a template", async ({ page }) => {
  await nav(page, "Workflow templates");
  await expect(page.getByText("Reusable code templates", { exact: false })).toBeVisible();

  await page.getByText("Lead routing by territory").click();
  await expect(page.getByText(/Custom Coded Action/).first()).toBeVisible();
  await shot(page, "10-workflow-templates.png");
});

test("11 Webhook tester: send a payload", async ({ page }) => {
  await nav(page, "Webhook tester");
  await expect(page.getByText("Send test payloads to webhook endpoints", { exact: false })).toBeVisible();

  await page.getByPlaceholder("https://your-webhook-url.com/endpoint").fill("https://example.com/hook");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("200 OK")).toBeVisible();
  await shot(page, "11-webhook-tester.png");
});

test("12 Portal scope guardrail: sandbox stays active across navigation", async ({ page }) => {
  // Walk every module and confirm a forbidden production hub never becomes active.
  const modules = [
    "Dashboard",
    "Data mapping studio",
    "File import",
    "Bulk record manager",
    "Record explorer",
    "Property architect",
    "Schema explorer",
    "Batch property creator",
    "Integration designer",
    "Workflow templates",
    "Webhook tester",
  ];
  for (const m of modules) {
    await nav(page, m);
    // The topbar portal trigger must continue to show the sandbox hub id.
    await expect(page.locator(`text=(${SANDBOX_HUB_ID})`).first()).toBeVisible();
    for (const forbidden of FORBIDDEN_HUB_IDS) {
      await expect(page.locator(`text=(${forbidden})`)).toHaveCount(0);
    }
  }
});
