import { useStore } from "utils";
// components
import {
  EntityStatusIcon,
  Table,
  ExportedEntityDetailsOverlaySection,
  Alert,
  ExportedOverlayModalReportSection,
} from "components";
import { Heading, Image, Td, Text, Tr } from "@chakra-ui/react";
// types
import {
  AlertTypes,
  AnyObject,
  EntityDetailsOverlayShape,
  EntityDetailsStepTypes,
  EntityShape,
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

interface AlertVerbiage {
  [key: string]: { title: string; description: string };
}

export const ExportedModalOverlayReportSection = ({ section }: Props) => {
  const { report } = useStore() ?? {};
  const entityType = section.entityType;

  const showAlert =
    report && (alertVerbiage as AlertVerbiage)[entityType]
      ? getWPAlertStatus(report, entityType)
      : false;
  return (
    <>
      {showAlert && (
        <Alert
          title={(alertVerbiage as AlertVerbiage)[entityType].title}
          status={AlertTypes.ERROR}
          description={(alertVerbiage as AlertVerbiage)[entityType].description}
        />
      )}
      <Table
        sx={sx.root}
        sxOverride={{ container: { ...sx.container } }}
        content={{}}
        data-testid="exportTable"
      >
        {report?.fieldData[entityType] &&
          renderModalOverlayTableBody(
            section,
            report,
            report?.fieldData[entityType]
          )}
      </Table>
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

  switch (reportType) {
    case ReportType.WP:
      return entities.map((entity, idx) => {
        return (
          <>
            <Tr key={`${reportType}${idx}`}>
              <Td sx={sx.statusIcon}>
                <EntityStatusIcon
                  entity={entity}
                  isPdf={isPdf}
                  entityStatus={getInitiativeStatus(report, entity, isPdf)}
                />
              </Td>
              <Td>
                <Heading sx={sx.heading} as="h3">
                  {`${idx + 1}. ${entity.initiative_name}` ?? "Not entered"}
                  <br />
                  <Text sx={sx.headingSubtitle}>
                    {entity.initiative_wpTopic[0].value}
                  </Text>
                </Heading>
              </Td>
            </Tr>
            {/* Depending on what the entity step type is, render its corresponding component */}
            {entitySteps.map((step, stepIdx) => {
              const type = step[0].toString();
              switch (type) {
                case EntityDetailsStepTypes.DEFINE_INITIATIVE:
                  return (
                    <Tr key={`${type}${idx}${stepIdx}`}>
                      <ExportedEntityDetailsOverlaySection
                        section={section as ModalOverlayReportPageShape}
                        entity={entity}
                        entityStep={step}
                        showHintText={true}
                      />
                    </Tr>
                  );
                case OverlayModalStepTypes.EVALUATION_PLAN:
                  return (
                    <Tr key={`${type}${idx}${stepIdx}`}>
                      <ExportedOverlayModalReportSection
                        section={section as OverlayModalPageShape}
                        entity={entity}
                        entityStep={step}
                      />
                    </Tr>
                  );
                case OverlayModalStepTypes.FUNDING_SOURCES:
                  return (
                    <Tr key={`${type}${idx}${stepIdx}`}>
                      <ExportedOverlayModalReportSection
                        section={section as OverlayModalPageShape}
                        entity={entity}
                        entityStep={step}
                      />
                    </Tr>
                  );
                case EntityDetailsStepTypes.CLOSE_OUT_INFORMATION:
                  //clean up title
                  step[1] = (step[1] as string).replace(" (if applicable)", "");

                  return (
                    entity?.isInitiativeClosed && (
                      <Tr key={`${type}${idx}${stepIdx}`}>
                        <ExportedEntityDetailsOverlaySection
                          section={section as ModalOverlayReportPageShape}
                          entity={entity}
                          entityStep={step}
                          showHintText={false}
                          closed={true}
                        />
                      </Tr>
                    )
                  );
                default:
                  return <></>;
              }
            })}
          </>
        );
      });
    case ReportType.SAR:
      return entities.map((entity, idx) => {
        return (
          <>
            <Tr key={`${reportType}${idx}`}>
              <Td sx={sx.statusIcon}>
                <EntityStatusIcon
                  entity={entity}
                  isPdf={isPdf}
                  entityStatus={getInitiativeStatus(report, entity, isPdf)}
                />
              </Td>
              <Td>
                <Heading sx={sx.heading} as="h2">
                  {`${idx + 1}. ${entity.initiative_name}` ?? "Not entered"}
                  <br />
                  <Text sx={sx.headingSubtitle}>
                    {entity.initiative_wpTopic[0].value}
                  </Text>
                </Heading>
              </Td>
            </Tr>
            {dynamicSection[idx].entitySteps.map(
              (step: any, stepIdx: number) => {
                switch (step.stepType) {
                  case OverlayModalStepTypes.OBJECTIVE_PROGRESS:
                    return (
                      <Tr key={`${step.stepType}${idx}${stepIdx}`}>
                        <ExportedOverlayModalReportSection
                          section={dynamicSection[idx] as OverlayModalPageShape}
                          entity={entity}
                          entityStep={step}
                        />
                      </Tr>
                    );
                  case EntityDetailsStepTypes.INITIAVTIVE_PROGRESS:
                    return (
                      <Tr key={`${step.stepType}${idx}${stepIdx}`}>
                        {/* <ExportedEntityDetailsOverlaySection
                          section={step}
                          entity={entity}
                          entityStep={step}
                          showHintText={true}
                        /> */}
                      </Tr>
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
                      <Tr key={`${step.stepType}${idx}${stepIdx}`}>
                        {/* <ExportedEntityDetailsOverlaySection
                          section={step}
                          entity={entity}
                          entityStep={cloneSection}
                          tableSection={tableSection}
                        /> */}
                      </Tr>
                    );
                  }
                  default:
                    return <></>;
                }
              }
            )}
          </>
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
  statusIcon: {
    paddingLeft: "1rem",
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
    paddingTop: "2rem",
    display: "flex",
    flexDirection: "column",
  },
};
