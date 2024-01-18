// // utils
import { sumOfRow, sumOfTwoRows, perOfTwoRows } from "./calculations";

const row1 = ["label", "1", "2", "3", "4", "5"];
const row2 = ["label", "2", "3", "4", "5", "6"];

describe("Test the calculations of an array of data", () => {
  test("Test the sum of a row", () => {
    const sum = sumOfRow(row1, 1);
    expect(sum).toBe("15");
  });
  test("Test the sum of two rows", () => {
    const sum = sumOfTwoRows(row1, row2);
    expect(sum).toStrictEqual(["3", "5", "7", "9", "11"]);
  });
  test("Test the percentage of two rows", () => {
    const per = perOfTwoRows(row1, row2);
    expect(per).toStrictEqual([
      "50.00%",
      "66.67%",
      "75.00%",
      "80.00%",
      "83.33%",
    ]);
  });
});
