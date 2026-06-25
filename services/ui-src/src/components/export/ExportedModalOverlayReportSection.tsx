import React from "react";
import {
  getReportVerbiage,
  useStore,
  renderEntityTables,
  parseCustomHtml,
  updateRenderFields,
  isFieldElement,
  parseFormFieldInfo,
  translate,
} from "utils";
// components
import {
  EntityStatusIcon,
  ExportedEntityDetailsOverlaySection,
  ExportedEntityDetailsTableRow,
  Alert,
  ExportedOverlayModalReportSection,
  Table,
} from "components";
import { Box, Flex, Heading, Text, Tr, Td } from "@chakra-ui/react";
import { sxSharedExportStyles } from "components/pages/Export/ExportedReportPage";
// types
import {
  AlertTypes,
  AnyObject,
  EntityDetailsOverlayShape,
  EntityDetailsStepTypes,
  EntityShape,
  ErrorVerbiage,
  FormField,
  FormLayoutElement,
  HeadingLevel,
  ModalOverlayReportPageShape,
  NestedFieldValidation,
  OverlayModalPageShape,
  OverlayModalStepTypes,
  PageTypes,
  ReportFormFieldType,
  ReportShape,
  ReportType,
} from "types";
// utils
import { getWPAlertStatus } from "components/alerts/getWPAlertStatus";
import { getInitiativeStatus } from "components/tables/getEntityStatus";
import { assertExhaustive } from "utils/other/typing";

/**
 * @deprecated No longer used as of Report Year 2026, Period 2
 */
export const ExportedModalOverlayReportSection = ({
  section,
  headingLevel = "h3",
}: Props) => {
  const { report } = useStore() ?? {};
  const entityType = section.entityType;
  const { alertsVerbiage } = getReportVerbiage(report?.reportType);
  const errorMessage: ErrorVerbiage =
    alertsVerbiage[entityType as keyof typeof alertsVerbiage];

  const showAlert =
    report && errorMessage ? getWPAlertStatus(report, entityType) : false;

  const entities = report?.fieldData?.[entityType];

  return (
    <>
      {showAlert && (
        <Alert
          title={errorMessage.title}
          status={AlertTypes.ERROR}
          description={errorMessage.description}
        />
      )}
      <Box sx={sx.container} data-testid="exportTable">
        {entities &&
          renderModalOverlayTableBody(section, report, entities, headingLevel)}
      </Box>

      {(!entities || entities.length === 0) && (
        <Text sx={sx.emptyState}>No entities found.</Text>
      )}
    </>
  );
};

export interface Props {
  section: ModalOverlayReportPageShape;
  headingLevel?: HeadingLevel;
}

/**
 * Split a list of form fields within each entity step form or modal form.
 * This allows returning distinct tables for each section, rather than one large one.
 *
 *
 * @param entitySteps List of entity step data and form fields
 * @returns array of arrays containing form field elements representing an entity step
 */
export function getEntityStepFields(
  entitySteps: (EntityDetailsOverlayShape | OverlayModalPageShape)[]
) {
  const entityStepFields: (string | FormLayoutElement | FormField)[][] = [];

  for (let step of entitySteps) {
    // store EntityStep name and hint for rendering
    let currentStepFields: (string | FormLayoutElement | FormField)[] = [
      step.stepType,
      step.stepName,
      step.hint,
    ];

    // handle Standard forms
    if (step.form) {
      for (let field of step.form.fields) {
        currentStepFields.push(field);
      }
    }
    // handle Modal forms
    else if (step.modalForm) {
      for (let field of step.modalForm.fields) {
        currentStepFields.push(field);
      }
    }
    entityStepFields.push(currentStepFields);
  }

  return entityStepFields;
}

