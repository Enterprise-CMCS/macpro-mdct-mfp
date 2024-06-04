import { quarterlyKeyGenerator } from "./helpers";

describe("quarterlyKeyGenerator", () => {
  it("returns quarters with correct keys and empty values", () => {
    const obj = quarterlyKeyGenerator(2024, 1, "test", null);
    expect(obj).toEqual({
      test2024Q1: "",
      test2024Q2: "",
      test2024Q3: "",
      test2024Q4: "",
      test2025Q1: "",
      test2025Q2: "",
      test2025Q3: "",
      test2025Q4: "",
      test2026Q1: "",
      test2026Q2: "",
      test2026Q3: "",
      test2026Q4: "",
    });
  });

  it("returns quarters with correct keys and floats", () => {
    const obj = quarterlyKeyGenerator(2024, 2, "test", "float");
    expect(Object.keys(obj)).toEqual([
      "test2024Q3",
      "test2024Q4",
      "test2025Q1",
      "test2025Q2",
      "test2025Q3",
      "test2025Q4",
      "test2026Q1",
      "test2026Q2",
      "test2026Q3",
      "test2026Q4",
      "test2027Q1",
      "test2027Q2",
    ]);
    const value = parseFloat(Object.values(obj)[0] as string);
    expect(Number(value) === value && value % 1 !== 0).toBe(true);
  });

  it("returns quarters with integers", () => {
    const obj = quarterlyKeyGenerator(2021, 2, "test", "int");
    const value = parseFloat(Object.values(obj)[0] as string);
    expect(Number(value) === value && value % 1 !== 0).toBe(false);
  });
});
