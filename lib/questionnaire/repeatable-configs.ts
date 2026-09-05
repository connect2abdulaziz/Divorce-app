import type { FieldConfig, SummaryConfig } from "@/components/questionnaire/RepeatableList";
import type { CaseBundle, RepeatableTable } from "@/lib/questionnaire/data";
import type { CaseGates } from "@/lib/questionnaire/steps";

type GateColumn =
  | "has_real_estate"
  | "has_vehicles"
  | "has_retirement_accounts"
  | "has_community_debts"
  | "has_household_property"
  | "has_separate_property"
  | "has_separate_debts";

export type RepeatableSectionSlug =
  | "real-estate"
  | "vehicles"
  | "retirement"
  | "community-debts"
  | "household-property"
  | "separate-property"
  | "separate-debts";

export type RepeatableSectionConfig = {
  slug: RepeatableSectionSlug;
  title: string;
  subtitle?: string;
  gateColumn: GateColumn;
  gateKey: keyof CaseGates;
  gateQuestion: string;
  table: RepeatableTable;
  recordKey: keyof CaseBundle["records"];
  addLabel: string;
  emptyLabel: string;
  fields: FieldConfig[];
  summary: SummaryConfig;
};

export const REPEATABLE_SECTION_CONFIGS: Record<RepeatableSectionSlug, RepeatableSectionConfig> = {
  "real-estate": {
    slug: "real-estate",
    title: "Real Estate",
    gateColumn: "has_real_estate",
    gateKey: "hasRealEstate",
    gateQuestion: "Do you or your spouse own any real estate?",
    table: "real_estate",
    recordKey: "real_estate",
    addLabel: "+ Add another property",
    emptyLabel: "No properties added yet.",
    fields: [
      { name: "address", label: "Address", kind: "text", required: true },
      { name: "estimated_value", label: "Estimated value", kind: "currency" },
      { name: "amount_owed", label: "Amount owed (mortgage)", kind: "currency" },
      {
        name: "assigned_to",
        label: "Who keeps it?",
        kind: "select",
        options: [
          { value: "client", label: "Me" },
          { value: "spouse", label: "Spouse" },
          { value: "sell", label: "Sell it" },
          { value: "joint", label: "Keep jointly" },
        ],
      },
    ],
    summary: {
      titleFields: ["address"],
      titleFallback: "Property",
      details: [
        { field: "estimated_value", kind: "currency", label: "Value" },
        { field: "amount_owed", kind: "currency", label: "Owed" },
        { field: "assigned_to", kind: "text", label: "Keeps it:" },
      ],
    },
  },

  vehicles: {
    slug: "vehicles",
    title: "Vehicles",
    gateColumn: "has_vehicles",
    gateKey: "hasVehicles",
    gateQuestion: "Do you or your spouse own any vehicles?",
    table: "vehicles",
    recordKey: "vehicles",
    addLabel: "+ Add another vehicle",
    emptyLabel: "No vehicles added yet.",
    fields: [
      { name: "make", label: "Make", kind: "text", required: true },
      { name: "model", label: "Model", kind: "text", required: true },
      { name: "year", label: "Year", kind: "number" },
      { name: "estimated_value", label: "Estimated value", kind: "currency" },
      { name: "amount_owed", label: "Amount owed", kind: "currency" },
      {
        name: "assigned_to",
        label: "Who keeps it?",
        kind: "select",
        options: [
          { value: "client", label: "Me" },
          { value: "spouse", label: "Spouse" },
        ],
      },
    ],
    summary: {
      titleFields: ["year", "make", "model"],
      titleFallback: "Vehicle",
      details: [
        { field: "estimated_value", kind: "currency", label: "Value" },
        { field: "amount_owed", kind: "currency", label: "Owed" },
        { field: "assigned_to", kind: "text", label: "Keeps it:" },
      ],
    },
  },

  retirement: {
    slug: "retirement",
    title: "Retirement Accounts",
    gateColumn: "has_retirement_accounts",
    gateKey: "hasRetirementAccounts",
    gateQuestion: "Do you or your spouse have a retirement plan, such as a 401(k), pension, or similar account?",
    table: "retirement_accounts",
    recordKey: "retirement_accounts",
    addLabel: "+ Add another retirement account",
    emptyLabel: "No retirement accounts added yet.",
    fields: [
      { name: "plan_type", label: "Type of plan", kind: "text", required: true },
      {
        name: "owner_party",
        label: "Owner",
        kind: "select",
        options: [
          { value: "client", label: "Me" },
          { value: "spouse", label: "Spouse" },
        ],
      },
      { name: "approximate_value", label: "Approximate value", kind: "currency" },
      { name: "division_method", label: "How should it be divided?", kind: "text" },
    ],
    summary: {
      titleFields: ["plan_type"],
      titleFallback: "Retirement account",
      details: [
        { field: "owner_party", kind: "text", label: "Owner:" },
        { field: "approximate_value", kind: "currency", label: "Value" },
        { field: "division_method", kind: "text", label: "Division:" },
      ],
    },
  },

  "community-debts": {
    slug: "community-debts",
    title: "Community Debts",
    subtitle: "The amounts you and your spouse will each pay should normally add up to the total owed.",
    gateColumn: "has_community_debts",
    gateKey: "hasCommunityDebts",
    gateQuestion: "Do you or your spouse have debts that need to be divided?",
    table: "community_debts",
    recordKey: "community_debts",
    addLabel: "+ Add another debt",
    emptyLabel: "No community debts added yet.",
    fields: [
      { name: "creditor", label: "Creditor / type of debt", kind: "text", required: true },
      { name: "amount_owed", label: "Total amount owed", kind: "currency" },
      { name: "amount_client_pays", label: "Amount you will pay", kind: "currency" },
      { name: "amount_spouse_pays", label: "Amount spouse will pay", kind: "currency" },
    ],
    summary: {
      titleFields: ["creditor"],
      titleFallback: "Debt",
      details: [
        { field: "amount_owed", kind: "currency", label: "Total" },
        { field: "amount_client_pays", kind: "currency", label: "You pay" },
        { field: "amount_spouse_pays", kind: "currency", label: "Spouse pays" },
      ],
    },
  },

  "household-property": {
    slug: "household-property",
    title: "Household Property",
    gateColumn: "has_household_property",
    gateKey: "hasHouseholdProperty",
    gateQuestion:
      "Do you have household furniture, appliances, tools, or other personal property that needs to be divided?",
    table: "personal_property",
    recordKey: "personal_property",
    addLabel: "+ Add another item",
    emptyLabel: "No items added yet.",
    fields: [
      { name: "description", label: "Description", kind: "text", required: true },
      { name: "estimated_value", label: "Estimated value", kind: "currency" },
      {
        name: "assigned_to",
        label: "Who keeps it?",
        kind: "select",
        options: [
          { value: "client", label: "Me" },
          { value: "spouse", label: "Spouse" },
        ],
      },
    ],
    summary: {
      titleFields: ["description"],
      titleFallback: "Item",
      details: [
        { field: "estimated_value", kind: "currency", label: "Value" },
        { field: "assigned_to", kind: "text", label: "Keeps it:" },
      ],
    },
  },

  "separate-property": {
    slug: "separate-property",
    title: "Separate Property",
    gateColumn: "has_separate_property",
    gateKey: "hasSeparateProperty",
    gateQuestion: "Did you or your spouse have property acquired before the marriage?",
    table: "separate_property",
    recordKey: "separate_property",
    addLabel: "+ Add another separate property item",
    emptyLabel: "No separate property added yet.",
    fields: [
      { name: "description", label: "Description", kind: "text", required: true },
      { name: "estimated_value", label: "Estimated value", kind: "currency" },
      {
        name: "owner_party",
        label: "Owner",
        kind: "select",
        options: [
          { value: "client", label: "Me" },
          { value: "spouse", label: "Spouse" },
        ],
      },
    ],
    summary: {
      titleFields: ["description"],
      titleFallback: "Item",
      details: [
        { field: "estimated_value", kind: "currency", label: "Value" },
        { field: "owner_party", kind: "text", label: "Owner:" },
      ],
    },
  },

  "separate-debts": {
    slug: "separate-debts",
    title: "Separate Debt",
    gateColumn: "has_separate_debts",
    gateKey: "hasSeparateDebts",
    gateQuestion: "Did you or your spouse have debts accumulated before the marriage?",
    table: "separate_debts",
    recordKey: "separate_debts",
    addLabel: "+ Add another separate debt",
    emptyLabel: "No separate debts added yet.",
    fields: [
      { name: "description", label: "Description / creditor", kind: "text", required: true },
      { name: "amount_owed", label: "Amount owed", kind: "currency" },
      {
        name: "owner_party",
        label: "Who owes the debt?",
        kind: "select",
        options: [
          { value: "client", label: "Me" },
          { value: "spouse", label: "Spouse" },
        ],
      },
    ],
    summary: {
      titleFields: ["description"],
      titleFallback: "Debt",
      details: [
        { field: "amount_owed", kind: "currency", label: "Owed" },
        { field: "owner_party", kind: "text", label: "Owed by:" },
      ],
    },
  },
};
