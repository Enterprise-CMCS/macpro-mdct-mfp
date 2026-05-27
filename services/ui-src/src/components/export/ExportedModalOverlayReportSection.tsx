import React from "react";
import {
  getReportVerbiage,
  useStore,
  renderEntityTables,
  parseCustomHtml,
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
        const overlayFormFields = overlayForm?.fields || [];
        const overlayFormTables = overlayForm?.tables || [];

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
        // Check if this is V2 route structure with overlayForm
        const overlayForm = dynamicSection?.[idx]?.overlayForm;
        const hasOverlayForm = Boolean(overlayForm);
        const overlayFormFields = overlayForm?.fields || [];
        const overlayFormTables = overlayForm?.tables || [];

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

  const tableRows: React.ReactElement[] = [];
  const entityType = entity.type;
  const entityId = entity.id;

  const renderFieldRow = (formField: FormField | FormLayoutElement) => {
    const isDynamicRowsTemplate = ReportFormFieldType.DYNAMIC_OBJECT;

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

    const hasTitle = !!(formField as any).props?.title;
    const hasSubtitle = !!(formField as any).props?.subtitle;
    const hasSectionTitle = !!(formField as any).props?.sectionTitle;
    const hasSubsectionTitle = !!(formField as any).props?.subsectionTitle;

    if (hasTitle && hasSubtitle) {
      const fieldTitle = (formField as any).props.title;
      const fieldSubtitle = (formField as any).props.subtitle;
      const fieldLabel = (formField as any).props.label;

      const modifiedField = {
        ...formField,
        props: {
          ...formField.props,
          label: "",
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
                {fieldTitle}
              </Heading>
              <Text sx={sx.helperText}>{parseCustomHtml(fieldSubtitle)}</Text>
              <Heading as="h5" sx={sx.subsectionHeading}>
                {fieldLabel}
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
      const fieldTitle =
        (formField as any).props.title || (formField as any).props.sectionTitle;
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
                {fieldTitle}
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
      const subsectionTitle = (formField as any).props.subsectionTitle;

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
                {subsectionTitle}
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

  fields.forEach((field: FormField | FormLayoutElement) => {
    if ((field as any).forCopyoverOnly) {
      return;
    }

    // Skip nested children fields (they're rendered by their parent)
    if (
      (field as FormField).validation &&
      typeof (field as FormField).validation === "object"
    ) {
      const validation = (field as FormField).validation as any;
      if (validation.nested === true) {
        return;
      }
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
