import { getSignedTemplateUrl } from "./getTemplateUrl";

const testTemplateName = "TestName";

describe("utils/getTemplateUrl", () => {
  test("getSignedTemplateUrl()", () => {
    expect(getSignedTemplateUrl(testTemplateName)).toBeTruthy();
  });
});
