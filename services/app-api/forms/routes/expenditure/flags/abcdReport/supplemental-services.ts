// types
import {
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

const categoryTableId = "supplementalServices_category";

/*
 * These lists will be mapped to buildServiceFields to create
 * totalComputable, totalStateTerritoryShare, and totalFederalShare fields
 */
const categoryBodyList = supplementalServices(categoryTableId);
const categoryFootList = [
  {
    id: categoryTableId,
    label: "Supplemental Services",
    readOnly: true,
  },
];
const categoryFieldsToReturn = [
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];

// Category table dynamic rows
const categoryDynamicRowId = `${categoryTableId}_otherCategories`;
const categoryDynamicBodyList = [
  {
    id: categoryDynamicRowId,
    label: "Other Categories",
  },
];
const categoryDynamicFieldsToReturn = [
  ServiceFieldType.CATEGORY,
  ...categoryFieldsToReturn,
];
const categoryDynamicRowsTemplate = {
  forTableOnly: true,
  id: categoryDynamicRowId,
  props: {
    label: "Other Categories",
    dynamicFields: categoryDynamicBodyList.flatMap((service) =>
      buildServiceFields(service, categoryDynamicFieldsToReturn, {
        dynamicLabel: "Other:",
      })
    ),
  },
  type: ReportFormFieldType.DYNAMIC_OBJECT,
  validation: {
    type: ValidationType.DYNAMIC_OPTIONAL,
    options: {
      dynamicFieldValidations: {
        category: ValidationType.TEXT_OPTIONAL,
        totalComputable: ValidationType.NUMBER_OPTIONAL,
        totalStateTerritoryShare: ValidationType.NUMBER_OPTIONAL,
        totalFederalShare: ValidationType.NUMBER_OPTIONAL,
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
      info: [
        {
          type: "p",
          content:
            "Supplemental services are short-term services that are otherwise not coverable under the Medicaid program to support an MFP participant’s transition (PTC 24).",
        },
      ],
    },
    accordion: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "p",
          props: {
            style: {
              marginBottom: "0",
            },
          },
          content:
            "Enter your total computable costs for each service during the reporting period. Of note,",
        },
        {
          type: "ul",
          props: {
            style: {
              paddingLeft: "1rem",
            },
          },
          children: [
            {
              type: "li",
              content:
                "If a service is used but you incurred no costs, enter ”0.”",
            },
            {
              type: "li",
              content:
                "If you did not use that service, leave the field blank.",
            },
            {
              type: "li",
              content:
                "If you incurred expenses for a qualified supplemental service that is not listed, use the “Add other category” to add it to the table.",
            },
          ],
        },
        {
          type: "p",
          content:
            "Previously this information was reported in Form B (Opt&Other Detail) in the excel version of the MFP Financial Reporting Form.",
        },
        {
          type: "p",
          content:
            "Any category you add can be copied over into future reports.",
        },
        {
          type: "p",
          content:
            "Your state or territory’s share for each service will be calculated at 100%. If this is not the case for supplemental services in your state or territory, contact your CMS Project Officer.",
        },
      ],
    },
  },
  form: {
    id: "exp-supplementalServices",
    tables: [
      {
        id: categoryTableId,
        // Display table fields in rows
        bodyRows: categoryBodyList.map((service) => {
          const bodyFields = buildServiceFields(
            service,
            categoryFieldsToReturn
          );
          return [service.label, ...bodyFields];
        }),
        dynamicRowsTemplate: categoryDynamicRowsTemplate,
        footRows: categoryFootList.map((service) => {
          const footFields = buildServiceFields(
            service,
            categoryFieldsToReturn
          );
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
      ...categoryBodyList.flatMap((service) =>
        buildServiceFields(service, categoryFieldsToReturn)
      ),
      ...categoryFootList.flatMap((service) =>
        buildServiceFields(service, categoryFieldsToReturn)
      ),
      categoryDynamicRowsTemplate,
      ...categoryDynamicBodyList.flatMap((service) =>
        buildServiceFields(service, categoryFieldsToReturn)
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
