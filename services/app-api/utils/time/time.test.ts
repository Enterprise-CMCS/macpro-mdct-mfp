import { calculatePeriod } from "./time";

describe("Test calculatePeriod", () => {
  it("calculatePeriod given due date of 01/01/2022", () => {
    const dueDate = Date.parse("01/01/2022");
    const period = "1";
    expect(calculatePeriod(dueDate)).toBe(period);
  });

  it("calculatePeriod given due date of 10/01/2022", () => {
    const dueDate = Date.parse("10/01/2022");
    const period = "2";
    expect(calculatePeriod(dueDate)).toBe(period);
  });

  it("calculatePeriod given due date of 04/01/2023", () => {
    const dueDate = Date.parse("04/01/2023");
    const period = "1";
    expect(calculatePeriod(dueDate)).toBe(period);
  });
});
