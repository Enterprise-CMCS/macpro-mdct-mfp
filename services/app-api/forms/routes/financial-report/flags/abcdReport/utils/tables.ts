// Qualified HCBS & Demonstration Services pages
export const statePlanServicesHeaders = [
  "Service",
  "Total Computable",
  "Total State / Territory Share",
  "Total Federal Share",
];

export const statePlanServices = (prefix: string) => [
  {
    id: `${prefix}_clinicServices`,
    label: "Clinic Services",
  },
  {
    id: `${prefix}_targetedCaseManagementForLongTermCare`,
    label: "Targeted Case Management for Long Term Care",
  },
  {
    id: `${prefix}_pace`,
    label: "PACE (Program of All-Inclusive Care for the Elderly)",
  },
  {
    id: `${prefix}_rehabilitativeServices`,
    label: "Rehabilitative Services",
  },
  {
    id: `${prefix}_homeHealthServices`,
    label: "Home Health Services",
  },
  {
    id: `${prefix}_hospice`,
    label: "Hospice",
  },
  {
    id: `${prefix}_personalCareServices`,
    label: "Personal Care Services",
  },
  {
    id: `${prefix}_physicalTherapyServices`,
    label: "Physical Therapy Services",
  },
  {
    id: `${prefix}_occupationalTherapyServices`,
    label: "Occupational Therapy Services",
  },
  {
    id: `${prefix}_servicesForSpeechHearingAndLanguageDisorders`,
    label: "Services for Speech, Hearing, and Language Disorders",
  },
  {
    id: `${prefix}_selfDirectedPersonalCareServices`,
    label: "Self-Directed Personal Care Services",
  },
  {
    id: `${prefix}_privateDutyNursing`,
    label: "Private Duty Nursing",
  },
  {
    id: `${prefix}_otherLicensedPractitionerServices`,
    label: "Other Licensed Practitioner Services",
  },
  {
    id: `${prefix}_preventativeServices`,
    label: "Preventative Services",
  },
  {
    id: `${prefix}_healthHomeForEnrolleesWithChronicConditions`,
    label: "Health Home for Enrollees with Chronic Conditions",
  },
  {
    id: `${prefix}_healthHomeForEnrolleesWithSubstanceUseDisorder`,
    label: "Health Home for Enrollees with Substance Use Disorder",
  },
  {
    id: `${prefix}_caseManagementServices`,
    label: "Case Management Services",
  },
  {
    id: `${prefix}_homemakerServices`,
    label: "Homemaker Services",
  },
  {
    id: `${prefix}_companionServices`,
    label: "Companion Services",
  },
  {
    id: `${prefix}_adultDayHealthServices`,
    label: "Adult Day Health Services",
  },
  {
    id: `${prefix}_communityIntegrationServices`,
    label: "Community Integration Services",
  },
  {
    id: `${prefix}_homeBasedHabilitationServices`,
    label: "Home Based Habilitation Services",
  },
  {
    id: `${prefix}_residentialHabilitationServices`,
    label: "Residential Habilitation Services",
  },
  {
    id: `${prefix}_dayHabilitationServices`,
    label: "Day Habilitation Services",
  },
  {
    id: `${prefix}_habilitationPrevocationalServices`,
    label: "Habilitation - Prevocational Services",
  },
  {
    id: `${prefix}_habilitationSupportedEmploymentServices`,
    label: "Habilitation - Supported Employment Services",
  },
  {
    id: `${prefix}_habilitationEducationServices`,
    label: "Habilitation - Education Services",
  },
  {
    id: `${prefix}_otherHabilitationServices`,
    label: "Other Habilitation Services",
  },
  {
    id: `${prefix}_respiteServices`,
    label: "Respite Services",
  },
  {
    id: `${prefix}_liveInCaregiverServices`,
    label: "Live-In Caregiver Services",
  },
  {
    id: `${prefix}_supportsForParticipantDirection`,
    label: "Supports for Participant Direction",
  },
  {
    id: `${prefix}_capitatedPaymentsForLongTermCareServices`,
    label: "Capitated Payments for Long Term Care Services",
  },
];

