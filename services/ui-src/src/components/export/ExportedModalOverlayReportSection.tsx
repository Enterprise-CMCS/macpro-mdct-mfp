import { useStore } from "utils";
// components
import {
  EntityStatusIcon,
  ExportedEntityDetailsOverlaySection,
  Alert,
  ExportedOverlayModalReportSection,
  Table,
} from "components";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
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
  ModalOverlayReportPageShape,
  OverlayModalPageShape,
  OverlayModalStepTypes,
  ReportShape,
  ReportType,
} from "types";
import { assertExhaustive } from "utils/other/typing";
// verbiage
import alertVerbiage from "../../verbiage/pages/wp/wp-alerts";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import finishedIcon from "assets/icons/icon_check_circle.png";
// utils
import { getWPAlertStatus } from "components/alerts/getWPAlertStatus";
import { getInitiativeStatus } from "components/tables/getEntityStatus";

export const ExportedModalOverlayReportSection = ({ section }: Props) => {
  const { report } = useStore() ?? {};
  const entityType = section.entityType;
  const errorMessage: ErrorVerbiage =
    alertVerbiage[entityType as keyof typeof alertVerbiage];

  const showAlert =
    report && errorMessage ? getWPAlertStatus(report, entityType) : false;
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
        {report?.fieldData[entityType] &&
          renderModalOverlayTableBody(
            section,
            report,
            report?.fieldData[entityType]
          )}
      </Box>
      {(!report?.fieldData[entityType] ||
        report?.fieldData[entityType].length === 0) && (
        <Text sx={sx.emptyState}> No entities found.</Text>
      )}
    </>
  );
};

export interface Props {
  section: ModalOverlayReportPageShape;
}

export function renderStatusIcon(status: boolean) {
  if (status) {
    return <Image src={finishedIcon} alt="success icon" boxSize="xl" />;
  }
  return <Image src={unfinishedIcon} alt="warning icon" boxSize="xl" />;
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
    let currentStepFields = [];
    // store EntityStep name and hint for rendering
    currentStepFields.push(step.stepType);
    currentStepFields.push(step.stepName);
    currentStepFields.push(step.hint);

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
  entities: EntityShape[]
) {
  const reportType = report.reportType as ReportType;
  const entitySteps = getEntityStepFields(section.entitySteps ?? []);
  const isPdf = true;

  let dynamicSection: AnyObject[];
  if (section.pageType === "dynamicModalOverlay") {
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
        return (
          <Box key={`${reportType}${idx}`}>
            <Flex sx={sx.entityHeading}>
              <Box sx={sx.statusIcon}>
                <EntityStatusIcon
                  entity={entity}
                  isPdf={isPdf}
                  entityStatus={getInitiativeStatus(report, entity, isPdf)}
                />
              </Box>
              <Box>
                <Heading sx={sx.heading} as="h3">
                  {`${idx + 1}. ${entity.initiative_name}` ?? "Not entered"}
                  <br />
                  <Text sx={sx.headingSubtitle}>
                    {entity.initiative_wpTopic[0].value}
                  </Text>
                </Heading>
              </Box>
            </Flex>
            {/* Depending on what the entity step type is, render its corresponding component */}
            {entitySteps.map((step, stepIdx) => {
              const type = step[0].toString();
              switch (type) {
                case EntityDetailsStepTypes.DEFINE_INITIATIVE:
                  return (
                    <Box key={`${type}${idx}${stepIdx}`}>
                      <ExportedEntityDetailsOverlaySection
                        section={section as ModalOverlayReportPageShape}
                        entity={entity}
                        entityStep={step}
                        showHintText={true}
                      />
                    </Box>
                  );
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
                  step[1] = (step[1] as string).replace(" (if applicable)", "");
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
                  return <></>;
              }
            })}
          </Box>
        );
      });
    case ReportType.SAR:
      return entities.map((entity, idx) => {
        return (
          <Box key={`${reportType}${idx}`}>
            <Flex sx={sx.entityHeading}>
              <Box sx={sx.statusIcon}>
                <EntityStatusIcon
                  entity={entity}
                  isPdf={isPdf}
                  entityStatus={getInitiativeStatus(report, entity, isPdf)}
                />
              </Box>
              <Box>
                <Heading sx={sx.heading} as="h2">
                  {renderInitiativeTitle(entity, idx)}
                  <br />
                  <Text sx={sx.headingSubtitle}>
                    {entity.initiative_wpTopic[0].value}
                  </Text>
                </Heading>

                {entity.isInitiativeClosed && (
                  <Box key={`${reportType}${idx}-closeout-info`}>
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
                  </Box>
                )}
              </Box>
            </Flex>
            {dynamicSection[idx].entitySteps.map(
              (step: any, stepIdx: number) => {
                switch (step.stepType) {
                  case OverlayModalStepTypes.OBJECTIVE_PROGRESS:
                    return (
                      <Box key={`${step.stepType}${idx}${stepIdx}`}>
                        <ExportedOverlayModalReportSection
                          section={dynamicSection[idx] as OverlayModalPageShape}
                          entity={entity}
                          entityStep={step}
                        />
                      </Box>
                    );
                  case EntityDetailsStepTypes.INITIAVTIVE_PROGRESS:
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
                    return <></>;
                }
              }
            )}
          </Box>
        );
      });
    default:
      assertExhaustive(reportType);
      throw new Error(
        `The modal overlay table headers for report type '${reportType}' have not been implemented.`
      );
  }
}

const sx = {
  root: {
    "@media print": {
      pageBreakInside: "avoid",
    },
    marginBottom: "1rem",
    "tr, th": {
      verticalAlign: "bottom",
      lineHeight: "base",
    },
    "th:nth-of-type(3)": {
      width: "15rem",
    },
    thead: {
      //this will prevent generating a new header whenever the table spills over in another page
      display: "table-row-group",
    },
    td: {
      padding: "0.75rem 0.5rem",
      borderStyle: "none",
      fontWeight: "normal",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
      ".mobile &": {
        fontSize: "xs",
      },
      verticalAlign: "middle",
    },
    th: {
      maxWidth: "100%",
      paddingBottom: "0.375rem",
      fontWeight: "bold",
      lineHeight: "lg",
      color: "palette.gray_medium",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
    },
    ".desktop &": {
      "&.two-column": {
        "th:first-of-type": {
          paddingLeft: "6rem",
        },
      },
    },
  },
  entityList: {
    wordBreak: "break-word",
  },
  tableIndex: {
    color: "palette.gray_medium",
    fontWeight: "bold",
  },
  entityHeading: {
    marginTop: "4rem",
  },
  statusIcon: {
    paddingLeft: "0.25rem",
    paddingRight: "1rem",
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
    fontWeight: "normal",
    marginLeft: "1.5rem",
  },
  container: {
    marginTop: "-3rem",
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
