import { useState, useMemo } from "react";
import { C, S, Icon, icons } from "./App.jsx";

/* Inline rich-text: supports **bold** and `code`. */
function RichText({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} style={{ color: C.gray800, fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: C.gray100, color: C.gray700, padding: "1px 5px", borderRadius: 4 }}>{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export const GUIDES = [
  {
    id: "getting-started",
    category: "Getting started",
    title: "Welcome & how the toolkit works",
    overview:
      "The Denamico SA Toolkit is your one-stop cockpit for HubSpot data work — mapping spreadsheets, importing files, building custom fields, and designing integrations, all in one place. This article explains the big picture so the rest of the guide makes sense.",
    prerequisites: [
      "A web browser. There is nothing to install and no login.",
      "An idea of which client you'll be working on (you'll select their **portal** in the top-right).",
    ],
    sections: [
      {
        heading: "How to find your way around",
        steps: [
          "The **left sidebar** (dark blue) is your menu of tools, grouped into **Data operations**, **Schema & properties**, **Integration tools**, and **Help & training**.",
          "The **top bar** (white) shows a breadcrumb trail on the left and the **client portal selector** on the right.",
          "The **main area** in the center shows whichever tool you've opened.",
          "Click **Dashboard** at the top of the sidebar any time to return to the home screen.",
        ],
      },
      {
        heading: "How to read results correctly (important)",
        steps: [
          "Today the toolkit runs on **built-in sample data**.",
          "Action buttons like **Start import**, **Archive**, **Create property**, **Search**, and **Send** produce **realistic example results — they do not change a real HubSpot account yet**.",
          "Treat the toolkit as a high-fidelity planning and demo tool: build and preview your work confidently, but coordinate with your admin before relying on it for live changes.",
          "When it is later connected to live portals, **these same screens and steps will apply** — nothing you learn here goes to waste.",
        ],
      },
    ],
    proTips: [
      "Always glance at the **top-right portal name** before you act — it's the single most important context in the whole app.",
      "Practice in the **Denamico Dev Sandbox** portal (orange dot) so you never worry about touching real client data.",
    ],
    faqs: [
      { q: "Do I need a username and password?", a: "No. There's no login today — anyone who can open the page sees the same tools. The circle with initials in the top-right is just a visual badge." },
      { q: "Why didn't my action change anything in real HubSpot?", a: "That's expected for now. The toolkit simulates results on sample data. Use it for planning and demos until your admin confirms it's connected to live portals." },
    ],
  },
  {
    id: "portal-selector",
    category: "Getting started",
    title: "Switch the active client portal",
    overview:
      "The portal selector decides which client account every tool works against. Getting this right is the difference between a clean migration and an embarrassing mistake, so it's worth a few seconds every session.",
    prerequisites: ["Know which client you're working on for this session."],
    sections: [
      {
        heading: "How to switch clients",
        steps: [
          "Look at the **top-right** of the white top bar — you'll see the current client's name, its Hub ID, and a colored dot.",
          "Click the selector to open the **Connected portals** dropdown.",
          "Click the client you want. The dropdown closes and **the entire app updates** to that client.",
          "Confirm the name now shown matches who you intend to work on.",
        ],
      },
    ],
    proTips: [
      "A **green dot** is a normal (production) client; an **orange dot** is a sandbox/dev environment. Use the sandbox to practice.",
      "The **Connect new portal** row at the bottom of the dropdown is a placeholder today — adding new clients is handled by your admin.",
    ],
    faqs: [
      { q: "How do I know which client is active?", a: "The active client shows a checkmark in the dropdown, and its name appears in the top-right plus inside most tool descriptions." },
      { q: "I think I ran something on the wrong client — what now?", a: "Because the toolkit runs on sample data today, nothing real changed. Build the habit now: confirm the top-right name before every import or bulk action." },
    ],
  },
  {
    id: "dashboard",
    category: "Getting started",
    title: "Use the Dashboard",
    toolPage: "home",
    overview:
      "The Dashboard is your home base — a quick health check of your connection plus one-click tiles to launch every tool.",
    sections: [
      {
        heading: "How to use the Dashboard",
        steps: [
          "Open the **Dashboard** from the top of the sidebar (or click **Home** in the breadcrumb).",
          "Review the four summary cards: **Connected portals**, **Active portal**, **Hub ID**, and **Environment** (Production or Sandbox).",
          "Under **Tools**, click any tile to jump straight into that tool.",
        ],
      },
    ],
    proTips: [
      "Blue-icon tiles are data/schema tools; orange-icon tiles are integration tools — a quick way to scan for what you need.",
      "Use the **Active portal** card as your pre-flight check before starting any real work.",
    ],
    faqs: [
      { q: "What's the fastest way back here?", a: "Click **Dashboard** in the sidebar or **Home** in the breadcrumb trail at the top-left." },
    ],
  },
  {
    id: "data-mapper",
    category: "Data operations",
    title: "Map a source file to HubSpot fields",
    toolPage: "data-mapper",
    overview:
      "Data Mapping Studio lets you match the columns in a source file (like a Salesforce export) to the right HubSpot fields, so your data lands exactly where it should during an import.",
    prerequisites: [
      "Know which HubSpot object you're loading into: **Contacts**, **Companies**, or **Deals**.",
      "A rough idea of your source columns (the studio comes preloaded with example columns for practice).",
    ],
    sections: [
      {
        heading: "How to map your fields",
        steps: [
          "Choose the **Target object** (Contacts, Companies, or Deals) at the top-left.",
          "Look at the two panels: **Source fields** on the left, **HubSpot properties** on the right.",
          "**Drag** a source field from the left and **drop** it onto the matching HubSpot property on the right.",
          "Repeat for each field — or click **Auto-map fields** to let the app pair obvious matches automatically.",
          "Review the **Active mappings** summary at the top; each line reads `source → HubSpot field`.",
          "Spot a wrong match? Click the **✕** next to that line to remove it.",
        ],
      },
    ],
    proTips: [
      "Run **Auto-map fields** first, then fix the few it misses by hand — it's far faster than mapping everything manually.",
      "The little sample value under each source field (e.g. `\"jane@acme.com\"`) helps you confirm you're mapping the right column.",
    ],
    faqs: [
      { q: "My mappings all disappeared — what happened?", a: "You likely changed the **Target object**, which clears mappings by design. Pick the correct object first, then map." },
      { q: "Why can't I map a field twice?", a: "The app blocks duplicate source or target mappings to keep your plan clean. Remove the existing mapping first if you need to re-point it." },
      { q: "Does Export mapping save a file?", a: "Export is a placeholder today. Note it for your admin, or copy the mapping details manually for now." },
    ],
  },
  {
    id: "file-import",
    category: "Data operations",
    title: "Import a CSV file",
    toolPage: "file-import",
    overview:
      "File Import uploads a CSV to create or update records in the selected client's HubSpot, then shows you a clear breakdown of what was created, updated, or errored.",
    prerequisites: [
      "A CSV file and the object type it belongs to.",
      "The correct client selected in the top-right. (Today the upload box loads a sample file and the import is simulated.)",
    ],
    sections: [
      {
        heading: "How to import a file",
        steps: [
          "Choose the **Object type** (Contacts, Companies, Deals, or Tickets).",
          "Optionally type an **Import name** to label this batch — e.g. `Acme Corp contacts – batch 1`.",
          "Click the **upload box** to select your CSV (it currently loads a sample file with detected rows and columns).",
          "Review the detected file details (row count and columns).",
          "Click **Start import** to begin, or **Cancel** to back out.",
          "Watch the **Import progress** bar. When it finishes, read the result tiles: **Total rows**, **Created**, **Updated**, and **Errors**.",
        ],
      },
    ],
    proTips: [
      "Name every import so batches are easy to tell apart later when you're reviewing history.",
      "Always check the **Errors** count and follow up on any failed rows before calling an import done.",
    ],
    faqs: [
      { q: "Nothing imported into real HubSpot — why?", a: "The import is simulated on sample data today. The progress bar and result tiles show you exactly what the live experience will look like." },
      { q: "Which object type should I pick?", a: "Match it to what the file contains — a contacts export goes to Contacts, a companies list to Companies, and so on. The wrong object type is the most common import mistake." },
    ],
  },
  {
    id: "bulk-records",
    category: "Data operations",
    title: "Archive or purge records in bulk",
    toolPage: "bulk-records",
    overview:
      "Bulk Record Manager lets you archive (recoverable) or purge (permanent) many records at once by pasting their ID numbers. It's a huge time-saver for cleanup — but purge is destructive, so handle it with care.",
    prerequisites: [
      "The list of **record IDs** you want to act on.",
      "Which object type those IDs belong to.",
    ],
    sections: [
      {
        heading: "How to run a bulk action",
        steps: [
          "Choose the **Object type** (Contacts, Companies, Deals, Tickets).",
          "Choose the **Action**: **Archive (soft delete)** or **Purge (GDPR delete for contacts)**.",
          "Paste the **record IDs** into the box — one per line, or separated by commas.",
          "Confirm the counter (e.g. `42 IDs detected · 1 API calls needed`).",
          "Click the action button — **Archive N records** or **Purge N records**.",
          "Review the **Results**: Total, Success, and Failed.",
        ],
      },
    ],
    proTips: [
      "Prefer **Archive** (recoverable) whenever possible, and practice in the **Denamico Dev Sandbox** first.",
      "Keep a saved copy of your ID list before purging — purge is permanent and can't be undone.",
    ],
    faqs: [
      { q: "Why is the action button red?", a: "Red means you've selected **Purge**, which permanently deletes records. Switch to **Archive** unless permanent deletion is truly intended." },
      { q: "The button is grayed out — why?", a: "You haven't pasted any IDs yet. Add at least one record ID (one per line or comma-separated) and it will enable." },
      { q: "What does 'API calls needed' mean?", a: "Records are processed in chunks of 100 behind the scenes. The counter just shows how many batches your list will take." },
    ],
  },
  {
    id: "record-explorer",
    category: "Data operations",
    title: "Search and browse records",
    toolPage: "record-explorer",
    overview:
      "Record Explorer lets you quickly look up existing records in the selected client's account and browse the results in a clean table.",
    prerequisites: ["Know what you're searching for — a name, email, or similar."],
    sections: [
      {
        heading: "How to look up records",
        steps: [
          "Choose the **Object type** (Contacts, Companies, Deals, Tickets).",
          "Type into the **Search query** box.",
          "Press **Enter** or click **Search**.",
          "Review the results table: ID, Name, Email, Company, and Lifecycle stage.",
        ],
      },
    ],
    proTips: [
      "Press **Enter** to run the search without reaching for the button.",
      "Lifecycle stages are color-coded (e.g. customers in green) so you can scan status at a glance.",
    ],
    faqs: [
      { q: "I get the same records every time — is it broken?", a: "No. Search returns a sample set today to show the layout. Treat it as a preview of the live experience." },
    ],
  },
  {
    id: "property-architect",
    category: "Schema & properties",
    title: "Create one HubSpot field (property)",
    toolPage: "property-architect",
    overview:
      "Property Architect helps you design and create a single new HubSpot field at a time, with a live preview of exactly what will be created — so there are no surprises.",
    prerequisites: [
      "The field's name (label), what kind of data it holds, and which field group it belongs to.",
    ],
    sections: [
      {
        heading: "How to build a property",
        steps: [
          "Choose the **Object type** and a **Group** (the section the field lives in).",
          "Type the **Property label** (e.g. `Source system`). The app auto-creates the behind-the-scenes **internal name** for you.",
          "Pick the **Type** (String, Number, Enumeration, Date/Time, Boolean). The **Field type** options update to match.",
          "If you chose **Enumeration**, type the dropdown **Options**, one per line.",
          "Optionally add a **Description**.",
          "Optionally tick **Has unique value** to prevent duplicates (this can only be set when creating).",
          "Click **Create property**. It appears under **Created this session** with a green check, and the form resets for the next one.",
        ],
      },
    ],
    proTips: [
      "Watch the **internal name** preview — once a field is created, that name can't be changed, so get the label right first.",
      "Let the **Type** drive your **Field type** choice; that's what keeps the two from mismatching.",
    ],
    faqs: [
      { q: "Why is Create property grayed out?", a: "You haven't entered a **label** yet. Type a property label and the button enables." },
      { q: "What is the API payload preview for?", a: "It's a live, read-only view of exactly what would be sent to HubSpot — great for double-checking your settings before creating." },
    ],
  },
  {
    id: "schema-explorer",
    category: "Schema & properties",
    title: "Audit and export existing fields",
    toolPage: "schema-explorer",
    overview:
      "Schema Explorer lets you browse, filter, and audit every existing field for the selected client, then export the list — perfect for documenting an account or finding the fields your team added.",
    prerequisites: ["Know which object's fields you want to review."],
    sections: [
      {
        heading: "How to audit fields",
        steps: [
          "Choose the **Object type** (Contacts, Companies, Deals).",
          "Optionally type in **Search** to find a field by name or label.",
          "Narrow with **Scope** (All / Custom only / Default only) and **Type** (string, number, etc.).",
          "Read the table; the summary line shows counts for properties, custom fields, and groups.",
          "Click **Export CSV** to download the filtered list (placeholder today).",
        ],
      },
    ],
    proTips: [
      "Use **Scope → Custom only** to instantly review just the fields your team created.",
      "If fields look 'missing,' check whether a filter is still applied — reset everything to **All** to see the full list.",
    ],
    faqs: [
      { q: "Did Export CSV download anything?", a: "Export is a placeholder today. Note it for your admin, or copy the visible details manually for now." },
      { q: "What's the difference between custom and default?", a: "Default fields ship with HubSpot; custom fields were added for this account. The Scope badge on each row tells you which is which." },
    ],
  },
  {
    id: "batch-properties",
    category: "Schema & properties",
    title: "Create many fields at once",
    toolPage: "batch-properties",
    overview:
      "Batch Property Creator lets you build a whole set of new fields in one table and create them together — far faster than making them one at a time.",
    prerequisites: [
      "The list of fields you want and their types. (Four common migration fields are pre-filled as a starting example.)",
    ],
    sections: [
      {
        heading: "How to create fields in a batch",
        steps: [
          "Choose the **Object type**.",
          "Edit the table rows: **Label**, **Type**, **Field type**, **Group**, and **Description**.",
          "Click **Add row** for each additional field you need.",
          "Remove any unwanted row with the **✕** at the end of that row.",
          "Click **Create N properties** to build them all at once (the count updates automatically).",
        ],
      },
    ],
    proTips: [
      "Keep a consistent **Group** name (e.g. `custom_migration`) so related fields stay together in HubSpot.",
      "Rows without a **Label** are skipped — a handy way to leave draft rows in place without creating them.",
    ],
    faqs: [
      { q: "Some rows didn't get created — why?", a: "Rows with a blank **Label** are intentionally skipped. Fill in the label to include them in the batch." },
      { q: "How is this different from Property Architect?", a: "Property Architect is for one carefully crafted field; Batch Property Creator is for standing up many fields quickly in a table." },
    ],
  },
  {
    id: "integration-designer",
    category: "Integration tools",
    title: "Design and document an integration",
    toolPage: "integration-designer",
    overview:
      "Integration Designer lets you diagram how data flows from a source system, through any middleware, into HubSpot — then export a clean spec you can share with the team or client.",
    prerequisites: ["Know the systems involved and how often data should sync."],
    sections: [
      {
        heading: "How to map out a flow",
        steps: [
          "Set the **Sync frequency** (Real-time, Hourly, Daily, Weekly, or Manual).",
          "Set the **Error handling** (e.g. Retry 3x with backoff, Dead letter queue, Alert only).",
          "Review the **flow cards** left-to-right; each is a step (Source → Middleware → Destination).",
          "Edit any step's **name** and **description** directly in its card, and set its **type** with the dropdown.",
          "Click **Add step** to insert more stages.",
          "Review the **Integration spec preview** at the bottom, then click **Export spec** to save it (placeholder today).",
        ],
      },
    ],
    proTips: [
      "Order matters — arrange steps left to right in the real sequence the data travels.",
      "Fill in every step's description; a well-documented spec is what makes the hand-off useful to others.",
    ],
    faqs: [
      { q: "What do the card colors mean?", a: "The step type dropdown colors each card: Source (blue), Middleware (orange), and Destination (green)." },
      { q: "Did Export spec create a file?", a: "Export is a placeholder today. For now, copy the spec preview text to share the design." },
    ],
  },
  {
    id: "workflow-templates",
    category: "Integration tools",
    title: "Reuse an automation code snippet",
    toolPage: "workflow-templates",
    overview:
      "Workflow Templates gives you ready-made, proven code snippets for common HubSpot automations — a fast, reliable starting point instead of writing from scratch.",
    prerequisites: ["A general idea of the automation you need."],
    sections: [
      {
        heading: "How to grab a snippet",
        steps: [
          "Browse the template list (e.g. Lead routing by territory, Data enrichment webhook, Deal stage notification, FTP file sync trigger).",
          "Click a template to open its details.",
          "Read the description and the code.",
          "Click **Copy** to copy the snippet, then paste it into HubSpot's custom code action, a webhook handler, or your integration tool.",
        ],
      },
    ],
    proTips: [
      "These are starting points — always review and adapt before using in a real account.",
      "Fill in your own IDs, tokens, and mappings; never run a snippet as-is.",
    ],
    faqs: [
      { q: "Can I use a snippet without changes?", a: "Not safely. Each template uses placeholders (owner IDs, tokens, territory maps) you must replace with the client's real values." },
    ],
  },
  {
    id: "webhook-tester",
    category: "Integration tools",
    title: "Test a webhook endpoint",
    toolPage: "webhook-tester",
    overview:
      "Webhook Tester sends a test message (payload) to a web address and shows you the reply — handy for confirming an endpoint is reachable and seeing the shape of its response before wiring up a full integration.",
    prerequisites: ["The destination URL and the test data you want to send."],
    sections: [
      {
        heading: "How to send a test request",
        steps: [
          "Choose the **method** (POST, PUT, PATCH, GET).",
          "Paste the destination **URL**.",
          "Edit the **Payload (JSON)** — a sample contact payload is pre-filled.",
          "Click **Send**.",
          "Review the **Response**: status code, response time, and body.",
        ],
      },
    ],
    proTips: [
      "Use this to confirm an endpoint is reachable and to preview the reply's structure before building the real integration.",
      "Keep your JSON valid — every brace `{ }`, bracket, quote, and comma matters.",
    ],
    faqs: [
      { q: "It won't accept my payload — why?", a: "The payload is almost certainly invalid JSON. Make sure all braces, brackets, quotes, and commas are intact." },
      { q: "Is the response real?", a: "Today it returns a simulated success response so you can see the layout. The status badge, timing, and body mirror the live experience." },
    ],
  },
  {
    id: "workflow-map-and-import",
    category: "End-to-end workflows",
    title: "Workflow: map a spreadsheet, then import it",
    overview:
      "This is the most common SA task: prepare a clean field mapping, then run the import against it. It chains two tools — Data Mapping Studio and File Import — into one smooth flow.",
    prerequisites: [
      "The correct client selected in the top-right.",
      "Your source CSV and the HubSpot object it belongs to.",
    ],
    sections: [
      {
        heading: "How to go from spreadsheet to import",
        steps: [
          "Sidebar → **Data mapping studio**. Pick the **Target object**.",
          "Click **Auto-map fields**, then drag-and-drop to fix any misses.",
          "Remove wrong matches with **✕**, then click **Export mapping** to save the plan.",
          "Sidebar → **File import**. Pick the **same Object type** and name the import.",
          "Click the upload box to choose your CSV, then click **Start import**.",
          "Watch progress and review **Created / Updated / Errors**.",
        ],
      },
    ],
    proTips: [
      "Use the **same object type** in both tools, or your mapping won't line up with the import.",
      "Confirm the active portal before you start — both steps act on whichever client is selected.",
    ],
    faqs: [
      { q: "Do I have to map before importing?", a: "Not strictly, but mapping first means your columns land in the right fields and saves cleanup later." },
    ],
  },
  {
    id: "workflow-bulk-cleanup",
    category: "End-to-end workflows",
    title: "Workflow: clean up records safely",
    overview:
      "When you need to remove records, this flow keeps you safe by starting with recoverable archives and reserving permanent deletion for when it's truly intended.",
    prerequisites: [
      "Your list of record IDs and the object type.",
      "Ideally, practice in the **Denamico Dev Sandbox** first.",
    ],
    sections: [
      {
        heading: "How to archive or delete in bulk",
        steps: [
          "Sidebar → **Bulk record manager**.",
          "Pick the **Object type**, then the **Action** — start with **Archive**.",
          "Paste the **record IDs** (one per line or comma-separated).",
          "Check the detected count, then click **Archive N records**.",
          "Review **Success / Failed**.",
          "Only switch to **Purge** when permanent, irreversible deletion is genuinely required — and keep a copy of your ID list first.",
        ],
      },
    ],
    proTips: [
      "Archive is recoverable; purge is not. When in doubt, archive.",
      "Save your ID list somewhere before any purge so you can audit what was removed.",
    ],
    faqs: [
      { q: "Can I undo a purge?", a: "No — purge is permanent. That's why this workflow starts with Archive and treats Purge as a deliberate, last-step choice." },
    ],
  },
];

const CATEGORY_ORDER = [
  "Getting started",
  "Data operations",
  "Schema & properties",
  "Integration tools",
  "End-to-end workflows",
];

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 700, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.07em", margin: "26px 0 10px" }}>
      {children}
    </div>
  );
}

