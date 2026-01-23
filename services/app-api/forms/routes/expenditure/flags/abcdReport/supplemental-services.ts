// types
import {
  FormTableType,
  FormTablesRoute,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
} from "../../../../../utils/types";
// utils
import {
  buildDynamicFields,
  buildServiceFields,
  supplementalServices,
  supplementalServicesHeaders,
} from "./utils";

const supplementalServicesTableId = "supplementalServices_supplementalServices";

/*
 * These lists will be mapped to buildServiceFields to create
 * totalComputable, totalStateTerritoryShare, and totalFederalShare fields
 */
const supplementalServicesBodyList = supplementalServices(
  supplementalServicesTableId
);
const supplementalServicesDynamicBodyList = [
  {
    id: `${supplementalServicesTableId}_other`,
    label: "Other",
  },
];
const supplementalServicesFootList = [
  {
    id: supplementalServicesTableId,
    label: "Supplemental Services",
    readOnly: true,
  },
];

export const supplementalServicesRoute: FormTablesRoute = {
  name: "Supplemental Services",
  path: "/expenditure/supplemental-services",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "Supplemental Services",
    },
    accordion: {
      buttonLabel: "Instructions",
      intro:
        "Enter your total computable costs for each service during the reporting period. If a service is used but you incurred no costs, enter “0”. For services that are not used, leave the field blank. If you incurred expenses for a qualified supplemental service that is not listed, use the “add other category” to add it to the table.",
    },
  },
  form: {
    id: "exp-supplementalServices",
    tables: [
      {
        id: supplementalServicesTableId,
        // Display table fields in rows
        bodyRows: supplementalServicesBodyList.map((service) => {
          const bodyFields = buildServiceFields(service);
          return [service.label, ...bodyFields];
        }),
        dynamicRows: supplementalServicesDynamicBodyList.map((service) => {
          const bodyFields = buildDynamicFields(service);
          return [...bodyFields];
        }),
        footRows: supplementalServicesFootList.map((service) => {
          const footFields = buildServiceFields(service);
          return ["Totals", ...footFields];
        }),
        headRows: [supplementalServicesHeaders],
        tableType: FormTableType.CALCULATION,
        verbiage: {
          dynamicField: {
            buttonText: "Add other category",
            hint: "To add an additional category, click the “Add other category” button below.",
            label: "Other:",
          },
          percentage: "Supplemental Services Percentage: {{percentage}}",
          title: "Supplemental Services",
        },
      },
    ],
    fields: [
      // Add table fields here only for validation
      ...supplementalServicesBodyList.flatMap((service) =>
        buildServiceFields(service)
      ),
      ...supplementalServicesDynamicBodyList.flatMap((service) =>
        buildDynamicFields(service)
      ),
      ...supplementalServicesFootList.flatMap((service) =>
        buildServiceFields(service)
      ),
      {
        id: "supplementalServices_narrative",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "Additional notes/comments (optional)",
          hint: "If applicable, add any notes or comments to provide additional explanation.",
        },
      },
    ],
    verbiage: {
      title: "Narrative",
    },
  },
};
