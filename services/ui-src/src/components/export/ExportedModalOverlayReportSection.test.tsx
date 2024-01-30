import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { RouterWrappedComponent } from "utils/testing/setupJest";
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

const defaultMockProps = {
  section: {
    entityType: OverlayModalTypes.INITIATIVE,
    verbiage: {
      intro: {
        section: "",
        subsection: "State- or Territory-Specific Initiatives",
        info: [
          {
            type: "html",
            content: "See ",
          },
          {
            type: "internalLink",
            content: "previous page",
            props: {
              to: "/wp/state-and-territory-specific-initiatives/instructions",
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
      tableHeader: "Initiative name <br/> Work Plan topic",
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

const testComponent = (
  <RouterWrappedComponent>
    <ExportedModalOverlayReportSection {...defaultMockProps} />
  </RouterWrappedComponent>
);

describe("ExportedModalOverlayReportSection rendering", () => {
  test("should render modal overlay report section", async () => {
    render(testComponent);
    expect(
      screen.getAllByTestId("exportedOverlayModalPage")[0]
    ).toBeInTheDocument();
  });

  test("should show success status icon", () => {
    const { container } = render(testComponent);
    screen.debug(container);
  });

  test("should not have basic accessibility issues", async () => {
    const { container } = render(testComponent);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
