import { MixedSchema } from "yup/lib/mixed";
import { schemaMap } from "./schemas";
import { AnyObject, NumberOptions, ValidationComparator } from "types";

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

  const goodIntegerTestCases = [
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
    "",
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

  const testSchema = (
    schemaToUse: MixedSchema,
    testCases: Array<string | AnyObject>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

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

  describe("optional schemas", () => {
    test("Verify optional schemas convert empty string to null", () => {
      testSchema(schemaMap.textOptional, [""], true);
      testSchema(schemaMap.numberOptional, [""], true);
      testSchema(schemaMap.validIntegerOptional, [""], true);
      testSchema(schemaMap.emailOptional, [""], true);
      testSchema(schemaMap.urlOptional, [""], true);
      testSchema(schemaMap.dateOptional, [""], true);
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
