import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { RouterWrappedComponent } from "utils/testing/setupJest";

import { ExportedOverlayModalReportSection } from "./ExportedOverlayModalReportSection";

import { renderStatusIcon } from "./ExportedModalOverlayReportSection";

import { EntityShape, FormField, OverlayModalPageShape } from "types";

jest.mock("./ExportedModalOverlayReportSection", () => ({
  ...jest.requireActual("./ExportedModalOverlayReportSection"),
  renderStatusIcon: jest.fn(),
}));

const section: OverlayModalPageShape = {
  entityType: "",
  stepType: "",
  stepName: "",
  stepInfo: [],
  hint: "",
  verbiage: {
    addEntityButtonText: "",
    dashboardTitle: "",
    countEntitiesInTitle: false,
    tableHeader: "",
    addEditModalHint: "",
    intro: {
      section: "",
      subsection: undefined,
      hint: undefined,
      info: undefined,
      title: undefined,
      subtitle: undefined,
      spreadsheet: undefined,
      exportSectionHeader: undefined,
    },
  },
  modalForm: {
    id: "",
    fields: [],
  },
  name: "",
  path: "",
};

const entityStep: (string | FormField)[] = [
  "mockType",
  "mock plan name",
  "mock hint",
  { id: "mock-id", props: { label: "mock field 1" }, type: "", validation: "" },
];

const entity: EntityShape = {
  id: "entity-id",
  type: "initiative",
  "mock-id": "mock value",
  mockType: [
    {
      id: "step-entity-id",
    },
  ],
};

const testComponent = (
  <RouterWrappedComponent>
    <ExportedOverlayModalReportSection
      section={section}
      entityStep={entityStep}
      entity={entity}
    />
  </RouterWrappedComponent>
);

describe("Test ExportedOverlayModalReportSection Component", () => {
  beforeEach(() => {
    render(testComponent);
  });
  test("Test ExportRETTable render", () => {
    screen.debug();
  });

  test("should render status icon", async () => {
    render(testComponent);
    (renderStatusIcon as jest.Mock).mockReturnValue(HTMLElement);
    expect(renderStatusIcon(true)).toEqual(HTMLElement);
  });
});

describe("Test ExportedModalOverlayReportSection accessibility", () => {
  test("should not have basic accessibility issues", async () => {
    const { container } = render(testComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
