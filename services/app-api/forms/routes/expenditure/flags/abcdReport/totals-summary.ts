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
  totalsSummary,
  totalsSummaryHeaders,
} from "./utils";

const totalsSummaryTableId = "totals_totalsSummary";
const totalsSummaryBodyList = totalsSummary();
const totalsSummaryFieldsToReturn = [
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
    id: "totalsSummary",
    tables: [
      {
        id: totalsSummaryTableId,
        // Display table fields in rows using existing field IDs from source tables
        bodyRows: totalsSummaryBodyList.map((service) => {
          const bodyFields = buildServiceFields(service);
          return [service.label, ...bodyFields];
        }),
        footRows: [],
        headRows: [totalsSummaryHeaders],
        tableType: FormTableType.CALCULATION,
      },
    ],
    fields: [
      // hidden trigger field that enables rendering of the table
      {
        forTableOnly: true,
        id: `${totalsSummaryTableId}-trigger`,
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT_OPTIONAL,
        props: {
          label: "Totals Summary Marker",
        },
      },
      ...totalsSummaryBodyList.flatMap((service) =>
        buildServiceFields(service, totalsSummaryFieldsToReturn)
      ),
    ],
  },
};
