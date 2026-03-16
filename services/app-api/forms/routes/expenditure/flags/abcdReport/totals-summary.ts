// types
import {
  FormTableType,
  FormTablesRoute,
  PageTypes,
  ServiceFieldType,
} from "../../../../../utils/types";
// utils
import {
  buildServiceFields,
  totalsSummary,
  totalsSummaryHeaders,
} from "./utils";

const totalsSummaryTableId = "totalComputable";

const totalsSummaryBodyList = totalsSummary(totalsSummaryTableId);
const totalsSummaryFootList = [
  {
    id: totalsSummaryTableId,
    label: "Totals",
    readOnly: true,
  },
];
const totalsSummaryFieldsToReturn = [
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];
const totalsSummaryFooterFieldsToReturn = [
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];

export const totalsSummaryRoute: FormTablesRoute = {
  name: "Totals",
  path: "/expenditure/totals",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "Totals",
    },
    accordion: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "p",
          content:
            "The table below displays the total computable amount, state/territory share, and federal share based on the amounts that you entered. If any value appears incorrect, return to the page for that service and double-check your entries.",
        },
      ],
    },
  },
  form: {
    id: "totals-summary",
    tables: [
      {
        id: totalsSummaryTableId,
        // Display table fields in rows
        bodyRows: totalsSummaryBodyList.map((service) => {
          const bodyFields = buildServiceFields(service);
          return [service.label, ...bodyFields];
        }),
        footRows: totalsSummaryFootList.map((service) => {
          return [
            "Totals - Waivers, State Plan & Supplmental Services, Administrative Costs, and Capacity Building",
            ...buildServiceFields(service, [ServiceFieldType.TOTAL_COMPUTABLE]),
            ...buildServiceFields(service, [
              ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
              ServiceFieldType.TOTAL_FEDERAL_SHARE,
            ]),
          ];
        }),
        headRows: [totalsSummaryHeaders],
        tableType: FormTableType.CALCULATION,
      },
    ],
    fields: [
      // Add table fields here only for validation
      ...totalsSummaryBodyList.flatMap((service) =>
        buildServiceFields(service, totalsSummaryFieldsToReturn)
      ),
      ...totalsSummaryFootList.flatMap((service) =>
        buildServiceFields(service, totalsSummaryFooterFieldsToReturn)
      ),
    ],
  },
};
