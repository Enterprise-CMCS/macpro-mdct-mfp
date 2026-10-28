import { MixedSchema } from "yup/lib/mixed";
import { object } from "yup";
import { endDate, isEndDateAfterStartDate, nested, schemaMap } from "./schemas";
import {
  AnyObject,
  NumberOptions,
  ValidationComparator,
  ValidationType,
} from "types";

describe("utils/validation/schemas", () => {
  const goodNumberTestCases = [
    "123",
    "123.00",
    "1,230",
    "1,2,30",
    "1230",
    "123450123,,,.123123123123",
    "N/A",
    "Data not available",
  ];
  const badNumberTestCases = ["abc", "N", "", "!@#!@%", "-1"];

  const goodNumberOptionalTestCases = [...goodNumberTestCases, ""];

  const badNumberOptionalTestCases = badNumberTestCases.filter((t) => t !== "");

  const goodIntegerTestCases = [
    "1",
    "123",
    "12300",
    "1,230",
    "1230",
    "N/A",
    "Data not available",
  ];
  const badIntegerTestCases = [
    "",
    "abc",
    "N",
    "!@#!@%",
    "-1",
    "1.23",
    "23450123,,,.123123123123",
  ];

  const goodRatioTestCases = [
    "1:1",
    "123:123",
    "1,234:1.12",
    "0:1",
    "1:10,000",
  ];
  const badRatioTestCases = [
    ":",
    ":1",
    "1:",
    "1",
    "1234",
    "abc",
    "N/A",
    "abc:abc",
    ":abc",
    "abc:",
    "%@#$!ASDF",
  ];

  const goodDropdownOptionalTestCases = [
    { label: "Option 1", value: "option1" },
    { label: "", value: "" },
    { label: undefined, value: undefined },
  ];
  const badDropdownOptionalTestCases = ["Not an object", []];

  const goodDateTestCases = ["01/01/1990", "12/31/2020", "01012000"];
  const badDateTestCases = ["01-01-1990", "13/13/1990", "12/32/1990"];

  // nested
  const fieldValidationObject = {
    type: "text",
    nested: true,
    parentFieldName: "mock-parent-field-name",
  };
  const validationSchema = {
    type: "string",
  };

  const numberOptions: NumberOptions = {
    boundary: 10,
    comparator: ValidationComparator.LESS_THAN_OR_EQUAL_PERCENTAGE,
  };

  const testSchema = (
    schemaToUse: MixedSchema<any, AnyObject, any>,
    testCases: Array<string | AnyObject | null | undefined>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  describe("date", () => {
    test("returns true", () => {
      testSchema(schemaMap.date, goodDateTestCases, true);
    });

    test("returns false", () => {
      testSchema(schemaMap.date, badDateTestCases, false);
    });
  });

  describe("dynamic", () => {
    test("returns true for text validation", () => {
      testSchema(schemaMap.dynamic(), [[{ id: "mockId", name: "text" }]], true);
    });

    test("returns false for empty text", () => {
      testSchema(schemaMap.dynamic(), [], false);
    });

    test("returns true for number validation", () => {
      testSchema(
        schemaMap.dynamic({
          dynamicFieldValidations: { name: ValidationType.NUMBER },
        }),
        [[{ id: "mockId", name: "123" }]],
        true
      );
    });

    test("returns false for text with number validation", () => {
      testSchema(
        schemaMap.dynamic({
          dynamicFieldValidations: { name: ValidationType.NUMBER },
        }),
        [[{ id: "mockId", name: "text" }]],
        false
      );
    });
  });

  describe("dynamicOptional", () => {
    test("returns true for text validation", () => {
      testSchema(
        schemaMap.dynamicOptional(),
        [[{ id: "mockId", name: "text" }]],
        true
      );
    });

    test("returns true for empty text", () => {
      testSchema(schemaMap.dynamicOptional(), [], true);
    });

    test("returns true for number validation", () => {
      testSchema(
        schemaMap.dynamicOptional({
          dynamicFieldValidations: {
            name: ValidationType.NUMBER_OPTIONAL,
          },
        }),
        [[{ id: "mockId", name: "123" }]],
        true
      );
    });

    test("returns false for number validation", () => {
      testSchema(
        schemaMap.dynamicOptional({
          dynamicFieldValidations: {
            name: ValidationType.NUMBER_OPTIONAL,
          },
        }),
        [[{ id: "mockId", name: "text" }]],
        false
      );
    });

    test("returns true for number comparison validation", () => {
      testSchema(
        schemaMap.dynamicOptional({
          dynamicFieldValidations: {
            name: {
              type: ValidationType.NUMBER_COMPARISON_OPTIONAL,
              options: numberOptions,
            },
          },
        }),
        [[{ id: "mockId", name: "9" }], [{ id: "mockId", name: "" }]],
        true
      );
    });

    test("returns false for number comparison validation", () => {
      testSchema(
        schemaMap.dynamicOptional({
          dynamicFieldValidations: {
            name: {
              type: ValidationType.NUMBER_COMPARISON_OPTIONAL,
              options: numberOptions,
            },
          },
        }),
        [
          [
            { id: "mockId", name: "11" },
            { id: "mockId", name: "10.01" },
          ],
        ],
        false
      );
    });
  });

  describe("isEndDateAfterStartDate", () => {
    test("returns true", () => {
      expect(isEndDateAfterStartDate("01/01/1989", "01/01/1990")).toBe(true);
    });

    test("returns false", () => {
      expect(isEndDateAfterStartDate("01/01/1990", "01/01/1989")).toBe(false);
    });

    test("returns true when dates are the same", () => {
      expect(isEndDateAfterStartDate("01/01/1990", "01/01/1990")).toBe(true);
    });

    test("handles empty and invalid inputs", () => {
      expect(isEndDateAfterStartDate("", "01/01/1990")).toBe(true);
      expect(isEndDateAfterStartDate("01/01/1990", "")).toBe(true);
      expect(isEndDateAfterStartDate(undefined as any, "01/01/1990")).toBe(
        true
      );
      expect(isEndDateAfterStartDate(null as any, "01/01/1990")).toBe(true);
    });

    test("handles invalid date formats", () => {
      expect(isEndDateAfterStartDate("invalid", "01/01/1990")).toBe(true);
      expect(isEndDateAfterStartDate("01/01/1990", "invalid")).toBe(true);
      expect(isEndDateAfterStartDate("13/32/1990", "01/01/1990")).toBe(true);
    });
  });

  describe("endDate with conditional start dates", () => {
    test("validates with single conditional field (legacy behavior)", async () => {
      const testSchema = object({
        startDate: schemaMap.date,
        endDate: endDate(["startDate"]),
      });
      const validData = {
        startDate: "01/01/1990",
        endDate: "12/31/1990",
      };
      expect(await testSchema.isValid(validData)).toBe(true);
    });

    test("validates against actual start date when it has a value", async () => {
      const testSchema = object({
        actualStartDate: schemaMap.date,
        expectedStartDate: schemaMap.dateOptional,
        endDate: endDate(["actualStartDate", "expectedStartDate"]),
      });
      const validData = {
        actualStartDate: "01/01/1990",
        expectedStartDate: "",
        endDate: "12/31/1990",
      };
      expect(await testSchema.isValid(validData)).toBe(true);
    });

    test("validates against expected start date when actual is empty", async () => {
      const testSchema = object({
        actualStartDate: schemaMap.dateOptional,
        expectedStartDate: schemaMap.date,
        endDate: endDate(["actualStartDate", "expectedStartDate"]),
      });
      const validData = {
        actualStartDate: "",
        expectedStartDate: "01/01/1990",
        endDate: "12/31/1990",
      };
      expect(await testSchema.isValid(validData)).toBe(true);
    });

    test("fails when end date is before actual start date", async () => {
      const testSchema = object({
        actualStartDate: schemaMap.date,
        expectedStartDate: schemaMap.dateOptional,
        endDate: endDate(["actualStartDate", "expectedStartDate"]),
      });
      const invalidData = {
        actualStartDate: "12/31/1990",
        expectedStartDate: "",
        endDate: "01/01/1990",
      };
      expect(await testSchema.isValid(invalidData)).toBe(false);
    });

    test("end date is before expected start date", async () => {
      const testSchema = object({
        actualStartDate: schemaMap.dateOptional,
        expectedStartDate: schemaMap.date,
        endDate: endDate(["actualStartDate", "expectedStartDate"]),
      });
      const invalidData = {
        actualStartDate: "",
        expectedStartDate: "12/31/1990",
        endDate: "01/01/1990",
      };
      expect(await testSchema.isValid(invalidData)).toBe(false);
    });

    test("end date is entered but no start date selected yet", async () => {
      const testSchema = object({
        actualStartDate: schemaMap.dateOptional,
        expectedStartDate: schemaMap.dateOptional,
        endDate: endDate(["actualStartDate", "expectedStartDate"]),
      });
      const dataWithOnlyEndDate = {
        actualStartDate: "",
        expectedStartDate: "",
        endDate: "12/31/1990",
      };
      expect(await testSchema.isValid(dataWithOnlyEndDate)).toBe(true);
    });

    test("use first defined value when multiple start dates provided", async () => {
      const testSchema = object({
        actualStartDate: schemaMap.date,
        expectedStartDate: schemaMap.date,
        endDate: endDate(["actualStartDate", "expectedStartDate"]),
      });
      const bothDatesValid = {
        actualStartDate: "01/01/1990",
        expectedStartDate: "06/01/1990",
        endDate: "12/31/1990",
      };
      expect(await testSchema.isValid(bothDatesValid)).toBe(true);

      const betweenDates = {
        actualStartDate: "01/01/1990",
        expectedStartDate: "06/01/1990",
        endDate: "03/01/1990",
      };
      expect(await testSchema.isValid(betweenDates)).toBe(true);
    });

    test("works with three conditional fields", async () => {
      const testSchema = object({
        plannedStartDate: schemaMap.dateOptional,
        actualStartDate: schemaMap.dateOptional,
        expectedStartDate: schemaMap.date,
        endDate: endDate([
          "plannedStartDate",
          "actualStartDate",
          "expectedStartDate",
        ]),
      });

      const onlyExpected = {
        plannedStartDate: "",
        actualStartDate: "",
        expectedStartDate: "03/01/1990",
        endDate: "12/31/1990",
      };
      expect(await testSchema.isValid(onlyExpected)).toBe(true);

      const actualHasValue = {
        plannedStartDate: "",
        actualStartDate: "02/01/1990",
        expectedStartDate: "03/01/1990",
        endDate: "12/31/1990",
      };
      expect(await testSchema.isValid(actualHasValue)).toBe(true);
    });

    test("validates error message structure correctly", async () => {
      const testSchema = object({
        startDate: schemaMap.date,
        endDate: endDate(["startDate"]),
      });

      const invalidData = {
        startDate: "12/31/1990",
        endDate: "01/01/1990",
      };

      try {
        await testSchema.validate(invalidData, { abortEarly: false });
        fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.errors).toContain("End date can't be before start date");
      }
    });
  });

  describe("nested", () => {
    test("returns true", () => {
      testSchema(
        nested(
          () => validationSchema,
          fieldValidationObject.parentFieldName,
          ""
        ),
        ["string"],
        true
      );
    });
  });

  describe("number", () => {
    test("returns true", () => {
      testSchema(schemaMap.number, goodNumberTestCases, true);
    });

    test("returns false", () => {
      testSchema(schemaMap.number, badNumberTestCases, false);
    });
  });

  describe("numberOptional", () => {
    test("returns true", () => {
      testSchema(schemaMap.numberOptional, goodNumberOptionalTestCases, true);
    });

    test("returns false", () => {
      testSchema(schemaMap.numberOptional, badNumberOptionalTestCases, false);
    });
  });

  describe("numberComparison", () => {
    test("returns true", () => {
      testSchema(
        schemaMap.numberComparison(numberOptions),
        ["0", "1", "10", "9.99", "N/A"],
        true
      );
    });

    test("returns false", () => {
      testSchema(
        schemaMap.numberComparison(numberOptions),
        ["-1", "", "11", "10.01"],
        false
      );
    });
  });

  describe("numberComparisonOptional", () => {
    test("returns true", () => {
      testSchema(
        schemaMap.numberComparisonOptional(numberOptions),
        ["0", "1", "10", "9.99", "N/A", "", undefined, null],
        true
      );
    });

    test("returns false", () => {
      testSchema(
        schemaMap.numberComparisonOptional(numberOptions),
        ["-1", "11", "10.01"],
        false
      );
    });
  });

  describe("optional schemas", () => {
    test("allows null or empty string", () => {
      testSchema(schemaMap.dateOptional, [null, ""], true);
      testSchema(schemaMap.emailOptional, [null, ""], true);
      testSchema(schemaMap.numberOptional, [null, ""], true);
      testSchema(
        schemaMap.numberComparisonOptional(numberOptions),
        [null, ""],
        true
      );
      testSchema(
        schemaMap.textCustomOptional({ maxLength: 10 }),
        [null, ""],
        true
      );
      testSchema(schemaMap.textOptional, [null, ""], true);
      testSchema(schemaMap.urlOptional, [null, ""], true);
      testSchema(schemaMap.validIntegerOptional, [null, ""], true);
    });
  });

  describe("ratio", () => {
    test("returns true", () => {
      testSchema(schemaMap.ratio, goodRatioTestCases, true);
    });

    test("returns false", () => {
      testSchema(schemaMap.ratio, badRatioTestCases, false);
    });
  });

  describe("textCustom", () => {
    test("returns true", () => {
      testSchema(schemaMap.textCustom({ maxLength: 10 }), ["0123456789"], true);
    });

    test("returns false", () => {
      testSchema(
        schemaMap.textCustom({ maxLength: 10 }),
        ["textistoolong", ""],
        false
      );
    });
  });

  describe("textCustomOptional", () => {
    test("returns true", () => {
      testSchema(
        schemaMap.textCustomOptional({ maxLength: 10 }),
        ["0123456789"],
        true
      );
    });

    test("returns false", () => {
      testSchema(
        schemaMap.textCustomOptional({ maxLength: 10 }),
        ["textistoolong"],
        false
      );
    });
  });

  describe("validInteger", () => {
    test("returns true", () => {
      testSchema(schemaMap.validInteger, goodIntegerTestCases, true);
    });

    test("returns false", () => {
      testSchema(schemaMap.validInteger, badIntegerTestCases, false);
    });
  });

  describe("dropdownOptional", () => {
    test("returns true", () => {
      testSchema(
        schemaMap.dropdownOptional,
        goodDropdownOptionalTestCases,
        true
      );
    });

    test("returns false", () => {
      testSchema(
        schemaMap.dropdownOptional,
        badDropdownOptionalTestCases,
        false
      );
    });
  });
});
