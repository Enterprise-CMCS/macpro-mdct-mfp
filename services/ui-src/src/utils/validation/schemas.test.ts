import { MixedSchema } from "yup/lib/mixed";
import {
  dateOptional,
  emailOptional,
  number,
  numberOptional,
  ratio,
  textOptional,
  urlOptional,
  validInteger,
  validIntegerOptional,
} from "./schemas";

describe("utils/schemas", () => {
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

  const testNumberSchema = (
    schemaToUse: MixedSchema,
    testCases: Array<string>,
    expectedReturn: boolean
  ) => {
    for (let testCase of testCases) {
      let test = schemaToUse.isValidSync(testCase);
      expect(test).toEqual(expectedReturn);
    }
  };

  test("Evaluate Number Schema using number scheme", () => {
    testNumberSchema(number(), goodNumberTestCases, true);
    testNumberSchema(number(), badNumberTestCases, false);
  });

  test("Evaluate Number Schema using integer scheme", () => {
    testNumberSchema(validInteger(), goodIntegerTestCases, true);
    testNumberSchema(validInteger(), badIntegerTestCases, false);
  });

  test("Evaluate Number Schema using ratio scheme", () => {
    testNumberSchema(ratio(), goodRatioTestCases, true);
    testNumberSchema(ratio(), badRatioTestCases, false);
  });

  test("Verify optional schemas convert empty string to null", () => {
    testNumberSchema(textOptional(), [""], true);
    testNumberSchema(numberOptional(), [""], true);
    testNumberSchema(validIntegerOptional(), [""], true);
    testNumberSchema(emailOptional(), [""], true);
    testNumberSchema(urlOptional(), [""], true);
    testNumberSchema(dateOptional(), [""], true);
  });
});
