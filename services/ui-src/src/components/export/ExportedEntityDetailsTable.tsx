import { ReactElement } from "react";
// components
import { Table } from "components";
import { ExportedEntityDetailsTableRow } from "./ExportedEntityDetailsTableRow";
// types
import {
  EntityShape,
  FieldChoice,
  FormField,
  ReportShape,
  FormLayoutElement,
  isFieldElement,
} from "types";
// utils
import { getReportVerbiage, useStore } from "utils";
// assets
import { sxSharedExportStyles } from "components/pages/Export/ExportedReportPage";

export const ExportedEntityDetailsTable = ({
  fields,
  entity,
  showHintText,
}: Props) => {
  const { report } = useStore() ?? {};
  const { exportVerbiage } = getReportVerbiage(report?.reportType);
  const { tableHeaders } = exportVerbiage;

  const entityType = entity.type;

  const threeColumnHeaderItems = [
    tableHeaders.indicator,
    tableHeaders.response,
  ];

  return (
    <Table
      data-testid="exportedEntityDetailsTable"
      sx={sx.table}
      content={{
        headRow: threeColumnHeaderItems,
      }}
    >
      {renderFieldTableBody(
        fields!,
        "modalOverlay",
        report,
        !!showHintText,
        entity.id,
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
  entityId: string,
  entityType: string
) => {
  const tableRows: ReactElement[] = [];
  // recursively renders field rows
  const renderFieldRow = (formField: FormField | FormLayoutElement) => {
    const validationType = isFieldElement(formField)
      ? // oxlint-disable-next-line no-nested-ternary
        typeof formField.validation === "object"
        ? formField.validation.type
        : formField.validation
      : "";

    const optional =
      validationType && validationType !== ""
        ? validationType.includes("Optional")
        : false;

    tableRows.push(
      <ExportedEntityDetailsTableRow
        key={formField.id}
        formField={formField}
        pageType={pageType}
        entityType={entityType}
        showHintText={showHintText}
        entityId={entityId}
        optional={optional}
      />
    );

    const entity = report?.fieldData[entityType].find(
      (e: EntityShape) => e.id === entityId
    );

    // Handle rendering nested children
    if (isFieldElement(formField) && formField.props?.choices) {
      formField.props.choices.forEach((choice: FieldChoice) => {
        //check to see if the choice exist in the field
        const isChoiceInField =
          entity[formField.id]?.length > 0 &&
          entity[formField.id]?.find((field: any) =>
            field.key?.endsWith(choice.id)
          );
        // If choice has been selected
        if (
          entity &&
          entity[formField.id] &&
          Array.isArray(entity[formField.id]) &&
          isChoiceInField &&
          choice.children
        ) {
          choice.children.forEach((c) => renderFieldRow(c));
        }
      });
    }
  };
  // map through form fields and call renderer
  formFields?.forEach((field: FormField | FormLayoutElement) => {
    renderFieldRow(field);
  });
  return tableRows;
};

export interface Props {
  fields: FormField[];
  entity: EntityShape;
  showHintText?: boolean;
}

const sx = {
  table: {
    ...sxSharedExportStyles.table,
    "th:nth-of-type(3)": {
      width: "15rem",
    },
  },
};
