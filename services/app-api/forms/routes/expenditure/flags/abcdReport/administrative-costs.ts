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

// Budget Category table - dynamic rows
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

// Personnel table
const personnelFootList = [
  {
    id: personnelTableId,
    label: "Personnel",
    readOnly: true,
  },
];
const personnelFieldsToReturn = [
  ServiceFieldType.BUDGETED_FTES,
  ServiceFieldType.FILLED_FTES,
];
const personnelFooterFieldsToReturn = [...personnelFieldsToReturn];

// Personnel table - dynamic rows
const personnelDynamicRowId = `${personnelTableId}_positions`;
const personnelDynamicBodyList = [
  {
    id: personnelDynamicRowId,
    label: "Personnel",
  },
];
const personnelDynamicFieldsToReturn = [
  ServiceFieldType.TITLE,
  ...personnelFieldsToReturn,
];
const personnelDynamicRowsTemplate = {
  forTableOnly: true,
  id: personnelDynamicRowId,
  props: {
    label: "Positions",
    dynamicFields: personnelDynamicBodyList.flatMap((service) =>
      buildServiceFields(service, personnelDynamicFieldsToReturn)
    ),
  },
  type: ReportFormFieldType.DYNAMIC_OBJECT,
  validation: {
    type: ValidationType.DYNAMIC_OPTIONAL,
    options: {
      dynamicFieldValidations: {
        name: ValidationType.TEXT_OPTIONAL,
        title: ValidationType.TEXT_OPTIONAL,
        budgetedFullTimeEmployees: ValidationType.NUMBER_OPTIONAL,
        filledFullTimeEmployees: ValidationType.NUMBER_OPTIONAL,
      },
    },
  },
  verbiage: {
    buttonText: "Add personnel",
    hint: "To add more types of roles, click the “Add personnel” button below.",
  },
};

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
            ...buildServiceFields(
              service,
              budgetCategoryFooterFieldsToReturn.slice(0, 1)
            ),
            "",
            ...buildServiceFields(
              service,
              budgetCategoryFooterFieldsToReturn.slice(1)
            ),
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
        dynamicRowsTemplate: personnelDynamicRowsTemplate,
        footRows: personnelFootList.map((service) => {
          return [
            "Totals",
            ...buildServiceFields(service, personnelFooterFieldsToReturn),
          ];
        }),
        headRows: [personnelHeaders],
        tableType: FormTableType.SUMMATION,
        verbiage: {
          subtitle: [
            {
              type: "p",
              content:
                "Add the position title, and the number of budgeted and filled full-time employees (FTEs) for each type of role in your MFP demonstration.",
            },
            {
              type: "p",
              content:
                "CMS expects that each MFP recipient will have at least two FTE personnel reported, including an MFP project director and an MFP data and quality analyst, per PTC 26.",
            },
            {
              type: "p",
              content:
                "If, for example, your demonstration has budgeted and hired 2 MFP data and quality analysts that are each 50% FTE, report 1 in both the # of budgeted FTEs and # of filled FTEs columns. Some MFP demonstrations might also have personnel including, but not limited to, care coordinators, systems specialists, and project coordinators.",
            },
            {
              type: "p",
              content:
                "If a role is expected to be filled by the end of the quarter, count that role as filled.",
            },
          ],
          title: "Personnel",
        },
      },
    ],
    // Add table fields here only for validation
    fields: [
      // Budget Category table
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

      // Capacity Building table
      ...capacityBuildingBodyList.flatMap((service) =>
        buildServiceFields(service, capacityBuildingFieldsToReturn)
      ),
      ...capacityBuildingFootList.flatMap((service) =>
        buildServiceFields(service, capacityBuildingFooterFieldsToReturn)
      ),

      // Personnel table
      ...personnelFootList.flatMap((service) =>
        buildServiceFields(service, personnelFooterFieldsToReturn)
      ),
      personnelDynamicRowsTemplate,
      ...personnelDynamicBodyList.flatMap((service) =>
        buildServiceFields(service, personnelFooterFieldsToReturn)
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
