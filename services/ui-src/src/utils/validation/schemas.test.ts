import { MixedSchema } from "yup/lib/mixed";
import { isEndDateAfterStartDate, nested, schemaMap } from "./schemas";
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
