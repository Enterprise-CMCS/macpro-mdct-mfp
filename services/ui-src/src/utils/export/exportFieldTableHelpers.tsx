import { ReactElement } from "react";
// components
import { Box, Heading } from "@chakra-ui/react";
import { ExportedReportFieldRow, Table } from "components";
// types
import {
  FormField,
  FormLayoutElement,
  FieldChoice,
  ReportFormFieldType,
  PageTypes,
} from "types";
// utils
import {
  getFieldParts,
  isFieldElement,
  maskResponseData,
  parseCustomHtml,
  useStore,
} from "utils";
// assets
import { sxSharedExportStyles } from "components/pages/Export/ExportedReportPage";

export const renderServiceTableBody = (bodyRows: any, headRow: string[]) => {
  const { report } = useStore();
  return bodyRows.map((row: any) => {
    const rowData = headRow.map((header, index) => {
      const field = row[index];
      if (field?.id) {
        const fieldDataValue = report?.fieldData[field.id];
        const isBold =
          header === "Total State / Territory Share" ||
          header === "Total Federal Share";
        if (field.type === ReportFormFieldType.NUMBER && fieldDataValue) {
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
    if (pageType === PageTypes.DRAWER) {
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

export const renderEntityTables = (
  tables: any[],
  entity: any,
  headingLevel: string = "h4",
  isEmbedded: boolean = false
) => {
  return tables.map((table: any) => {
    const headRow = table.headRows[0];
    const styleAsOptionalHeadRows = table.styleAsOptionalHeadRows || [];

    const transformedHeadRow = headRow.map((header: string) => {
      if (styleAsOptionalHeadRows.includes(header)) {
        return `${header}<span style="font-weight: normal;"> (optional)</span>`;
      }
      return header;
    });

    const dynamicData = entity[table.dynamicRowsTemplate?.id] || [];

    const dynamicBodyRows = dynamicData.map((item: any) => {
      const rowValues: any[] = [];
      const fields = table.dynamicRowsTemplate.props.dynamicFields;

      let skipNext = false;
      fields.forEach((f: any, index: number) => {
        if (skipNext) {
          skipNext = false;
          return;
        }

        const { fieldType } = getFieldParts(f.id);
        let fieldValue = item[fieldType];

        // Special handling for baseline period - combine start and end dates
        if (fieldType === "baselineStartDate" && index + 1 < fields.length) {
          const nextField = fields[index + 1];
          const { fieldType: nextFieldType } = getFieldParts(nextField.id);

          if (nextFieldType === "baselineEndDate") {
            const startDate = item[fieldType] || "Not answered";
            const endDate = item[nextFieldType] || "Not answered";
            rowValues.push(`${startDate} - ${endDate}`);
            skipNext = true; // Skip the next field since we've already processed it
            return;
          }
        }

        if (Array.isArray(fieldValue) && fieldValue[0]?.value) {
          fieldValue = fieldValue[0].value;
        }

        // If the field value is "Other, specify", look for the nested field
        if (fieldValue === "Other, specify") {
          const otherTextValue = item["otherText"];
          if (otherTextValue) {
            fieldValue = otherTextValue;
          }
        }

        if (fieldType.endsWith("-otherText")) {
          const baseFieldType = fieldType.replace("-otherText", "");
          const baseField = item[baseFieldType];
          if (
            Array.isArray(baseField) &&
            baseField[0]?.value === "Other, specify"
          ) {
            fieldValue = item[fieldType];
          }
        }

        if (f.type === ReportFormFieldType.NUMBER) {
          fieldValue = maskResponseData(fieldValue, f.props.mask);
        }

        if (f.type === ReportFormFieldType.DATE && fieldValue) {
          rowValues.push(fieldValue);
          return;
        }

        rowValues.push(fieldValue || "Not answered");
      });

      return rowValues;
    });

    const bodyRows = dynamicBodyRows.length > 0 ? dynamicBodyRows : [];

    return (
      <Box
        key={table.id}
        sx={isEmbedded ? sx.embeddedEntityTable : sx.entityTable}
      >
        {table.verbiage?.sectionTitle && (
          <Heading as="h5" sx={sx.entityTableSectionHeading}>
            {table.verbiage.sectionTitle}
          </Heading>
        )}
        <Heading as={headingLevel as any} sx={sx.entityTableHeading}>
          {table.verbiage?.title}
        </Heading>
        {dynamicBodyRows.length === 0 && table.verbiage?.emptyTableMessage ? (
          <Box sx={sx.emptyTableMessage}>
            {table.verbiage.emptyTableMessage}
          </Box>
        ) : (
          <Table
            sx={
              isEmbedded
                ? {
                    ...sx.table,
                    ...sx.tableCommonStyle,
                    ...sx.embeddedTableStyle,
                  }
                : {
                    ...sx.table,
                    ...sx.tableCommonStyle,
                    ...sx.entityTableStyle,
                  }
            }
            content={{
              headRow: transformedHeadRow,
              bodyRows: bodyRows,
            }}
            data-testid={`entity-table-${table.id}`}
          />
        )}
      </Box>
    );
  });
};

export const sx = {
  table: sxSharedExportStyles.table,
  serviceTable: {
    "& th, & td": {
      paddingTop: "1rem",
      paddingBottom: "1rem",
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
  entityTable: {
    marginTop: "spacer4",
  },
  embeddedEntityTable: {
    marginTop: "spacer3",
    marginBottom: 0,
  },
  entityTableSectionHeading: {
    fontSize: "lg",
    fontWeight: "bold",
    marginBottom: "spacer3",
  },
  entityTableHeading: {
    fontSize: "md",
    fontWeight: "bold",
    marginBottom: "spacer2",
  },
  tableCommonStyle: {
    "& th, & td": {
      paddingX: "spacer1",
      paddingY: "spacer1",
      fontSize: "sm",
    },
    "& thead tr": {
      backgroundColor: "gray.50",
    },
  },
  entityTableStyle: {
    thead: {
      "tr:first-of-type": {
        borderBottom: "2px solid #383838",
        borderColor: "#383838",
        th: {
          borderBottom: "2px solid #383838",
          borderColor: "#383838",
          color: "gray_dark",
          verticalAlign: "bottom",
        },
      },
    },
  },
  embeddedTableStyle: {
    marginTop: 0,
    marginBottom: 0,
    thead: {
      "tr:first-of-type": {
        borderBottom: "2px solid #383838",
        borderColor: "#383838",
        th: {
          borderBottom: "2px solid #383838",
          borderColor: "#383838",
          color: "gray_dark",
          verticalAlign: "bottom",
        },
      },
    },
  },
  emptyTableMessage: {
    padding: "spacer3",
    fontStyle: "italic",
    color: "gray_dark",
  },
};
