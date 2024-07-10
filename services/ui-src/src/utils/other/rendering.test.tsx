import { Choice } from "types";
import { prettifyChoices } from "./rendering";

describe("utils/rendering", () => {
  describe("prettifyChoices()", () => {
    const choices: Choice[] = [
      {
        key: "mock-1",
        value: "Older adults",
      },
      {
        key: "mock-2",
        value: "Younger adults",
      },
      {
        key: "mock-3",
        value: "Teens",
      },
    ];

    test("should prettify choices", async () => {
      expect(prettifyChoices(choices)).toEqual(
        "Older adults, Younger adults, Teens"
      );
    });
  });
});
