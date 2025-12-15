import { MixedSchema } from "yup/lib/mixed";
import { AnyObject } from "yup/lib/types";
import {
  date,
  isEndDateAfterStartDate,
  nested,
  number,
  numberComparison,
  ratio,
  textCustom,
  validInteger,
} from "./schemaMap";
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
        }).toThrowError();
      }
    }
  };

  test("Evaluate Number Schema using number scheme", () => {
    testSchema(number(), goodNumberTestCases, true);
    testSchema(number(), badNumberTestCases, false);
  });

  test("Evaluate numberComparison scheme", () => {
    const numberOptions: NumberOptions = {
      boundary: 10,
      comparator: ValidationComparator.LESS_THAN_OR_EQUAL_PERCENTAGE,
    };
    testSchema(
      numberComparison(numberOptions),
      ["0", "1", "10", "9.99", "N/A"],
      true
    );
    testSchema(
      numberComparison(numberOptions),
      ["-1", "", "11", "10.01"],
      false
    );
  });

  test("Evaluate Number Schema using integer scheme", () => {
    testSchema(validInteger(), goodIntegerTestCases, true);
    testSchema(validInteger(), badIntegerTestCases, false);
  });

  test("Evaluate Number Schema using ratio scheme", () => {
    testSchema(ratio(), goodRatioTestCases, true);
    testSchema(ratio(), badRatioTestCases, false);
  });

  test("Evaluate Date Schema using date scheme", () => {
    testSchema(date(), goodDateTestCases, true);
    testSchema(date(), badDateTestCases, false);
  });

  test("Evaluate End Date Schema using date scheme", () => {
    expect(isEndDateAfterStartDate("01/01/1989", "01/01/1990")).toBeTruthy();
    expect(isEndDateAfterStartDate("01/01/1990", "01/01/1989")).toBeFalsy();
  });

  test("Test Nested Schema using nested scheme", () => {
    testSchema(
      nested(() => validationSchema, fieldValidationObject.parentFieldName, ""),
      ["string"],
      true
    );
  });

  test("Evaluate Text Schema using textCustom scheme", () => {
    testSchema(textCustom({ maxLength: 10 }), ["0123456789"], true);
    testSchema(textCustom({ maxLength: 10 }), ["textistoolong", ""], false);
  });
});
