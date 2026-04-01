import { useState, useCallback, useMemo, useRef, useEffect } from "react";

/* ─── Denamico Brand Palette ─── */
const C = {
  slate: "#152746", slateLight: "#1e3459", slateMid: "#2a4470",
  blue: "#2b69a5", blueLight: "#64bee6", bluePale: "#e8f2fb",
  orange: "#f57f21", orangeLight: "#fef4eb", orangeDark: "#c4641a",
  olive: "#acbe37", olivePale: "#f3f6e6",
  red: "#953820", redPale: "#fceeed",
  white: "#ffffff", gray50: "#f8f9fb", gray100: "#f1f3f6",
  gray200: "#e2e5ea", gray300: "#c8cdd5", gray400: "#9aa1ad",
  gray500: "#6b7280", gray600: "#4b5563", gray700: "#374151",
  gray800: "#1f2937", gray900: "#111827",
};

/* ─── Icon Components (inline SVG) ─── */
const Icon = ({ d, size = 18, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  home: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z M9 21V12h6v9",
  mapping: "M21 3H3v7h18V3z M21 14H3v7h18v-7z M10 7h4 M10 18h4",
  upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  archive: "M21 8v13H3V8 M1 3h22v5H1z M10 12h4",
  property: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  schema: "M4 7V4h16v3 M9 20h6 M12 4v16",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  integration: "M12 2v6m0 8v6 M2 12h6m8 0h6 M12 8a4 4 0 100 8 4 4 0 000-8z",
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  webhook: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  chevron: "M9 18l6-6-6-6",
  menu: "M4 6h16M4 12h16M4 18h16",
  portal: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  plus: "M12 5v14M5 12h14",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  grip: "M8 6h.01M12 6h.01M16 6h.01M8 12h.01M12 12h.01M16 12h.01M8 18h.01M12 18h.01M16 18h.01",
  arrow: "M5 12h14M12 5l7 7-7 7",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  copy: "M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1",
  refresh: "M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  layers: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  database: "M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2z M2 6.5C2 8.98 6.48 11 12 11s10-2.02 10-4.5 M2 11.5c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5",
};

/* ─── Navigation Config ─── */
const NAV = [
  { id: "home", label: "Dashboard", icon: icons.home, category: null },
  { id: "divider-1", divider: true, label: "Data operations" },
  { id: "data-mapper", label: "Data mapping studio", icon: icons.mapping },
  { id: "file-import", label: "File import", icon: icons.upload },
  { id: "bulk-records", label: "Bulk record manager", icon: icons.archive },
  { id: "record-explorer", label: "Record explorer", icon: icons.search },
  { id: "divider-2", divider: true, label: "Schema & properties" },
  { id: "property-architect", label: "Property architect", icon: icons.property },
  { id: "schema-explorer", label: "Schema explorer", icon: icons.schema },
  { id: "batch-properties", label: "Batch property creator", icon: icons.layers },
  { id: "divider-3", divider: true, label: "Integration tools" },
  { id: "integration-designer", label: "Integration designer", icon: icons.integration },
  { id: "workflow-templates", label: "Workflow templates", icon: icons.code },
  { id: "webhook-tester", label: "Webhook tester", icon: icons.webhook },
];

const PORTALS = [
  { id: "p1", name: "Acme Corp", hubId: "44012785", status: "active" },
  { id: "p2", name: "TechStart Inc", hubId: "39281047", status: "active" },
  { id: "p3", name: "MedFlow Health", hubId: "51093826", status: "active" },
  { id: "demo", name: "Denamico Dev Sandbox", hubId: "22481956", status: "dev" },
];

/* ─── Sample Data ─── */
const SAMPLE_PROPERTIES = {
  contacts: [
    { name: "email", label: "Email", type: "string", fieldType: "text", group: "contactinformation", custom: false },
    { name: "firstname", label: "First name", type: "string", fieldType: "text", group: "contactinformation", custom: false },
    { name: "lastname", label: "Last name", type: "string", fieldType: "text", group: "contactinformation", custom: false },
    { name: "phone", label: "Phone number", type: "string", fieldType: "phonenumber", group: "contactinformation", custom: false },
    { name: "company", label: "Company name", type: "string", fieldType: "text", group: "contactinformation", custom: false },
    { name: "jobtitle", label: "Job title", type: "string", fieldType: "text", group: "contactinformation", custom: false },
    { name: "lifecyclestage", label: "Lifecycle stage", type: "enumeration", fieldType: "radio", group: "contactinformation", custom: false },
    { name: "hs_lead_status", label: "Lead status", type: "enumeration", fieldType: "radio", group: "contactinformation", custom: false },
    { name: "hubspot_owner_id", label: "Contact owner", type: "enumeration", fieldType: "select", group: "contactinformation", custom: false },
    { name: "createdate", label: "Create date", type: "datetime", fieldType: "date", group: "contactinformation", custom: false },
    { name: "lastmodifieddate", label: "Last modified date", type: "datetime", fieldType: "date", group: "contactinformation", custom: false },
    { name: "hs_email_domain", label: "Email domain", type: "string", fieldType: "text", group: "contactinformation", custom: false },
    { name: "custom_source_system", label: "Source system", type: "string", fieldType: "text", group: "custom_migration", custom: true },
    { name: "custom_legacy_id", label: "Legacy record ID", type: "string", fieldType: "text", group: "custom_migration", custom: true },
    { name: "custom_data_quality", label: "Data quality score", type: "number", fieldType: "number", group: "custom_migration", custom: true },
    { name: "custom_migration_date", label: "Migration date", type: "datetime", fieldType: "date", group: "custom_migration", custom: true },
  ],
  companies: [
    { name: "name", label: "Name", type: "string", fieldType: "text", group: "companyinformation", custom: false },
    { name: "domain", label: "Company domain name", type: "string", fieldType: "text", group: "companyinformation", custom: false },
    { name: "industry", label: "Industry", type: "enumeration", fieldType: "select", group: "companyinformation", custom: false },
    { name: "phone", label: "Phone number", type: "string", fieldType: "phonenumber", group: "companyinformation", custom: false },
    { name: "city", label: "City", type: "string", fieldType: "text", group: "companyinformation", custom: false },
    { name: "state", label: "State/Region", type: "string", fieldType: "text", group: "companyinformation", custom: false },
    { name: "numberofemployees", label: "Number of employees", type: "number", fieldType: "number", group: "companyinformation", custom: false },
    { name: "annualrevenue", label: "Annual revenue", type: "number", fieldType: "number", group: "companyinformation", custom: false },
    { name: "hubspot_owner_id", label: "Company owner", type: "enumeration", fieldType: "select", group: "companyinformation", custom: false },
  ],
  deals: [
    { name: "dealname", label: "Deal name", type: "string", fieldType: "text", group: "dealinformation", custom: false },
    { name: "dealstage", label: "Deal stage", type: "enumeration", fieldType: "select", group: "dealinformation", custom: false },
    { name: "pipeline", label: "Pipeline", type: "enumeration", fieldType: "select", group: "dealinformation", custom: false },
    { name: "amount", label: "Amount", type: "number", fieldType: "number", group: "dealinformation", custom: false },
    { name: "closedate", label: "Close date", type: "datetime", fieldType: "date", group: "dealinformation", custom: false },
    { name: "hubspot_owner_id", label: "Deal owner", type: "enumeration", fieldType: "select", group: "dealinformation", custom: false },
  ],
};

const SAMPLE_SOURCE_FIELDS = [
  { name: "Email Address", type: "string", sample: "jane@acme.com" },
  { name: "First_Name", type: "string", sample: "Jane" },
  { name: "Last_Name", type: "string", sample: "Smith" },
  { name: "Phone_Number", type: "string", sample: "+1-555-0199" },
  { name: "Company_Name", type: "string", sample: "Acme Corp" },
  { name: "Title", type: "string", sample: "VP Marketing" },
  { name: "Lead_Score", type: "number", sample: "85" },
  { name: "Legacy_CRM_ID", type: "string", sample: "SF-00482912" },
  { name: "Created_Date", type: "date", sample: "2024-03-15" },
  { name: "Opt_In_Status", type: "boolean", sample: "true" },
  { name: "Source_System", type: "string", sample: "Salesforce" },
  { name: "Annual_Revenue", type: "number", sample: "2500000" },
];

/* ─── Styles ─── */
const S = {
  app: { display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: C.gray50, color: C.gray800, fontSize: 14, overflow: "hidden" },
  sidebar: (collapsed) => ({
    width: collapsed ? 60 : 248, minWidth: collapsed ? 60 : 248, background: C.slate, display: "flex", flexDirection: "column",
    transition: "all 0.2s ease", overflow: "hidden", position: "relative", zIndex: 10,
  }),
  sidebarHeader: { padding: "18px 16px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.slateLight}` },
  logo: { width: 28, height: 28, borderRadius: 6, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: 14, color: C.white },
  logoText: { color: C.white, fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: "-0.01em" },
  sidebarNav: { flex: 1, overflowY: "auto", padding: "8px 8px", display: "flex", flexDirection: "column", gap: 1 },
  navDivider: (collapsed) => ({ padding: collapsed ? "12px 0 4px" : "14px 10px 6px", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.slateMid, whiteSpace: "nowrap", overflow: "hidden" }),
  navItem: (active, collapsed) => ({
    display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "9px 0" : "9px 12px",
    justifyContent: collapsed ? "center" : "flex-start",
    borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: active ? 500 : 400,
    color: active ? C.white : "rgba(255,255,255,0.6)",
    background: active ? "rgba(255,255,255,0.1)" : "transparent",
    transition: "all 0.12s", whiteSpace: "nowrap", overflow: "hidden",
    border: "none", textAlign: "left", width: "100%",
  }),
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 },
  topbar: {
    height: 56, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
    background: C.white, borderBottom: `1px solid ${C.gray200}`, flexShrink: 0,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 12 },
  topRight: { display: "flex", alignItems: "center", gap: 16 },
  menuBtn: { background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", color: C.gray500 },
  breadcrumb: { fontSize: 13, color: C.gray400, display: "flex", alignItems: "center", gap: 6 },
  breadcrumbActive: { color: C.gray800, fontWeight: 500 },
  portalSelect: {
    display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8,
    border: `1px solid ${C.gray200}`, background: C.gray50, cursor: "pointer", fontSize: 13, color: C.gray700,
  },
  portalDot: (status) => ({ width: 7, height: 7, borderRadius: "50%", background: status === "dev" ? C.orange : "#34d399", flexShrink: 0 }),
  content: { flex: 1, overflow: "auto", padding: 24 },
  pageHeader: { marginBottom: 24 },
  pageTitle: { fontSize: 22, fontWeight: 600, color: C.gray900, letterSpacing: "-0.02em", marginBottom: 4 },
  pageDesc: { fontSize: 14, color: C.gray500, lineHeight: 1.5 },
  card: { background: C.white, borderRadius: 10, border: `1px solid ${C.gray200}`, overflow: "hidden" },
  cardHeader: { padding: "14px 20px", borderBottom: `1px solid ${C.gray100}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 14, fontWeight: 600, color: C.gray800 },
  cardBody: { padding: 20 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 },
  btn: (variant = "default") => ({
    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 7,
    fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.12s", border: "none",
    ...(variant === "primary" ? { background: C.orange, color: C.white } :
      variant === "secondary" ? { background: C.bluePale, color: C.blue } :
      variant === "outline" ? { background: "transparent", color: C.gray600, border: `1px solid ${C.gray200}` } :
      variant === "danger" ? { background: C.redPale, color: C.red } :
      { background: C.gray100, color: C.gray700 }),
  }),
  input: { width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${C.gray200}`, fontSize: 13, color: C.gray800, background: C.white, outline: "none", fontFamily: "inherit" },
  select: { width: "100%", padding: "9px 12px", borderRadius: 7, border: `1px solid ${C.gray200}`, fontSize: 13, color: C.gray800, background: C.white, outline: "none", fontFamily: "inherit", cursor: "pointer" },
  label: { fontSize: 12, fontWeight: 500, color: C.gray600, marginBottom: 5, display: "block" },
  badge: (color = "blue") => ({
    display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 500,
    ...(color === "blue" ? { background: C.bluePale, color: C.blue } :
      color === "orange" ? { background: C.orangeLight, color: C.orangeDark } :
      color === "green" ? { background: C.olivePale, color: "#4e5022" } :
      color === "red" ? { background: C.redPale, color: C.red } :
      { background: C.gray100, color: C.gray600 }),
  }),
  tag: { display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 5, fontSize: 11, background: C.gray100, color: C.gray600 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: C.gray400, borderBottom: `1px solid ${C.gray200}`, background: C.gray50 },
  td: { padding: "10px 14px", borderBottom: `1px solid ${C.gray100}`, color: C.gray700 },
  emptyState: { textAlign: "center", padding: "48px 24px", color: C.gray400 },
  emptyIcon: { width: 48, height: 48, borderRadius: 12, background: C.gray100, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12, color: C.gray400 },
};

/* ─── Dashboard Home ─── */
function DashboardHome({ portal, setPage }) {
  const modules = [
    { id: "data-mapper", title: "Data mapping studio", desc: "Map source fields to HubSpot properties with type validation", icon: icons.mapping, color: C.blue, status: "ready" },
    { id: "file-import", title: "File import", desc: "CSV upload with object mapping and import status tracking", icon: icons.upload, color: C.blue, status: "ready" },
    { id: "bulk-records", title: "Bulk record manager", desc: "Archive, purge, and batch operations on record IDs", icon: icons.archive, color: C.blue, status: "ready" },
    { id: "record-explorer", title: "Record explorer", desc: "Search and browse CRM records across any object type", icon: icons.search, color: C.blue, status: "ready" },
    { id: "property-architect", title: "Property architect", desc: "Build and create HubSpot properties with validation", icon: icons.property, color: C.blue, status: "ready" },
    { id: "schema-explorer", title: "Schema explorer", desc: "Browse all properties by object type, audit and export", icon: icons.schema, color: C.blue, status: "ready" },
    { id: "batch-properties", title: "Batch property creator", desc: "Create multiple properties from spreadsheet or template", icon: icons.layers, color: C.orange, status: "ready" },
    { id: "integration-designer", title: "Integration designer", desc: "Document FTP, Tray.io, and webhook integration flows", icon: icons.integration, color: C.orange, status: "ready" },
    { id: "workflow-templates", title: "Workflow templates", desc: "Reusable custom coded action and webhook templates", icon: icons.code, color: C.orange, status: "ready" },
    { id: "webhook-tester", title: "Webhook tester", desc: "Send test payloads and inspect webhook responses", icon: icons.webhook, color: C.orange, status: "ready" },
  ];

  const stats = [
    { label: "Connected portals", value: PORTALS.length, color: C.blue },
    { label: "Active portal", value: portal.name, color: C.olive },
    { label: "Hub ID", value: portal.hubId, color: C.gray500 },
    { label: "Environment", value: portal.status === "dev" ? "Sandbox" : "Production", color: portal.status === "dev" ? C.orange : "#34d399" },
  ];

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>SA toolkit</div>
        <div style={S.pageDesc}>Select a tool below to get started. Connected to {portal.name} (Hub {portal.hubId}).</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.gray200}`, padding: "12px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Tools</div>
      <div style={S.grid3}>
        {modules.map((m) => (
          <div key={m.id} onClick={() => setPage(m.id)}
            style={{ ...S.card, padding: "16px 18px", cursor: "pointer", transition: "all 0.15s", borderColor: C.gray200 }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.transform = "none"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 7, background: m.color === C.orange ? C.orangeLight : C.bluePale, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={m.icon} size={16} color={m.color} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.gray800 }}>{m.title}</div>
            </div>
            <div style={{ fontSize: 12, color: C.gray500, lineHeight: 1.5 }}>{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Data Mapping Studio ─── */
function DataMappingStudio({ portal }) {
  const [objectType, setObjectType] = useState("contacts");
  const [mappings, setMappings] = useState([]);
  const [sourceFields] = useState(SAMPLE_SOURCE_FIELDS);
  const [searchProp, setSearchProp] = useState("");
  const [dragSource, setDragSource] = useState(null);

  const hsProps = SAMPLE_PROPERTIES[objectType] || [];
  const filteredProps = hsProps.filter((p) =>
    p.label.toLowerCase().includes(searchProp.toLowerCase()) || p.name.toLowerCase().includes(searchProp.toLowerCase())
  );
  const mappedSourceNames = mappings.map((m) => m.source);
  const mappedHsNames = mappings.map((m) => m.target);

  const addMapping = (source, target) => {
    if (mappings.some((m) => m.source === source || m.target === target)) return;
    setMappings([...mappings, { source, target, targetLabel: hsProps.find((p) => p.name === target)?.label || target }]);
  };

  const removeMapping = (idx) => setMappings(mappings.filter((_, i) => i !== idx));

  const autoMap = () => {
    const newMappings = [];
    sourceFields.forEach((sf) => {
      const normalizedSource = sf.name.toLowerCase().replace(/[_\-\s]+/g, "");
      const match = hsProps.find((hp) => {
        const normalizedTarget = hp.label.toLowerCase().replace(/[_\-\s]+/g, "");
        const normalizedName = hp.name.toLowerCase().replace(/[_\-\s]+/g, "");
        return normalizedTarget === normalizedSource || normalizedName === normalizedSource ||
          normalizedTarget.includes(normalizedSource) || normalizedSource.includes(normalizedTarget);
      });
      if (match && !newMappings.some((m) => m.target === match.name)) {
        newMappings.push({ source: sf.name, target: match.name, targetLabel: match.label });
      }
    });
    setMappings(newMappings);
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Data mapping studio</div>
        <div style={S.pageDesc}>Map source system fields to HubSpot properties for {portal.name}. Drag source fields to HubSpot properties or use auto-map.</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <label style={S.label}>Target object</label>
          <select style={{ ...S.select, width: 180 }} value={objectType} onChange={(e) => { setObjectType(e.target.value); setMappings([]); }}>
            <option value="contacts">Contacts</option>
            <option value="companies">Companies</option>
            <option value="deals">Deals</option>
          </select>
        </div>
        <div style={{ flex: 1 }} />
        <button style={S.btn("secondary")} onClick={autoMap}>
          <Icon d={icons.zap} size={14} /> Auto-map fields
        </button>
        <button style={S.btn("outline")} onClick={() => setMappings([])}>
          <Icon d={icons.refresh} size={14} /> Clear all
        </button>
        <button style={S.btn("primary")}>
          <Icon d={icons.download} size={14} /> Export mapping
        </button>
      </div>

      {/* Mapping summary */}
      {mappings.length > 0 && (
        <div style={{ ...S.card, marginBottom: 20 }}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Active mappings ({mappings.length})</div>
            <span style={S.badge("green")}>{mappings.length} of {sourceFields.length} mapped</span>
          </div>
          <div style={{ padding: "8px 12px", maxHeight: 200, overflowY: "auto" }}>
            {mappings.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 8px", borderBottom: i < mappings.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
                <span style={{ ...S.tag, background: C.bluePale, color: C.blue }}>{m.source}</span>
                <Icon d={icons.arrow} size={14} color={C.gray400} />
                <span style={{ ...S.tag, background: C.olivePale, color: "#4e5022" }}>{m.targetLabel}</span>
                <span style={{ fontSize: 11, color: C.gray400, fontFamily: "monospace" }}>{m.target}</span>
                <div style={{ flex: 1 }} />
                <button onClick={() => removeMapping(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: C.gray400 }}>
                  <Icon d={icons.x} size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two-panel mapper */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Source fields */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Source fields</div>
            <span style={S.badge()}>{sourceFields.length} fields</span>
          </div>
          <div style={{ padding: "8px 12px", maxHeight: 420, overflowY: "auto" }}>
            {sourceFields.map((sf) => {
              const isMapped = mappedSourceNames.includes(sf.name);
              return (
                <div key={sf.name} draggable={!isMapped}
                  onDragStart={() => setDragSource(sf.name)}
                  onDragEnd={() => setDragSource(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 2,
                    borderRadius: 6, cursor: isMapped ? "default" : "grab", opacity: isMapped ? 0.45 : 1,
                    background: dragSource === sf.name ? C.bluePale : "transparent",
                    border: `1px solid ${isMapped ? C.gray200 : "transparent"}`,
                    transition: "all 0.1s",
                  }}>
                  <Icon d={icons.grip} size={14} color={C.gray300} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: isMapped ? C.gray400 : C.gray800 }}>{sf.name}</div>
                    <div style={{ fontSize: 11, color: C.gray400 }}>
                      {sf.type} {sf.sample && `· "${sf.sample}"`}
                    </div>
                  </div>
                  {isMapped && <Icon d={icons.check} size={14} color="#34d399" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* HubSpot properties */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>HubSpot {objectType} properties</div>
            <span style={S.badge("green")}>{hsProps.length} props</span>
          </div>
          <div style={{ padding: "8px 12px 4px" }}>
            <input style={{ ...S.input, marginBottom: 8 }} placeholder="Search properties..." value={searchProp} onChange={(e) => setSearchProp(e.target.value)} />
          </div>
          <div style={{ padding: "0 12px 8px", maxHeight: 360, overflowY: "auto" }}>
            {filteredProps.map((hp) => {
              const isMapped = mappedHsNames.includes(hp.name);
              return (
                <div key={hp.name}
                  onDragOver={(e) => { if (dragSource && !isMapped) e.preventDefault(); }}
                  onDrop={() => { if (dragSource && !isMapped) { addMapping(dragSource, hp.name); setDragSource(null); } }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", marginBottom: 2,
                    borderRadius: 6, opacity: isMapped ? 0.45 : 1,
                    border: `1px dashed ${dragSource && !isMapped ? C.blue : "transparent"}`,
                    background: isMapped ? C.gray50 : "transparent",
                    transition: "all 0.1s",
                  }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: isMapped ? C.gray400 : C.gray800, display: "flex", alignItems: "center", gap: 6 }}>
                      {hp.label}
                      {hp.custom && <span style={S.badge("orange")}>custom</span>}
                    </div>
                    <div style={{ fontSize: 11, color: C.gray400 }}>
                      {hp.name} · {hp.type} · {hp.fieldType}
                    </div>
                  </div>
                  {isMapped && <Icon d={icons.check} size={14} color="#34d399" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── File Import ─── */
function FileImport({ portal }) {
  const [objectType, setObjectType] = useState("contacts");
  const [fileName, setFileName] = useState("");
  const [importStatus, setImportStatus] = useState(null);

  const mockImport = () => {
    setImportStatus({ state: "processing", progress: 0, total: 1247 });
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 25;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setImportStatus({ state: "complete", progress: 100, total: 1247, created: 1189, updated: 42, errors: 16 });
      } else {
        setImportStatus((prev) => ({ ...prev, progress: Math.round(p) }));
      }
    }, 400);
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>File import</div>
        <div style={S.pageDesc}>Upload CSV files to import records into {portal.name} via the HubSpot Import API.</div>
      </div>
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={S.cardHeader}><div style={S.cardTitle}>Import configuration</div></div>
        <div style={S.cardBody}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={S.label}>Object type</label>
              <select style={S.select} value={objectType} onChange={(e) => setObjectType(e.target.value)}>
                <option value="contacts">Contacts</option>
                <option value="companies">Companies</option>
                <option value="deals">Deals</option>
                <option value="tickets">Tickets</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Import name (optional)</label>
              <input style={S.input} placeholder="e.g. Acme Corp contacts - batch 1" />
            </div>
          </div>
          {/* Upload zone */}
          <div style={{
            border: `2px dashed ${C.gray300}`, borderRadius: 10, padding: "32px 24px", textAlign: "center",
            cursor: "pointer", transition: "all 0.15s", background: C.gray50, marginBottom: 16,
          }}
            onClick={() => setFileName("acme-contacts-export.csv")}>
            <div style={S.emptyIcon}><Icon d={icons.upload} size={22} color={C.gray400} /></div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.gray600, marginBottom: 4 }}>
              {fileName ? fileName : "Click to select CSV file"}
            </div>
            <div style={{ fontSize: 12, color: C.gray400 }}>
              {fileName ? "1,247 rows · 12 columns detected" : "or drag and drop here · CSV files up to 50MB"}
            </div>
          </div>
          {fileName && (
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button style={S.btn("outline")} onClick={() => { setFileName(""); setImportStatus(null); }}>Cancel</button>
              <button style={S.btn("primary")} onClick={mockImport}>
                <Icon d={icons.upload} size={14} /> Start import
              </button>
            </div>
          )}
        </div>
      </div>

      {importStatus && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Import progress</div>
            <span style={S.badge(importStatus.state === "complete" ? "green" : "blue")}>
              {importStatus.state === "complete" ? "Complete" : `${importStatus.progress}%`}
            </span>
          </div>
          <div style={S.cardBody}>
            <div style={{ height: 6, background: C.gray100, borderRadius: 3, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ height: "100%", width: `${importStatus.progress}%`, background: importStatus.state === "complete" ? "#34d399" : C.blue, borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            {importStatus.state === "complete" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                  { label: "Total rows", value: importStatus.total, color: C.gray700 },
                  { label: "Created", value: importStatus.created, color: "#34d399" },
                  { label: "Updated", value: importStatus.updated, color: C.blue },
                  { label: "Errors", value: importStatus.errors, color: C.red },
                ].map((s, i) => (
                  <div key={i} style={{ background: C.gray50, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: C.gray400, fontWeight: 500, marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: s.color }}>{s.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Bulk Record Manager ─── */
function BulkRecords({ portal }) {
  const [objectType, setObjectType] = useState("contacts");
  const [action, setAction] = useState("archive");
  const [ids, setIds] = useState("");
  const [result, setResult] = useState(null);

  const parsedIds = ids.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);

  const mockExecute = () => {
    const total = parsedIds.length;
    setResult({ state: "complete", total, success: total - 2, failed: 2, action });
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Bulk record manager</div>
        <div style={S.pageDesc}>Archive or purge records in bulk for {portal.name}. Paste record IDs below — they'll be processed in chunks of 100.</div>
      </div>
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={S.cardBody}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={S.label}>Object type</label>
              <select style={S.select} value={objectType} onChange={(e) => setObjectType(e.target.value)}>
                <option value="contacts">Contacts</option><option value="companies">Companies</option>
                <option value="deals">Deals</option><option value="tickets">Tickets</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Action</label>
              <select style={S.select} value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="archive">Archive (soft delete)</option>
                <option value="purge">Purge (GDPR delete for contacts)</option>
              </select>
            </div>
          </div>
          {action === "purge" && (
            <div style={{ background: C.redPale, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: C.red, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon d={icons.zap} size={14} color={C.red} />
              Purge is permanent. Contacts will be GDPR-deleted. Companies will be archived with a deletion note.
            </div>
          )}
          <label style={S.label}>Record IDs (one per line or comma-separated)</label>
          <textarea style={{ ...S.input, height: 120, fontFamily: "monospace", fontSize: 12, resize: "vertical" }}
            placeholder={"12345\n67890\n24680\n..."}
            value={ids} onChange={(e) => setIds(e.target.value)} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <span style={{ fontSize: 12, color: C.gray400 }}>
              {parsedIds.length} IDs detected · {Math.ceil(parsedIds.length / 100)} API calls needed
            </span>
            <button style={S.btn(action === "purge" ? "danger" : "primary")} onClick={mockExecute} disabled={parsedIds.length === 0}>
              {action === "archive" ? "Archive" : "Purge"} {parsedIds.length} records
            </button>
          </div>
        </div>
      </div>
      {result && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Results</div>
            <span style={S.badge("green")}>Complete</span>
          </div>
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div style={{ background: C.gray50, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.gray400, fontWeight: 500, marginBottom: 2 }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.gray700 }}>{result.total}</div>
            </div>
            <div style={{ background: C.gray50, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.gray400, fontWeight: 500, marginBottom: 2 }}>Success</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#34d399" }}>{result.success}</div>
            </div>
            <div style={{ background: C.gray50, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: C.gray400, fontWeight: 500, marginBottom: 2 }}>Failed</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.red }}>{result.failed}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Property Architect ─── */
function PropertyArchitect({ portal }) {
  const [objectType, setObjectType] = useState("contacts");
  const [label, setLabel] = useState("");
  const [propType, setPropType] = useState("string");
  const [fieldType, setFieldType] = useState("text");
  const [groupName, setGroupName] = useState("contactinformation");
  const [description, setDescription] = useState("");
  const [hasUnique, setHasUnique] = useState(false);
  const [options, setOptions] = useState("");
  const [created, setCreated] = useState([]);

  const internalName = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

  const TYPE_MAP = {
    string: ["text", "textarea", "phonenumber", "file"],
    number: ["number"],
    enumeration: ["select", "radio", "checkbox", "booleancheckbox"],
    datetime: ["date"],
    date: ["date"],
    bool: ["booleancheckbox"],
  };

  const fieldTypes = TYPE_MAP[propType] || ["text"];

  const mockCreate = () => {
    setCreated([...created, { label, name: internalName, type: propType, fieldType, objectType }]);
    setLabel(""); setDescription("");
  };

  const payload = {
    name: internalName || "property_name",
    label: label || "Property label",
    type: propType, fieldType, groupName, description,
    ...(hasUnique ? { hasUniqueValue: true } : {}),
    ...(propType === "enumeration" ? { options: options.split("\n").filter(Boolean).map((o, i) => ({ label: o.trim(), value: o.trim().toLowerCase().replace(/\s+/g, "_"), displayOrder: i })) } : {}),
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Property architect</div>
        <div style={S.pageDesc}>Build and create HubSpot properties for {portal.name} with full type/field validation.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={S.card}>
          <div style={S.cardHeader}><div style={S.cardTitle}>Property builder</div></div>
          <div style={S.cardBody}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><label style={S.label}>Object type</label>
                <select style={S.select} value={objectType} onChange={(e) => setObjectType(e.target.value)}>
                  <option value="contacts">Contacts</option><option value="companies">Companies</option>
                  <option value="deals">Deals</option><option value="tickets">Tickets</option>
                </select></div>
              <div><label style={S.label}>Group</label>
                <input style={S.input} value={groupName} onChange={(e) => setGroupName(e.target.value)} /></div>
            </div>
            <div style={{ marginBottom: 12 }}><label style={S.label}>Property label</label>
              <input style={S.input} placeholder="e.g. Source system" value={label} onChange={(e) => setLabel(e.target.value)} /></div>
            {internalName && <div style={{ fontSize: 11, color: C.gray400, marginTop: -8, marginBottom: 12, fontFamily: "monospace" }}>Internal name: {internalName}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><label style={S.label}>Type</label>
                <select style={S.select} value={propType} onChange={(e) => { setPropType(e.target.value); setFieldType(TYPE_MAP[e.target.value]?.[0] || "text"); }}>
                  <option value="string">String</option><option value="number">Number</option>
                  <option value="enumeration">Enumeration</option><option value="datetime">Date/Time</option>
                  <option value="bool">Boolean</option>
                </select></div>
              <div><label style={S.label}>Field type</label>
                <select style={S.select} value={fieldType} onChange={(e) => setFieldType(e.target.value)}>
                  {fieldTypes.map((ft) => <option key={ft} value={ft}>{ft}</option>)}
                </select></div>
            </div>
            {propType === "enumeration" && (
              <div style={{ marginBottom: 12 }}><label style={S.label}>Options (one per line)</label>
                <textarea style={{ ...S.input, height: 80, resize: "vertical" }} placeholder={"Option 1\nOption 2\nOption 3"} value={options} onChange={(e) => setOptions(e.target.value)} /></div>
            )}
            <div style={{ marginBottom: 12 }}><label style={S.label}>Description</label>
              <input style={S.input} placeholder="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <input type="checkbox" id="unique" checked={hasUnique} onChange={(e) => setHasUnique(e.target.checked)} />
              <label htmlFor="unique" style={{ fontSize: 13, color: C.gray600, cursor: "pointer" }}>Has unique value (create only)</label>
            </div>
            <button style={{ ...S.btn("primary"), width: "100%", justifyContent: "center" }} onClick={mockCreate} disabled={!label}>
              <Icon d={icons.plus} size={14} /> Create property
            </button>
          </div>
        </div>

        <div>
          <div style={{ ...S.card, marginBottom: 16 }}>
            <div style={S.cardHeader}><div style={S.cardTitle}>API payload preview</div></div>
            <div style={{ padding: 16 }}>
              <pre style={{ fontSize: 11, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: C.gray700, background: C.gray50, borderRadius: 8, padding: 14, overflow: "auto", maxHeight: 260, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>
          {created.length > 0 && (
            <div style={S.card}>
              <div style={S.cardHeader}><div style={S.cardTitle}>Created this session ({created.length})</div></div>
              <div style={{ padding: "8px 12px" }}>
                {created.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 8px", borderBottom: i < created.length - 1 ? `1px solid ${C.gray100}` : "none" }}>
                    <Icon d={icons.check} size={14} color="#34d399" />
                    <span style={{ fontWeight: 500, fontSize: 13, color: C.gray800 }}>{c.label}</span>
                    <span style={{ fontSize: 11, color: C.gray400, fontFamily: "monospace" }}>{c.name}</span>
                    <div style={{ flex: 1 }} />
                    <span style={S.badge()}>{c.objectType}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Schema Explorer ─── */
function SchemaExplorer({ portal }) {
  const [objectType, setObjectType] = useState("contacts");
  const [search, setSearch] = useState("");
  const [filterCustom, setFilterCustom] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const props = SAMPLE_PROPERTIES[objectType] || [];
  const filtered = props.filter((p) => {
    if (filterCustom === "custom" && !p.custom) return false;
    if (filterCustom === "default" && p.custom) return false;
    if (filterType !== "all" && p.type !== filterType) return false;
    if (search && !p.label.toLowerCase().includes(search.toLowerCase()) && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const types = [...new Set(props.map((p) => p.type))];
  const groups = [...new Set(props.map((p) => p.group))];

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Schema explorer</div>
        <div style={S.pageDesc}>Browse and audit all properties for {portal.name}. Filter, search, and export property schemas by object type.</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div><label style={S.label}>Object type</label>
          <select style={{ ...S.select, width: 160 }} value={objectType} onChange={(e) => setObjectType(e.target.value)}>
            <option value="contacts">Contacts</option><option value="companies">Companies</option><option value="deals">Deals</option>
          </select></div>
        <div style={{ flex: 1, minWidth: 200 }}><label style={S.label}>Search</label>
          <input style={S.input} placeholder="Search by name or label..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div><label style={S.label}>Scope</label>
          <select style={{ ...S.select, width: 120 }} value={filterCustom} onChange={(e) => setFilterCustom(e.target.value)}>
            <option value="all">All</option><option value="custom">Custom only</option><option value="default">Default only</option>
          </select></div>
        <div><label style={S.label}>Type</label>
          <select style={{ ...S.select, width: 140 }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select></div>
        <button style={S.btn("outline")}><Icon d={icons.download} size={14} /> Export CSV</button>
      </div>
      <div style={{ ...S.card, marginBottom: 12 }}>
        <div style={{ padding: "10px 20px", display: "flex", gap: 16, fontSize: 12, color: C.gray500, borderBottom: `1px solid ${C.gray100}` }}>
          <span>{filtered.length} properties</span>
          <span>{props.filter((p) => p.custom).length} custom</span>
          <span>{groups.length} groups</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Label</th><th style={S.th}>Internal name</th><th style={S.th}>Type</th>
                <th style={S.th}>Field type</th><th style={S.th}>Group</th><th style={S.th}>Scope</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.name} style={{ transition: "background 0.1s" }} onMouseEnter={(e) => e.currentTarget.style.background = C.gray50} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...S.td, fontWeight: 500 }}>{p.label}</td>
                  <td style={{ ...S.td, fontFamily: "monospace", fontSize: 12, color: C.gray500 }}>{p.name}</td>
                  <td style={S.td}><span style={S.badge()}>{p.type}</span></td>
                  <td style={S.td}><span style={{ fontSize: 12, color: C.gray500 }}>{p.fieldType}</span></td>
                  <td style={{ ...S.td, fontSize: 12, color: C.gray500 }}>{p.group}</td>
                  <td style={S.td}><span style={S.badge(p.custom ? "orange" : "blue")}>{p.custom ? "custom" : "default"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Record Explorer ─── */
function RecordExplorer({ portal }) {
  const [objectType, setObjectType] = useState("contacts");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const mockSearch = () => {
    setResults([
      { id: "501", props: { email: "jane.smith@acme.com", firstname: "Jane", lastname: "Smith", company: "Acme Corp", lifecyclestage: "lead" } },
      { id: "502", props: { email: "john.doe@techstart.io", firstname: "John", lastname: "Doe", company: "TechStart Inc", lifecyclestage: "customer" } },
      { id: "503", props: { email: "maria.garcia@medflow.com", firstname: "Maria", lastname: "Garcia", company: "MedFlow Health", lifecyclestage: "opportunity" } },
      { id: "504", props: { email: "alex.chen@startup.co", firstname: "Alex", lastname: "Chen", company: "Startup Co", lifecyclestage: "subscriber" } },
      { id: "505", props: { email: "sam.wilson@enterprise.com", firstname: "Sam", lastname: "Wilson", company: "Enterprise Ltd", lifecyclestage: "lead" } },
    ]);
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Record explorer</div>
        <div style={S.pageDesc}>Search and browse CRM records in {portal.name}. Uses the HubSpot search API with filters.</div>
      </div>
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={S.cardBody}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div><label style={S.label}>Object type</label>
              <select style={{ ...S.select, width: 160 }} value={objectType} onChange={(e) => setObjectType(e.target.value)}>
                <option value="contacts">Contacts</option><option value="companies">Companies</option>
                <option value="deals">Deals</option><option value="tickets">Tickets</option>
              </select></div>
            <div style={{ flex: 1 }}><label style={S.label}>Search query</label>
              <input style={S.input} placeholder='Search by name, email, or use filters...' value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && mockSearch()} /></div>
            <button style={S.btn("primary")} onClick={mockSearch}><Icon d={icons.search} size={14} /> Search</button>
          </div>
        </div>
      </div>
      {results && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>{results.length} results</div>
            <span style={S.badge("blue")}>{objectType}</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead><tr>
                <th style={S.th}>ID</th><th style={S.th}>Name</th><th style={S.th}>Email</th>
                <th style={S.th}>Company</th><th style={S.th}>Lifecycle</th>
              </tr></thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} style={{ cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = C.gray50} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <td style={{ ...S.td, fontFamily: "monospace", fontSize: 12 }}>{r.id}</td>
                    <td style={{ ...S.td, fontWeight: 500 }}>{r.props.firstname} {r.props.lastname}</td>
                    <td style={{ ...S.td, color: C.blue }}>{r.props.email}</td>
                    <td style={S.td}>{r.props.company}</td>
                    <td style={S.td}><span style={S.badge(r.props.lifecyclestage === "customer" ? "green" : r.props.lifecyclestage === "opportunity" ? "orange" : "blue")}>{r.props.lifecyclestage}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Batch Property Creator ─── */
function BatchProperties({ portal }) {
  const [rows, setRows] = useState([
    { label: "Source system", type: "string", fieldType: "text", group: "custom_migration", description: "" },
    { label: "Legacy record ID", type: "string", fieldType: "text", group: "custom_migration", description: "" },
    { label: "Data quality score", type: "number", fieldType: "number", group: "custom_migration", description: "" },
    { label: "Migration date", type: "datetime", fieldType: "date", group: "custom_migration", description: "" },
  ]);
  const [objectType, setObjectType] = useState("contacts");

  const updateRow = (idx, key, val) => {
    const updated = [...rows];
    updated[idx] = { ...updated[idx], [key]: val };
    setRows(updated);
  };

  const addRow = () => setRows([...rows, { label: "", type: "string", fieldType: "text", group: "custom_migration", description: "" }]);
  const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Batch property creator</div>
        <div style={S.pageDesc}>Create multiple properties at once for {portal.name}. Build a table of properties and create them in a single batch.</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-end" }}>
        <div><label style={S.label}>Object type</label>
          <select style={{ ...S.select, width: 160 }} value={objectType} onChange={(e) => setObjectType(e.target.value)}>
            <option value="contacts">Contacts</option><option value="companies">Companies</option>
            <option value="deals">Deals</option><option value="tickets">Tickets</option>
          </select></div>
        <div style={{ flex: 1 }} />
        <button style={S.btn("outline")} onClick={addRow}><Icon d={icons.plus} size={14} /> Add row</button>
        <button style={S.btn("primary")}><Icon d={icons.zap} size={14} /> Create {rows.filter((r) => r.label).length} properties</button>
      </div>
      <div style={{ ...S.card, overflowX: "auto" }}>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Label</th><th style={S.th}>Type</th><th style={S.th}>Field type</th>
            <th style={S.th}>Group</th><th style={S.th}>Description</th><th style={{ ...S.th, width: 36 }}></th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={S.td}><input style={{ ...S.input, padding: "6px 8px" }} value={r.label} onChange={(e) => updateRow(i, "label", e.target.value)} placeholder="Property label" /></td>
                <td style={S.td}><select style={{ ...S.select, padding: "6px 8px" }} value={r.type} onChange={(e) => updateRow(i, "type", e.target.value)}>
                  <option value="string">string</option><option value="number">number</option>
                  <option value="enumeration">enumeration</option><option value="datetime">datetime</option>
                </select></td>
                <td style={S.td}><select style={{ ...S.select, padding: "6px 8px" }} value={r.fieldType} onChange={(e) => updateRow(i, "fieldType", e.target.value)}>
                  <option value="text">text</option><option value="textarea">textarea</option><option value="number">number</option>
                  <option value="select">select</option><option value="radio">radio</option><option value="date">date</option>
                  <option value="checkbox">checkbox</option><option value="phonenumber">phonenumber</option>
                </select></td>
                <td style={S.td}><input style={{ ...S.input, padding: "6px 8px" }} value={r.group} onChange={(e) => updateRow(i, "group", e.target.value)} /></td>
                <td style={S.td}><input style={{ ...S.input, padding: "6px 8px" }} value={r.description} onChange={(e) => updateRow(i, "description", e.target.value)} placeholder="Optional" /></td>
                <td style={S.td}><button onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: C.gray400 }}><Icon d={icons.x} size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Integration Designer ─── */
function IntegrationDesigner({ portal }) {
  const [steps, setSteps] = useState([
    { id: 1, type: "source", label: "Salesforce", detail: "Nightly SOQL export via Connected App", tech: "REST API" },
    { id: 2, type: "middleware", label: "Tray.io", detail: "Transform, deduplicate, validate email format", tech: "Tray workflow" },
    { id: 3, type: "destination", label: "HubSpot", detail: "Upsert contacts via batch create/update", tech: "CRM API v3" },
  ]);
  const [syncFreq, setSyncFreq] = useState("daily");
  const [errorHandling, setErrorHandling] = useState("retry-3x");

  const addStep = () => setSteps([...steps, { id: Date.now(), type: "middleware", label: "New step", detail: "", tech: "" }]);
  const updateStep = (id, key, val) => setSteps(steps.map((s) => s.id === id ? { ...s, [key]: val } : s));

  const typeColors = { source: C.blue, middleware: C.orange, destination: "#34d399" };
  const typeLabels = { source: "Source", middleware: "Middleware", destination: "Destination" };

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Integration designer</div>
        <div style={S.pageDesc}>Design and document integration flows for {portal.name}. Define source → middleware → HubSpot data pipelines.</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div><label style={S.label}>Sync frequency</label>
          <select style={{ ...S.select, width: 160 }} value={syncFreq} onChange={(e) => setSyncFreq(e.target.value)}>
            <option value="realtime">Real-time</option><option value="hourly">Hourly</option>
            <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="manual">Manual</option>
          </select></div>
        <div><label style={S.label}>Error handling</label>
          <select style={{ ...S.select, width: 180 }} value={errorHandling} onChange={(e) => setErrorHandling(e.target.value)}>
            <option value="retry-3x">Retry 3x with backoff</option><option value="retry-5x">Retry 5x with backoff</option>
            <option value="dead-letter">Dead letter queue</option><option value="alert-only">Alert only</option>
          </select></div>
        <div style={{ flex: 1 }} />
        <button style={S.btn("outline")} onClick={addStep}><Icon d={icons.plus} size={14} /> Add step</button>
        <button style={S.btn("primary")}><Icon d={icons.download} size={14} /> Export spec</button>
      </div>

      {/* Flow visualization */}
      <div style={{ display: "flex", gap: 0, alignItems: "stretch", marginBottom: 20, overflowX: "auto", padding: "4px 0" }}>
        {steps.map((step, i) => (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ ...S.card, padding: "16px 18px", minWidth: 200, maxWidth: 260, borderTop: `3px solid ${typeColors[step.type]}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ ...S.badge(step.type === "source" ? "blue" : step.type === "middleware" ? "orange" : "green"), fontSize: 10 }}>{typeLabels[step.type]}</span>
                <span style={{ fontSize: 10, color: C.gray400 }}>Step {i + 1}</span>
              </div>
              <input style={{ ...S.input, fontWeight: 600, fontSize: 14, border: "none", padding: "0 0 4px", background: "transparent" }}
                value={step.label} onChange={(e) => updateStep(step.id, "label", e.target.value)} />
              <textarea style={{ ...S.input, height: 48, fontSize: 12, resize: "none", border: "none", padding: 0, background: "transparent", color: C.gray500 }}
                value={step.detail} onChange={(e) => updateStep(step.id, "detail", e.target.value)} placeholder="Describe this step..." />
              <div style={{ marginTop: 6 }}>
                <select style={{ ...S.select, padding: "4px 8px", fontSize: 11, width: "auto" }} value={step.type}
                  onChange={(e) => updateStep(step.id, "type", e.target.value)}>
                  <option value="source">Source</option><option value="middleware">Middleware</option><option value="destination">Destination</option>
                </select>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ padding: "0 8px", color: C.gray300, flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.gray300} strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}><div style={S.cardTitle}>Integration spec preview</div></div>
        <div style={{ padding: 16 }}>
          <pre style={{ fontSize: 11, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: C.gray700, background: C.gray50, borderRadius: 8, padding: 14, overflow: "auto", maxHeight: 200, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {JSON.stringify({
              client: portal.name, hubId: portal.hubId, syncFrequency: syncFreq, errorHandling,
              steps: steps.map((s, i) => ({ order: i + 1, type: s.type, system: s.label, description: s.detail, technology: s.tech })),
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ─── Workflow Templates ─── */
function WorkflowTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const templates = [
    { id: 1, name: "Lead routing by territory", category: "Lead management", language: "Node.js (Custom coded action)",
      description: "Route leads to owners based on state/region property using a territory mapping object.",
      code: `// HubSpot Custom Coded Action — Lead Routing\nconst hubspot = require('@hubspot/api-client');\n\nexports.main = async (event, callback) => {\n  const hubspotClient = new hubspot.Client({ accessToken: process.env.SECRET_TOKEN });\n  const state = event.inputFields['state'];\n\n  const TERRITORY_MAP = {\n    'CA': 'owner-id-west',\n    'NY': 'owner-id-east',\n    'TX': 'owner-id-central',\n    // Add territories...\n  };\n\n  const ownerId = TERRITORY_MAP[state] || 'owner-id-default';\n\n  callback({ outputFields: { hubspot_owner_id: ownerId } });\n};` },
    { id: 2, name: "Data enrichment webhook", category: "Data quality", language: "Webhook workflow",
      description: "Trigger on contact creation to enrich via external API and update HubSpot properties.",
      code: `// Webhook endpoint for data enrichment\n// POST /api/webhooks/enrich\n\napp.post('/api/webhooks/enrich', async (req, res) => {\n  const { objectId, properties } = req.body;\n  const email = properties.email;\n\n  // Call enrichment API\n  const enriched = await enrichmentService.lookup(email);\n\n  // Update HubSpot record\n  await hubspotClient.crm.contacts.basicApi.update(objectId, {\n    properties: {\n      company: enriched.company,\n      jobtitle: enriched.title,\n      custom_enrichment_date: new Date().toISOString(),\n    }\n  });\n\n  res.json({ status: 'enriched' });\n});` },
    { id: 3, name: "Deal stage notification", category: "Notifications", language: "Node.js (Custom coded action)",
      description: "Send a Slack notification when a deal moves to a specific stage.",
      code: `// Custom Coded Action — Deal Stage Slack Alert\nconst axios = require('axios');\n\nexports.main = async (event, callback) => {\n  const dealName = event.inputFields['dealname'];\n  const amount = event.inputFields['amount'];\n  const stage = event.inputFields['dealstage'];\n\n  await axios.post(process.env.SECRET_SLACK_WEBHOOK, {\n    text: \`Deal "\${dealName}" moved to \${stage}\\nAmount: $\${Number(amount).toLocaleString()}\`,\n  });\n\n  callback({ outputFields: { notification_sent: 'true' } });\n};` },
    { id: 4, name: "FTP file sync trigger", category: "Integration", language: "Tray.io connector",
      description: "Poll FTP server for new CSV files, parse and upsert contacts into HubSpot.",
      code: `// Tray.io Workflow Pseudocode — FTP Sync\n// Trigger: Scheduled (daily at 2:00 AM EST)\n\n1. FTP Connector → List files in /exports/daily/\n2. Filter → Only .csv files modified today\n3. Loop → For each file:\n   a. FTP Connector → Download file\n   b. CSV Parser → Parse rows\n   c. Data Mapper → Transform fields:\n      - "Email Address" → email\n      - "First_Name" → firstname\n      - "Company" → company\n   d. HubSpot Connector → Batch create/update contacts\n      - Batch size: 100\n      - Dedupe on: email\n   e. FTP Connector → Move file to /exports/processed/\n4. Slack Connector → Send summary notification` },
  ];

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Workflow templates</div>
        <div style={S.pageDesc}>Reusable code templates for HubSpot custom coded actions, webhook workflows, and integration patterns.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: selectedTemplate ? "280px 1fr" : "1fr", gap: 16 }}>
        <div>
          {templates.map((t) => (
            <div key={t.id} onClick={() => setSelectedTemplate(t)}
              style={{ ...S.card, padding: "14px 16px", marginBottom: 8, cursor: "pointer",
                borderColor: selectedTemplate?.id === t.id ? C.blue : C.gray200,
                background: selectedTemplate?.id === t.id ? C.bluePale : C.white }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.gray800, marginBottom: 4 }}>{t.name}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={S.badge("blue")}>{t.category}</span>
                <span style={S.badge()}>{t.language.split(" ")[0]}</span>
              </div>
            </div>
          ))}
        </div>
        {selectedTemplate && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              <div>
                <div style={S.cardTitle}>{selectedTemplate.name}</div>
                <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>{selectedTemplate.description}</div>
              </div>
              <button style={S.btn("outline")}><Icon d={icons.copy} size={14} /> Copy</button>
            </div>
            <div style={{ padding: 16 }}>
              <pre style={{ fontSize: 12, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: C.gray700, background: C.gray50, borderRadius: 8, padding: 16, overflow: "auto", maxHeight: 400, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {selectedTemplate.code}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Webhook Tester ─── */
function WebhookTester() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("POST");
  const [payload, setPayload] = useState(JSON.stringify({
    objectId: "12345", objectType: "contacts",
    properties: { email: "test@example.com", firstname: "Test", lastname: "Contact" },
    subscriptionType: "contact.creation", eventId: 1001,
  }, null, 2));
  const [response, setResponse] = useState(null);

  const mockSend = () => {
    setResponse({
      status: 200, statusText: "OK", time: "142ms",
      headers: { "content-type": "application/json", "x-request-id": "req_abc123" },
      body: JSON.stringify({ received: true, processed: 1, timestamp: new Date().toISOString() }, null, 2),
    });
  };

  return (
    <div>
      <div style={S.pageHeader}>
        <div style={S.pageTitle}>Webhook tester</div>
        <div style={S.pageDesc}>Send test payloads to webhook endpoints and inspect responses. Useful for testing custom coded actions and Tray.io triggers.</div>
      </div>
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={S.cardBody}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <select style={{ ...S.select, width: 100 }} value={method} onChange={(e) => setMethod(e.target.value)}>
              <option>POST</option><option>PUT</option><option>PATCH</option><option>GET</option>
            </select>
            <input style={{ ...S.input, flex: 1 }} placeholder="https://your-webhook-url.com/endpoint" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button style={S.btn("primary")} onClick={mockSend}><Icon d={icons.zap} size={14} /> Send</button>
          </div>
          <label style={S.label}>Payload (JSON)</label>
          <textarea style={{ ...S.input, height: 180, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 12, resize: "vertical", lineHeight: 1.6 }}
            value={payload} onChange={(e) => setPayload(e.target.value)} />
        </div>
      </div>
      {response && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={S.cardTitle}>Response</div>
              <span style={S.badge(response.status < 300 ? "green" : "red")}>{response.status} {response.statusText}</span>
              <span style={{ fontSize: 11, color: C.gray400 }}>{response.time}</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <pre style={{ fontSize: 12, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: C.gray700, background: C.gray50, borderRadius: 8, padding: 14, overflow: "auto", maxHeight: 200, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {response.body}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Portal Dropdown ─── */
function PortalDropdown({ portal, setPortal }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <div style={S.portalSelect} onClick={() => setOpen(!open)}>
        <div style={S.portalDot(portal.status)} />
        <span style={{ fontWeight: 500 }}>{portal.name}</span>
        <span style={{ fontSize: 11, color: C.gray400 }}>({portal.hubId})</span>
        <Icon d={icons.chevron} size={14} color={C.gray400} />
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: 4, width: 280,
          background: C.white, borderRadius: 10, border: `1px solid ${C.gray200}`,
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)", zIndex: 100, overflow: "hidden",
        }}>
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.gray100}`, fontSize: 11, fontWeight: 600, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Connected portals
          </div>
          {PORTALS.map((p) => (
            <div key={p.id} onClick={() => { setPortal(p); setOpen(false); }}
              style={{
                padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                background: p.id === portal.id ? C.bluePale : "transparent",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { if (p.id !== portal.id) e.currentTarget.style.background = C.gray50; }}
              onMouseLeave={(e) => { if (p.id !== portal.id) e.currentTarget.style.background = "transparent"; }}>
              <div style={S.portalDot(p.status)} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.gray800 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.gray400 }}>Hub ID: {p.hubId}</div>
              </div>
              {p.id === portal.id && <Icon d={icons.check} size={14} color={C.blue} />}
            </div>
          ))}
          <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.gray100}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.blue }}
            onMouseEnter={(e) => e.currentTarget.style.background = C.gray50}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <Icon d={icons.plus} size={14} color={C.blue} /> Connect new portal
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [page, setPage] = useState("home");
  const [portal, setPortal] = useState(PORTALS[0]);
  const [collapsed, setCollapsed] = useState(false);

  const currentNav = NAV.find((n) => n.id === page);
  const pageLabel = currentNav?.label || "Dashboard";

  const renderPage = () => {
    switch (page) {
      case "home": return <DashboardHome portal={portal} setPage={setPage} />;
      case "data-mapper": return <DataMappingStudio portal={portal} />;
      case "file-import": return <FileImport portal={portal} />;
      case "bulk-records": return <BulkRecords portal={portal} />;
      case "record-explorer": return <RecordExplorer portal={portal} />;
      case "property-architect": return <PropertyArchitect portal={portal} />;
      case "schema-explorer": return <SchemaExplorer portal={portal} />;
      case "batch-properties": return <BatchProperties portal={portal} />;
      case "integration-designer": return <IntegrationDesigner portal={portal} />;
      case "workflow-templates": return <WorkflowTemplates />;
      case "webhook-tester": return <WebhookTester />;
      default: return <DashboardHome portal={portal} setPage={setPage} />;
    }
  };

  return (
    <div style={S.app}>
      {/* Sidebar */}
      <div style={S.sidebar(collapsed)}>
        <div style={S.sidebarHeader}>
          <div style={S.logo}>D</div>
          {!collapsed && <div style={S.logoText}>Denamico SA toolkit</div>}
        </div>
        <div style={S.sidebarNav}>
          {NAV.map((item) => {
            if (item.divider) {
              return <div key={item.id} style={S.navDivider(collapsed)}>{collapsed ? "—" : item.label}</div>;
            }
            return (
              <button key={item.id} style={S.navItem(page === item.id, collapsed)}
                onClick={() => setPage(item.id)}
                onMouseEnter={(e) => { if (page !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { if (page !== item.id) e.currentTarget.style.background = "transparent"; }}>
                <Icon d={item.icon} size={18} color={page === item.id ? C.white : "rgba(255,255,255,0.5)"} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
        {/* Sidebar footer */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.slateLight}` }}>
          <button style={S.navItem(false, collapsed)} onClick={() => setCollapsed(!collapsed)}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <Icon d={collapsed ? icons.chevron : icons.menu} size={18} color="rgba(255,255,255,0.5)" />
            {!collapsed && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Collapse sidebar</span>}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div style={S.main}>
        {/* Top bar */}
        <div style={S.topbar}>
          <div style={S.topLeft}>
            <div style={S.breadcrumb}>
              <span style={{ cursor: "pointer" }} onClick={() => setPage("home")}>Home</span>
              {page !== "home" && <>
                <Icon d={icons.chevron} size={12} color={C.gray300} />
                <span style={S.breadcrumbActive}>{pageLabel}</span>
              </>}
            </div>
          </div>
          <div style={S.topRight}>
            <PortalDropdown portal={portal} setPortal={setPortal} />
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.slate, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.white, cursor: "pointer" }}>
              SW
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={S.content}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
