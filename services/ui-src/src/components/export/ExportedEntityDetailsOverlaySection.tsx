// components
import { Box, Heading, Text } from "@chakra-ui/react";
import { Fragment } from "react";
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
    <Box key={crypto.randomUUID()}>
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
          <Text sx={sx.tableIndex} fontSize={"body_sm"}>
            Closed by
          </Text>
          <Text fontSize={"body_sm"}>{entity.closedBy}</Text>
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
    case ReportType.WP:
      return getEntityTableComponents(
        report!,
        entity,
        entityStep,
        showHintText,
        closed,
        undefined,
        headingLevel
      );

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
  tableIndex: {
    color: "gray",
    fontWeight: "heading_md",
  },
  stepName: {
    fontSize: "body_lg",
    paddingBottom: "0.75rem",
    lineHeight: "body_lg",
  },
  stepHint: {
    fontSize: "body_md",
    fontWeight: "body_md",
    color: "gray_dark",
    lineHeight: "body_md",
  },
  sectionHeading: {
    padding: "1.5rem 0 0 0",
  },
};
