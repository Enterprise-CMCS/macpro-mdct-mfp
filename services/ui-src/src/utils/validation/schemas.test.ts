import { MixedSchema } from "yup/lib/mixed";
import {
  dateOptional,
  emailOptional,
  number,
  numberOptional,
  ratio,
  textCustom,
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

  const testSchema = (
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
    testSchema(number(), goodNumberTestCases, true);
    testSchema(number(), badNumberTestCases, false);
  });

  test("Evaluate Number Schema using integer scheme", () => {
    testSchema(validInteger(), goodIntegerTestCases, true);
    testSchema(validInteger(), badIntegerTestCases, false);
  });

  test("Evaluate Number Schema using ratio scheme", () => {
    testSchema(ratio(), goodRatioTestCases, true);
    testSchema(ratio(), badRatioTestCases, false);
  });

  test("Verify optional schemas convert empty string to null", () => {
    testSchema(textOptional(), [""], true);
    testSchema(numberOptional(), [""], true);
    testSchema(validIntegerOptional(), [""], true);
    testSchema(emailOptional(), [""], true);
    testSchema(urlOptional(), [""], true);
    testSchema(dateOptional(), [""], true);
  });

  test("Evaluate Text Schema using textCustom scheme", () => {
    testSchema(textCustom({ maxLength: 10 }), ["0123456789"], true);
    testSchema(textCustom({ maxLength: 10 }), ["textistoolong", ""], false);
  });
});
