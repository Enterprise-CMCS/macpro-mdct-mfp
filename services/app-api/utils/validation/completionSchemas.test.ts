import { MixedSchema } from "yup/lib/mixed";
import {
  completionSchemaMap,
  isEndDateAfterStartDate,
  nested,
} from "./completionSchemas";
import { AnyObject } from "../types";

describe("Schemas", () => {
  const goodNumberTestCases = [
    "123",
    "123.00",
    "123..00",
    "1,230",
    "1,2,30",
    "1230",
    "123450123..,,,.123123123123",
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
    schemaToUse: MixedSchema,
    testCases: Array<string | AnyObject>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  describe("date", () => {
    test("returns true", () => {
      testSchema(completionSchemaMap.date, goodDateTestCases, true);
    });

    test("returns false", () => {
      testSchema(completionSchemaMap.date, badDateTestCases, false);
    });
  });

  describe("dynamic", () => {
    test("returns true", () => {
      testSchema(
        completionSchemaMap.dynamic(),
        [[{ id: "mockId", name: "0123456789" }]],
        true
      );
    });

    test("returns false", () => {
      testSchema(completionSchemaMap.dynamic(), [], false);
    });
  });

  describe("dynamicOptional", () => {
    test("returns true", () => {
      testSchema(
        completionSchemaMap.dynamicOptional(),
        [[{ id: "mockId", name: "0123456789" }]],
        true
      );
    });

    test("returns false", () => {
      testSchema(completionSchemaMap.dynamicOptional(), [], true);
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
      testSchema(completionSchemaMap.number, goodNumberTestCases, true);
    });

    test("returns false", () => {
      testSchema(completionSchemaMap.number, badNumberTestCases, false);
    });
  });

  describe("ratio", () => {
    test("returns true", () => {
      testSchema(completionSchemaMap.ratio, goodRatioTestCases, true);
    });

    test("returns false", () => {
      testSchema(completionSchemaMap.ratio, badRatioTestCases, false);
    });
  });

  describe("textCustom", () => {
    test("returns true", () => {
      testSchema(
        completionSchemaMap.textCustom({ maxLength: 10 }),
        ["0123456789"],
        true
      );
    });

    test("returns false", () => {
      testSchema(
        completionSchemaMap.textCustom({ maxLength: 10 }),
        ["textistoolong"],
        false
      );
    });
  });

  describe("validInteger", () => {
    test("returns true", () => {
      testSchema(completionSchemaMap.validInteger, goodIntegerTestCases, true);
    });

    test("returns false", () => {
      testSchema(completionSchemaMap.validInteger, badIntegerTestCases, false);
    });
  });
});