export const c1915WaiverServices = (prefix: string) => [
  {
    id: `${prefix}_caseManagement`,
    label: "Case Management",
  },
  {
    id: `${prefix}_homemakerServices`,
    label: "Homemaker Services",
  },
  {
    id: `${prefix}_homeHealthAideServices`,
    label: "Home Health Aide Services",
  },
  {
    id: `${prefix}_adultDayHealth`,
    label: "Adult Day Health",
  },
  {
    id: `${prefix}_habilitationResidentialHabilitation`,
    label: "Habilitation: Residential Habilitation",
  },
  {
    id: `${prefix}_habilitationDayHabilitation`,
    label: "Habilitation: Day Habilitation",
  },
  {
    id: `${prefix}_expandedHabilitationServices42Cfr440180cPrevocationalServices`,
    label:
      "Expanded Habilitation Services (42 CFR §440.180(c)): Prevocational Services",
  },
  {
    id: `${prefix}_expandedHabilitationServices42Cfr440180cSupportedEmployment`,
    label:
      "Expanded Habilitation Services (42 CFR §440.180(c)): Supported Employment",
  },
  {
    id: `${prefix}_expandedHabilitationServices42Cfr440180cEducation`,
    label: "Expanded Habilitation Services (42 CFR §440.180(c)): Education",
  },
  {
    id: `${prefix}_respiteCare`,
    label: "Respite Care",
  },
  {
    id: `${prefix}_dayTreatment`,
    label: "Day Treatment",
  },
  {
    id: `${prefix}_partialHospitalization`,
    label: "Partial Hospitalization",
  },
  {
    id: `${prefix}_psychosocialRehabilitation`,
    label: "Psychosocial Rehabilitation",
  },
  {
    id: `${prefix}_clinicServices`,
    label: "Clinic Services",
  },
  {
    id: `${prefix}_liveInCaregiver42Cfr441303f8`,
    label: "Live-In Caregiver (42 CFR §441.303(f)(8))",
  },
  {
    id: `${prefix}_capitatedPaymentsForLongTermCareServices`,
    label: "Capitated Payments for Long Term Care Services",
  },
  {
    id: `${prefix}_personalCareServices`,
    label: "Personal Care Services",
  },
  {
    id: `${prefix}_communityIntegrationServices`,
    label: "Community Integration Services",
  },
  {
    id: `${prefix}_homeBasedHabilitationServices`,
    label: "Home Based Habilitation Services",
  },
  {
    id: `${prefix}_companionServices`,
    label: "Companion Services",
  },
  {
    id: `${prefix}_otherHabilitationServices`,
    label: "Other Habilitation Services",
  },
  {
    id: `${prefix}_supportsForParticipantDirection`,
    label: "Supports for Participant Direction",
  },
];

// Supplemental Services page
export const supplementalServicesHeaders = [
  "Service",
  "Total Computable",
  "Total State / Territory Share",
  "Total Federal Share",
];

export const supplementalServices = (prefix: string) => [
  {
    id: `${prefix}_shortTermHousingAssistance`,
    label: "Short-Term Housing Assistance",
  },
  {
    id: `${prefix}_foodSecurity`,
    label: "Food Security",
  },
  {
    id: `${prefix}_paymentForActivitiesPriorToTransitioning`,
    label: "Payment for Activities Prior to Transitioning",
  },
  {
    id: `${prefix}_paymentForSecuringACommunityBasedHome`,
    label: "Payment for Securing a Community-Based Home",
  },
];

// Administrative Costs page
export const administrativeCostsHeaders = [
  "Budget Category",
  "Total Computable",
  "Override %",
  "Total State / Territory Share",
  "Total Federal Share",
];

export const administrativeCosts = (prefix: string) => [
  {
    id: `${prefix}_personnel`,
    label: "Personnel",
  },
  {
    id: `${prefix}_fringeBenefits`,
    label: "Fringe Benefits",
  },
  {
    id: `${prefix}_travel`,
    label: "Travel",
  },
  {
    id: `${prefix}_equipment`,
    label: "Equipment",
  },
  {
    id: `${prefix}_supplies`,
    label: "Supplies",
  },
  {
    id: `${prefix}_indirectCosts`,
    label: "Indirect Costs",
  },
];

// Totals Summary page
export const totalsSummaryHeaders = [
  "Expenditures",
  "Total Computable",
  "Total State / Territory Share",
  "Total Federal Share",
];

// Totals summary just displays footer values from other tables using their field IDs
export const totalsSummary = (prefix: string) => [
  {
    id: `${prefix}_qualifiedHcbsTotals`,
    label: "Qualified HCBS (State Plan & Waiver Services)",
    readOnly: true,
  },
  {
    id: `${prefix}_demonstrationServicesTotals`,
    label: "Demonstration Services (State Plan & Waiver Services)",
    readOnly: true,
  },
  {
    id: "supplementalServices_category",
    label: "Supplemental Services",
    readOnly: true,
  },
  {
    id: `${prefix}_serviceTotals`,
    label: "Totals - Waivers, State Plan & Supplemental Services",
    readOnly: true,
  },
  {
    id: "administrativeCosts_budgetCategory",
    label: "Administrative Costs",
    readOnly: true,
  },
  {
    id: "administrativeCosts_capacityBuilding",
    label: "Capacity Building",
    readOnly: true,
  },
];

export const capacityBuilding = (prefix: string) => [
  {
    id: `${prefix}_capacityBuilding`,
    label: "Capacity Building",
  },
];

export const personnelHeaders = [
  "Position Title",
  "# of Budget FTEs",
  "# of Filled FTEs",
];

export const subRecipientsHeaders = [
  "Sub Recipient",
  "Describe SOW",
  "Expenditures",
  "Override %",
  "Total State / Territory Share",
  "Total Federal Share",
];
