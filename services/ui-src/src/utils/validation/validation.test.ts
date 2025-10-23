import { mapValidationTypesToSchema } from "./validation";
import * as schema from "./schemas";
import { FormJson, isFieldElement } from "types";
import { compileValidationJsonFromFields } from "utils/reports/reports";
import * as yup from "yup";

const mockStandardValidationType = {
  key: "text",
};

const mockCustomValidationType = {
  key: {
    type: "textCustom",
    options: {
      maxLength: 10,
    },
  },
};
const mockNestedValidationType = {
  key: {
    type: "text",
    nested: true,
    parentFieldName: "mock-parent-field-name",
    parentOptionId: "mock-parent-option-name",
  },
};

const mockDependentValidationType = {
  key: {
    type: "endDate",
    dependentFieldName: "mock-dependent-field-name",
  },
};

const mockNestedDependentValidationType = {
  key: {
    type: "endDate",
    dependentFieldName: "mock-dependent-field-name",
    nested: true,
    parentFieldName: "mock-parent-field-name",
    parentOptionId: "mock-parent-option-name",
  },
};

describe("utils/validation", () => {
  describe("mapValidationTypesToSchema()", () => {
    test("Returns standard validation schema if passed standard validation type", () => {
      const result = mapValidationTypesToSchema(mockStandardValidationType);
      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({ key: schema.text() })
      );
    });

    test("Returns custom validation schema if passed custom validation type", () => {
      const result = mapValidationTypesToSchema(mockCustomValidationType);
      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({ key: schema.textCustom({}) })
      );
    });

    test("Returns nested validation schema if passed nested validation type", () => {
      const result = mapValidationTypesToSchema(mockNestedValidationType);
      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({
          key: schema.nested(
            () => schema.text(),
            "mock-parent-field-name",
            "mock-parent-option-name"
          ),
        })
      );
    });

    test("Returns dependent validation schema if passed dependent validation type", () => {
      const result = mapValidationTypesToSchema(mockDependentValidationType);
      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({
          key: schema.endDate("mock-dependent-field-name"),
        })
      );
    });

    test("Returns nested dependent validation schema if passed nested dependent validation type", () => {
      const result = mapValidationTypesToSchema(
        mockNestedDependentValidationType
      );
      expect(JSON.stringify(result)).toEqual(
        JSON.stringify({
          key: schema.nested(
            () => schema.endDate("mock-dependent-field-name"),
            "mock-parent-field-name",
            "mock-parent-option-name"
          ),
        })
      );
    });

    describe("Full nested validation tests, formJson through to data", () => {
      const petForm: FormJson = {
        id: "mock-form-id",
        fields: [
          {
            id: "hasPets",
            type: "radio",
            validation: "radio",
            props: {
              label: "Do you have any pets?",
              choices: [
                {
                  id: "123",
                  label: "No",
                },
                {
                  id: "456",
                  label: "Yes",
                  children: [
                    {
                      id: "hasPets_howMany",
                      props: {
                        label: "How many pets?",
                      },
                      type: "number",
                      validation: {
                        type: "number",
                        parentFieldName: "hasPets",
                        parentOptionId: "456",
                        nested: true,
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      };
      let petSchema: any; // this type is heckin' complicated

      beforeAll(() => {
        const petFields = petForm.fields.filter(isFieldElement);
        const validationJson = compileValidationJsonFromFields(petFields);

        expect(validationJson).toEqual({
          hasPets: "radio",
          hasPets_howMany: {
            nested: true,
            parentFieldName: "hasPets",
            parentOptionId: "456",
            type: "number",
          },
        });

        const fieldsSchema = mapValidationTypesToSchema(validationJson);
        petSchema = yup.object(fieldsSchema);
      });

      test("Makes nested fields optional if parent option is not selected", () => {
        const petReport = {
          hasPets: [
            {
              key: "hasPets-123",
              value: "No",
            },
          ],
          // That's fine.
        };

        expect(() => petSchema.validateSync(petReport)).not.toThrow();
      });

      test("Makes nested fields required if parent option is selected", () => {
        const petReport = {
          hasPets: [
            {
              key: "hasPets-456",
              value: "Yes",
            },
          ],
          // Missing the hasPets_howMany field
        };

        expect(() => petSchema.validateSync(petReport)).toThrow();
      });

      test("Enforces nested field validation if parent option is selected", () => {
        const petReport = {
          hasPets: [
            {
              key: "hasPets-456",
              value: "Yes",
            },
          ],
          hasPets_howMany: "who are you, the pet police?", // This is not a number.
        };

        expect(() => petSchema.validateSync(petReport)).toThrow();
      });

      test("Passes validation for correctly-completed nested fields", () => {
        const petReport = {
          hasPets: [
            {
              key: "hasPets-456",
              value: "Yes",
            },
          ],
          hasPets_howMany: "17", // That's, like, a lot of pets. Valid though.
        };

        expect(() => petSchema.validateSync(petReport)).not.toThrow();
      });
    });
  });
});
