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
  buildServiceFields,
  capacityBuildingHeaders,
  personnelHeaders,
  subRecipientsHeaders,
  supplementalServices,
  supplementalServicesHeaders,
} from "./utils";

const administrativeCostsTableId = "administrativeCosts_administrativeCosts";
const capacityBuildingTableId = "administrativeCosts_capacityBuilding";
const personnelTableId = "administrativeCosts_personnel";
const subRecipientsTableId = "administrativeCosts_subRecipients";

/*
 * These lists will be mapped to buildServiceFields to create
 * totalComputable, totalStateTerritoryShare, and totalFederalShare fields
 */
const administrativeCostsBodyList = supplementalServices(
  administrativeCostsTableId
);
const administrativeCostsFootList = [
  {
    id: administrativeCostsTableId,
    label: "Administrative Costs",
    readOnly: true,
  },
];

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
      intro:
        "Enter your total computable costs for each service during the reporting period. If a service is used but you incurred no costs, enter “0”. For services that are not used, leave the field blank. If you incurred expenses for a qualified budget category that is not listed, use the “Add other budget category” to add it to the table. \n The Administrative FMAP percentage defaults to 100%. If a recipient must claim less than 100% enter the new rate in the “Override” column.",
    },
  },
  form: {
    id: "exp-administrativeCosts",
    tables: [
      {
        id: administrativeCostsTableId,
        // Display table fields in rows
        bodyRows: administrativeCostsBodyList.map((service) => {
          const bodyFields = buildServiceFields(service);
          return [service.label, ...bodyFields];
        }),
        footRows: administrativeCostsFootList.map((service) => {
          const footFields = buildServiceFields(service);
          return ["Totals", ...footFields];
        }),
        headRows: [supplementalServicesHeaders],
        tableType: FormTableType.CALCULATION,
        verbiage: {
          percentage: "Administrative Costs Percentage: {{percentage}}",
          title: "Administrative Costs",
        },
      },
      {
        id: capacityBuildingTableId,
        bodyRows: [],
        footRows: [],
        headRows: [capacityBuildingHeaders],
        tableType: FormTableType.CALCULATION,
        verbiage: {
          percentage: "Capacity Building Percentage: {{percentage}}",
          title: "Capacity Building",
        },
      },
      {
        id: subRecipientsTableId,
        bodyRows: [],
        footRows: [],
        headRows: [subRecipientsHeaders],
        tableType: FormTableType.CALCULATION,
        verbiage: {
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
      ...administrativeCostsBodyList.flatMap((service) =>
        buildServiceFields(service)
      ),
      ...administrativeCostsFootList.flatMap((service) =>
        buildServiceFields(service)
      ),
      {
        id: "administrativeCosts_narrative",
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