function Article({ article, setPage }) {
  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span style={S.badge("blue")}>{article.category}</span>
        {article.toolPage && (
          <button
            style={{ ...S.btn("secondary"), marginLeft: "auto" }}
            onClick={() => setPage(article.toolPage)}
          >
            <Icon d={icons.arrow} size={14} /> Open this tool
          </button>
        )}
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: C.gray900, letterSpacing: "-0.02em", margin: "4px 0 14px" }}>
        {article.title}
      </h1>

      <SectionTitle>Overview</SectionTitle>
      <p style={{ fontSize: 15, lineHeight: 1.65, color: C.gray700, margin: 0 }}>
        <RichText text={article.overview} />
      </p>

      {article.prerequisites?.length > 0 && (
        <>
          <SectionTitle>Before you start</SectionTitle>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 7 }}>
            {article.prerequisites.map((p, i) => (
              <li key={i} style={{ fontSize: 14, lineHeight: 1.6, color: C.gray700 }}>
                <RichText text={p} />
              </li>
            ))}
          </ul>
        </>
      )}

      {article.sections.map((sec, si) => (
        <div key={si}>
          <SectionTitle>{sec.heading}</SectionTitle>
          <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, counterReset: `step-${si}` }}>
            {sec.steps.map((step, i) => (
              <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{
                  flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: C.bluePale, color: C.blue,
                  fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.6, color: C.gray700, paddingTop: 2 }}>
                  <RichText text={step} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}

      {article.proTips?.length > 0 && (
        <div style={{
          marginTop: 26, borderLeft: `4px solid ${C.olive}`, background: C.olivePale, borderRadius: "0 10px 10px 0",
          padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#4e5022" }}>
            <Icon d={icons.bulb} size={16} color="#4e5022" /> Pro-tips &amp; best practices
          </div>
          {article.proTips.map((tip, i) => (
            <div key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "#4e5022" }}>
              <RichText text={tip} />
            </div>
          ))}
        </div>
      )}

      {article.faqs?.length > 0 && (
        <>
          <SectionTitle>Troubleshooting &amp; FAQs</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {article.faqs.map((f, i) => (
              <div key={i} style={{ ...S.card, padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 8, fontSize: 14, fontWeight: 600, color: C.gray800, marginBottom: 5 }}>
                  <span style={{ color: C.blue, fontWeight: 700 }}>Q.</span>
                  <span><RichText text={f.q} /></span>
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 14, lineHeight: 1.6, color: C.gray600 }}>
                  <span style={{ color: C.olive, fontWeight: 700 }}>A.</span>
                  <span><RichText text={f.a} /></span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 28, paddingTop: 16, borderTop: `1px solid ${C.gray200}`, fontSize: 12, color: C.gray400, lineHeight: 1.6 }}>
        Some actions currently run on sample data and simulate results. Treat outputs as previews until your admin confirms the toolkit is connected to live HubSpot portals — the screens and steps stay the same once it's live.
      </div>
    </div>
  );
}

export default function GuideTraining({ setPage }) {
  const [activeId, setActiveId] = useState(GUIDES[0].id);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GUIDES;
    return GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.overview.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach((g) => {
      (map[g.category] = map[g.category] || []).push(g);
    });
    return map;
  }, [filtered]);

  const active = GUIDES.find((g) => g.id === activeId) || GUIDES[0];

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Guide &amp; training</div>
        <div style={S.pageDesc}>
          Step-by-step help for every tool in the toolkit. Pick a topic on the left to see how to do it end to end.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "270px 1fr", gap: 20, alignItems: "start" }}>
        {/* Article list */}
        <div style={{ ...S.card, position: "sticky", top: 0, overflow: "hidden" }}>
          <div style={{ padding: 12, borderBottom: `1px solid ${C.gray100}` }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <Icon d={icons.search} size={14} color={C.gray400} />
              </div>
              <input
                style={{ ...S.input, paddingLeft: 32 }}
                placeholder="Search the guide..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div style={{ maxHeight: "calc(100vh - 230px)", overflowY: "auto", padding: "6px 8px" }}>
            {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => (
              <div key={cat} style={{ marginBottom: 6 }}>
                <div style={{ padding: "8px 10px 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.gray400 }}>
                  {cat}
                </div>
                {grouped[cat].map((g) => {
                  const isActive = g.id === active.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setActiveId(g.id)}
                      style={{
                        display: "block", width: "100%", textAlign: "left", border: "none", cursor: "pointer",
                        padding: "8px 10px", borderRadius: 6, fontSize: 13, lineHeight: 1.4,
                        marginBottom: 1, transition: "all 0.1s",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? C.blue : C.gray700,
                        background: isActive ? C.bluePale : "transparent",
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = C.gray50; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      {g.title}
                    </button>
                  );
                })}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: "24px 12px", textAlign: "center", color: C.gray400, fontSize: 13 }}>
                No topics match "{query}".
              </div>
            )}
          </div>
        </div>

        {/* Reader */}
        <div style={{ ...S.card, padding: "24px 28px" }}>
          <Article article={active} setPage={setPage} />
        </div>
      </div>
    </div>
  );
}
