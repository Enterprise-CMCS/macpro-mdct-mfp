import { useStore } from "utils";
// components
import {
  EntityStatusIcon,
  Table,
  ExportedEntityDetailsOverlaySection,
} from "components";
import { Box, Heading, Image, Td, Text, Tr } from "@chakra-ui/react";
// types
import {
  EntityDetailsOverlayShape,
  EntityDetailsStepTypes,
  EntityShape,
  FormField,
  FormLayoutElement,
  ModalOverlayReportPageShape,
  OverlayModalPageShape,
  OverlayModalStepTypes,
  ReportType,
} from "types";
import { assertExhaustive } from "utils/other/typing";
// verbiage
import wpVerbiage from "verbiage/pages/wp/wp-export";
import sarVerbiage from "verbiage/pages/sar/sar-export";
// assets
import unfinishedIcon from "assets/icons/icon_error_circle_bright.png";
import finishedIcon from "assets/icons/icon_check_circle.png";
import { ExportedOverlayModalReportSection } from "./ExportedOverlayModalReportSection";

const exportVerbiageMap: { [key in ReportType]: any } = {
  WP: wpVerbiage,
  SAR: sarVerbiage,
};

export const ExportedModalOverlayReportSection = ({ section }: Props) => {
  const { report } = useStore() ?? {};
  const entityType = section.entityType;

  const verbiage = exportVerbiageMap[report?.reportType as ReportType];

  const { modalOverlayTableHeaders } = verbiage;

  const headerLabels = Object.values(
    modalOverlayTableHeaders as Record<string, string>
  );

  return (
    <Box>
      <Table
        sx={sx.root}
        content={{
          headRow: headerLabels,
        }}
        data-testid="exportTable"
      >
        {report?.fieldData[entityType] &&
          renderModalOverlayTableBody(
            section,
            report?.reportType as ReportType,
            report?.fieldData[entityType]
          )}
      </Table>
      {(!report?.fieldData[entityType] ||
        report?.fieldData[entityType].length === 0) && (
        <Text sx={sx.emptyState}> No entities found.</Text>
      )}
    </Box>
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
  reportType: ReportType,
  entities: EntityShape[]
) {
  const entitySteps = getEntityStepFields(section.entitySteps ?? []);
  switch (reportType) {
    case ReportType.WP:
      return entities.map((entity, idx) => {
        return (
          <Box>
            <Tr key={idx}>
              <Td sx={sx.statusIcon}>
                <EntityStatusIcon
                  entity={entity}
                  isPdf={true}
                  entityStatus={entity.status}
                />
              </Td>
              <Td>
                <Heading sx={sx.heading} as="h3">
                  {`${idx + 1}. ${entity.initiative_name}` ?? "Not entered"}{" "}
                  <br />
                  <Text sx={sx.headingSubtitle}>
                    {entity.initiative_wpTopic[0].value}
                  </Text>
                </Heading>
              </Td>
            </Tr>
            {/* Depending on what the entity step type is, render its corresponding component */}
            {entitySteps.map((step, idx) => {
              return (
                <Box key={idx}>
                  {step[0] === EntityDetailsStepTypes.DEFINE_INITIATIVE ||
                  step[0] === EntityDetailsStepTypes.CLOSE_OUT_INFORMATION ? (
                    <ExportedEntityDetailsOverlaySection
                      section={section as ModalOverlayReportPageShape}
                      entityStep={step}
                    />
                  ) : (
                    step[0] === OverlayModalStepTypes.EVALUATION_PLAN ||
                    (step[0] === OverlayModalStepTypes.FUNDING_SOURCES && (
                      <ExportedOverlayModalReportSection
                        stepType={step[0]}
                        section={section as OverlayModalPageShape}
                      />
                    ))
                  )}
                </Box>
              );
            })}
          </Box>
        );
      });
    case ReportType.SAR:
      throw new Error(
        `The modal overlay table headers for report type '${reportType}' have not been implemented.`
      );
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
      color: "palette.base",
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
};
