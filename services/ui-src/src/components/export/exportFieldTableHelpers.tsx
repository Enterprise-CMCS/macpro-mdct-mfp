import { ReactElement } from "react";
import { Box, Heading } from "@chakra-ui/react";
import {
  FormField,
  FormLayoutElement,
  isFieldElement,
  FieldChoice,
  ReportFormFieldType,
} from "types";
import {
  useStore,
  parseCustomHtml,
  maskResponseData,
  getFieldParts,
} from "utils";
import { ExportedReportFieldRow, Table } from "components";
import { sxSharedExportStyles } from "components/pages/Export/ExportedReportPage";

export const renderServiceTableBody = (bodyRows: any, headRow: string[]) => {
  const { report } = useStore();
  return bodyRows.map((row: any) => {
    const rowData = headRow.map((header, index) => {
      const field = row[index];
      if (field?.id) {
        const fieldDataValue =
          report?.fieldData[field.id] ?? field.props.initialValue;
        const isBold =
          header === "Total State / Territory Share" ||
          header === "Total Federal Share";
        if (field.type === ReportFormFieldType.NUMBER) {
          const value = fieldDataValue
            ? maskResponseData(fieldDataValue, field.props.mask)
            : "Not answered";
          return isBold ? <span>{value}</span> : value;
        }
        const value = fieldDataValue ?? "Not answered";
        return isBold ? <span>{value}</span> : value;
      }
      return field;
    });
    return rowData;
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
  formFields.map((field: FormField | FormLayoutElement) => {
    if (isFieldElement(field)) {
      renderFieldRow(field);
    }
  });
  return tableRows;
};

export const renderCalculationTables = (
  section: any,
  fieldData: any,
  formPercentage: number
) => {
  const calculationTables = section.form?.tables || [];
  return calculationTables.map((table: any) => {
    const headRow = table.headRows[0];

    const dynamicData = fieldData[table.dynamicRowsTemplate?.id] || [];
    const dynamicBodyRows = dynamicData.map((item: any) => {
      return table.dynamicRowsTemplate.props.dynamicFields.map((f: any) => {
        const { fieldType } = getFieldParts(f.id);

        // This puts Misc Costs: or Other: before the value
        const dynamicLabel = f.props.dynamicLabel;
        let fieldValue = item[fieldType];

        // Number needs to be masked
        if (f.type === ReportFormFieldType.NUMBER) {
          fieldValue = maskResponseData(fieldValue, f.props.mask);
        }
        return dynamicLabel ? `${dynamicLabel} ${fieldValue}` : fieldValue;
      });
    });
    const bodyRows = renderServiceTableBody(
      [...table.bodyRows, ...dynamicBodyRows],
      headRow
    );

    const footerRow = renderServiceTableBody(table.footRows, headRow);

    let percentageValue;
    if (section.name === "Qualified HCBS") {
      percentageValue = fieldData?.["fmap_qualifiedHcbsPercentage"] || 100;
    } else if (section.name === "Demonstration Services") {
      percentageValue =
        fieldData?.["fmap_demonstrationServicesPercentage"] || 100;
    } else {
      percentageValue = formPercentage;
    }

    const percentageText = table.verbiage?.percentage || "[auto-populated]%";
    const displayPercentage = percentageText.replace(
      "{{percentage}}",
      `${percentageValue}%`
    );

    return (
      <Box key={table.id}>
        <Heading as="h3" sx={sx.subHeading}>
          {table.verbiage?.title}
        </Heading>
        {table.verbiage?.percentage && (
          <Box sx={sx.tableSubHeading}>
            {parseCustomHtml(displayPercentage)}
          </Box>
        )}
        <Table
          sx={{ ...sx.table, ...sx.serviceTable }}
          content={{
            headRow: headRow,
            bodyRows: bodyRows,
            footRow: footerRow,
          }}
          data-testid={`service-table-${table.id}`}
        />
      </Box>
    );
  });
};

export const sx = {
  table: sxSharedExportStyles.table,
  serviceTable: {
    "& th, & td": {
      paddingRight: "0.5rem",
    },
    "& th:not(:first-of-type), & td:not(:first-of-type)": {
      textAlign: "right",
    },
    "& thead tr:first-of-type": {
      borderBottom: "2px solid",
      borderColor: "gray.400",
    },
    "& tbody tr td span": {
      fontWeight: "bold",
    },
    "& tfoot tr th": {
      fontWeight: "bold",
      color: "black",
    },
    "& tfoot tr:first-of-type": {
      borderTop: "2px solid",
      borderColor: "gray.400",
    },
    "& tfoot tr:last-of-type": {
      borderBottom: "2px solid",
      borderColor: "gray.400",
    },
  },
  heading: {
    fontSize: "xl",
    fontWeight: "bold",
    color: "black",
  },
  subHeading: {
    fontSize: "xl",
    "& + table": {
      marginTop: "spacer2",
    },
  },
  tableSubHeading: {
    fontSize: "md",
    fontWeight: "bold",
    color: "gray_dark",
    marginTop: "spacer2",
  },
};