export function renderModalOverlayTableBody(
  section: ModalOverlayReportPageShape | OverlayModalPageShape,
  report: ReportShape,
  entities: EntityShape[],
  headingLevel: HeadingLevel
) {
  const reportType = report.reportType as ReportType;
  const entitySteps = getEntityStepFields(section.entitySteps ?? []);
  const isPdf = true;

  let dynamicSection: AnyObject[];
  if (section.pageType === PageTypes.DYNAMIC_MODAL_OVERLAY) {
    dynamicSection = (section as AnyObject).initiatives;
  }

  const renderInitiativeTitle = (entity: EntityShape, idx: number) => {
    if (entity.initiative_name) {
      return entity.isInitiativeClosed
        ? `${idx + 1}. [Closed] ${entity.initiative_name}`
        : `${idx + 1}. ${entity.initiative_name}`;
    }
    return "Not entered";
  };

  switch (reportType) {
    case ReportType.WP:
      return entities.map((entity, idx) => {
        const headingText = entity.initiative_name
          ? `${idx + 1}. ${entity.initiative_name}`
          : "Not entered";

        // Check if V2
        const { overlayForm } = section as AnyObject;
        const hasOverlayForm = Boolean(overlayForm);
        const rawOverlayFormFields = overlayForm?.fields || [];
        const overlayFormTables = overlayForm?.tables || [];

        // Process fields to inject target populations and other dynamic data
        const overlayFormFields = updateRenderFields(
          report,
          rawOverlayFormFields,
          entity
        );

        return (
          <Box key={`${reportType}${idx}`} sx={sx.entityContainer}>
            <Flex>
              <Box sx={sx.statusIcon}>
                <EntityStatusIcon
                  entity={entity}
                  showLabel={true}
                  entityStatus={getInitiativeStatus(report, entity, isPdf)}
                />
              </Box>
              <Box>
                <Heading as={headingLevel} sx={sx.heading}>
                  {headingText}
                </Heading>
                <Text sx={sx.headingSubtitle}>
                  {entity.initiative_wp_otherTopic ||
                    entity.initiative_wpTopic[0].value}
                </Text>
              </Box>
            </Flex>

            {/* V2 Route: Render overlayForm fields directly */}
            {hasOverlayForm && overlayFormFields.length > 0 && (
              <EntityFieldsTable
                fields={overlayFormFields}
                entity={entity}
                tables={overlayFormTables}
              />
            )}

            {/* deprecated: V1 Render entitySteps */}
            {!hasOverlayForm &&
              entitySteps.map((step, stepIdx) => {
                const type = step[0].toString();
                switch (type) {
                  case EntityDetailsStepTypes.DEFINE_INITIATIVE: {
                    const currentLevel = parseInt(headingLevel.charAt(1), 10);
                    const nextLevel = currentLevel + 1;
                    const nextHeadingLevel = `h${nextLevel}`;

                    return (
                      <Box key={`${type}${idx}${stepIdx}`}>
                        <ExportedEntityDetailsOverlaySection
                          section={section as ModalOverlayReportPageShape}
                          entity={entity}
                          entityStep={step}
                          showHintText={true}
                          headingLevel={nextHeadingLevel as HeadingLevel}
                        />
                      </Box>
                    );
                  }
                  case OverlayModalStepTypes.EVALUATION_PLAN:
                    return (
                      <Box key={`${type}${idx}${stepIdx}`}>
                        <ExportedOverlayModalReportSection
                          section={section as OverlayModalPageShape}
                          entity={entity}
                          entityStep={step}
                        />
                      </Box>
                    );
                  case OverlayModalStepTypes.FUNDING_SOURCES:
                    return (
                      <Box key={`${type}${idx}${stepIdx}`}>
                        <ExportedOverlayModalReportSection
                          section={section as OverlayModalPageShape}
                          entity={entity}
                          entityStep={step}
                        />
                      </Box>
                    );
                  case EntityDetailsStepTypes.CLOSE_OUT_INFORMATION:
                    //clean up title
                    step[1] = (step[1] as string).replace(
                      " (if applicable)",
                      ""
                    );
                    return (
                      entity?.isInitiativeClosed && (
                        <Box key={`${type}${idx}${stepIdx}`}>
                          <ExportedEntityDetailsOverlaySection
                            section={section as ModalOverlayReportPageShape}
                            entity={entity}
                            entityStep={step}
                            showHintText={false}
                            closed={true}
                          />
                        </Box>
                      )
                    );
                  default:
                    return <Box key={`${type}${idx}${stepIdx}`}></Box>;
                }
              })}
          </Box>
        );
      });
    case ReportType.SAR:
      return entities.map((entity, idx) => {
        // Check if V2 - for DYNAMIC_MODAL_OVERLAY, overlayForm is on section directly
        const overlayForm =
          section.pageType === PageTypes.DYNAMIC_MODAL_OVERLAY
            ? (section as ModalOverlayReportPageShape).overlayForm
            : dynamicSection?.[idx]?.overlayForm;
        const hasOverlayForm = Boolean(overlayForm);
        const rawOverlayFormFields = overlayForm?.fields || [];
        const overlayFormTables = overlayForm?.tables || [];

        // Process fields to inject target populations and other dynamic data
        const overlayFormFields = hasOverlayForm
          ? updateRenderFields(report, rawOverlayFormFields, entity)
          : [];

        return (
          <Box key={`${reportType}${idx}`} sx={sx.entityContainer}>
            <Flex>
              <Box sx={sx.statusIcon}>
                <EntityStatusIcon
                  entity={entity}
                  showLabel={true}
                  entityStatus={getInitiativeStatus(report, entity, isPdf)}
                />
              </Box>
              <Box>
                <Heading as={headingLevel} sx={sx.heading}>
                  {renderInitiativeTitle(entity, idx)}
                </Heading>
                <Text sx={sx.headingSubtitle}>
                  {entity.initiative_wpTopic[0].value}
                </Text>
                {entity.isInitiativeClosed && (
                  <Box>
                    <Table
                      content={{
                        headRow: ["Actual end date", "Closed by"],
                        bodyRows: [
                          [
                            entity.closeOutInformation_actualEndDate,
                            entity.closedBy,
                          ],
                        ],
                      }}
                      variant="none"
                      sx={sx.closedByTable}
                    />
                  </Box>
                )}
              </Box>
            </Flex>

            {/* V2 Route: Render overlayForm fields directly */}
            {hasOverlayForm && overlayFormFields.length > 0 && (
              <EntityFieldsTable
                fields={overlayFormFields}
                entity={entity}
                tables={overlayFormTables}
              />
            )}

            {/* deprecated: V1 Render entitySteps */}
            {!hasOverlayForm &&
              dynamicSection &&
              dynamicSection[idx].entitySteps.map(
                (step: any, stepIdx: number) => {
                  switch (step.stepType) {
                    case OverlayModalStepTypes.OBJECTIVE_PROGRESS:
                      return (
                        <Box key={`${step.stepType}${idx}${stepIdx}`}>
                          <ExportedOverlayModalReportSection
                            section={
                              dynamicSection[idx] as OverlayModalPageShape
                            }
                            entity={entity}
                            entityStep={step}
                          />
                        </Box>
                      );
                    case EntityDetailsStepTypes.INITIATIVE_PROGRESS:
                      return (
                        <Box key={`${step.stepType}${idx}${stepIdx}`}>
                          <ExportedEntityDetailsOverlaySection
                            section={step}
                            entity={entity}
                            entityStep={step}
                            showHintText={true}
                          />
                        </Box>
                      );
                    case EntityDetailsStepTypes.EXPENDITURES: {
                      const cloneSection = structuredClone(step);
                      if (cloneSection?.form?.fields)
                        cloneSection.form.fields = [
                          cloneSection.form.fields.pop(),
                        ];

                      const tableSection = structuredClone(step);
                      if (tableSection?.form?.fields)
                        tableSection.form.fields.pop();

                      return (
                        <Box key={`${step.stepType}${idx}${stepIdx}`}>
                          <ExportedEntityDetailsOverlaySection
                            section={step}
                            entity={entity}
                            entityStep={cloneSection}
                            tableSection={tableSection}
                          />
                        </Box>
                      );
                    }
                    default:
                      return (
                        <Box key={`${step.stepType}${idx}${stepIdx}`}></Box>
                      );
                  }
                }
              )}
          </Box>
        );
      });
    default:
      assertExhaustive(reportType as never);
      throw new Error(
        `The modal overlay table headers for report type '${reportType}' have not been implemented.`
      );
  }
}

