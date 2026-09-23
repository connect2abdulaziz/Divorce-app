import type { CaseBundle } from "@/lib/documents/case-values";

const baseParties = {
  party_client: {
    first_name: "Jordan",
    middle_name: "A",
    last_name: "Martinez",
    date_of_birth: "1988-04-12",
    height: "5'9\"",
    weight_lbs: 165,
    az_years: 8,
    az_months: 3,
    address_line1: "1842 W Camelback Rd",
    address_line2: "Apt 210",
    city: "Phoenix",
    state: "AZ",
    zip: "85015",
    home_phone: "602-555-0142",
    cell_phone: "602-555-0198",
    phone: "602-555-0198",
    email: "jordan.martinez.test@example.com",
    ssn_last4: "4821",
  },
  party_spouse: {
    first_name: "Alex",
    middle_name: "R",
    last_name: "Martinez",
    date_of_birth: "1986-11-03",
    height: "5'6\"",
    weight_lbs: 140,
    az_years: 8,
    az_months: 3,
    address_line1: "920 E Indian School Rd",
    address_line2: null,
    city: "Phoenix",
    state: "AZ",
    zip: "85014",
    home_phone: null,
    cell_phone: "480-555-0177",
    phone: "480-555-0177",
    email: "alex.martinez.test@example.com",
    ssn_last4: "9033",
    address_unknown: false,
    phone_unknown: false,
    ssn_unknown: false,
  },
  marriage: {
    marriage_date: "2015-06-20",
    separation_date: "2025-09-01",
    marriage_city: "Scottsdale",
    marriage_state: "AZ",
    marriage_location: "Scottsdale, AZ",
    grounds: "Irretrievable breakdown",
    due_date: null,
    restore_former_name: true,
    restored_first_name: "Jordan",
    restored_middle_name: "A",
    restored_last_name: "Chen",
    spouse_is_father: null,
  },
  employment: {
    client_status: "employed",
    client_employer_name: "Desert Tech LLC",
    client_position: "Software Engineer",
    client_employer_phone: "602-555-2200",
    client_employer_address: "2501 E Camelback Rd",
    client_employer_city: "Phoenix",
    client_employer_state: "AZ",
    client_employer_zip: "85016",
    client_monthly_income: 7200,
    client_annual_income: 86400,
    spouse_status: "employed",
    spouse_employer_name: "Valley Medical Group",
    spouse_position: "Office Manager",
    spouse_employer_phone: "480-555-3311",
    spouse_employer_address: "7400 E McDowell Rd",
    spouse_employer_city: "Scottsdale",
    spouse_employer_state: "AZ",
    spouse_employer_zip: "85257",
    spouse_monthly_income: 4100,
    spouse_annual_income: 49200,
  },
  domestic_violence: {
    has_domestic_violence: false,
    order_of_protection_exists: null,
    filed_by: null,
    against_whom: null,
    date_issued: null,
    oop_city: null,
    oop_state: null,
    details: null,
  },
};

const basePropertyRecords = {
  real_estate: [
    {
      id: "re-1",
      address: "1842 W Camelback Rd, Phoenix, AZ 85015",
      estimated_value: 425000,
      amount_owed: 310000,
      assigned_to: "sell",
    },
  ],
  vehicles: [
    {
      id: "v-1",
      year: 2019,
      make: "Toyota",
      model: "RAV4",
      estimated_value: 22000,
      amount_owed: 8000,
      assigned_to: "client",
    },
    {
      id: "v-2",
      year: 2017,
      make: "Honda",
      model: "Civic",
      estimated_value: 14000,
      amount_owed: 0,
      assigned_to: "spouse",
    },
  ],
  retirement_accounts: [
    {
      id: "r-1",
      plan_type: "401(k)",
      owner_party: "client",
      approximate_value: 68000,
      division_method: "Divide 50/50 by QDRO",
    },
  ],
  community_debts: [
    {
      id: "d-1",
      creditor: "Chase Visa",
      amount_owed: 4200,
      amount_client_pays: 2100,
      amount_spouse_pays: 2100,
    },
    {
      id: "d-2",
      creditor: "Capital One auto loan (RAV4)",
      amount_owed: 8000,
      amount_client_pays: 8000,
      amount_spouse_pays: 0,
    },
  ],
  personal_property: [
    {
      id: "h-1",
      description: "Living room sofa set",
      estimated_value: 1200,
      assigned_to: "client",
    },
    {
      id: "h-2",
      description: "Washer and dryer",
      estimated_value: 900,
      assigned_to: "spouse",
    },
  ],
  separate_property: [
    {
      id: "sp-1",
      description: "Inheritance from parent (2022)",
      estimated_value: 15000,
      owner_party: "client",
    },
  ],
  separate_debts: [],
};

