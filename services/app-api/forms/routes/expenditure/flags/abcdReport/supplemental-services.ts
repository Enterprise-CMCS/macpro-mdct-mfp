// types
import {
  DynamicValidationType,
  FormTableType,
  FormTablesRoute,
  PageTypes,
  ReportFormFieldType,
  ServiceFieldType,
  ValidationType,
} from "../../../../../utils/types";
// utils
import {
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
const supplementalServicesFootList = [
  {
    id: supplementalServicesTableId,
    label: "Supplemental Services",
    readOnly: true,
  },
];

// Dynamic rows
const dynamicRowId = `${supplementalServicesTableId}_otherCategories`;
const supplementalServicesDynamicBodyList = [
  {
    id: dynamicRowId,
    label: "Other Categories",
  },
];

const dynamicRowsTemplate = {
  forTableOnly: true,
  id: dynamicRowId,
  props: {
    label: "Other Categories",
    dynamicFields: supplementalServicesDynamicBodyList.flatMap((service) =>
      buildServiceFields(service, [
        ServiceFieldType.CATEGORY,
        ServiceFieldType.TOTAL_COMPUTABLE,
        ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
        ServiceFieldType.TOTAL_FEDERAL_SHARE,
      ])
    ),
  },
  type: ReportFormFieldType.DYNAMIC_OBJECT,
  validation: {
    type: ValidationType.DYNAMIC_OPTIONAL,
    options: {
      dynamicFields: {
        [ServiceFieldType.CATEGORY]: DynamicValidationType.TEXT_OPTIONAL,
        [ServiceFieldType.TOTAL_COMPUTABLE]:
          DynamicValidationType.NUMBER_OPTIONAL,
        [ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE]:
          DynamicValidationType.NUMBER_OPTIONAL,
        [ServiceFieldType.TOTAL_FEDERAL_SHARE]:
          DynamicValidationType.NUMBER_OPTIONAL,
      },
    },
  },
  verbiage: {
    buttonText: "Add other category",
    hint: "To add an additional category, click the “Add other category” button below.",
  },
};

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
        dynamicRowsTemplate,
        footRows: supplementalServicesFootList.map((service) => {
          const footFields = buildServiceFields(service);
          return ["Totals", ...footFields];
        }),
        headRows: [supplementalServicesHeaders],
        tableType: FormTableType.CALCULATION,
        verbiage: {
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
      ...supplementalServicesFootList.flatMap((service) =>
        buildServiceFields(service)
      ),
      dynamicRowsTemplate,
      ...supplementalServicesDynamicBodyList.flatMap((service) =>
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
