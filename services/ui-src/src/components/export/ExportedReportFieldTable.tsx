import { ReactElement } from "react";
// components
import { Table } from "components";
// types, utils
import { useStore } from "utils";
import {
  FormField,
  StandardReportPageShape,
  DrawerReportPageShape,
  ReportShape,
  FormLayoutElement,
  isFieldElement,
  ReportType,
} from "types";
// verbiage
import verbiage from "verbiage/pages/wp/wp-export";
import { ExportedReportFieldRow } from "./ExportedReportFieldRow";

export const ExportedReportFieldTable = ({ section }: Props) => {
  const { report } = useStore() ?? {};
  const { tableHeaders } = verbiage;

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
        report,
        !hideHintText,
        entityType
      )}
    </Table>
  );
};

export const renderFieldTableBody = (
  formFields: (FormField | FormLayoutElement)[],
  pageType: string,
  report: ReportShape | undefined,
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
}

const sx = {
  root: {
    "@media print": {
      pageBreakInside: "avoid",
    },
    marginBottom: "1rem",
    "tr, th": {
      verticalAlign: "top",
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
    },
    th: {
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
};
