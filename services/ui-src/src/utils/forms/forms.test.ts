import { notAnsweredText } from "../../constants";
import {
  convertChoiceToEntity,
  convertEntityToTargetPopulationChoice,
  fillEmptyQuarters,
  hydrateFormFields,
  injectFormWithTargetPopulations,
  getDefaultAndApplicablePopulations,
  resetClearProp,
  setClearedEntriesToDefaultValue,
  sortFormErrors,
  disableCopiedFundingSources,
  getApplicablePopulations,
  addDynamicTableRowsValidation,
  filterResubmissionData,
} from "./forms";
// types
import {
  FormField,
  ReportFormFieldType,
  ReportShape,
  ReportStatus,
  ReportType,
  ValidationType,
} from "types";
import {
  mockDateField,
  mockFormField,
  mockNestedFormField,
  mockNumberField,
  mockTargetPopButOtherApplicable,
  mockTargetPopButOtherNotApplicable,
  mockTargetPopByOtherNotDefined,
  mockTargetPopReqButApplicable,
  mockTargetPopReqButApplicableIsUndefined,
  mockTargetPopReqButNotApplicable,
  mockTargetPopDefaultAndApplicable,
  mockTargetPopDefaultButNotApplicable,
  mockWPCopiedReport,
  mockFundingSourceFormField,
  mockDynamicFieldId,
} from "utils/testing/setupJest";
import { AnyObject } from "yup/lib/types";

const mockFormData = {
  fundingSources_quarters2024Q3: "8.00",
  fundingSources_quarters2024Q4: "8.00",
  fundingSources_quarters2025Q1: "8.00",
  fundingSources_quarters2025Q2: "8.00",
  fundingSources_quarters2025Q3: "888.00",
  fundingSources_quarters2025Q4: "8.00",
  fundingSources_quarters2026Q1: "88.00",
  fundingSources_quarters2026Q2: "8.00",
  fundingSources_quarters2026Q3: "8.00",
  fundingSources_quarters2026Q4: "8.00",
  fundingSources_wpTopic: [
    {
      isCopied: true,
      key: "",
      value: "MFP cooperative agreement funds for supplemental services",
    },
  ],
  id: "635d43f-21c8-3234-5630-a2d4c7ad8ca8",
  initiative_wp_otherTopic: "",
  isCopied: true,
};

