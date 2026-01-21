import { MixedSchema } from "yup/lib/mixed";
import { AnyObject } from "yup/lib/types";
import { isEndDateAfterStartDate, nested, schemaMap } from "./schemaMap";
import { NumberOptions, ValidationComparator } from "../types";

describe("Schemas", () => {
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

  const testSchema = (
    schemaToUse: MixedSchema<any, AnyObject, any>,
    testCases: Array<string | AnyObject>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      if (expectedReturn) {
        expect(schemaToUse.validateSync(testCase)).toEqual(testCase);
      } else {
        expect(() => {
          schemaToUse.validateSync(testCase);
        }).toThrow();
      }
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
    test("returns true", () => {
      testSchema(
        schemaMap.dynamic(),
        [[{ id: "mockId", name: "0123456789" }]],
        true
      );
    });

    test("returns false", () => {
      testSchema(schemaMap.dynamic(), [], false);
    });
  });

  describe("dynamicOptional", () => {
    test("returns true", () => {
      testSchema(
        schemaMap.dynamicOptional(),
        [[{ id: "mockId", name: "0123456789" }]],
        true
      );
    });

    test("returns false", () => {
      testSchema(schemaMap.dynamicOptional(), [], true);
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

  describe("numberComparison", () => {
    const numberOptions: NumberOptions = {
      boundary: 10,
      comparator: ValidationComparator.LESS_THAN_OR_EQUAL_PERCENTAGE,
    };

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

  describe("validInteger", () => {
    test("returns true", () => {
      testSchema(schemaMap.validInteger, goodIntegerTestCases, true);
    });

    test("returns false", () => {
      testSchema(schemaMap.validInteger, badIntegerTestCases, false);
    });
  });
});
