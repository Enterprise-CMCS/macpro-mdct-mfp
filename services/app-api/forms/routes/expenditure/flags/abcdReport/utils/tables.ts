import {
  ReportFormFieldType,
  ValidationType,
} from "../../../../../../utils/types";

export const buildServiceFields = (service: {
  id: string;
  label: string;
  readOnly?: boolean;
}) => [
  {
    id: `${service.id}-totalComputable`,
    type: ReportFormFieldType.NUMBER,
    validation: ValidationType.NUMBER_OPTIONAL,
    forTableOnly: true,
    props: {
      decimalPlacesToRoundTo: 2,
      initialValue: service.readOnly ? "0" : "",
      label: `${service.label} Total Computable`,
      mask: "currency",
      readOnly: service.readOnly,
    },
  },
  {
    id: `${service.id}-totalStateTerritoryShare`,
    type: ReportFormFieldType.NUMBER,
    validation: ValidationType.NUMBER_OPTIONAL,
    forTableOnly: true,
    props: {
      decimalPlacesToRoundTo: 2,
      initialValue: "0",
      label: `${service.label} Total State / Territory Share`,
      mask: "currency",
      readOnly: true,
    },
  },
  {
    id: `${service.id}-totalFederalShare`,
    type: ReportFormFieldType.NUMBER,
    validation: ValidationType.NUMBER_OPTIONAL,
    forTableOnly: true,
    props: {
      decimalPlacesToRoundTo: 2,
      initialValue: "0",
      label: `${service.label} Total Federal Share`,
      mask: "currency",
      readOnly: true,
    },
  },
];

export const statePlanServicesHeaders = [
  "Services",
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
    label: "PACE (Program for all includes care for the elderly)",
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
