import { ReactElement } from "react";
// components
import { Box, Heading } from "@chakra-ui/react";
import { ExportedReportFieldRow, Table } from "components";
// types
import {
  FormField,
  StandardReportPageShape,
  DrawerReportPageShape,
  FormLayoutElement,
  isFieldElement,
  ReportType,
  FieldChoice,
  ReportStatus,
  HeadingLevel,
} from "types";
// utils
import { getReportVerbiage, useStore } from "utils";

export const ExportedReportFieldTable = ({
  section,
  headingLevel = "h3",
}: Props) => {
  const { report } = useStore() ?? {};

  const { exportVerbiage } = getReportVerbiage(report?.reportType);
  const { tableHeaders } = exportVerbiage;
  const pageType = section.pageType;
  const formFields =
    pageType === "drawer" ? section.drawerForm?.fields : section.form?.fields;

  const formHasOnlyDynamicFields = formFields?.every(
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

  return (
    // SAR "General Information" section layout is a unique case with multiple section headings within the same page
    section.name === "General Information" ? (
      renderGeneralInformation(
        exportVerbiage,
        formFields!,
        pageType!,
        entityType,
        headingLevel
      )
    ) : (
      <Table
        sx={sx.root}
        className={formHasOnlyDynamicFields ? "two-column" : ""}
        content={{
          headRow: headRowItems,
        }}
        data-testid="exportTable"
      >
        {renderFieldTableBody(
          formFields!,
          pageType!,
          !hideHintText,
          entityType
        )}
      </Table>
    )
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
      report?.submissionCount! === 1 &&
      report.locked);

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
        (isNotResubmission && heading != "Resubmission Information") ? (
          <>
            <Heading as={headingLevel} sx={sx.heading}>
              {heading}
            </Heading>
            <Table
              sx={sx.root}
              content={{
                headRow: [
                  verbiage.reportPage.sarDetailsTable.headers.indicator,
                  verbiage.reportPage.sarDetailsTable.headers.response,
                ],
              }}
            >
              {renderFieldTableBody(
                getSectionFormFields(idx, formFields!),
                pageType!,
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

export const renderFieldTableBody = (
  formFields: (FormField | FormLayoutElement)[],
  pageType: string,
  showHintText: boolean,
  entityType?: string
) => {
  const tableRows: ReactElement[] = [];
  // recursively renders field rows
  const renderFieldRow = (
    formField: FormField | FormLayoutElement,
    parentFieldCheckedChoiceIds?: string[]
  ) => {
    tableRows.push(
      <ExportedReportFieldRow
        key={formField.id}
        formField={formField}
        pageType={pageType}
        entityType={entityType}
        parentFieldCheckedChoiceIds={parentFieldCheckedChoiceIds}
        showHintText={showHintText}
      />
    );
    // for drawer pages, render nested child field if any entity has a checked parent choice
    if (pageType === "drawer") {
      return;
    }

    // Handle rendering nested children
    if (isFieldElement(formField) && formField.props?.choices) {
      formField.props.choices.forEach((choice: FieldChoice) => {
        if (choice.children) {
          choice.children.forEach((c) => renderFieldRow(c));
        }
      });
    }
  };

  // map through form fields and call renderer
  formFields?.map((field: FormField | FormLayoutElement) => {
    if (isFieldElement(field)) {
      renderFieldRow(field);
    }
  });
  return tableRows;
};

export interface Props {
  section: StandardReportPageShape | DrawerReportPageShape;
  showHintText?: boolean;
  headingLevel?: HeadingLevel;
}

const sx = {
  root: {
    "@media print": {
      pageBreakInside: "avoid",
    },
    margin: "2rem 0 2rem 0",
    "tr, th": {
      verticalAlign: "top",
      lineHeight: "base",
      borderBottom: "1px solid",
      borderColor: "gray_lighter",
      paddingLeft: "0",
    },
    thead: {
      //this will prevent generating a new header whenever the table spills over in another page
      display: "table-row-group",
    },
    td: {
      p: {
        lineHeight: "1.25rem",
      },
      padding: "0.75rem 0.5rem 0.75rem 0",
      borderStyle: "none",
      fontWeight: "normal",
      color: "base",
      ".shrink &": {
        padding: "0.375rem 0rem",
      },
      ".mobile &": {
        fontSize: "xs",
      },
    },
    th: {
      paddingBottom: "0.375rem",
      fontWeight: "bold",
      lineHeight: "lg",
      color: "gray",
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
  heading: {
    fontSize: "xl",
    fontWeight: "bold",
    color: "black",
  },
};
