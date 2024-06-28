import { render, screen } from "@testing-library/react";
import { useStore } from "utils";
import {
  mockReportStore,
  RouterWrappedComponent,
} from "utils/testing/setupJest";
import { mockSARFullReport, mockWPFullReport } from "utils/testing/mockReport";
import {
  EntityDetailsStepTypes,
  ModalOverlayReportPageVerbiage,
  OverlayModalPageShape,
  OverlayModalTypes,
  ReportRoute,
  OverlayModalStepTypes,
} from "types";
import {
  ExportedModalOverlayReportSection,
  Props,
} from "./ExportedModalOverlayReportSection";
import { testA11y } from "utils/testing/commonTests";

global.structuredClone = (x: any) => JSON.parse(JSON.stringify(x));

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;

const mockWPReportWithOverlays = {
  ...mockWPFullReport,
  fieldData: {
    ...mockWPFullReport.fieldData,
    [OverlayModalTypes.INITIATIVE]: [
      {
        ...mockWPFullReport.fieldData.entityType[0],
        type: OverlayModalTypes.INITIATIVE,
        id: "mock wip id", // this is both our search filter and our search target in renderFieldRow
        initiative_wpTopic: [
          {
            value: "mock WP topic",
          },
        ],
      },
    ],
  },
  formTemplate: {
    ...mockWPFullReport.formTemplate,
    routes: [
      /*
       * We need the 3th route to have a child with entityType initiative,
       * to avoid a null reference in getInitiativeStatus()
       */
      ...mockWPFullReport.formTemplate.routes.slice(0, 3),
      {
        name: "mock-route-4",
        path: "/mock/mock-route-4",
        children: [
          {
            entityType: OverlayModalTypes.INITIATIVE,
          },
        ],
      } as ReportRoute,
      ...mockWPFullReport.formTemplate.routes.slice(3),
    ],
  },
};

const mockSARReportWithOverlays = {
  ...mockSARFullReport,
  fieldData: {
    ...mockSARFullReport.fieldData,
    [OverlayModalTypes.INITIATIVE]: [
      {
        ...mockSARFullReport.fieldData.entityType[0],
        type: OverlayModalTypes.INITIATIVE,
        id: "mock wip id", // this is both our search filter and our search target in renderFieldRow
        initiative_wpTopic: [
          {
            value: "mock WP topic",
          },
        ],
        "mock-expenditure-field-1": "5",
        "mock-expenditure-field-2": "10",
        "mock-expenditure-field-3": "15",
        "mock-expenditure-field-4": "20",
      },
    ],
  },
  formTemplate: {
    ...mockSARFullReport.formTemplate,
    routes: [
      /*
       * We need the 2th route to have a child with entityType initiative,
       * to avoid a null reference in getInitiativeStatus()
       */
      ...mockSARFullReport.formTemplate.routes.slice(0, 2),
      {
        name: "mock-dynamic-route",
        path: "/mock/mock-dynamic-route",
        initiatives: [
          {
            initiatiaveId: "mock-init-id",
            name: "mock init name",
            entitySteps: [
              {
                // TODO what here?
                foo: "bar",
              },
            ],
          },
        ],
      } as ReportRoute,
      ...mockSARFullReport.formTemplate.routes.slice(2),
    ],
  },
};

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
                    label: "Field W",
                  },
                },
                {
                  id: "mock-expenditure-field-2",
                  type: "number",
                  validation: "number",
                  props: {
                    label: "Field X",
                  },
                },
                {
                  id: "mock-expenditure-field-3",
                  type: "number",
                  validation: "number",
                  props: {
                    label: "Field Y",
                  },
                },
                {
                  id: "mock-expenditure-field-4",
                  type: "number",
                  validation: "number",
                  props: {
                    label: "Field Z",
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

  test("should render modal overlay report section", async () => {
    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(wpMockProps));
    expect(
      screen.getAllByTestId("exportedOverlayModalPage")[0]
    ).toBeInTheDocument();
  });

  test("should render for SAR", async () => {
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