describe("utils/forms", () => {
  describe("resetClearProp()", () => {
    test("should reset clear for choicelist fields and its nested children", async () => {
      const fields: FormField[] = [mockNestedFormField];
      resetClearProp(fields);
      expect(fields[0].props!.clear).toBe(false);
      for (let choice of fields[0].props!.choices) {
        expect(choice.props!.clear).toBe(false);
      }
    });

    test("should reset clear for text fields", async () => {
      const fields: FormField[] = [mockFormField];
      resetClearProp(fields);
      expect(fields[0].props?.clear).toBe(false);
    });

    test("should reset clear for number fields", async () => {
      const fields: FormField[] = [mockNumberField];
      resetClearProp(fields);
      expect(fields[0].props?.clear).toBe(false);
    });

    test("should reset clear for date fields", async () => {
      const fields: FormField[] = [mockDateField];
      resetClearProp(fields);
      expect(fields[0].props?.clear).toBe(false);
    });
  });

  describe("disableCopiedFundingSources()", () => {
    test("should disable choicelist on copy over report - funding source section", () => {
      const fields: FormField[] = [structuredClone(mockFundingSourceFormField)];
      disableCopiedFundingSources(mockWPCopiedReport, fields, mockFormData);
      expect(fields[0].props?.disabled).toBe(true);
    });

    test("should not disable funding sources for non-copied reports", () => {
      const fields: FormField[] = [structuredClone(mockFundingSourceFormField)];
      disableCopiedFundingSources({} as ReportShape, fields, mockFormData);
      expect(fields[0].props?.disabled).toBeFalsy();
    });

    test("should not disable fields other than funding sources", () => {
      const fields: FormField[] = [structuredClone(mockFormField)];
      disableCopiedFundingSources(mockWPCopiedReport, fields, mockFormData);
      expect(fields[0].props?.disabled).toBeFalsy();
    });
  });

  describe("getDefaultAndApplicablePopulations()", () => {
    const exampleTargetPopulations = [
      mockTargetPopReqButNotApplicable,
      mockTargetPopReqButApplicable,
      mockTargetPopReqButApplicableIsUndefined,
      mockTargetPopButOtherApplicable,
      mockTargetPopButOtherNotApplicable,
      mockTargetPopByOtherNotDefined,
      mockTargetPopDefaultButNotApplicable,
      mockTargetPopDefaultAndApplicable,
    ];

    test("should filter out any target population that has a no value for transitionBenchmarks_applicableToMfpDemonstration that is not a default population", async () => {
      const filteredPopulations = getDefaultAndApplicablePopulations(
        exampleTargetPopulations
      );
      expect(filteredPopulations.length).toBe(6);
      expect(filteredPopulations).toEqual([
        mockTargetPopReqButApplicable,
        mockTargetPopReqButApplicableIsUndefined,
        mockTargetPopButOtherApplicable,
        mockTargetPopByOtherNotDefined,
        mockTargetPopDefaultButNotApplicable,
        mockTargetPopDefaultAndApplicable,
      ]);
    });
  });

  describe("getApplicablePopulations()", () => {
    const exampleTargetPopulations = [
      mockTargetPopReqButNotApplicable,
      mockTargetPopReqButApplicable,
      mockTargetPopReqButApplicableIsUndefined,
      mockTargetPopButOtherApplicable,
      mockTargetPopButOtherNotApplicable,
      mockTargetPopByOtherNotDefined,
      mockTargetPopDefaultButNotApplicable,
      mockTargetPopDefaultAndApplicable,
    ];

    test("should filter out any target population that has a no value for transitionBenchmarks_applicableToMfpDemonstration ", async () => {
      const filteredPopulations = getApplicablePopulations(
        exampleTargetPopulations
      );
      expect(filteredPopulations.length).toBe(3);
      expect(filteredPopulations).toEqual([
        mockTargetPopReqButApplicable,
        mockTargetPopButOtherApplicable,
        mockTargetPopDefaultAndApplicable,
      ]);
    });
  });

  describe("fillEmptyQuarters()", () => {
    test("should has 12 quarters and 2 values as not answered", () => {
      let mockQuarters = [];
      for (var i = 0; i < 10; i++) {
        mockQuarters.push({ id: `2021 Q1`, value: i });
      }

      const newQuarters: AnyObject[] = fillEmptyQuarters(mockQuarters);
      expect(newQuarters).toHaveLength(12);
      expect(
        newQuarters.filter((quarter) => quarter.value === notAnsweredText)
      ).toHaveLength(2);
    });
  });

  describe("hydrateFormFields()", () => {
    test("should recursively fill in values", () => {
      const formFields = [
        {
          id: "field1",
          type: "mock type",
          props: {
            choices: [
              {
                children: [
                  {
                    id: "field2",
                  },
                ],
              },
            ],
          },
        },
      ];
      const formData = {
        field1: "mock entry 1",
        field2: "mock entry 2",
      };

      hydrateFormFields(formFields, formData);

      const field1 = formFields[0] as AnyObject;
      const field2 = formFields[0].props.choices[0].children[0] as AnyObject;
      expect(field1.props.hydrate).toBe("mock entry 1");
      expect(field2.props.hydrate).toBe("mock entry 2");
    });

    test("should account for the WP close-out initiative disabled field", () => {
      const formFields = [
        {
          id: "defineInitiative_projectedEndDate_value",
          type: "mock type",
          props: {
            disabled: true,
          },
        },
      ];
      const formData = {
        defineInitiative_projectedEndDate: [
          {
            value: "No",
          },
        ],
      };

      hydrateFormFields(formFields, formData);

      expect((formFields[0].props as AnyObject).hydrate).toBe("No");
    });
  });

  describe("sortFormErrors()", () => {
    test("should aggregate errors from a form into an array", () => {
      const form = {
        badField: "bad",
        goodField: "good",
        terribleField: "terrible",
      };
      const errors = {
        badField: true,
        terribleField: true,
      };

      const result = sortFormErrors(form, errors);

      expect(result).toEqual(["badField", "terribleField"]);
    });

    /** TODO: Evidently it should not */
    test.skip("should sort the result", () => {
      const form = {
        terribleField: "terrible",
        badField: "bad",
        goodField: "good",
      };
      const errors = {
        badField: true,
        terribleField: true,
      };

      const result = sortFormErrors(form, errors);

      expect(result).toEqual(["badField", "terribleField"]);
    });
  });

  describe("setClearedEntriesToDefaultValue()", () => {
    test("should clear each entry appropriately according to its type", () => {
      const entity = {
        arr: [1, 2, 3],
        obj: { foo: "bar" },
        str: "quux",
      };
      const entriesToClear = ["arr", "obj", "str"];

      setClearedEntriesToDefaultValue(entity, entriesToClear);

      expect(entity).toEqual({
        arr: [],
        obj: {},
        str: "",
      });
    });

    test("should not clear entries unless specified", () => {
      const entity = {
        arr: [1, 2, 3],
        obj: { foo: "bar" },
        str: "quux",
      };
      const entriesToClear = [] as string[];

      setClearedEntriesToDefaultValue(entity, entriesToClear);

      expect(entity).toEqual({
        arr: [1, 2, 3],
        obj: { foo: "bar" },
        str: "quux",
      });
    });
  });

  describe("convertEntityToTargetPopulationChoice()", () => {
    test("should map entities to choice answers", () => {
      const entity = [
        {
          id: "field1",
          type: "targetPopulations" as const,
          transitionBenchmarks_targetPopulationName: "Older adults", // a default population
        },
        {
          id: "field2",
          type: "targetPopulations" as const,
          transitionBenchmarks_targetPopulationName: "custom population",
        },
      ];

      const result = convertEntityToTargetPopulationChoice(entity);

      expect(result).toEqual([
        {
          key: "targetPopulations-field1",
          value: "Older adults",
        },
        {
          key: "targetPopulations-field2",
          value: "Other: custom population",
        },
      ]);
    });
  });

  describe("convertChoiceToEntity()", () => {
    test("should map choice answers to entities", () => {
      const choices = [
        { key: "field1", value: "Yes" },
        { key: "field2", value: "Nah" },
      ];

      const result = convertChoiceToEntity(choices);

      expect(result).toEqual([
        { id: "field1", label: "Yes", name: "Yes", value: "Yes" },
        { id: "field2", label: "Nah", name: "Nah", value: "Nah" },
      ]);
    });
  });

  describe("injectFormWithTargetPopulations()", () => {
    test("should populate fields with data from a work plan", () => {
      const form = {
        id: "form1",
        fields: [
          {
            id: "something_populations", // importantly, this contains the string "populations"
            type: "checkbox",
            props: {
              reallyCool: true,
              choices: "will be overwritten",
            },
          },
          {
            id: "some other field",
            type: "text",
            props: {
              reallyCool: false, // aw, sad :(
            },
          },
        ],
      };
      const dataToInject = [
        {
          id: "entity1",
          type: "targetPopulations",
          transitionBenchmarks_targetPopulationName: "Older adults", // a default population
        },
        {
          id: "entity2",
          type: "targetPopulations",
          transitionBenchmarks_targetPopulationName: "population B",
        },
      ];
      const dataFromSAR = false;

      injectFormWithTargetPopulations(form, dataToInject, dataFromSAR);

      expect(form.fields).toEqual([
        {
          id: "something_populations",
          type: "checkbox",
          props: {
            reallyCool: true,
            choices: [
              {
                id: "targetPopulations-entity1",
                label: "Older adults",
                name: "Older adults",
                value: "Older adults",
              },
              {
                id: "targetPopulations-entity2",
                label: "Other: population B",
                name: "population B",
                value: "Other: population B",
              },
            ],
          },
        },
        {
          id: "some other field",
          type: "text",
          props: {
            reallyCool: false,
          },
        },
      ]);
    });

    test("should populate fields with data from a semi-annual report", () => {
      const form = {
        id: "form1",
        fields: [
          {
            id: "something_populations", // importantly, this contains the string "populations"
            type: "checkbox",
            props: {
              reallyCool: true,
              choices: "will be overwritten",
            },
          },
          {
            id: "some other field",
            type: "text",
            props: {
              reallyCool: false, // aw, sad :(
            },
          },
        ],
      };
      const dataToInject = [
        {
          key: "targetPopulations-entity1",
          value: "Older adults",
        },
        {
          key: "targetPopulations-entity2",
          value: "Other: population B",
        },
      ];
      const dataFromSAR = true;

      injectFormWithTargetPopulations(form, dataToInject, dataFromSAR);

      expect(form.fields).toEqual([
        {
          id: "something_populations",
          type: "checkbox",
          props: {
            reallyCool: true,
            choices: [
              {
                id: "targetPopulations-entity1",
                label: "Older adults",
                name: "Older adults",
                value: "Older adults",
              },
              {
                id: "targetPopulations-entity2",
                label: "Other: population B",
                name: "Other: population B",
                value: "Other: population B",
              },
            ],
          },
        },
        {
          id: "some other field",
          type: "text",
          props: {
            reallyCool: false,
          },
        },
      ]);
    });
  });

  describe("filterResubmissionData()", () => {
    const fields = [
      {
        id: "generalInformation_resubmissionInformation",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
      },
      {
        id: "mockFieldId",
        type: ReportFormFieldType.TEXT,
        validation: ValidationType.TEXT,
      },
    ];

    const filteredFields = [fields[1]];

    const form = { id: "mockFormId", fields };
    test("filters SAR with no submission count", () => {
      const report = {
        status: ReportStatus.IN_PROGRESS,
        submissionCount: 0,
        reportType: ReportType.SAR,
      } as unknown as ReportShape;
      const result = filterResubmissionData(form, report);

      expect(result).toEqual({ id: "mockFormId", fields: filteredFields });
    });

    test("filters submitted report", () => {
      const report = {
        locked: true,
        status: ReportStatus.SUBMITTED,
        submissionCount: 1,
        reportType: ReportType.WP,
      } as unknown as ReportShape;
      const result = filterResubmissionData(form, report);

      expect(result).toEqual({ id: "mockFormId", fields: filteredFields });
    });

    test("does not filter SAR with submission count", () => {
      const report = {
        status: ReportStatus.IN_PROGRESS,
        submissionCount: 1,
        reportType: ReportType.SAR,
      } as unknown as ReportShape;
      const result = filterResubmissionData(form, report);

      expect(result).toEqual({ id: "mockFormId", fields });
    });

    test("does not filter unlocked report", () => {
      const report = {
        locked: false,
        status: ReportStatus.SUBMITTED,
        submissionCount: 1,
        reportType: ReportType.WP,
      } as unknown as ReportShape;
      const result = filterResubmissionData(form, report);

      expect(result).toEqual({ id: "mockFormId", fields });
    });

    test("does not resubmitted report", () => {
      const report = {
        locked: true,
        status: ReportStatus.SUBMITTED,
        submissionCount: 2,
        reportType: ReportType.WP,
      } as unknown as ReportShape;
      const result = filterResubmissionData(form, report);

      expect(result).toEqual({ id: "mockFormId", fields });
    });
  });

  describe("addDynamicTableRowsValidation()", () => {
    const form = {
      id: "mockFormId",
      fields: [
        {
          id: "mockFieldId",
          type: ReportFormFieldType.TEXT,
          validation: ValidationType.TEXT,
        },
        {
          id: "mockForm_mockDynamicField",
          type: ReportFormFieldType.DYNAMIC_OBJECT,
          validation: ValidationType.DYNAMIC,
          props: {
            dynamicFields: [
              {
                id: "mockForm_mockDynamicField-mockId",
                type: ReportFormFieldType.TEXT,
                validation: ValidationType.TEXT,
              },
            ],
          },
        },
      ],
    };

    test("adds dynamic validation fields to form", () => {
      const formData = {
        mockForm_mockDynamicField: [
          {
            id: mockDynamicFieldId,
            mockId: "Mock text",
          },
        ],
      };
      const result = addDynamicTableRowsValidation(form, formData);
      expect(result).toEqual({
        id: "mockFormId",
        fields: [
          {
            id: "mockFieldId",
            type: "text",
            validation: "text",
          },
          {
            id: "mockForm_mockDynamicField",
            props: {
              dynamicFields: [
                {
                  id: "mockForm_mockDynamicField-mockId",
                  type: "text",
                  validation: "text",
                },
              ],
            },
            type: "dynamicObject",
            validation: "dynamic",
          },
          {
            id: "tempDynamicField_mockForm_mockDynamicField_123a-456b-789c-mockId",
            type: "text",
            validation: "text",
          },
        ],
      });
    });

    test("ignores dynamic validation if no dynamic data", () => {
      const result = addDynamicTableRowsValidation(form, {});
      expect(result).toEqual({
        id: "mockFormId",
        fields: [
          {
            id: "mockFieldId",
            type: "text",
            validation: "text",
          },
          {
            id: "mockForm_mockDynamicField",
            props: {
              dynamicFields: [
                {
                  id: "mockForm_mockDynamicField-mockId",
                  type: "text",
                  validation: "text",
                },
              ],
            },
            type: "dynamicObject",
            validation: "dynamic",
          },
        ],
      });
    });
  });
});
