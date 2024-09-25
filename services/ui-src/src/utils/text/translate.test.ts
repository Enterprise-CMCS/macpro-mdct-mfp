import { translate } from "./translate";

describe("translate()", () => {
  const stateName = "Puerto Rico";
  const heading = "MFP Work Plan for";
  const reportYear = "2024";
  const reportPeriod = "1";

  test("returns translated text", () => {
    const result = translate(
      "{{stateName}} {{heading}} {{reportYear}} - Period {{reportPeriod}}",
      { stateName, heading, reportYear, reportPeriod }
    );
    expect(result).toBe("Puerto Rico MFP Work Plan for 2024 - Period 1");
  });

  test("returns empty value for missing key", () => {
    const result = translate(
      "{{stateName}} {{heading}} {{reportYear}} - Period {{reportPeriod}}",
      { heading, reportYear, reportPeriod }
    );

    expect(result).toBe(" MFP Work Plan for 2024 - Period 1");
  });

  test("returns empty value for non-existent key", () => {
    const result = translate(
      "{{stateName}} {{heading}} {{reportYear}} - Period {{reportPeriod}}",
      { stateName, nonExistent: "nonExistent", reportYear, reportPeriod }
    );

    expect(result).toBe("Puerto Rico  2024 - Period 1");
  });
});
