import { useContext, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
// components
import { Button, Image, Td, Tr } from "@chakra-ui/react";
import { DynamicTableContext } from "components";
// types
import {
  AnyObject,
  DynamicFieldShape,
  FormTableRows,
  InputChangeEvent,
} from "types";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";
import { updatedReportOnFieldChange } from "utils";

export const DynamicTableRows = ({
  disabled,
  dynamicRows,
  label,
  tableId,
}: Props) => {
  const {
    displayDynamicCell,
    focusedRowIndex,
    localDynamicRows,
    localReport,
    setLocalDynamicRows,
    // setLocalReport,
  } = useContext(DynamicTableContext);
  const prevLenRef = useRef<number>(0);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const form = useFormContext();
  const [displayValue, setDisplayValue] = useState({} as AnyObject);

  const onChangeHandler = (event: InputChangeEvent) => {
    const { id, name, value } = event.target;

    const updatedDisplayValue = {
      ...displayValue,
      [id]: value,
    };

    setDisplayValue(updatedDisplayValue);

    // TODO: Percentage
    const updatedReport = updatedReportOnFieldChange({
      id,
      name,
      percentage: 100,
      report: localReport,
      tableId,
      value,
    });
    console.log(updatedReport);
    // setLocalReport(updatedReport);

    const match = name.match(/^(.*)\[(\d+)\]$/);
    if (!match) return;

    const fieldKey = match[1];
    const current = form.getValues(fieldKey) ?? [];
    const idx = current.findIndex((r: DynamicFieldShape) => r.id === id);
    const updated =
      idx > -1
        ? current.map((r: DynamicFieldShape, i: number) =>
            i === idx ? { ...r, name: value } : r
          )
        : [...current, { id, name: value }];

    form.setValue(fieldKey, updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // TODO: Autosave
  const onBlurHandler = async () => {};

  const removeRow = (rowId: string) => {
    console.log(rowId);
  };

  // Register form fields, set values
  useEffect(() => {
    const values = form.getValues();

    for (const columns of dynamicRows) {
      for (const cell of columns) {
        if (typeof cell === "string") continue;

        const name = cell.id;

        if (!(name in values)) {
          form.register(name);
        }

        form.setValue(name, localReport.fieldData?.[name] || [], {
          shouldValidate: true,
        });
      }
    }
  }, [dynamicRows, localReport.fieldData]);

  // Add rows for saved dynamic values
  useEffect(() => {
    const rows = dynamicRows.flatMap((columns) => {
      let rowCount = 0;

      // Set rowCount to the largest set of values
      for (let i = 0; i < columns.length; i++) {
        const cell = columns[i];
        const id = typeof cell === "string" ? cell : cell.id;
        const len = localReport.fieldData?.[id]?.length || 0;
        if (len > rowCount) rowCount = len;
      }

      const updatedDisplayValue = {
        ...displayValue,
      };

      return Array.from({ length: rowCount }, (_, rowIndex) =>
        columns.map((cell) => {
          if (typeof cell === "string") return cell;

          const fieldObject = localReport.fieldData?.[cell.id]?.[rowIndex];
          if (!fieldObject) return cell;

          const dynamicRowId = fieldObject.id.split("-").slice(0, -1).join("-");

          updatedDisplayValue[fieldObject.id] = fieldObject.name;
          setDisplayValue(updatedDisplayValue);

          return {
            ...cell,
            props: {
              ...cell.props,
              dynamicId: fieldObject.id,
              dynamicRowId,
              hydrate: fieldObject.name,
            },
          };
        })
      );
    });

    setLocalDynamicRows(rows);
  }, [localReport.fieldData]);

  // Scroll to newly added row
  useEffect(() => {
    if (focusedRowIndex === null) return;

    rowRefs.current[focusedRowIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedRowIndex]);

  // Update form values with new row
  useEffect(() => {
    const prevLen = prevLenRef.current;
    const nextLen = localDynamicRows?.length || 0;

    if (nextLen > prevLen) {
      for (let rowIndex = prevLen; rowIndex < nextLen; rowIndex++) {
        const row = localDynamicRows[rowIndex];

        for (const cell of row) {
          if (typeof cell === "string") continue;

          const fieldKey = cell.id;
          const dynamicId = cell.props?.dynamicId;
          const nameValue =
            cell.props?.hydrate ?? cell.props?.initialValue ?? "";

          const current: any[] = form.getValues(fieldKey) ?? [];
          const updated = current.slice();

          // ensure length up to rowIndex
          while (updated.length < rowIndex) updated.push(undefined);

          updated[rowIndex] = {
            id: dynamicId ?? updated[rowIndex]?.id,
            name: nameValue,
          };

          form.setValue(fieldKey, updated, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
    }

    prevLenRef.current = nextLen;
  }, [localDynamicRows]);

  return (
    <>
      {localDynamicRows.map((row, rowIndex: number) => {
        const firstInput = row.find((cell) => typeof cell !== "string");
        const dynamicRowId = firstInput?.props?.dynamicRowId;

        return (
          <Tr
            key={`tbody-dynamicRow-${rowIndex}`}
            id={dynamicRowId}
            ref={(el) => {
              rowRefs.current[rowIndex] = el;
            }}
          >
            {row.map((cell, cellIndex: number) => (
              <Td
                id={`tbody-dynamicRow-${rowIndex}-cell-${cellIndex}`}
                key={`tbody-dynamicRow-${rowIndex}-cell-${cellIndex}`}
              >
                {displayDynamicCell({
                  cell,
                  columnId: `tbody-dynamicRow-${rowIndex}-cell-0`,
                  disabled,
                  label,
                  onBlurHandler,
                  onChangeHandler,
                  rowIndex,
                  rowId: `thead-row-0-cell-${cellIndex}`,
                  value: displayValue,
                })}
              </Td>
            ))}
            <Td>
              {!disabled && (
                <Button
                  onClick={() => removeRow(dynamicRowId)}
                  sx={sx.removeButton}
                  type="button"
                  variant={"unstyled"}
                >
                  <Image src={cancelIcon} alt={`Delete ${dynamicRowId}`} />
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
  dynamicRows: FormTableRows;
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
    minWidth: "1.5rem",
  },
};
