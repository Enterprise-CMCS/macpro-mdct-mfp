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
  accordionWithFmapLink,
  buildServiceFields,
  c1915WaiverServices,
  errorMessageWithFmapLink,
  statePlanServices,
  statePlanServicesHeaders,
} from "./utils";

const statePlanServicesTableId = "qualifiedHcbs_statePlanServices";
const c1915WaiverServicesTableId = "qualifiedHcbs_1915cWaiverServices";

/*
 * These lists will be mapped to buildServiceFields to create
 * totalComputable, totalStateTerritoryShare, and totalFederalShare fields
 */
const statePlanServicesBodyList = statePlanServices(statePlanServicesTableId);
const c1915WaiverServicesBodyList = c1915WaiverServices(
  c1915WaiverServicesTableId
);
const statePlanServicesFootList = [
  {
    id: statePlanServicesTableId,
    label: "State Plan Services",
    readOnly: true,
  },
];
const c1915WaiverServicesFootList = [
  {
    id: c1915WaiverServicesTableId,
    label: "1915c Waiver Services",
    readOnly: true,
  },
];

export const qualifiedHcbsRoute: FormTablesRoute = {
  name: "Qualified HCBS",
  path: "/expenditure/qualified-hcbs",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "Qualified HCBS",
    },
    accordion: accordionWithFmapLink,
  },
  form: {
    id: "exp-qualifiedHcbs",
    tables: [
      {
        id: statePlanServicesTableId,
        // Display table fields in rows
        bodyRows: statePlanServicesBodyList.map((service) => {
          const bodyFields = buildServiceFields(service);
          return [service.label, ...bodyFields];
        }),
        footRows: statePlanServicesFootList.map((service) => {
          const footFields = buildServiceFields(service);
          return ["Totals", ...footFields];
        }),
        headRows: [statePlanServicesHeaders],
        options: {
          percentageField: "fmap_qualifiedHcbsPercentage",
        },
        tableType: FormTableType.CALCULATION,
        verbiage: {
          errorMessage: errorMessageWithFmapLink,
          percentage: "Enhanced FMAP Qualified HCBS Percentage: {{percentage}}",
          title: "State Plan Services",
        },
      },
      {
        id: c1915WaiverServicesTableId,
        // Display table fields in rows
        bodyRows: c1915WaiverServicesBodyList.map((service) => {
          const bodyFields = buildServiceFields(service);
          return [service.label, ...bodyFields];
        }),
        footRows: c1915WaiverServicesFootList.map((service) => {
          const footFields = buildServiceFields(service);
          return ["Totals", ...footFields];
        }),
        headRows: [statePlanServicesHeaders],
        options: {
          percentageField: "fmap_qualifiedHcbsPercentage",
        },
        tableType: FormTableType.CALCULATION,
        verbiage: {
          errorMessage: errorMessageWithFmapLink,
          percentage: "Enhanced FMAP Qualified HCBS Percentage: {{percentage}}",
          title: "1915c Waiver Services",
        },
      },
    ],
    fields: [
      // Add table fields here only for validation
      ...statePlanServicesBodyList.flatMap(buildServiceFields),
      ...statePlanServicesFootList.flatMap(buildServiceFields),
      ...c1915WaiverServicesBodyList.flatMap(buildServiceFields),
      ...c1915WaiverServicesFootList.flatMap(buildServiceFields),
      {
        id: "qualifiedHcbs_narrative",
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
