import {
  cleanAndMaskNumberValues,
  cleanRatioInput,
  cleanStandardNumericalInput,
  makeStringParseableForDatabase,
} from "./clean";

describe("utils/clean", () => {
  describe("cleanStandardNumericalInput()", () => {
    test("formats and returns valid true", () => {
      const result = cleanStandardNumericalInput("0123");
      expect(result).toEqual({
        cleanedValue: "123",
        isValid: true,
      });
    });

    test("removes leading zero for float", () => {
      const result = cleanStandardNumericalInput("01.23");
      expect(result).toEqual({
        cleanedValue: "1.23",
        isValid: true,
      });
    });

    test("formats and returns valid false", () => {
      const result = cleanStandardNumericalInput("NaN");
      expect(result).toEqual({
        cleanedValue: "NaN",
        isValid: false,
      });
    });
  });

  describe("cleanRatioInput()", () => {
    test("formats and returns valid true", () => {
      const result = cleanRatioInput("01:2");
      expect(result).toEqual({
        cleanedValue: "1:2",
        isValid: true,
      });
    });

    test("formats and returns valid false", () => {
      const result = cleanRatioInput("NaN");
      expect(result).toEqual({
        cleanedValue: "NaN",
        isValid: false,
      });
    });
  });

  describe("makeStringParseableForDatabase()", () => {
    test("formats float", () => {
      const result = makeStringParseableForDatabase("1:2.34", "currency");
      expect(result).toBe("12.34");
    });

    test("formats ratio", () => {
      const result = makeStringParseableForDatabase("1:2", "ratio");
      expect(result).toBe("1:2");
    });

    test("formats without mask", () => {
      const result = makeStringParseableForDatabase("1:2.34", null);
      expect(result).toBe("1:2.34");
    });
  });

  describe("cleanAndMaskNumberValues()", () => {
    test("formats with mask", () => {
      const result = cleanAndMaskNumberValues({
        decimalPlacesToRoundTo: 2,
        mask: "currency",
        value: "12.3456",
      });
      expect(result).toEqual({
        cleanedFieldValue: "12.35",
        maskedFieldValue: "12.35",
      });
    });

    test("formats without mask", () => {
      const result = cleanAndMaskNumberValues({
        decimalPlacesToRoundTo: 2,
        mask: null,
        value: "12.3456",
      });
      expect(result).toEqual({
        cleanedFieldValue: "12.3456",
        maskedFieldValue: "12.3456",
      });
    });
  });
});
