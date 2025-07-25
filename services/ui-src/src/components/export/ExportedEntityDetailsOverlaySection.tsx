// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import uuid from "react-uuid";
// components
import {
  ExportedEntityDetailsTable,
  ExportEntityDetailsTable,
} from "components";
// types
import {
  AnyObject,
  EntityShape,
  FormField,
  FormLayoutElement,
  HeadingLevel,
  ModalOverlayReportPageShape,
  ReportPageShapeBase,
  ReportShape,
  ReportType,
} from "types";
// utils
import { parseCustomHtml, updateRenderFields, useStore } from "utils";
import { assertExhaustive } from "utils/other/typing";

export const ExportedEntityDetailsOverlaySection = ({
  entity,
  entityStep,
  closed,
  showHintText,
  tableSection,
  headingLevel = "h4",
}: ExportedEntityDetailsOverlaySectionProps) => {
  const { report } = useStore() ?? {};

  return (
    <Box sx={sx.sectionHeading}>
      {report &&
        renderEntityDetailTables(
          report,
          entity ?? [],
          entityStep,
          showHintText,
          closed,
          tableSection,
          headingLevel
        )}
    </Box>
  );
};

export interface ExportedEntityDetailsOverlaySectionProps {
  section: ModalOverlayReportPageShape;
  entity: EntityShape;
  entityStep: (string | FormLayoutElement | FormField)[];
  showHintText?: boolean;
  tableSection?: ReportPageShapeBase;
  closed?: boolean;
  headingLevel?: HeadingLevel;
}

/**
 *
 * @param entity entity data
 * @param report report field data
 * @returns entity table and heading information for each section
 */
export function getEntityTableComponents(
  report: ReportShape,
  entity: EntityShape,
  entityStep: (string | FormLayoutElement | FormField)[],
  showHintText?: boolean,
  closed?: boolean,
  tableSection?: ReportPageShapeBase,
  headingLevel?: HeadingLevel
) {
  const reportType = report.reportType;
  const title = (entityStep as any)?.name || (entityStep![1] as string);
  const hint = (entityStep as any)?.hint || (entityStep![2] as string);

  let info: string = "";
  ((entityStep as any)?.verbiage?.intro?.info as [])?.forEach(
    (text: AnyObject) => {
      info += `${text?.content} `;
    }
  );
  const entityStepFields =
    (entityStep as any)?.form?.fields || (entityStep?.slice(3) as FormField[]);
  const updatedEntityStepFields = updateRenderFields(report, entityStepFields);
  return (
    <Box key={uuid()}>
      <Box>
        <Heading as={headingLevel} sx={sx.stepName}>
          {title}
        </Heading>
        <Box sx={sx.stepHint}>
          {reportType === ReportType.SAR ? parseCustomHtml(info) : hint}
        </Box>
      </Box>
      {closed && (
        <Box sx={sx.sectionHeading}>
          <Text sx={sx.tableIndex} fontSize={"sm"}>
            Closed by
          </Text>
          <Text fontSize={"sm"}>{entity.closedBy}</Text>
        </Box>
      )}
      {tableSection && (
        <ExportEntityDetailsTable
          report={report}
          section={tableSection}
          entity={entity}
        />
      )}
      <Fragment>
        <ExportedEntityDetailsTable
          fields={updatedEntityStepFields as FormField[]}
          entity={entity}
          showHintText={showHintText}
        />
      </Fragment>
    </Box>
  );
}

/**
 * Render entity detail table(s) conditionally based on report type.
 *
 * @param report report
 * @param entities entities for entity type
 * @param section form json section
 * @param report report data
 * @returns array of exported entity table components
 */
export function renderEntityDetailTables(
  report: ReportShape,
  entity: EntityShape,
  entityStep: (string | FormLayoutElement | FormField)[],
  showHintText?: boolean,
  closed?: boolean,
  tableSection?: ReportPageShapeBase,
  headingLevel?: HeadingLevel
) {
  const reportType: ReportType = report?.reportType as ReportType;
  switch (reportType) {
    case ReportType.WP: {
      return getEntityTableComponents(
        report!,
        entity,
        entityStep,
        showHintText,
        closed,
        undefined,
        headingLevel
      );
    }
    case ReportType.SAR:
      return getEntityTableComponents(
        report!,
        entity,
        entityStep,
        showHintText,
        closed,
        tableSection,
        headingLevel
      );
    default:
      assertExhaustive(reportType as never);
      throw new Error(
        `The entity detail table for report type '${reportType}' has not been implemented.`
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
    lineHeight: "130%",
  },
  stepHint: {
    fontSize: "16px",
    fontWeight: "normal",
    color: "palette.gray_medium_dark",
    lineHeight: "1.5rem",
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
