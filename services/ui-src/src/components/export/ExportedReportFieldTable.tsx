// components
import { Box, Heading } from "@chakra-ui/react";
import { Table } from "components";
// types
import {
  FormField,
  StandardReportPageShape,
  DrawerReportPageShape,
  FormLayoutElement,
  ReportType,
  ReportStatus,
  HeadingLevel,
} from "types";
// utils
import { getReportVerbiage, useStore } from "utils";
// helpers
import {
  sx,
  renderFieldTableBody,
  renderCalculationTables,
} from "./exportFieldTableHelpers";

export const ExportedReportFieldTable = ({
  section,
  headingLevel = "h3",
}: Props) => {
  const { report } = useStore();

  const { exportVerbiage } = getReportVerbiage(report?.reportType);
  const { tableHeaders } = exportVerbiage;
  const pageType = section.pageType || "";
  const formFields =
    (pageType === "drawer"
      ? section.drawerForm?.fields
      : section.form?.fields) || [];

  const formHasOnlyDynamicFields = formFields.every(
    (field: FormField | FormLayoutElement) => field.type === "dynamic"
  );
  const twoColumnHeaderItems = [tableHeaders.indicator, tableHeaders.response];
  const threeColumnHeaderItems = [
    tableHeaders.indicator,
    tableHeaders.response,
  ];
  const headRowItems = formHasOnlyDynamicFields
    ? twoColumnHeaderItems
    : threeColumnHeaderItems;

  const reportType = report?.reportType as ReportType;
  const hideHintText = reportType === ReportType.WP;
  const entityType = section.entityType;

  const formId = section.form?.id;
  const fieldData = report?.fieldData || {};
  const percentageField = `fmap_${formId}Percentage`;
  const formPercentage = fieldData?.[percentageField] || 100;

  const calculationTables = section.form?.tables || [];

  // SAR "General Information" section layout is a unique case with multiple section headings within the same page
  if (reportType === ReportType.SAR && section.name === "General Information") {
    return renderGeneralInformation(
      exportVerbiage,
      formFields,
      pageType,
      entityType,
      headingLevel
    );
  }

  const nonTableFields = formFields.filter((f) => !f.forTableOnly);
  const currentLevel = parseInt(headingLevel.charAt(1), 10);
  const nextLevel = currentLevel + 1;
  const nextHeadingLevel = `h${nextLevel}`;

  return (
    <>
      {calculationTables.length > 0 &&
        renderCalculationTables(section, fieldData, formPercentage)}
      {nonTableFields.length > 0 && (
        <>
          {nonTableFields?.[0]?.props?.title && (
            <Heading as={nextHeadingLevel as HeadingLevel} sx={sx.subHeading}>
              {nonTableFields[0].props.title}
            </Heading>
          )}
          <Table
            sx={sx.table}
            className={formHasOnlyDynamicFields ? "two-column" : ""}
            content={{
              headRow: headRowItems,
            }}
            data-testid="exportTable"
          >
            {renderFieldTableBody(
              nonTableFields,
              pageType,
              !hideHintText,
              entityType
            )}
          </Table>
        </>
      )}
    </>
  );
};

export const renderGeneralInformation = (
  verbiage: any,
  formFields: (FormField | FormLayoutElement)[],
  pageType: string,
  entityType?: string,
  headingLevel?: HeadingLevel
) => {
  const { report } = useStore();

  // check if this was a resubmission
  const isNotResubmission =
    (report?.reportType === "SAR" && !report?.submissionCount) ||
    (report?.status === ReportStatus.SUBMITTED &&
      report?.submissionCount === 1 &&
      report?.locked);

  const headings = verbiage.generalInformationTable.headings;

  // get the range of form fields for a particular section
  const getSectionFormFields = (
    heading: number,
    formFields: (FormField | FormLayoutElement)[]
  ) => {
    let fields: (FormField | FormLayoutElement)[] = [];
    switch (heading) {
      case 0:
        fields = formFields.slice(0, 1);
        break;
      case 1:
        fields = formFields.slice(1, 6);
        break;
      case 2:
        fields = formFields.slice(6, 10);
        break;
      case 3:
        fields = formFields.slice(10, 13);
        break;
      case 4:
        fields = formFields.slice(13);
        break;
    }
    return fields;
  };

  return headings.map((heading: string, idx: number) => {
    return (
      <Box key={idx}>
        {!isNotResubmission ||
        (isNotResubmission && heading !== "Resubmission Information") ? (
          <>
            <Heading as={headingLevel} sx={sx.heading}>
              {heading}
            </Heading>
            <Table
              sx={sx.table}
              content={{
                headRow: [
                  verbiage.reportPage.sarDetailsTable.headers.indicator,
                  verbiage.reportPage.sarDetailsTable.headers.response,
                ],
              }}
            >
              {renderFieldTableBody(
                getSectionFormFields(idx, formFields),
                pageType,
                false,
                entityType
              )}
            </Table>
          </>
        ) : (
          ""
        )}
      </Box>
    );
  });
};

export interface Props {
  section: StandardReportPageShape | DrawerReportPageShape;
  showHintText?: boolean;
  headingLevel?: HeadingLevel;
}
