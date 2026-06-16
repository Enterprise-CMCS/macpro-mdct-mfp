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
  buildServiceFields,
  serviceFieldDynamicRowsTemplateBuilder,
} from "../../../../../utils/routes/tables";
import {
  administrativeCosts,
  administrativeCostsHeaders,
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
const budgetCategoryDynamicRowsTemplate =
  serviceFieldDynamicRowsTemplateBuilder({
    dynamicFieldsBodyList: budgetCategoryDynamicBodyList,
    dynamicFieldsSettings: {
      dynamicLabel: "Misc. Costs:",
    },
    dynamicFieldsToReturn: budgetCategoryDynamicFieldsToReturn,
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
    dynamicRowId: budgetCategoryDynamicRowId,
    label: "Miscellaneous Costs",
    verbiage: {
      buttonText: "Add miscellaneous cost",
      hint: "To add an additional budget category, click the “Add miscellaneous cost” button below.",
    },
  });

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

// Sub Recipients table
const subRecipientsFootList = [
  {
    id: subRecipientsTableId,
    label: "Sub Recipients",
    readOnly: true,
  },
];
const subRecipientsFooterFieldsToReturn = [
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];

// Sub Recipients table - dynamic rows
const subRecipientsDynamicRowId = `${subRecipientsTableId}_subRecipients`;
const subRecipientsDynamicBodyList = [
  {
    id: subRecipientsDynamicRowId,
    label: "Sub Recipients",
    readOnly: true,
  },
];
const subRecipientsDynamicFieldsToReturn = [
  ServiceFieldType.NAME,
  ServiceFieldType.DESCRIPTION,
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.PERCENTAGE_OVERRIDE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];

// Sub Recipients table - modal
const subRecipientsModalList = [
  {
    id: subRecipientsDynamicRowId,
    label: "Sub Recipients",
  },
];
const subRecipientsModalFieldsToReturn = [
  ServiceFieldType.NAME,
  ServiceFieldType.DESCRIPTION,
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.PERCENTAGE_OVERRIDE,
];
const subRecipientModalFieldsSettings = {
  [ServiceFieldType.NAME]: {
    props: {
      hint: [
        {
          type: "span",
          content:
            "Please use the same sub recipient name across multiple reports where possible. For example, if sub recipient “XYZ Company” conducts work for the MFP recipient for more than one quarter, use the same name “XYZ Company” across your MFP Financial Reporting Form.",
          props: {
            className: "display-block",
          },
        },
        {
          type: "span",
          content:
            "This will ensure that the data are helpful in supporting CMS and MFP recipient analysis of sub recipient information.",
          props: {
            className: "display-block",
          },
        },
      ],
      label: "Sub Recipient",
    },
    options: {
      forTableOnly: false,
    },
  },
  [ServiceFieldType.DESCRIPTION]: {
    props: {
      hint: "Provide a brief description of the work this subrecipient performs for your state or territory (100 characters or fewer). Include key details about the scope of their work, MFP populations served, activities performed, and deliverables completed. If you reach the character limit, alternatively reference the section of MFP Worksheet for Proposed Budget where this information is described.",
      label: "Describe Statement of Work (SOW)",
      maxLength: 100,
    },
    options: {
      forTableOnly: false,
      validation: {
        type: ValidationType.TEXT_CUSTOM,
        options: {
          maxLength: 100,
        },
      },
    },
  },
  [ServiceFieldType.TOTAL_COMPUTABLE]: {
    props: {
      label: "Expenditures",
    },
    options: {
      forTableOnly: false,
      validation: ValidationType.NUMBER,
    },
  },
  [ServiceFieldType.PERCENTAGE_OVERRIDE]: {
    props: {
      label: "Override %",
      styleAsOptional: true,
    },
    options: {
      forTableOnly: false,
    },
  },
};
const subRecipientsDynamicRowsTemplate = serviceFieldDynamicRowsTemplateBuilder(
  {
    dynamicFieldsBodyList: subRecipientsDynamicBodyList,
    dynamicFieldsToReturn: subRecipientsDynamicFieldsToReturn,
    dynamicFieldValidations: {
      name: ValidationType.TEXT_OPTIONAL,
      description: ValidationType.TEXT_OPTIONAL,
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
    dynamicModalList: subRecipientsModalList,
    dynamicModalFieldsToReturn: subRecipientsModalFieldsToReturn,
    dynamicModalFieldsSettings: subRecipientModalFieldsSettings,
    dynamicModalVerbiage: {
      add: "Add Sub Recipient",
      edit: "Edit Sub Recipient",
    },
    dynamicRowId: subRecipientsDynamicRowId,
    label: "Sub Recipients",
    verbiage: {
      buttonText: "Add sub recipient",
      hint: "To add a sub recipient, click the “Add sub recipient” button below.",
    },
  }
);

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
    label: "Positions",
  },
];
const personnelDynamicFieldsToReturn = [
  ServiceFieldType.TITLE,
  ...personnelFieldsToReturn,
];
const personnelDynamicRowsTemplate = serviceFieldDynamicRowsTemplateBuilder({
  dynamicFieldsBodyList: personnelDynamicBodyList,
  dynamicFieldsToReturn: personnelDynamicFieldsToReturn,
  dynamicFieldValidations: {
    name: ValidationType.TEXT_OPTIONAL,
    title: ValidationType.TEXT_OPTIONAL,
    budgetedFullTimeEmployees: ValidationType.NUMBER_OPTIONAL,
    filledFullTimeEmployees: ValidationType.NUMBER_OPTIONAL,
  },
  dynamicRowId: personnelDynamicRowId,
  label: "Positions",
  verbiage: {
    buttonText: "Add personnel",
    hint: "To add more types of roles, click the “Add personnel” button below.",
  },
});

