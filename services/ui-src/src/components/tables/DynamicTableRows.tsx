import { useContext, useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Td, Text, Tr } from "@chakra-ui/react";
import { DynamicTableContext } from "components";
// types
import { InputChangeEvent } from "types";
// utils
import { maskResponseData } from "utils";

export const DynamicTableRows = ({ tableId }: Props) => {
  const { focusedRowIndex, localDynamicRows, localReport } =
    useContext(DynamicTableContext);

  const name = `${tableId}-dynamicRows`;
  const form = useFormContext();
  form.register(name);

  const { append, fields = [] } = useFieldArray({
    name,
    shouldUnregister: true,
  });

  // TODO: Set up
  const onChangeHandler = (event: InputChangeEvent) => {
    const { id, value } = event.target;
    form.setValue(id, value, { shouldValidate: true });
  };
  const onBlurHandler = () => {};

  const displayCell = ({ cell, rowIndex }: any) => {
    if (typeof cell === "string") return cell;

    // If input is readonly, display text instead of input
    if (cell.props?.readOnly) {
      const { initialValue, mask } = cell.props;
      const cellValue = localReport.fieldData?.[cell.id] ?? initialValue;

      const readOnlyValue = Array.isArray(cellValue)
        ? (cellValue?.[rowIndex]?.name ?? initialValue)
        : cellValue;

      return (
        <Text as="span" sx={sx.calculated}>
          {maskResponseData(readOnlyValue, mask)}
        </Text>
      );
    }

    // TODO: Return field with errors and masks
    return (
      <CmsdsTextField
        id={cell.props?.idOverride}
        name={`${cell.id}[${rowIndex}]`}
        hint={undefined}
        label={undefined}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        value={form.getValues(cell.id)}
      />
    );
  };

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  useEffect(() => {
    if (focusedRowIndex !== null) {
      rowRefs.current[focusedRowIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focusedRowIndex]);

  useEffect(() => {
    const existingNumberOfFields = fields.length;
    const newNumberOfFields = localDynamicRows.length;
    if (newNumberOfFields > existingNumberOfFields) {
      const newRow = localDynamicRows.pop();
      append(newRow);
    }
  }, [localDynamicRows, fields]);

  useEffect(() => {
    // TODO: Set values
    form.setValue(name, [], { shouldValidate: true });
  }, []);

  return (
    <>
      {localDynamicRows.map((row, rowIndex: number) => (
        <Tr
          key={`tbody-dynamicRow-${rowIndex}`}
          ref={(el) => (rowRefs.current[rowIndex] = el)}
        >
          {row.map((cell, cellIndex: number) => (
            <Td
              id={`tbody-dynamicRow-${rowIndex}-cell-${cellIndex}`}
              key={`tbody-dynamicRow-${rowIndex}-cell-${cellIndex}`}
            >
              {displayCell({
                cell,
                rowIndex,
              })}
            </Td>
          ))}
        </Tr>
      ))}
    </>
  );
};

interface Props {
  tableId: string;
}

const sx = {
  calculated: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
};
