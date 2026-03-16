import {
  AnyObject,
  BuildServiceField,
  NumberMask,
  ReportFormFieldType,
  ServiceField,
  ServiceFieldType,
  ValidationComparator,
  ValidationType,
} from "../../../../../../utils/types";

export const buildServiceFields = (
  service: ServiceField,
  fieldsToReturn: ServiceFieldType[] = [
    ServiceFieldType.TOTAL_COMPUTABLE,
    ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
    ServiceFieldType.TOTAL_FEDERAL_SHARE,
  ],
  settings?: AnyObject
) => {
  const buildServiceField = ({
    suffix,
    label,
    props,
    options,
  }: BuildServiceField) => ({
    forTableOnly: true,
    id: `${service.id}-${suffix}`,
    type: ReportFormFieldType.NUMBER,
    validation: ValidationType.NUMBER_OPTIONAL,
    ...options,
    props: {
      label: `${service.label} ${label}`,
      ...props,
    },
  });

  const currencyProps = {
    decimalPlacesToRoundTo: 2,
    initialValue: "0",
    mask: NumberMask.CURRENCY,
    readOnly: true,
  };

  const fields = [];

  for (const fieldType of fieldsToReturn) {
    switch (fieldType) {
      case ServiceFieldType.CATEGORY:
        fields.push(
          buildServiceField({
            suffix: "category",
            label: "Category",
            props: {
              dynamicLabel: settings?.dynamicLabel,
              ...settings?.[ServiceFieldType.CATEGORY]?.props,
            },
            options: {
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT_OPTIONAL,
              ...settings?.[ServiceFieldType.CATEGORY]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.NAME:
        fields.push(
          buildServiceField({
            suffix: "name",
            label: "Name",
            props: {
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.NAME]?.props,
            },
            options: {
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              ...settings?.[ServiceFieldType.NAME]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.DESCRIPTION:
        fields.push(
          buildServiceField({
            suffix: "description",
            label: "Description",
            props: {
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.DESCRIPTION]?.props,
            },
            options: {
              type: ReportFormFieldType.TEXTAREA,
              validation: ValidationType.TEXT,
              ...settings?.[ServiceFieldType.DESCRIPTION]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.TOTAL_COMPUTABLE:
        fields.push(
          buildServiceField({
            suffix: "totalComputable",
            label: "Total Computable",
            props: {
              ...currencyProps,
              initialValue: service.readOnly ? "0" : "",
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.TOTAL_COMPUTABLE]?.props,
            },
            options: {
              ...settings?.[ServiceFieldType.TOTAL_COMPUTABLE]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.PERCENTAGE_OVERRIDE:
        fields.push(
          buildServiceField({
            suffix: "percentageOverride",
            label: "Override %",
            props: {
              decimalPlacesToRoundTo: 0,
              mask: NumberMask.PERCENTAGE,
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.PERCENTAGE_OVERRIDE]?.props,
            },
            options: {
              validation: {
                type: ValidationType.NUMBER_COMPARISON_OPTIONAL,
                options: {
                  boundary: 100,
                  comparator:
                    ValidationComparator.LESS_THAN_OR_EQUAL_PERCENTAGE,
                },
              },
              ...settings?.[ServiceFieldType.PERCENTAGE_OVERRIDE]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE:
        fields.push(
          buildServiceField({
            suffix: "totalStateTerritoryShare",
            label: "Total State / Territory Share",
            props: {
              ...currencyProps,
              ...settings?.[ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE]
                ?.props,
            },
            options: {
              ...settings?.[ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE]
                ?.options,
            },
          })
        );
        break;

      case ServiceFieldType.TOTAL_FEDERAL_SHARE:
        fields.push(
          buildServiceField({
            suffix: "totalFederalShare",
            label: "Total Federal Share",
            props: {
              ...currencyProps,
              ...settings?.[ServiceFieldType.TOTAL_FEDERAL_SHARE]?.props,
            },
            options: {
              ...settings?.[ServiceFieldType.TOTAL_FEDERAL_SHARE]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.TITLE:
        fields.push(
          buildServiceField({
            suffix: "title",
            label: "Position Title",
            props: {
              ...settings?.[ServiceFieldType.TITLE]?.props,
            },
            options: {
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              ...settings?.[ServiceFieldType.TITLE]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.BUDGETED_FTES:
        fields.push(
          buildServiceField({
            suffix: "budgetedFullTimeEmployees",
            label: "# of Budgeted FTEs",
            props: {
              decimalPlacesToRoundTo: 2,
              initialValue: service.readOnly ? "0" : "",
              mask: NumberMask.FLOAT_OR_INTEGER,
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.BUDGETED_FTES]?.props,
            },
            options: {
              validation: ValidationType.NUMBER,
              ...settings?.[ServiceFieldType.BUDGETED_FTES]?.options,
            },
          })
        );
        break;

      case ServiceFieldType.FILLED_FTES:
        fields.push(
          buildServiceField({
            suffix: "filledFullTimeEmployees",
            label: "# of Filled FTEs",
            props: {
              decimalPlacesToRoundTo: 2,
              initialValue: service.readOnly ? "0" : "",
              mask: NumberMask.FLOAT_OR_INTEGER,
              readOnly: service.readOnly,
              ...settings?.[ServiceFieldType.FILLED_FTES]?.props,
            },
            options: {
              validation: ValidationType.NUMBER,
              ...settings?.[ServiceFieldType.FILLED_FTES]?.options,
            },
          })
        );
        break;

      default:
        break;
    }
  }

  return fields;
};

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
    id: `${prefix}_captivatedPaymentsForLongTermCareServices`,
    label: "Captivated Payments for Long Term Care Services",
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
export const totalsSummary = () => [
  {
    id: "qualifiedHcbs_statePlanServices",
    label: "State Plan Services (Qualified HCBS)",
    readOnly: true,
  },
  {
    id: "qualifiedHcbs_1915cWaiverServices",
    label: "Waiver Services (Qualified HCBS)",
    readOnly: true,
  },
  {
    id: "demonstrationServices_statePlanServices",
    label: "State Plan Services (Demonstration HCBS)",
    readOnly: true,
  },
  {
    id: "demonstrationServices_1915cWaiverServices",
    label: "Waiver Services (Demonstration HCBS)",
    readOnly: true,
  },
  {
    id: "supplementalServices_category",
    label: "Supplemental Services",
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