// Administrative Costs route
export const administrativeCostsRoute: FormTablesRoute = {
  name: "Administrative Costs",
  path: "/financial-report/administrative-costs",
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
            "Enter your total computable costs for each service during the reporting period. If a service is used but you incurred no costs, enter “0”. For services that are not used, leave the field blank. If you incurred expenses for a qualified budget category that is not listed, use the “Add miscellaneous cost” to add it to the table.",
        },
        {
          type: "p",
          content:
            "The Administrative FMAP percentage defaults to 100%. If a recipient must claim less than 100% enter the new rate in the “Override” column.",
        },
        {
          type: "p",
          content:
            "Previously this information was reported in Form C (Admin) in the excel version of the MFP Financial Reporting Form.",
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
                "In the table below, include the amount of capacity building funds that your state or territory spent during this reporting period. Do not include funds that have not been spent, even if the MFP recipient has plans and has received CMS approval to spend the funds on specific initiatives or activities. CMS expects that MFP recipients will claim 100% of MFP funding for capacity building; however, if an MFP recipient is claiming less than 100%, enter the relevant rate in the Override % column and provide further explanation in the Narrative field.",
            },
          ],
        },
      },
      {
        id: subRecipientsTableId,
        bodyRows: [],
        dynamicRowsTemplate: subRecipientsDynamicRowsTemplate,
        footRows: subRecipientsFootList.map((service) => {
          return [
            "Totals",
            "",
            ...buildServiceFields(
              service,
              subRecipientsFooterFieldsToReturn.slice(0, 1)
            ),
            "",
            ...buildServiceFields(
              service,
              subRecipientsFooterFieldsToReturn.slice(1)
            ),
          ];
        }),
        headRows: [subRecipientsHeaders],
        tableType: FormTableType.CALCULATION,
        verbiage: {
          percentage: "Administrative Costs Percentage: {{percentage}}",
          subtitle: [
            {
              type: "p",
              content:
                "Organizations that provide Medicaid MFP enrollees with qualified services (i.e., a community partner or home health agency) are considered “sub recipients,” as they receive payment directly from the state.",
            },
            {
              type: "p",
              content:
                "While this section is optional, the information can help CMS better understand your state’s demonstration. This information was not previously reported in the Excel version of the MFP Financial Reporting Form and is new to reporting in the Medicaid Data Collection Tool. As noted above, if an MFP recipient is claiming less than 100%, enter the relevant rate in the <b>Override % column</b>.",
            },
          ],
          emptyTableMessage: "No Sub Recipients added.",
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
          emptyTableMessage: "No Personnel added.",
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

      // Sub Recipients table
      ...subRecipientsFootList.flatMap((service) =>
        buildServiceFields(service, subRecipientsFooterFieldsToReturn)
      ),
      subRecipientsDynamicRowsTemplate,
      ...subRecipientsDynamicBodyList.flatMap((service) =>
        buildServiceFields(service, subRecipientsFooterFieldsToReturn)
      ),

      // Personnel table
      ...personnelFootList.flatMap((service) =>
        buildServiceFields(service, personnelFooterFieldsToReturn)
      ),
      personnelDynamicRowsTemplate,
      ...personnelDynamicBodyList.flatMap((service) =>
        buildServiceFields(service, personnelFooterFieldsToReturn)
      ),
      {
        id: "administrativeCosts_narrative",
        type: ReportFormFieldType.TEXTAREA,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "Additional notes/comments",
          hint: "If applicable, add any notes or comments to provide additional explanation.",
          styleAsOptional: true,
          title: "Narrative",
        },
      },
    ],
  },
};
