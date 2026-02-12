import { useContext, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box, Flex, Image, Td, Text, Tr } from "@chakra-ui/react";
import { DynamicTableContext, NumberFieldDisplay } from "components";
// types
import { FormTableRows, InputChangeEvent, ReportFormFieldType } from "types";
// utils
import { maskResponseData } from "utils";
// assets
import cancelIcon from "assets/icons/icon_cancel_x_circle.png";

export const DynamicTableRows = ({ disabled, dynamicRows, label }: Props) => {
  const {
    focusedRowIndex,
    localDynamicRows,
    localReport,
    setLocalDynamicRows,
  } = useContext(DynamicTableContext);
  const prevLenRef = useRef<number>(0);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const form = useFormContext();

  const displayCell = ({ cell, rowId, rowIndex, columnId }: any) => {
    if (typeof cell === "string") return cell;

    const props = cell.props || {};
    const { dynamicId, hydrate, initialValue, mask, readOnly, subType } = props;

    // If input is readonly, display text instead of input
    if (readOnly) {
      const cellValue = localReport.fieldData?.[cell.id] || initialValue;

      const readOnlyValue = Array.isArray(cellValue)
        ? (cellValue?.[rowIndex]?.name ?? initialValue)
        : cellValue;

      return (
        <Text as="span" sx={sx.calculated}>
          {maskResponseData(readOnlyValue, mask)}
        </Text>
      );
    }

    const name = `${cell.id}[${rowIndex}]`;
    const errorMessage = "";

    if (subType === ReportFormFieldType.NUMBER) {
      return (
        <NumberFieldDisplay
          ariaLabelledby={`${rowId} ${columnId}`}
          disabled={disabled}
          errorMessage={errorMessage}
          hint={undefined}
          id={dynamicId}
          label={undefined}
          mask={mask}
          name={name}
          nested={false}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          placeholder={undefined}
          readOnly={readOnly}
          value={hydrate}
        />
      );
    }

    const dynamicLabel = `${dynamicId}_dynamic-label`;
    const ariaProps = {
      "aria-labelledby": `${dynamicLabel} ${columnId}`,
    };

    return (
      <Flex>
        <Box sx={sx.label}>
          <label htmlFor={dynamicId} id={dynamicLabel}>
            {label}
          </label>
        </Box>
        <CmsdsTextField
          disabled={disabled}
          errorMessage={errorMessage}
          hint={undefined}
          id={dynamicId}
          label={undefined}
          name={name}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          placeholder={undefined}
          readOnly={readOnly}
          value={hydrate}
          {...ariaProps}
        />
      </Flex>
    );
  };

  const onChangeHandler = (event: InputChangeEvent) => {
    const { name, value } = event.target;
    const match = name.match(/^(.*)\[(\d+)\]$/);
    if (!match) return;

    const fieldKey = match[1];
    const rowIndex = Number(match[2]);

    const current: any[] = form.getValues(fieldKey) ?? [];
    const updated = current.slice();

    const existing = updated[rowIndex] ?? {};
    updated[rowIndex] = { id: existing.id, name: value };

    form.setValue(fieldKey, updated, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  // TODO: Autosave
  const onBlurHandler = async () => {};

  // TODO
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

      return Array.from({ length: rowCount }, (_, rowIndex) =>
        columns.map((cell) => {
          if (typeof cell === "string") return cell;

          const fieldObject = localReport.fieldData?.[cell.id]?.[rowIndex];
          if (!fieldObject) return cell;

          const dynamicRowId = fieldObject.id.split("-").slice(0, -1).join("-");

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
    if (focusedRowIndex !== null) {
      rowRefs.current[focusedRowIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
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
                {displayCell({
                  cell,
                  columnId: `tbody-dynamicRow-${rowIndex}-cell-0`,
                  rowIndex,
                  rowId: `thead-row-0-cell-${cellIndex}`,
                })}
              </Td>
            ))}
            <Td>
              {!disabled && (
                <Box sx={sx.removeBox}>
                  <button type="button" onClick={() => removeRow(dynamicRowId)}>
                    <Image src={cancelIcon} alt={`Delete ${dynamicRowId}`} />
                  </button>
                </Box>
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
}

const sx = {
  calculated: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
  label: {
    marginRight: "spacer1",
    marginTop: "spacer2",
  },
  removeBox: {
    width: "1.5rem",
    height: "1.5rem",
  },
};
