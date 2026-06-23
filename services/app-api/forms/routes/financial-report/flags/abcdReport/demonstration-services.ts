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
  serviceFieldDynamicRowsTemplateBuilder,
} from "../../../../../utils/routes/tables";
import {
  accordionWithFmapLink,
  c1915WaiverServices,
  errorMessageWithFmapLink,
  statePlanServices,
  statePlanServicesHeaders,
} from "./utils";

const statePlanServicesTableId = "demonstrationServices_statePlanServices";
const c1915WaiverServicesTableId = "demonstrationServices_1915cWaiverServices";

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
const statePlanServicesFieldsToReturn = [
  ServiceFieldType.TOTAL_COMPUTABLE,
  ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
  ServiceFieldType.TOTAL_FEDERAL_SHARE,
];
const c1915WaiverServicesFieldsToReturn = [...statePlanServicesFieldsToReturn];

// State Plan Services table dynamic rows
const statePlanServicesDynamicRowId = `${statePlanServicesTableId}_otherServices`;
const statePlanServicesDynamicBodyList = [
  {
    id: statePlanServicesDynamicRowId,
    label: "Other Services",
  },
];
const statePlanServicesDynamicFieldsToReturn = [
  ServiceFieldType.NAME,
  ...statePlanServicesFieldsToReturn,
];

const statePlanServicesDynamicRowsTemplate =
  serviceFieldDynamicRowsTemplateBuilder({
    dynamicFieldsBodyList: statePlanServicesDynamicBodyList,
    dynamicFieldsSettings: {
      dynamicLabel: "Other:",
    },
    dynamicFieldsToReturn: statePlanServicesDynamicFieldsToReturn,
    dynamicFieldValidations: {
      name: ValidationType.TEXT_OPTIONAL,
      totalComputable: ValidationType.NUMBER_OPTIONAL,
      totalStateTerritoryShare: ValidationType.NUMBER_OPTIONAL,
      totalFederalShare: ValidationType.NUMBER_OPTIONAL,
    },
    dynamicRowId: statePlanServicesDynamicRowId,
    label: "Other Services",
    verbiage: {
      buttonText: "Add other service",
      hint: "To add an additional service, click the “Add other service” button below.",
    },
  });

// 1915(c) Waiver Services table dynamic rows
const c1915WaiverServicesDynamicRowId = `${c1915WaiverServicesTableId}_otherServices`;
const c1915WaiverServicesDynamicBodyList = [
  {
    id: c1915WaiverServicesDynamicRowId,
    label: "Other Services",
  },
];
const c1915WaiverServicesDynamicFieldsToReturn = [
  ServiceFieldType.NAME,
  ...c1915WaiverServicesFieldsToReturn,
];

const c1915WaiverServicesDynamicRowsTemplate =
  serviceFieldDynamicRowsTemplateBuilder({
    dynamicFieldsBodyList: c1915WaiverServicesDynamicBodyList,
    dynamicFieldsSettings: {
      dynamicLabel: "Other:",
    },
    dynamicFieldsToReturn: c1915WaiverServicesDynamicFieldsToReturn,
    dynamicFieldValidations: {
      name: ValidationType.TEXT_OPTIONAL,
      totalComputable: ValidationType.NUMBER_OPTIONAL,
      totalStateTerritoryShare: ValidationType.NUMBER_OPTIONAL,
      totalFederalShare: ValidationType.NUMBER_OPTIONAL,
    },
    dynamicRowId: c1915WaiverServicesDynamicRowId,
    label: "Other Services",
    verbiage: {
      buttonText: "Add other service",
      hint: "To add an additional service, click the “Add other service” button below.",
    },
  });

export const demonstrationServicesRoute: FormTablesRoute = {
  name: "Demonstration Services",
  path: "/financial-report/demonstration-services",
  pageType: PageTypes.STANDARD,
  verbiage: {
    intro: {
      section: "",
      subsection: "Demonstration Services",
      info: [
        {
          type: "p",
          content:
            "Demonstration services are optional HCBS Medicaid services as listed in Attachment A of the MFP Program Terms and Conditions that are not currently covered under the state or territory’s Medicaid state plan or HCBS waiver programs (PTC 17).",
        },
      ],
    },
    accordion: accordionWithFmapLink,
  },
  form: {
    id: "exp-demonstrationServices",
    tables: [
      {
        id: statePlanServicesTableId,
        // Display table fields in rows
        bodyRows: statePlanServicesBodyList.map((service) => {
          const bodyFields = buildServiceFields(service);
          return [service.label, ...bodyFields];
        }),
        dynamicRowsTemplate: statePlanServicesDynamicRowsTemplate,
        footRows: statePlanServicesFootList.map((service) => {
          const footFields = buildServiceFields(service);
          return ["Totals", ...footFields];
        }),
        headRows: [statePlanServicesHeaders],
        options: {
          percentageField: "fmap_demonstrationServicesPercentage",
        },
        tableType: FormTableType.CALCULATION,
        verbiage: {
          errorMessage: errorMessageWithFmapLink,
          percentage:
            "Enhanced FMAP Demonstration Services Percentage: {{percentage}}",
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
        dynamicRowsTemplate: c1915WaiverServicesDynamicRowsTemplate,
        footRows: c1915WaiverServicesFootList.map((service) => {
          const footFields = buildServiceFields(service);
          return ["Totals", ...footFields];
        }),
        headRows: [statePlanServicesHeaders],
        options: {
          percentageField: "fmap_demonstrationServicesPercentage",
        },
        tableType: FormTableType.CALCULATION,
        verbiage: {
          errorMessage: errorMessageWithFmapLink,
          percentage:
            "Enhanced FMAP Demonstration Services Percentage: {{percentage}}",
          title: "1915c Waiver Services",
        },
      },
    ],
    fields: [
      // Add table fields here only for validation
      ...statePlanServicesBodyList.flatMap((service) =>
        buildServiceFields(service)
      ),
      ...statePlanServicesFootList.flatMap((service) =>
        buildServiceFields(service)
      ),
      statePlanServicesDynamicRowsTemplate,
      ...c1915WaiverServicesBodyList.flatMap((service) =>
        buildServiceFields(service)
      ),
      ...c1915WaiverServicesFootList.flatMap((service) =>
        buildServiceFields(service)
      ),
      c1915WaiverServicesDynamicRowsTemplate,
      {
        id: "demonstrationServices_narrative",
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
