// components
import { Box, Heading } from "@chakra-ui/react";
import { Fragment } from "react";
import uuid from "react-uuid";
// types
import {
  EntityDetailsOverlayShape,
  EntityShape,
  FormField,
  FormLayoutElement,
  ModalOverlayReportPageShape,
  OverlayModalPageShape,
  ReportType,
} from "types";
// utils
import { useStore } from "utils";
import { assertExhaustive } from "utils/other/typing";
import { ExportedEntityDetailsTable } from "./ExportedEntityDetailsTable";

export const ExportedEntityDetailsOverlaySection = ({
  section,
  ...props
}: ExportedEntityDetailsOverlaySectionProps) => {
  const { report } = useStore() ?? {};
  const entityType = section.entityType;

  return (
    <Box sx={sx.sectionHeading} {...props}>
      {renderEntityDetailTables(
        report?.reportType as ReportType,
        report?.fieldData[entityType] ?? [],
        section
      )}
    </Box>
  );
};

export interface ExportedEntityDetailsOverlaySectionProps {
  section: ModalOverlayReportPageShape;
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

/**
 *
 * @param entity entity data
 * @param report report field data
 * @returns entity table and heading information for each section
 */
export function getEntityTableComponents(
  entity: EntityShape,
  entityStepFields: (string | FormField | FormLayoutElement)[][]
) {
  return entityStepFields?.map((step, idx) => {
    return (
      <Box key={uuid()}>
        <Box>
          <Heading as="h4">
            <Box sx={sx.stepName}>{step[0]}</Box>
            <Box sx={sx.stepHint}>{step[1]}</Box>
          </Heading>
        </Box>
        <Fragment key={`tableContainer-${idx}`}>
          <ExportedEntityDetailsTable
            key={`table-${idx}`}
            fields={step.slice(2) as FormField[]}
            entity={entity}
            showHintText={false}
          />
        </Fragment>
      </Box>
    );
  });
}

/**
 * Render entity detail table(s) conditionally based on report type.
 *
 * @param reportType report type of report
 * @param entities entities for entity type
 * @param section form json section
 * @param report report data
 * @returns array of exported entity table components
 */
export function renderEntityDetailTables(
  reportType: ReportType,
  entity: EntityShape,
  section: ModalOverlayReportPageShape
) {
  switch (reportType) {
    case ReportType.WP: {
      const entitySteps = getEntityStepFields(section.entitySteps ?? []);
      return getEntityTableComponents(entity, entitySteps);
    }
    case ReportType.SAR:
      throw new Error(
        `The entity detail table for report type '${reportType}' have not been implemented.`
      );
    default:
      assertExhaustive(reportType);
      throw new Error(
        `The entity detail table for report type '${reportType}' have not been implemented.`
      );
  }
}

const sx = {
  root: {
    "@media print": {
      pageBreakInside: "avoid",
    },
    marginBottom: "1rem",
    width: "100%",
    "tr, th": {
      verticalAlign: "bottom",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
    },
    thead: {
      //this will prevent generating a new header whenever the table spills over in another page
      display: "table-row-group",
    },
    td: {
      p: {
        lineHeight: "1.25rem",
      },
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
      verticalAlign: "top",
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
      "&:first-of-type": {
        paddingLeft: 0,
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
    margin: "0 auto",
    textAlign: "center",
    paddingBottom: "5rem",
  },
  stepName: {
    fontSize: "18px",
    paddingBottom: "0.75rem",
  },
  stepHint: {
    fontSize: "16px",
    fontWeight: "normal",
    color: "#5B616B",
  },
  entityHeading: {
    padding: "2rem 0 0.5rem 0",
    color: "palette.gray_medium",
    width: "100%",
    p: {
      color: "palette.base",
      "&:first-of-type": {
        marginTop: "1rem",
      },
    },
  },
  sectionHeading: {
    padding: "1.5rem 0 0 0",
  },
};