const propertyGates = {
  hasCommunityProperty: true,
  hasRealEstate: true,
  hasVehicles: true,
  hasRetirementAccounts: true,
  hasCommunityDebts: true,
  hasHouseholdProperty: true,
  hasSeparateProperty: true,
  hasSeparateDebts: false,
};

/** Sample without-children case for local PDF generation tests. */
export function buildTestCaseBundle(): CaseBundle {
  return {
    kase: {
      id: "00000000-0000-4000-8000-000000000001",
      has_common_children: false,
      has_community_property: true,
      has_real_estate: true,
      has_vehicles: true,
      has_retirement_accounts: true,
      has_community_debts: true,
      has_household_property: true,
      has_separate_property: true,
      has_separate_debts: false,
      is_spouse_pregnant: false,
      last_completed_section: "review",
      questionnaire_status: "submitted",
      last_saved_at: new Date().toISOString(),
    } as CaseBundle["kase"],
    gates: {
      hasCommonChildren: false,
      isSpousePregnant: false,
      clientEmploymentStatus: "employed",
      spouseEmploymentStatus: "employed",
      hasDomesticViolence: false,
      ...propertyGates,
    },
    sections: {
      ...baseParties,
      parenting: null,
      tax_information: {
        dependents_claimed_by: null,
        claim_frequency: null,
        notes: null,
      },
    },
    records: {
      children: [],
      ...basePropertyRecords,
    },
  };
}

/** Sample with-children case for Divorce WC PDF generation tests. */
export function buildTestCaseBundleWithChildren(): CaseBundle {
  return {
    kase: {
      id: "00000000-0000-4000-8000-000000000002",
      has_common_children: true,
      has_community_property: true,
      has_real_estate: true,
      has_vehicles: true,
      has_retirement_accounts: true,
      has_community_debts: true,
      has_household_property: true,
      has_separate_property: true,
      has_separate_debts: false,
      is_spouse_pregnant: false,
      last_completed_section: "review",
      questionnaire_status: "submitted",
      last_saved_at: new Date().toISOString(),
    } as CaseBundle["kase"],
    gates: {
      hasCommonChildren: true,
      isSpousePregnant: false,
      clientEmploymentStatus: "employed",
      spouseEmploymentStatus: "employed",
      hasDomesticViolence: false,
      ...propertyGates,
    },
    sections: {
      ...baseParties,
      parenting: {
        custody_arrangement: "joint",
        decision_making: "joint legal decision-making",
        parenting_time_schedule:
          "Week-on / week-off; exchanges Sundays at 6:00 PM at Party A's residence.",
        notes: "Both parents share holidays alternating by year.",
        visitation_wanted: true,
        visitation_denied_reason: null,
      },
      tax_information: {
        dependents_claimed_by: "split",
        claim_frequency: "alternate years",
        notes: "Jordan claims even years; Alex claims odd years.",
      },
    },
    records: {
      children: [
        {
          id: "child-1",
          first_name: "Mia",
          middle_name: "L",
          last_name: "Martinez",
          date_of_birth: "2017-03-14",
          ssn_last4: "1122",
          child_residences: [
            {
              id: "res-1",
              street_address: "1842 W Camelback Rd Apt 210",
              city: "Phoenix",
              state: "AZ",
              zip: "85015",
              address: "1842 W Camelback Rd Apt 210, Phoenix, AZ 85015",
              lived_with: "both",
              start_date: "2017-03-14",
              end_date: null,
              is_primary_residence: true,
            },
          ],
        },
        {
          id: "child-2",
          first_name: "Noah",
          middle_name: "J",
          last_name: "Martinez",
          date_of_birth: "2020-08-02",
          ssn_last4: "3344",
          child_residences: [
            {
              id: "res-2",
              street_address: "1842 W Camelback Rd Apt 210",
              city: "Phoenix",
              state: "AZ",
              zip: "85015",
              address: "1842 W Camelback Rd Apt 210, Phoenix, AZ 85015",
              lived_with: "both",
              start_date: "2020-08-02",
              end_date: null,
              is_primary_residence: true,
            },
          ],
        },
      ],
      ...basePropertyRecords,
    },
  };
}
