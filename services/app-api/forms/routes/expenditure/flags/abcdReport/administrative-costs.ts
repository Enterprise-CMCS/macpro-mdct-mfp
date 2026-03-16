// types
import {
  FormTableType,
  FormTablesRoute,
  PageTypes,
  ReportFormFieldType,
  ServiceFieldType,
  ValidationComparator,
  ValidationType,
} from "../../../../../utils/types";
// utils
import {
  administrativeCosts,
  administrativeCostsHeaders,
  buildServiceFields,
  capacityBuilding,
  personnelHeaders,
  subRecipientsHeaders,
} from "./utils";

const budgetCategoryTableId = "administrativeCosts_budgetCategory";
const capacityBuildingTableId = "administrativeCosts_capacityBuilding";
const personnelTableId = "administrativeCosts_personnel";
const subRecipientsTableId = "administrativeCosts_subRecipients";

/*
 * These lists will be mapped to buildServiceFields to create
 * totalComputable, percentageOverride, totalStateTerritoryShare,
 * and totalFederalShare fields
 */

// Budget Category table
const budgetCategoryBodyList = administrativeCosts(budgetCategoryTableId);
const budgetCategoryFootList = [
  {
    id: budgetCategoryTableId,
    label: "Administrative Costs",
    readOnly: true,
  },
];
const budgetCategoryFieldsToReturn = [
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.PERCENTAGE_OVERRIDE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];
const budgetCategoryFooterFieldsToReturn = [
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];

