import { render, screen } from "@testing-library/react";
import { EntityStepCardBottomSection } from "./EntityCardBottomSection";
import { mockGenericEntity, mockUseSARStore } from "utils/testing/setupJest";
import { useStore } from "utils";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

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

const cardWithQualitativeAnswers = (
  <EntityStepCardBottomSection
    stepType={"evaluationPlan"}
    verbiage={verbiage}
    formattedEntityData={{}}
    entity={mockGenericEntity}
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
  test("EntityStepCardBottomSection returns default if evaluationStep but not SAR", () => {
    let entityStepCardBottomSectionSwitchCase = (
      <EntityStepCardBottomSection
        stepType={"evaluationPlan"}
        verbiage={verbiage}
        formattedEntityData={{}}
      />
    );

    const bottomSection = render(entityStepCardBottomSectionSwitchCase);
    expect(bottomSection.container).toBeEmptyDOMElement();
  });
});

describe("Test EntityStepCardBottomSection renders the evalutionStep correctly", () => {
  beforeEach(async () => {
    mockedUseStore.mockReturnValue(mockUseSARStore);
  });
  test("EntityStepCardBottomSection renders evalutionStep correctly", () => {
    render(cardWithQualitativeAnswers);
    const progressBox = screen.getAllByTestId("objective-progress-box");
    expect(progressBox[0]).toBeVisible();
    expect(progressBox).toHaveLength(2);
    const deliverablesOther = screen.getByTestId("deliverables-other");
    expect(deliverablesOther).toBeVisible();
  });
});
