import { actionButtonText } from "./modalLogic";
import { Spinner } from "@chakra-ui/react";

describe("actionButtonText", () => {
  test("returns Spinner when submitting is true", () => {
    const result = actionButtonText(true, false);
    expect(result).toEqual(<Spinner size="md" />);
  });

  test("returns 'Return' when viewOnly is true", () => {
    const result = actionButtonText(false, true);
    expect(result).toBe("Return");
  });

  test("returns 'Update submission' when isEditingExisting is truthy", () => {
    const result = actionButtonText(false, false, "some-id");
    expect(result).toBe("Update submission");
  });

  test("returns 'Save' when creating a new report", () => {
    const result = actionButtonText(false, false);
    expect(result).toBe("Save");
  });

  test("prioritizes submitting over viewOnly", () => {
    const result = actionButtonText(true, true);
    expect(result).toEqual(<Spinner size="md" />);
  });

  test("prioritizes submitting over isEditingExisting", () => {
    const result = actionButtonText(true, false, "some-id");
    expect(result).toEqual(<Spinner size="md" />);
  });

  test("prioritizes viewOnly over isEditingExisting", () => {
    const result = actionButtonText(false, true, "some-id");
    expect(result).toBe("Return");
  });
});
