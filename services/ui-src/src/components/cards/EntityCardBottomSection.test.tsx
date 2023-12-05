import { render } from "@testing-library/react";
import { EntityStepCardBottomSection } from "./EntityCardBottomSection";

const verbiage = {
  entityMissingResponseMessage: "test string",
  entityEmptyResponseMessage: "test string",
};

const entityStepCardBottomSection = (
  <EntityStepCardBottomSection
    stepType={"mockStepType"}
    verbiage={verbiage}
    formattedEntityData={{}}
  />
);
describe("Test EntityStepCardBottomSection renders", () => {
  test("EntityStepCardBottomSection renders correctly", () => {
    const bottomSection = render(entityStepCardBottomSection);
    expect(bottomSection.container).toBeEmptyDOMElement();
  });

  test("EntityStepCardBottomSection always returns default", () => {
    let entityStepCardBottomSectionSwitchCase = (
      <EntityStepCardBottomSection
        stepType={"mockStepType"}
        verbiage={verbiage}
        formattedEntityData={{}}
      />
    );

    const bottomSection = render(entityStepCardBottomSectionSwitchCase);
    expect(bottomSection.container).toBeEmptyDOMElement();

    entityStepCardBottomSectionSwitchCase = (
      <EntityStepCardBottomSection
        stepType={"anotherMockStepType"}
        verbiage={verbiage}
        formattedEntityData={{}}
      />
    );
    expect(bottomSection.container).toBeEmptyDOMElement();
  });
});
