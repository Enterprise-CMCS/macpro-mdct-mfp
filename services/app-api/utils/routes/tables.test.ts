import {
  buildServiceFields,
  serviceFieldDynamicRowsTemplateBuilder,
  tableFieldBuilder,
  tableFieldDynamicRowsTemplateBuilder,
} from "./tables";
// types
import {
  NumberMask,
  ReportFormFieldType,
  ServiceFieldType,
  ValidationComparator,
  ValidationType,
} from "../types";

describe("utils/routes/tables", () => {
  const service = {
    id: "mockServiceId",
    label: "Mock Service",
  };

  describe("buildServiceFields()", () => {
    test("returns default fields", () => {
      const fields = buildServiceFields(service);
      const expectedResult = [
        {
          forTableOnly: true,
          id: "mockServiceId-totalComputable",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "",
            label: "Mock Service Total Computable",
            mask: NumberMask.CURRENCY,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-totalStateTerritoryShare",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "0",
            label: "Mock Service Total State / Territory Share",
            mask: NumberMask.CURRENCY,
            readOnly: true,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-totalFederalShare",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "0",
            label: "Mock Service Total Federal Share",
            mask: NumberMask.CURRENCY,
            readOnly: true,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
      ];
      expect(fields).toEqual(expectedResult);
    });

    test("returns readOnly fields with initialValue", () => {
      const readOnlyService = {
        ...service,
        readOnly: true,
      };
      const fieldsToReturn = [
        ServiceFieldType.BUDGETED_FTES,
        ServiceFieldType.FILLED_FTES,
        ServiceFieldType.TOTAL_COMPUTABLE,
        ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
        ServiceFieldType.TOTAL_FEDERAL_SHARE,
      ];
      const fields = buildServiceFields(readOnlyService, fieldsToReturn);
      const expectedResult = [
        {
          forTableOnly: true,
          id: "mockServiceId-budgetedFullTimeEmployees",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "0",
            label: "Mock Service # of Budgeted FTEs",
            mask: NumberMask.FLOAT_OR_INTEGER,
            readOnly: true,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-filledFullTimeEmployees",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "0",
            label: "Mock Service # of Filled FTEs",
            mask: NumberMask.FLOAT_OR_INTEGER,
            readOnly: true,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-totalComputable",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "0",
            label: "Mock Service Total Computable",
            mask: NumberMask.CURRENCY,
            readOnly: true,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-totalStateTerritoryShare",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "0",
            label: "Mock Service Total State / Territory Share",
            mask: NumberMask.CURRENCY,
            readOnly: true,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-totalFederalShare",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "0",
            label: "Mock Service Total Federal Share",
            mask: NumberMask.CURRENCY,
            readOnly: true,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
      ];
      expect(fields).toEqual(expectedResult);
    });

    test("returns all field types", () => {
      const fieldsToReturn = [
        ServiceFieldType.BUDGETED_FTES,
        ServiceFieldType.CATEGORY,
        ServiceFieldType.DESCRIPTION,
        ServiceFieldType.FILLED_FTES,
        ServiceFieldType.NAME,
        ServiceFieldType.PERCENTAGE_OVERRIDE,
        ServiceFieldType.TITLE,
        ServiceFieldType.TOTAL_COMPUTABLE,
        ServiceFieldType.TOTAL_STATE_TERRITORY_SHARE,
        ServiceFieldType.TOTAL_FEDERAL_SHARE,
      ];
      const fields = buildServiceFields(service, fieldsToReturn);
      const expectedResult = [
        {
          forTableOnly: true,
          id: "mockServiceId-budgetedFullTimeEmployees",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "",
            label: "Mock Service # of Budgeted FTEs",
            mask: NumberMask.FLOAT_OR_INTEGER,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-category",
          props: {
            label: "Mock Service Category",
          },
          type: ReportFormFieldType.TEXT,
          validation: ValidationType.TEXT_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-description",
          props: {
            label: "Mock Service Description",
          },
          type: ReportFormFieldType.TEXTAREA,
          validation: ValidationType.TEXT,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-filledFullTimeEmployees",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "",
            label: "Mock Service # of Filled FTEs",
            mask: NumberMask.FLOAT_OR_INTEGER,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-name",
          props: {
            label: "Mock Service Name",
          },
          type: ReportFormFieldType.TEXT,
          validation: ValidationType.TEXT,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-percentageOverride",
          props: {
            decimalPlacesToRoundTo: 0,
            label: "Mock Service Override %",
            mask: "percentage",
          },
          type: ReportFormFieldType.NUMBER,
          validation: {
            options: {
              boundary: 100,
              comparator: ValidationComparator.LESS_THAN_OR_EQUAL_PERCENTAGE,
            },
            type: ValidationType.NUMBER_COMPARISON_OPTIONAL,
          },
        },
        {
          forTableOnly: true,
          id: "mockServiceId-title",
          props: {
            label: "Mock Service Position Title",
          },
          type: ReportFormFieldType.TEXT,
          validation: ValidationType.TEXT_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-totalComputable",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "",
            label: "Mock Service Total Computable",
            mask: NumberMask.CURRENCY,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-totalStateTerritoryShare",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "0",
            label: "Mock Service Total State / Territory Share",
            mask: NumberMask.CURRENCY,
            readOnly: true,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
        {
          forTableOnly: true,
          id: "mockServiceId-totalFederalShare",
          props: {
            decimalPlacesToRoundTo: 2,
            initialValue: "0",
            label: "Mock Service Total Federal Share",
            mask: NumberMask.CURRENCY,
            readOnly: true,
          },
          type: ReportFormFieldType.NUMBER,
          validation: ValidationType.NUMBER_OPTIONAL,
        },
      ];
      expect(fields).toEqual(expectedResult);
    });

    test("returns empty array for unknown fields", () => {
      const fieldsToReturn = ["UnknownFieldType" as ServiceFieldType];
      const fields = buildServiceFields(service, fieldsToReturn);
      expect(fields).toEqual([]);
    });
  });

  describe("table field builders", () => {
    const expectedSharedResult = [
      {
        forTableOnly: true,
        id: "mockServiceId-name",
        props: {
          label: "Mock Label Override",
        },
        type: ReportFormFieldType.NUMBER,
        validation: ValidationType.NUMBER,
      },
    ];

    test("buildServiceFields() returns same fields as tableFieldBuilder()", () => {
      const fieldsToReturn = [ServiceFieldType.NAME];
      const settings = {
        [ServiceFieldType.NAME]: {
          props: {
            label: "Mock Label Override",
          },
          options: {
            type: ReportFormFieldType.NUMBER,
            validation: ValidationType.NUMBER,
          },
        },
      };
      const fields = buildServiceFields(service, fieldsToReturn, settings);
      expect(fields).toEqual(expectedSharedResult);
    });

    test("tableFieldBuilder() returns same fields as buildServiceFields()", () => {
      const fieldsToBuild = [
        {
          id: "name",
          props: {
            label: "Mock Label Override",
          },
          options: {
            type: ReportFormFieldType.NUMBER,
            validation: ValidationType.NUMBER,
          },
        },
      ];
      const fields = tableFieldBuilder(service, fieldsToBuild);
      expect(fields).toEqual(expectedSharedResult);
    });
  });
});

describe("dynamic rows template builders", () => {
  const sharedProps = {
    dynamicFieldsBodyList: [
      {
        id: "mockDynamicRowId",
        label: "Mock Results",
        readOnly: true,
      },
    ],
    dynamicFieldValidations: {
      name: ValidationType.TEXT_OPTIONAL,
    },
    dynamicModalList: [
      {
        id: "mockDynamicRowId",
        label: "Mock Results",
      },
    ],
    dynamicModalVerbiage: {
      add: "Add Mock",
      edit: "Edit Mock",
    },
    dynamicRowId: "mockDynamicRowId",
    label: "Mock Dynamic Row",
    verbiage: {
      buttonText: "Add mock to row",
      hint: "Mock hint",
    },
  };

  const expectedSharedResult = {
    forTableOnly: true,
    id: "mockDynamicRowId",
    props: {
      label: "Mock Dynamic Row",
      dynamicFields: [
        {
          forTableOnly: true,
          id: "mockDynamicRowId-name",
          props: {
            label: "Mock Label Override",
            readOnly: true,
          },
          type: ReportFormFieldType.TEXT,
          validation: ValidationType.TEXT,
        },
      ],
      dynamicModalForm: {
        id: "mockDynamicRowId-modalForm",
        heading: sharedProps.dynamicModalVerbiage,
        fields: [
          {
            forTableOnly: true,
            id: "mockDynamicRowId-name",
            props: {
              label: "Mock Modal Label Override",
              readOnly: undefined,
            },
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.TEXT,
          },
        ],
      },
    },
    type: ReportFormFieldType.DYNAMIC_OBJECT,
    validation: {
      type: ValidationType.DYNAMIC_OPTIONAL,
      options: {
        dynamicFieldValidations: sharedProps.dynamicFieldValidations,
      },
    },
    verbiage: sharedProps.verbiage,
  };

  test("serviceFieldDynamicRowsTemplateBuilder() returns same template as tableFieldDynamicRowsTemplateBuilder()", () => {
    const template = serviceFieldDynamicRowsTemplateBuilder({
      ...sharedProps,
      dynamicFieldsSettings: {
        [ServiceFieldType.NAME]: {
          props: {
            label: "Mock Label Override",
          },
        },
      },
      dynamicFieldsToReturn: [ServiceFieldType.NAME],
      dynamicModalFieldsSettings: {
        [ServiceFieldType.NAME]: {
          props: {
            label: "Mock Modal Label Override",
          },
        },
      },
      dynamicModalFieldsToReturn: [ServiceFieldType.NAME],
    });
    expect(template).toEqual(expectedSharedResult);
  });

  test("tableFieldDynamicRowsTemplateBuilder() returns same template as serviceFieldDynamicRowsTemplateBuilder()", () => {
    const template = tableFieldDynamicRowsTemplateBuilder({
      ...sharedProps,
      dynamicFieldsToReturn: [
        {
          id: "name",
          props: {
            label: "Mock Label Override",
          },
        },
      ],
      dynamicModalFieldsToReturn: [
        {
          id: "name",
          props: {
            label: "Mock Modal Label Override",
          },
        },
      ],
    });
    expect(template).toEqual(expectedSharedResult);
  });
});