// Helper component to render V2 in PDF
const EntityFieldsTable = ({
  fields,
  entity,
  tables,
}: {
  fields: (FormField | FormLayoutElement)[];
  entity: EntityShape;
  tables?: any[];
}) => {
  const { report } = useStore();
  const { exportVerbiage } = getReportVerbiage(report?.reportType);
  const { tableHeaders } = exportVerbiage;

  // Flatten nested fields from choices.children into main fields array
  const flattenedFields: (FormField | FormLayoutElement)[] = [];
  fields.forEach((field) => {
    flattenedFields.push(field);
    const choices = field.props?.choices;
    if (Array.isArray(choices)) {
      choices.forEach((choice: any) => {
        if (Array.isArray(choice.children)) {
          flattenedFields.push(...choice.children);
        }
      });
    }
  });

  const tableRows: React.ReactElement[] = [];
  const entityType = entity.type;
  const entityId = entity.id;
  const initiativeName = entity.initiative_name;

  const renderFieldRow = (formField: FormField | FormLayoutElement) => {
    const isDynamicRowsTemplate =
      formField.type === ReportFormFieldType.DYNAMIC_OBJECT;

    if (isDynamicRowsTemplate) {
      const templateId = formField.id;
      const tableId = templateId.split("_performanceIndicators")[0];
      const table = tables?.find((t) => t.id === tableId);

      if (table) {
        tableRows.push(
          <Tr
            key={formField.id}
            sx={{ border: "none !important", borderBottom: "none !important" }}
          >
            <Td
              colSpan={2}
              sx={{
                padding: 0,
                border: "none !important",
                verticalAlign: "top",
              }}
            >
              <Box sx={{ margin: 0 }}>
                {renderEntityTables([table], entity, "h5", true)}
              </Box>
            </Td>
          </Tr>
        );
      }
      return;
    }

    // Special handling for start date field with nested children
    // This field shows "Expected start date" or "Actual start date" choice with a nested date field
    const isStartDateField = formField.id === "defineInitiative_startDate";
    const hasNestedChildren =
      isFieldElement(formField) &&
      formField.props?.choices &&
      formField.props.choices.some((choice: any) => choice.children);

    // If this is the start date field with nested children, render with custom logic
    if (isStartDateField && hasNestedChildren && formField.props) {
      const parentFieldValue = entity[formField.id];

      // Find the selected choice
      const selectedChoice = Array.isArray(parentFieldValue)
        ? parentFieldValue[0]
        : null;

      if (selectedChoice?.key) {
        // Extract the choice ID from the key (format: "fieldName-choiceId")
        const selectedChoiceId = selectedChoice.key.split("-").pop();

        // Find the choice definition that matches the selected ID and has children
        const choiceWithChildren = formField.props.choices.find(
          (choice: any) => choice.id === selectedChoiceId && choice.children
        );

        if (choiceWithChildren?.children?.length > 0) {
          // Get the nested child field (there should be only one child per choice)
          const childField = choiceWithChildren.children[0];
          const childValue = entity[childField.id];

          // Render the parent field with the selected choice label
          const formFieldInfo = parseFormFieldInfo(formField?.props);

          // First row: show the parent label with the selected choice as value
          tableRows.push(
            <Tr key={formField.id} data-testid="exportRow">
              <Td sx={{ width: "14rem" }}>
                <Text sx={{ fontSize: "sm", fontWeight: "bold" }}>
                  {formFieldInfo.label}
                </Text>
                {formFieldInfo.hint && (
                  <Text
                    sx={{
                      lineHeight: "lg",
                      fontSize: "sm",
                      color: "gray_dark",
                    }}
                  >
                    {parseCustomHtml(formFieldInfo.hint)}
                  </Text>
                )}
              </Td>
              <Td>
                <Text>{choiceWithChildren.label}</Text>
              </Td>
            </Tr>
          );

          // Second row: show the selected choice label with the child value
          tableRows.push(
            <Tr key={`${formField.id}_value`} data-testid="exportRow">
              <Td sx={{ width: "14rem" }}>
                <Text sx={{ fontSize: "sm", fontWeight: "bold" }}>
                  {choiceWithChildren.label}
                </Text>
              </Td>
              <Td>
                <Text>{childValue || "Not answered"}</Text>
              </Td>
            </Tr>
          );
          return;
        }
      }

      // If field has nested children but no choice selected, still render it normally
      // Fall through to normal rendering below
    }

    const fieldProps = formField.props || {};

    const fieldTitle = fieldProps.title;
    const fieldSubtitle = fieldProps.subtitle;
    const sectionTitle = fieldProps.sectionTitle;
    const subsectionTitle = (formField as any).props.subsectionTitle;

    const hasTitle = Boolean(fieldTitle);
    const hasSubtitle = Boolean(fieldSubtitle);
    const hasSectionTitle = Boolean(fieldProps.sectionTitle);
    const hasSubsectionTitle = Boolean(fieldProps.subsectionTitle);

    if (hasTitle && hasSubtitle) {
      const fieldTitle = (formField as any).props.title;
      const fieldSubtitle = (formField as any).props.subtitle;
      const fieldLabel = (formField as any).props.label;

      // Close-out fields carry a title/subtitle as a section header, but their
      // label should stay in the Indicators column rather than become a heading.
      const isCloseOutField = formField.id?.startsWith("closeOutInformation_");

      const modifiedField = {
        ...formField,
        props: {
          ...formField.props,
          label: isCloseOutField ? formField.props?.label : "",
        },
      };

      // Render as: H4 title -> subtitle text -> H5 label -> table
      tableRows.push(
        <Tr
          key={formField.id}
          sx={{ border: "none !important", borderBottom: "none !important" }}
        >
          <Td
            colSpan={2}
            sx={{ padding: 0, border: "none !important", verticalAlign: "top" }}
          >
            <Box sx={{ margin: 0, marginBottom: 0, marginTop: "1.5rem" }}>
              <Heading as="h4" sx={sx.sectionHeading}>
                {translate(fieldTitle, { initiativeName })}
              </Heading>
              <Text sx={sx.helperText}>{parseCustomHtml(fieldSubtitle)}</Text>
              {!isCloseOutField && (
                <Heading as="h5" sx={sx.subsectionHeading}>
                  {fieldLabel}
                </Heading>
              )}
              <Table
                content={{
                  headRow: [tableHeaders.indicator, tableHeaders.response],
                }}
                sx={{
                  ...sxSharedExportStyles.table,
                  marginTop: "1.5rem",
                  marginBottom: 0,
                }}
              >
                <ExportedEntityDetailsTableRow
                  formField={modifiedField as FormField}
                  pageType={PageTypes.MODAL_OVERLAY}
                  entityType={entityType}
                  entityId={entityId}
                  showHintText={true}
                />
              </Table>
            </Box>
          </Td>
        </Tr>
      );
      return;
    }

    // Check if field has a title or sectionTitle property (like Qualitative Methods, Funding Sources, Describe Initiative, Initiative Progress)
    if (hasTitle || hasSectionTitle) {
      const fieldOrSectionTitle = fieldTitle || sectionTitle;
      const isDescribeInitiative =
        formField.id === "defineInitiative_describeInitiative";
      const helperText = isDescribeInitiative
        ? "Provide initiative description, including target populations and timeframe"
        : null;

      // Render as: H4 heading -> optional helper text -> mini-table
      tableRows.push(
        <Tr
          key={formField.id}
          sx={{ border: "none !important", borderBottom: "none !important" }}
        >
          <Td
            colSpan={2}
            sx={{ padding: 0, border: "none !important", verticalAlign: "top" }}
          >
            <Box sx={{ margin: 0, marginBottom: 0, marginTop: "1.5rem" }}>
              <Heading as="h4" sx={sx.sectionHeading}>
                {translate(fieldOrSectionTitle, { initiativeName })}
              </Heading>
              {helperText && <Text sx={sx.helperText}>{helperText}</Text>}
              <Table
                content={{
                  headRow: [tableHeaders.indicator, tableHeaders.response],
                }}
                sx={{
                  ...sxSharedExportStyles.table,
                  marginTop: "1.5rem",
                  marginBottom: 0,
                }}
              >
                <ExportedEntityDetailsTableRow
                  formField={formField}
                  pageType={PageTypes.MODAL_OVERLAY}
                  entityType={entityType}
                  entityId={entityId}
                  showHintText={true}
                />
              </Table>
            </Box>
          </Td>
        </Tr>
      );
      return;
    }

    if (hasSubsectionTitle) {
      // Render as: H5 heading -> mini-table
      tableRows.push(
        <Tr
          key={formField.id}
          sx={{ border: "none !important", borderBottom: "none !important" }}
        >
          <Td
            colSpan={2}
            sx={{ padding: 0, border: "none !important", verticalAlign: "top" }}
          >
            <Box sx={{ margin: 0, marginBottom: 0, marginTop: "1.5rem" }}>
              <Heading as="h5" sx={sx.subsectionHeading}>
                {translate(subsectionTitle, { initiativeName })}
              </Heading>
              <Table
                content={{
                  headRow: [tableHeaders.indicator, tableHeaders.response],
                }}
                sx={{
                  ...sxSharedExportStyles.table,
                  marginTop: "1.5rem",
                  marginBottom: 0,
                }}
              >
                <ExportedEntityDetailsTableRow
                  formField={formField}
                  pageType={PageTypes.MODAL_OVERLAY}
                  entityType={entityType}
                  entityId={entityId}
                  showHintText={true}
                />
              </Table>
            </Box>
          </Td>
        </Tr>
      );
      return;
    }

    // Normal field rendering
    tableRows.push(
      <ExportedEntityDetailsTableRow
        key={formField.id}
        formField={formField}
        pageType={PageTypes.MODAL_OVERLAY}
        entityType={entityType}
        entityId={entityId}
        showHintText={true}
      />
    );
  };

  flattenedFields.forEach((field: FormField | FormLayoutElement) => {
    // Close-out fields are flagged forCopyoverOnly, but should be shown in the
    // export once the initiative has been closed out.
    const isCloseOutField = field.id?.startsWith("closeOutInformation_");
    const showClosedOutField = isCloseOutField && entity.isInitiativeClosed;
    if ((field as any).forCopyoverOnly && !showClosedOutField) {
      return;
    }

    // Handle nested children fields - check if parent choice is selected before rendering
    const validation = (field as FormField).validation as NestedFieldValidation;
    if (validation?.nested === true) {
      const parentFieldId = validation.parentFieldName;
      const parentOptionId = validation.parentOptionId;

      if (parentFieldId && parentOptionId && entity[parentFieldId]) {
        const parentValue = entity[parentFieldId];
        // Check if this parent choice is selected (key format: "fieldName-optionId")
        const isParentChoiceSelected =
          Array.isArray(parentValue) &&
          parentValue.some((choice: any) => {
            const choiceId = choice.key?.split("-").pop();
            return choiceId === parentOptionId;
          });

        if (isParentChoiceSelected) {
          const fieldLabel = field.props?.label;

          if (fieldLabel === "Please describe:") {
            // Render "Please describe:" as a simple table row
            const fieldId = field.id;
            const fieldValue = entity[fieldId];
            tableRows.push(
              <Tr key={fieldId} data-testid="exportRow">
                <Td sx={{ width: "14rem" }}>
                  <Text sx={{ fontSize: "sm", fontWeight: "bold" }}>
                    Please describe:
                  </Text>
                </Td>
                <Td>
                  <Text>{fieldValue || "Not answered"}</Text>
                </Td>
              </Tr>
            );
          } else {
            renderFieldRow(field);
          }
        }
      }
      return;
    }

    if ((field as FormField).type) {
      renderFieldRow(field);
    }
  });

  return (
    <Box sx={sx.v2FieldsContainer}>
      {tableRows.length > 0 && (
        <Box sx={sx.fieldsTableContainer}>
          <Table
            content={{}}
            sx={sxSharedExportStyles.table}
            data-testid="exportFieldsTable"
          >
            {tableRows}
          </Table>
        </Box>
      )}
    </Box>
  );
};

const sx = {
  entityContainer: {
    "& + &": { marginTop: "spacer4" },
  },
  v2FieldsContainer: {
    marginTop: "spacer4",
  },
  fieldsTableContainer: {
    marginTop: "spacer2",
  },
  sectionHeading: {
    fontSize: "lg",
    fontWeight: "bold",
    marginBottom: 0,
  },
  subsectionHeading: {
    fontSize: "md",
    fontWeight: "bold",
    marginBottom: 0,
    marginTop: "spacer2",
  },
  helperText: {
    lineHeight: "lg",
    fontSize: "sm",
    color: "gray_dark",
    marginTop: "spacer2",
    marginBottom: "spacer2",
  },
  statusIcon: {
    paddingLeft: "spacer_half",
    paddingRight: "spacer2",
    img: {
      maxWidth: "fit-content",
    },
  },
  emptyState: {
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
    paddingBottom: "5rem",
  },
  heading: {
    fontSize: "xl",
  },
  headingSubtitle: {
    fontSize: "xl",
    fontWeight: "normal",
    marginLeft: "spacer3",
  },
  container: {
    display: "flex",
    flexDirection: "column",
  },
  closedByTable: {
    th: {
      width: "2rem",
      paddingBottom: "0",
    },
  },
};