// Budget Category table Dynamic rows
const budgetCategoryDynamicRowId = `${budgetCategoryTableId}_miscellaneousCosts`;
const budgetCategoryDynamicBodyList = [
  {
    id: budgetCategoryDynamicRowId,
    label: "Miscellaneous Costs",
  },
];
const budgetCategoryDynamicFieldsToReturn = [
  ServiceFieldType.CATEGORY,
  ...budgetCategoryFieldsToReturn,
];
const budgetCategoryDynamicRowsTemplate = {
  forTableOnly: true,
  id: budgetCategoryDynamicRowId,
  props: {
    label: "Miscellaneous Costs",
    dynamicFields: budgetCategoryDynamicBodyList.flatMap((service) =>
      buildServiceFields(service, budgetCategoryDynamicFieldsToReturn, {
        dynamicLabel: "Misc. Costs:",
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
        percentageOverride: {
          type: ValidationType.NUMBER_COMPARISON_OPTIONAL,
          options: {
            boundary: 100,
            comparator: ValidationComparator.LESS_THAN_OR_EQUAL_PERCENTAGE,
          },
        },
        totalStateTerritoryShare: ValidationType.NUMBER_OPTIONAL,
        totalFederalShare: ValidationType.NUMBER_OPTIONAL,
      },
    },
  },
  verbiage: {
    buttonText: "Add miscellaneous cost",
    hint: "To add an additional budget category, click the “Add miscellaneous cost” button below.",
  },
};

// Capacity Building table
const capacityBuildingBodyList = capacityBuilding(capacityBuildingTableId);
const capacityBuildingFootList = [
  {
    id: capacityBuildingTableId,
    label: "Capacity Building",
    readOnly: true,
  },
];
const capacityBuildingFieldsToReturn = [
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.PERCENTAGE_OVERRIDE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];
const capacityBuildingFooterFieldsToReturn = [
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];

// Sub Recipients Table
const subRecipientsFootList = [
  {
    id: subRecipientsTableId,
    label: "Sub Recipients",
    readOnly: true,
  },
];

const subRecipientsFooterFieldsToReturn = [
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];

// Administrative Costs route
export const administrativeCostsRoute: FormTablesRoute = {
  name: "Administrative Costs",
  path: "/expenditure/administrative-costs",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "Administrative Costs",
    },
    accordion: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "p",
          content:
            "Enter your total computable costs for each service during the reporting period. If a service is used but you incurred no costs, enter “0”. For services that are not used, leave the field blank. If you incurred expenses for a qualified budget category that is not listed, use the “Add other budget category” to add it to the table.",
        },
        {
          type: "p",
          content:
            "The Administrative FMAP percentage defaults to 100%. If a recipient must claim less than 100% enter the new rate in the “Override” column.",
        },
      ],
    },
  },
  form: {
    id: "exp-administrativeCosts",
    tables: [
      {
        id: budgetCategoryTableId,
        // Display table fields in rows
        bodyRows: budgetCategoryBodyList.map((service) => {
          const bodyFields = buildServiceFields(
            service,
            budgetCategoryFieldsToReturn
          );
          return [service.label, ...bodyFields];
        }),
        dynamicRowsTemplate: budgetCategoryDynamicRowsTemplate,
        footRows: budgetCategoryFootList.map((service) => {
          return [
            "Totals (includes the Sub Recipient totals below)",
            ...buildServiceFields(service, [ServiceFieldType.TOTAL_COMPUTABLE]),
            "",
            ...buildServiceFields(service, [
              ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
              ServiceFieldType.TOTAL_FEDERAL_SHARE,
            ]),
          ];
        }),
        headRows: [administrativeCostsHeaders],
        tableType: FormTableType.CALCULATION,
        verbiage: {
          percentage: "Administrative Costs Percentage: {{percentage}}",
          title: "Administrative Costs",
        },
      },
      {
        id: capacityBuildingTableId,
        // Display table fields in rows
        bodyRows: capacityBuildingBodyList.map((service) => {
          const bodyFields = buildServiceFields(
            service,
            capacityBuildingFieldsToReturn
          );
          return [service.label, ...bodyFields];
        }),
        footRows: capacityBuildingFootList.map((service) => {
          return [
            "Totals",
            ...buildServiceFields(
              service,
              capacityBuildingFooterFieldsToReturn.slice(0, 1)
            ),
            "",
            ...buildServiceFields(
              service,
              capacityBuildingFooterFieldsToReturn.slice(1)
            ),
          ];
        }),
        headRows: [administrativeCostsHeaders],
        tableType: FormTableType.CALCULATION,
        verbiage: {
          percentage: "Capacity Building Percentage: {{percentage}}",
          title: "Capacity Building",
          subtitle: [
            {
              type: "p",
              content:
                "Only MFP recipients who received capacity building grants should complete this section. Under this supplemental funding opportunity, up to $5 million in MFP grant funds were made available to each eligible MFP recipient for planning and capacity building activities to accelerate LTSS system transformation design and implementation and to expand HCBS capacity. Eligible MFP recipients submitted supplemental budget requests and funds were made available to MFP recipients for the year in which the award was received and four additional fiscal years.",
            },
            {
              type: "p",
              content:
                "In the table below, include the amount of capacity building funds that your state or territory spent during this reporting period. Do not include funds that have not been spent, even if the MFP recipient has plans and received CMS approval to spend the funds on specific initiatives or activities. CMS expects that MFP recipients will claim 100% of MFP funding for capacity building; however, if an MFP recipient is claiming less than 100%, enter the relevant rate in the Override % column and provide further explanation in the Narrative field.",
            },
          ],
        },
      },
      {
        id: subRecipientsTableId,
        bodyRows: [],
        footRows: subRecipientsFootList.map((service) => {
          return [
            "Totals",
            "",
            "",
            "",
            ...buildServiceFields(service, subRecipientsFooterFieldsToReturn),
          ];
        }),
        headRows: [subRecipientsHeaders],
        tableType: FormTableType.MODAL_CALCULATION,
        verbiage: {
          modalButtonText: "Add sub recipient",
          percentage: "Administrative Costs Percentage: {{percentage}}",
          title: "Sub Recipients",
        },
      },
      {
        id: personnelTableId,
        bodyRows: [],
        footRows: [],
        headRows: [personnelHeaders],
        tableType: FormTableType.CALCULATION,
        verbiage: {
          percentage: "Administrative Costs Percentage: {{percentage}}",
          title: "Personnel",
        },
      },
    ],
    fields: [
      // Add table fields here only for validation
      ...budgetCategoryBodyList.flatMap((service) =>
        buildServiceFields(service, budgetCategoryFieldsToReturn)
      ),
      ...budgetCategoryFootList.flatMap((service) =>
        buildServiceFields(service, budgetCategoryFooterFieldsToReturn)
      ),
      budgetCategoryDynamicRowsTemplate,
      ...budgetCategoryDynamicBodyList.flatMap((service) =>
        buildServiceFields(service, budgetCategoryFooterFieldsToReturn)
      ),
      ...capacityBuildingBodyList.flatMap((service) =>
        buildServiceFields(service, capacityBuildingFieldsToReturn)
      ),
      ...capacityBuildingFootList.flatMap((service) =>
        buildServiceFields(service, capacityBuildingFooterFieldsToReturn)
      ),
      ...subRecipientsFootList.flatMap((service) =>
        buildServiceFields(service, subRecipientsFooterFieldsToReturn)
      ),
      {
        id: "administrativeCosts_narrative",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "Additional notes/comments (optional)",
          hint: "If applicable, add any notes or comments to provide additional explanation.",
          title: "Narrative",
        },
      },
    ],
  },
};
