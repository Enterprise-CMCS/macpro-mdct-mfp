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
  FormTableType,
  ModalOverlayReportPageVerbiage,
  OverlayModalPageShape,
  OverlayModalTypes,
  OverlayModalStepTypes,
  PageTypes,
  ReportFormFieldType,
  ValidationType,
  AnyObject,
} from "types";
import {
  ExportedModalOverlayReportSection,
  Props,
} from "./ExportedModalOverlayReportSection";
import { testA11yAct } from "utils/testing/commonTests";

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
      tableHeaders: ["Initiative name <br/> MFP Work Plan topic"],
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
    pageType: PageTypes.DYNAMIC_MODAL_OVERLAY,
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
      tableHeaders: ["Initiative name <br/> MFP Work Plan topic"],
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
            stepType: EntityDetailsStepTypes.INITIATIVE_PROGRESS,
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
    expect(screen.getAllByTestId("exportedOverlayModalPage")[0]).toBeVisible();
  });

  test("should render correct initiative topic", () => {
    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(wpMockProps));
    expect(screen.getByText("mock WP topic")).toBeVisible();
    expect(screen.getByText("Unique initiative type")).toBeVisible();
  });

  test("should render for SAR", () => {
    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockSARReportWithOverlays,
    });
    render(testComponent(sarMockProps));
    expect(screen.getByText("% of total projected spending")).toBeVisible();
    expect(screen.getByText("42.86%")).toBeVisible(); // (5+10)/(15+20)
  });

  test("should skip fields with forCopyoverOnly flag", () => {
    const propsWithCopyoverField = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "copyover_field",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              forCopyoverOnly: true,
              props: { label: "Should be skipped" },
            },
            {
              id: "regular_field",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
              props: { label: "Regular Field" },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(propsWithCopyoverField));
    expect(screen.queryByText("Should be skipped")).not.toBeInTheDocument();
    expect(screen.getAllByText("Regular Field").length).toBe(2);
  });

  test("should render nested field with Please describe label", () => {
    const reportWithNestedField = {
      ...mockWPReportWithOverlays,
      fieldData: {
        ...mockWPReportWithOverlays.fieldData,
        initiative: [
          {
            ...mockWPReportWithOverlays.fieldData.initiative[0],
            parent_field: [{ key: "parent_field-option1", value: "Option 1" }],
            nested_describe_field: "Test description",
          },
        ],
      },
    };

    const propsWithNestedField = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "parent_field",
              type: "radio",
              validation: "text",
              props: {
                label: "Parent Field",
                choices: [
                  { id: "option1", label: "Option 1" },
                  { id: "option2", label: "Option 2" },
                ],
              },
            },
            {
              id: "nested_describe_field",
              type: "text",
              validation: {
                nested: true,
                parentFieldName: "parent_field",
                parentOptionId: "option1",
              },
              props: { label: "Please describe:" },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: reportWithNestedField,
    });
    render(testComponent(propsWithNestedField));
    expect(screen.getByText("Please describe:")).toBeVisible();
    expect(screen.getByText("Test description")).toBeVisible();
  });

  test("should render nested field without Please describe label", () => {
    const reportWithNestedField = {
      ...mockWPReportWithOverlays,
      fieldData: {
        ...mockWPReportWithOverlays.fieldData,
        initiative: [
          {
            ...mockWPReportWithOverlays.fieldData.initiative[0],
            parent_field: [{ key: "parent_field-option1", value: "Option 1" }],
            nested_field: "Nested value",
          },
        ],
      },
    };

    const propsWithNestedField = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "parent_field",
              type: "radio",
              validation: "text",
              props: {
                label: "Parent Field",
                choices: [
                  { id: "option1", label: "Option 1" },
                  { id: "option2", label: "Option 2" },
                ],
              },
            },
            {
              id: "nested_field",
              type: "text",
              validation: {
                nested: true,
                parentFieldName: "parent_field",
                parentOptionId: "option1",
              },
              props: { label: "Nested Field Label" },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: reportWithNestedField,
    });
    render(testComponent(propsWithNestedField));
    expect(screen.getByText("Nested Field Label")).toBeVisible();
    expect(screen.getByText("Nested value")).toBeVisible();
  });

  test("should not render nested field when parent choice is not selected", () => {
    const reportWithUnselectedParent = {
      ...mockWPReportWithOverlays,
      fieldData: {
        ...mockWPReportWithOverlays.fieldData,
        initiative: [
          {
            ...mockWPReportWithOverlays.fieldData.initiative[0],
            parent_field: [{ key: "parent_field-option2", value: "Option 2" }],
            nested_field: "Should not render",
          },
        ],
      },
    };

    const propsWithNestedField = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "parent_field",
              type: "radio",
              validation: "text",
              props: {
                label: "Parent Field",
                choices: [
                  { id: "option1", label: "Option 1" },
                  { id: "option2", label: "Option 2" },
                ],
              },
            },
            {
              id: "nested_field",
              type: "text",
              validation: {
                nested: true,
                parentFieldName: "parent_field",
                parentOptionId: "option1",
              },
              props: { label: "Nested Field" },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: reportWithUnselectedParent,
    });
    render(testComponent(propsWithNestedField));
    expect(screen.queryByText("Should not render")).not.toBeInTheDocument();
  });

  test("should flatten fields with choices.children", () => {
    const propsWithChoicesChildren = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "parent_choice_field",
              type: "radio",
              validation: "text",
              props: {
                label: "Parent Choice Field",
                choices: [
                  {
                    id: "choice1",
                    label: "Choice 1",
                    children: [
                      {
                        id: "child_field",
                        type: "text",
                        validation: "text",
                        props: { label: "Child Field" },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(propsWithChoicesChildren));
    expect(screen.getAllByText("Parent Choice Field").length).toBe(2);
  });

  test("should render start date field with nested children", () => {
    const reportWithStartDate = {
      ...mockWPReportWithOverlays,
      fieldData: {
        ...mockWPReportWithOverlays.fieldData,
        initiative: [
          {
            ...mockWPReportWithOverlays.fieldData.initiative[0],
            defineInitiative_startDate: [
              { key: "defineInitiative_startDate-expected", value: "Expected" },
            ],
            expectedStartDate: "01/01/2026",
          },
        ],
      },
    };

    const propsWithStartDate = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "defineInitiative_startDate",
              type: "radio",
              validation: "text",
              props: {
                label: "Start Date",
                hint: "Select start date type",
                choices: [
                  {
                    id: "expected",
                    label: "Expected start date",
                    children: [
                      {
                        id: "expectedStartDate",
                        type: "date",
                        validation: "date",
                        props: { label: "Date" },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: reportWithStartDate,
    });
    render(testComponent(propsWithStartDate));
    expect(screen.getAllByText("Expected start date").length).toBe(2);
  });

  test("should render field with title and subtitle", () => {
    const propsWithTitleSubtitle = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "field_with_title_subtitle",
              type: "text",
              validation: "text",
              props: {
                title: "Unique Field Title",
                subtitle: "Field subtitle text",
                label: "Field Label",
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(propsWithTitleSubtitle));
    expect(screen.getAllByText("Unique Field Title").length).toBe(2);
    // Non-close-out fields promote the label to an h5 subsection heading
    expect(
      screen.getAllByRole("heading", { level: 5, name: "Field Label" }).length
    ).toBe(2);
  });

  test("should render field with sectionTitle", () => {
    const propsWithSectionTitle = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "field_with_section_title",
              type: "text",
              validation: "text",
              props: {
                sectionTitle: "Unique Section Title Test",
                label: "Field Label",
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(propsWithSectionTitle));
    expect(screen.getAllByText("Unique Section Title Test").length).toBe(2);
  });

  test("should render field with subsectionTitle", () => {
    const propsWithSubsectionTitle = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "field_with_subsection_title",
              type: "text",
              validation: "text",
              props: {
                subsectionTitle: "Unique Subsection Title Test",
                label: "Field Label",
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(propsWithSubsectionTitle));
    expect(screen.getAllByText("Unique Subsection Title Test").length).toBe(2);
  });

  test("should render field with defineInitiative_describeInitiative id", () => {
    const propsWithDescribeInitiative = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "defineInitiative_describeInitiative",
              type: "textarea",
              validation: "text",
              props: {
                title: "Unique Describe Initiative",
                label: "Description",
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(propsWithDescribeInitiative));
    expect(screen.getAllByText("Unique Describe Initiative").length).toBe(2);
    expect(
      screen.getAllByText(
        "Provide initiative description, including target populations and timeframe"
      ).length
    ).toBe(2);
  });

  test("should render dynamic object field with table", () => {
    const propsWithDynamicObject = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "testTable_performanceIndicators",
              type: "dynamicObject",
              validation: "text",
              props: {
                label: "Performance Indicators",
              },
            },
          ],
          tables: [
            {
              id: "testTable",
              bodyRows: [],
              footRows: [],
              headRows: [["Indicator", "Baseline"]],
              tableType: FormTableType.ENTITY_MODAL,
              verbiage: { title: "Unique Test Table" },
              dynamicRowsTemplate: {
                id: "testTable_performanceIndicators",
                type: ReportFormFieldType.DYNAMIC_OBJECT,
                validation: {
                  type: ValidationType.DYNAMIC_OPTIONAL,
                  options: { dynamicFieldValidations: {} },
                },
                props: {
                  dynamicFields: [
                    { id: "testTable_indicator", type: "text", props: {} },
                    { id: "testTable_baseline", type: "number", props: {} },
                  ],
                },
                verbiage: {
                  buttonText: "Add",
                  hint: "",
                },
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(propsWithDynamicObject));
    expect(screen.getAllByText("Unique Test Table").length).toBe(2);
  });

  test("should handle dynamic object field without matching table", () => {
    const propsWithDynamicObjectNoTable = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "missingTable_performanceIndicators",
              type: "dynamicObject",
              validation: "text",
              props: {
                label: "Performance Indicators",
              },
            },
          ],
          tables: [
            {
              id: "differentTable",
              bodyRows: [],
              footRows: [],
              headRows: [["Header"]],
              tableType: FormTableType.ENTITY_MODAL,
              verbiage: { title: "Different Table" },
              dynamicRowsTemplate: {
                id: "differentTable_data",
                type: ReportFormFieldType.DYNAMIC_OBJECT,
                validation: {
                  type: ValidationType.DYNAMIC_OPTIONAL,
                  options: { dynamicFieldValidations: {} },
                },
                props: {
                  dynamicFields: [{ id: "field", type: "text", props: {} }],
                },
                verbiage: {
                  buttonText: "Add",
                  hint: "",
                },
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
    render(testComponent(propsWithDynamicObjectNoTable));
    expect(screen.getByTestId("exportTable")).toBeVisible();
  });

  // Renders a single initiative so text assertions are unambiguous.
  const singleInitiativeReport = (overrides: AnyObject) => ({
    ...mockWPReportWithOverlays,
    fieldData: {
      ...mockWPReportWithOverlays.fieldData,
      initiative: [
        {
          ...mockWPReportWithOverlays.fieldData.initiative[0],
          ...overrides,
        },
      ],
    },
  });

  test("should substitute {{initiativeName}} placeholder in field title", () => {
    const propsWithPlaceholderTitle = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "field_with_placeholder",
              type: "text",
              validation: "text",
              props: {
                title: "Close-out {{initiativeName}}",
                subtitle: "Field subtitle text",
                label: "Field Label",
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: singleInitiativeReport({ initiative_name: "Test Initiative" }),
    });
    render(testComponent(propsWithPlaceholderTitle));
    expect(screen.getByText("Close-out Test Initiative")).toBeVisible();
    expect(
      screen.queryByText("Close-out {{initiativeName}}")
    ).not.toBeInTheDocument();
  });

  test("should hide close-out fields when initiative is not closed", () => {
    const propsWithCloseOutField = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "closeOutInformation_projectedEndDate",
              type: "date",
              validation: "dateOptional",
              forCopyoverOnly: true,
              props: { label: "Projected end date" },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: singleInitiativeReport({ isInitiativeClosed: false }),
    });
    render(testComponent(propsWithCloseOutField));
    expect(screen.queryByText("Projected end date")).not.toBeInTheDocument();
  });

  test("should show close-out fields when initiative is closed", () => {
    const propsWithCloseOutField = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "closeOutInformation_projectedEndDate",
              type: "date",
              validation: "dateOptional",
              forCopyoverOnly: true,
              props: {
                title: "Close-out {{initiativeName}}",
                subtitle: "Complete for initiatives that end soon.",
                label: "Projected end date",
              },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: singleInitiativeReport({
        isInitiativeClosed: true,
        initiative_name: "Test Initiative",
      }),
    });
    render(testComponent(propsWithCloseOutField));
    // Title renders as the section header with the substituted initiative name
    expect(screen.getByText("Close-out Test Initiative")).toBeVisible();
    // Label renders in the Indicators column, not as an h5 subsection heading
    expect(screen.getByText("Projected end date")).toBeVisible();
    expect(
      screen.queryByRole("heading", { level: 5, name: "Projected end date" })
    ).not.toBeInTheDocument();
  });

  test("should keep non-close-out forCopyoverOnly fields hidden when closed", () => {
    const propsWithCopyoverField = {
      section: {
        ...wpMockProps.section,
        overlayForm: {
          id: "test_form",
          fields: [
            {
              id: "regular_copyover_field",
              type: "text",
              validation: "text",
              forCopyoverOnly: true,
              props: { label: "Hidden Copyover Field" },
            },
          ],
        },
      },
    };

    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: singleInitiativeReport({ isInitiativeClosed: true }),
    });
    render(testComponent(propsWithCopyoverField));
    expect(screen.queryByText("Hidden Copyover Field")).not.toBeInTheDocument();
  });

  testA11yAct(testComponent(wpMockProps), () => {
    mockedUseStore.mockReturnValue({
      ...mockReportStore,
      report: mockWPReportWithOverlays,
    });
  });
});
