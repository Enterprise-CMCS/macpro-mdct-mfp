import { render, screen } from "@testing-library/react";
import { InfoSection } from "components";
import { testA11y } from "utils/testing/commonTests";

const content = {
  sectionNumber: 1,
  header: "Header Text",
  body: "Section Body",
  widget: {},
};

const InfoSectionComponent = (
  <InfoSection data-testid="section-component" content={content} />
);

describe("<InfoSection />", () => {
  test("Check that Section renders", () => {
    const { getByTestId } = render(InfoSectionComponent);
    expect(getByTestId("section-component")).toBeVisible();
  });

  test("should see that there is a section number and associated content", async () => {
    render(InfoSectionComponent);
    const sectionNumber = screen.getByText("1");
    await expect(sectionNumber).toBeVisible();
    const sectionHeader = screen.getByText(content.header);
    await expect(sectionHeader).toBeVisible();
  });

  testA11y(InfoSectionComponent);
});
