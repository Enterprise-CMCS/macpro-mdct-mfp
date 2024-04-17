import { notAnsweredText } from "../../constants";
import {
  convertChoiceToEntity,
  convertEntityToTargetPopulationChoice,
  fillEmptyQuarters,
  hydrateFormFields,
  injectFormWithTargetPopulations,
  removeNotApplicablePopulations,
  resetClearProp,
  setClearedEntriesToDefaultValue,
  sortFormErrors,
  disableCopiedFundingSources,
} from "./forms";
// types
import { FormField } from "types";
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
} from "utils/testing/setupJest";
import { AnyObject } from "yup/lib/types";

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

describe("form utilities", () => {
  describe("Test resetClearProp", () => {
    it("should reset clear for choicelist fields and its nested children", async () => {
      const fields: FormField[] = [mockNestedFormField];
      resetClearProp(fields);
      expect(fields[0].props!.clear).toBe(false);
      for (let choice of fields[0].props!.choices) {
        expect(choice.props!.clear).toBe(false);
      }
    });

    describe("Test Choice List Disabling", () => {
      it("should disable choicelist on copy over report - funding source section", () => {
        const fields: FormField[] = [mockFundingSourceFormField];
        const disabledFields = disableCopiedFundingSources(
          fields,
          mockWPCopiedReport
        );
        expect(disabledFields[0].props?.disabled).toBe(true);
      });
    });

    it("should reset clear for text fields", async () => {
      const fields: FormField[] = [mockFormField];
      resetClearProp(fields);
      expect(fields[0].props?.clear).toBe(false);
    });

    it("should reset clear for number fields", async () => {
      const fields: FormField[] = [mockNumberField];
      resetClearProp(fields);
      expect(fields[0].props?.clear).toBe(false);
    });

    it("should reset clear for date fields", async () => {
      const fields: FormField[] = [mockDateField];
      resetClearProp(fields);
      expect(fields[0].props?.clear).toBe(false);
    });
  });

  describe("Test removeNotApplicablePopulations", () => {
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

    it("should filter out any target population that has a no value for transitionBenchmarks_applicableToMfpDemonstration", async () => {
      const filteredPopulations = removeNotApplicablePopulations(
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

  describe("Test fillEmptyQuarters", () => {
    it("should has 12 quarters and 2 values as not answered", () => {
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

  describe("hydrateFormFields", () => {
    it("should recursively fill in values", () => {
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

    it("should account for the WP close-out initiative disabled field", () => {
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

  describe("sortFormErrors", () => {
    it("should aggregate errors from a form into an array", () => {
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

    /** Evidently it should not */
    it.skip("should sort the result", () => {
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

  describe("setClearedEntriesToDefaultValue", () => {
    it("should clear each entry appropriately according to its type", () => {
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

    it("should not clear entries unless specified", () => {
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

  describe("convertEntityToTargetPopulationChoice", () => {
    it("should map entities to choice answers", () => {
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

  describe("convertChoiceToEntity", () => {
    it("should map choice answers to entities", () => {
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

  describe("injectFormWithTargetPopulations", () => {
    it("should populate fields with data from a work plan", () => {
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

    it("should populate fields with data from a semi-annual report", () => {
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
});
