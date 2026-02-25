import { useContext, useEffect, useRef, useState } from "react";
// components
import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { DynamicTableContext } from "components";
// types
import {
  AnyObject,
  DynamicFieldShape,
  DynamicRowsTemplate,
  FormField,
} from "types";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";

export const DynamicTableRows = ({
  disabled,
  dynamicRowsTemplate,
  formData,
  formPercentage,
  tableId,
}: Props) => {
  const {
    displayDynamicCell,
    focusedRowIndex,
    localFieldData,
    removeDynamicRow,
  } = useContext(DynamicTableContext);
  // Refs to help keep track of rows
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const [localDynamicRows, setLocalDynamicRows] = useState<DynamicFieldShape[]>(
    []
  );

  // Add rows from fieldData
  useEffect(() => {
    const rows = localFieldData?.[dynamicRowsTemplate.id];
    if (rows) {
      setLocalDynamicRows((prev: DynamicFieldShape[]) => {
        const diff = rows.length - prev.length;
        // Initial load or rows changed
        if (prev.length === 0 || Math.abs(diff) === 1) return rows;
        return prev;
      });
    }
  }, [localFieldData]);

  // Scroll to newly added row
  useEffect(() => {
    if (focusedRowIndex === null) return;

    rowRefs.current[focusedRowIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedRowIndex, localDynamicRows]);

  return (
    <>
      {localDynamicRows.map((row, rowIndex: number) => {
        const dynamicId = row.id;

        return (
          <Tr
            key={dynamicId}
            id={dynamicId}
            ref={(el) => {
              rowRefs.current[rowIndex] = el;
            }}
          >
            {dynamicRowsTemplate.props?.dynamicFields.map(
              (field: FormField, cellIndex: number) => (
                <Td
                  id={`${dynamicId}-${rowIndex}-cell-${cellIndex}`}
                  key={`${dynamicId}-${rowIndex}-cell-${cellIndex}`}
                >
                  {displayDynamicCell({
                    cell: field,
                    columnId: `${dynamicId}-${rowIndex}-cell-0`,
                    disabled,
                    dynamicId,
                    formData,
                    percentage: formPercentage,
                    rowId: `thead-row-0-cell-${cellIndex}`,
                    rowIndex,
                    tableId,
                  })}
                </Td>
              )
            )}
            <Td>
              {!disabled && (
                <Button
                  onClick={() =>
                    removeDynamicRow(dynamicRowsTemplate.id, dynamicId)
                  }
                  sx={sx.removeButton}
                  type="button"
                  variant={"unstyled"}
                >
                  <Image src={cancelIcon} alt={`Delete ${dynamicId}`} />
                </Button>
              )}
            </Td>
          </Tr>
        );
      })}
    </>
  );
};

interface Props {
  disabled: boolean;
  dynamicRowsTemplate: DynamicRowsTemplate;
  formData?: AnyObject;
  formPercentage: number;
  label?: string;
  tableId: string;
}

const sx = {
  calculated: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
  removeButton: {
    minWidth: "0",
    width: "1.75rem",
  },
};
