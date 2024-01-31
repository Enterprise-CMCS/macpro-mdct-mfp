import { Choice } from "types";
import { prettifyChoices } from "./rendering";

describe("Prettify Choices", () => {
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
      value: "Sad adults",
    },
  ];

  it("should prettify choices", async () => {
    expect(prettifyChoices(choices)).toEqual(
      "Older adults, Younger adults, Sad adults"
    );
  });
});
