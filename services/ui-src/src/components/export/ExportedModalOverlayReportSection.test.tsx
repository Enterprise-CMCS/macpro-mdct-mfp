import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import {
  mockReportStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import {
  mockSARReportWithOverlays,
  mockWPReportWithOverlays,
} from "utils/testing/mockReport";
import {
  EntityDetailsStepTypes,
  ModalOverlayReportPageVerbiage,
  OverlayModalPageShape,
  OverlayModalTypes,
  OverlayModalStepTypes,
} from "types";
import {
  ExportedModalOverlayReportSection,
  Props,
} from "./ExportedModalOverlayReportSection";
import { testA11y } from "utils/testing/commonTests";

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const wpMockProps = {
  section: {
    entityType: OverlayModalTypes.INITIATIVE,
    verbiage: {
      intro: {
        section: "",
        subsection: "State or Territory-Specific Initiatives",
        info: [
          {
            type: "html",
            content: "See ",
          },
          {
            type: "internalLink",
            content: "previous page",
            props: {
              to: "/wp/state-or-territory-specific-initiatives/instructions",
              style: {
                textDecoration: "underline",
              },
            },
          },
          {
            type: "html",
            content: " for detailed instructions.",
          },
        ],
      },
      addEntityButtonText: "Add initiative",
      editEntityHint: 'Select "Edit" to complete the details.',
      editEntityButtonText: "Edit name/topic",
      readOnlyEntityButtonText: "View name/topic",
      addEditModalAddTitle: "Add initiative",
      addEditModalEditTitle: "Edit initiative",
      deleteModalTitle: "Are you sure you want to delete this initiative?",
      deleteModalConfirmButtonText: "Yes, delete initiative",
      deleteModalWarning:
        "Are you sure you want to proceed? You will lose all information entered for this initiative in the Work Plan.",
      enterEntityDetailsButtonText: "Edit",
      readOnlyEntityDetailsButtonText: "View",
      dashboardTitle: "Initiative total count:",
      countEntitiesInTitle: true,
      tableHeader: "Initiative name <br/> MFP Work Plan topic",
      addEditModalHint:
        "Provide the name of one initiative. You will be then be asked to complete details for this initiative including a description, evaluation plan and funding sources.",
    } as ModalOverlayReportPageVerbiage,
    entitySteps: [
      {
        stepType: EntityDetailsStepTypes.DEFINE_INITIATIVE,
        stepName: "mock step name",
        hint: "mock step hint",
        entityType: "initiative",
        modalForm: {
          fields: [
            {
              id: "mock field id",
              validation: "number",
            },
          ],
        },
      },
      {
        stepType: OverlayModalStepTypes.EVALUATION_PLAN,
        stepName: "mock step name",
        hint: "mock step hint",
        entityType: "initiative",
        modalForm: {
          fields: [
            {
              id: "mock field id",
              validation: "number",
            },
          ],
        },
      },
      {
        stepType: OverlayModalStepTypes.FUNDING_SOURCES,
        stepName: "mock step name",
        hint: "mock step hint",
        entityType: "initiative",
        modalForm: {
          fields: [
            {
              id: "mock field id",
              validation: "number",
            },
          ],
        },
      },
      {
        stepType: EntityDetailsStepTypes.CLOSE_OUT_INFORMATION,
        stepName: "mock step name",
        hint: "mock step hint",
        entityType: "initiative",
        modalForm: {
          fields: [
            {
              id: "mock field id",
              validation: "number",
            },
          ],
        },
      },
    ] as OverlayModalPageShape[],
  },
} as Props;

const sarMockProps = {
  section: {
    pageType: "dynamicModalOverlay",
    entityType: OverlayModalTypes.INITIATIVE,
    verbiage: {
      intro: {
        section: "",
        subsection: "State or Territory-Specific Initiatives",
        info: [
          {
            type: "html",
            content: "See ",
          },
          {
            type: "internalLink",
            content: "previous page",
            props: {
              to: "/wp/state-or-territory-specific-initiatives/instructions",
              style: {
                textDecoration: "underline",
              },
            },
          },
          {
            type: "html",
            content: " for detailed instructions.",
          },
        ],
      },
      addEntityButtonText: "Add initiative",
      editEntityHint: 'Select "Edit" to complete the details.',
      editEntityButtonText: "Edit name/topic",
      readOnlyEntityButtonText: "View name/topic",
      addEditModalAddTitle: "Add initiative",
      addEditModalEditTitle: "Edit initiative",
      deleteModalTitle: "Are you sure you want to delete this initiative?",
      deleteModalConfirmButtonText: "Yes, delete initiative",
      deleteModalWarning:
        "Are you sure you want to proceed? You will lose all information entered for this initiative in the Work Plan.",
      enterEntityDetailsButtonText: "Edit",
      readOnlyEntityDetailsButtonText: "View",
      dashboardTitle: "Initiative total count:",
      countEntitiesInTitle: true,
      tableHeader: "Initiative name <br/> MFP Work Plan topic",
      addEditModalHint:
        "Provide the name of one initiative. You will be then be asked to complete details for this initiative including a description, evaluation plan and funding sources.",
    } as ModalOverlayReportPageVerbiage,
    entitySteps: [
      {
        stepType: EntityDetailsStepTypes.DEFINE_INITIATIVE,
        stepName: "mock step name",
        hint: "mock step hint",
        entityType: "initiative",
        modalForm: {
          fields: [
            {
              id: "mock field id",
              validation: "number",
            },
          ],
        },
      },
      {
        stepType: OverlayModalStepTypes.EVALUATION_PLAN,
        stepName: "mock step name",
        hint: "mock step hint",
        entityType: "initiative",
        modalForm: {
          fields: [
            {
              id: "mock field id",
              validation: "number",
            },
          ],
        },
      },
      {
        stepType: OverlayModalStepTypes.FUNDING_SOURCES,
        stepName: "mock step name",
        hint: "mock step hint",
        entityType: "initiative",
        modalForm: {
          fields: [
            {
              id: "mock field id",
              validation: "number",
            },
          ],
        },
      },
      {
        stepType: EntityDetailsStepTypes.CLOSE_OUT_INFORMATION,
        stepName: "mock step name",
        hint: "mock step hint",
        entityType: "initiative",
        modalForm: {
          fields: [
            {
              id: "mock field id",
              validation: "number",
            },
          ],
        },
      },
    ] as OverlayModalPageShape[],
    initiatives: [
      {
        entitySteps: [
          {
            stepType: OverlayModalStepTypes.OBJECTIVE_PROGRESS,
          },
          {
            stepType: EntityDetailsStepTypes.INITIAVTIVE_PROGRESS,
            form: {
              fields: [],
            },
          },
          {
            stepType: EntityDetailsStepTypes.EXPENDITURES,
            form: {
              fields: [
                {
                  id: "mock-section-header",
                  type: "sectionHeader",
                  props: {
                    content: "Section A",
                  },
                },
                {
                  id: "mock-expenditure-field-1",
                  type: "number",
                  validation: "number",
                  props: {
                    label: "Actual spending W",
                  },
                },
                {
                  id: "mock-expenditure-field-2",
                  type: "number",
                  validation: "number",
                  props: {
                    label: "Actual spending X",
                  },
                },
                {
                  id: "mock-expenditure-field-3",
                  type: "number",
                  validation: "number",
                  props: {
                    label: "Projected spending Y",
                  },
                },
                {
                  id: "mock-expenditure-field-4",
                  type: "number",
                  validation: "number",
                  props: {
                    label: "Projected spending Z",
                  },
                },
                {
                  id: "mock-field-that-i-guess-will-just-be-discarded???",
                  type: "who-cares",
                  validation: "no thank you",
                },
              ],
            },
          },
          {
            stepType: "UNRECOGNIZED STEP TYPE",
          },
        ],
      },
    ],
  },
} as unknown as Props;

const testComponent = (props: Props) => (
  <RouterWrappedComponent>
    <ExportedModalOverlayReportSection {...props} />
  </RouterWrappedComponent>
);

describe("<ExportedModalOverlayReportSection />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render modal overlay report section", () => {
    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(wpMockProps));
    expect(
      screen.getAllByTestId("exportedOverlayModalPage")[0]
    ).toBeInTheDocument();
  });

  test("should render correct initiative topic", () => {
    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(wpMockProps));
    expect(screen.getByText("mock WP topic")).toBeInTheDocument();
    expect(screen.getByText("Unique initiative type")).toBeInTheDocument();
  });

  test("should render for SAR", () => {
    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockSARReportWithOverlays,
    });
    render(testComponent(sarMockProps));
    expect(
      screen.getByText("% of total projected spending")
    ).toBeInTheDocument();
    expect(screen.getByText("42.86%")).toBeInTheDocument(); // (5+10)/(15+20)
  });

  testA11y(testComponent(wpMockProps), () => {
    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
  });
});
