import { AnyObject } from "types";
import { getSignedTemplateUrl } from "./getTemplateUrl";

const testTemplateName = "TestName";

const mockGet = jest.fn();
jest.mock("../apiLib", () => ({
  apiLib: {
    get: (path: string, options: AnyObject) => mockGet(path, options),
  },
}));

describe("Test template methods", () => {
  test("getSignedTemplateUrl", async () => {
    await getSignedTemplateUrl(testTemplateName);
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
