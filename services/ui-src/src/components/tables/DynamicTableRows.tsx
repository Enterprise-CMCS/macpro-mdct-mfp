import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
// components
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { Box, Flex, Td, Text, Tr } from "@chakra-ui/react";
import { DynamicTableContext, NumberFieldDisplay } from "components";
// types
import {
  AnyObject,
  DynamicFieldShape,
  InputChangeEvent,
  ReportFormFieldType,
} from "types";
// utils
import { maskResponseData } from "utils";

export const DynamicTableRows = ({ label, tableId }: Props) => {
  const { focusedRowIndex, localDynamicRows, localReport } =
    useContext(DynamicTableContext);
  const [displayValues, setDisplayValues] = useState<DynamicFieldShape[]>([]);

  // Get form context and register field
  const name = `${tableId}-dynamicRows`;
  const form = useFormContext();
  form.register(name);

  const fieldErrorState: AnyObject | undefined =
    form?.formState?.errors?.[name];
  const errorMessage = fieldErrorState?.[name]?.message as ReactNode;

  // Make formfield dynamic array with config options
  // oxlint-disable-next-line no-unused-vars
  const { append } = useFieldArray({
    name,
    shouldUnregister: true,
  });

  // TODO: Set up
  const onChangeHandler = (event: InputChangeEvent) => {
    // oxlint-disable-next-line no-unused-vars
    const { name, id, value } = event.target;
    const newDisplayValues = [...displayValues];
    setDisplayValues(newDisplayValues);
  };

  const onBlurHandler = async () => {
    form.trigger(name);
  };

  const displayCell = ({ cell, rowIndex }: any) => {
    if (typeof cell === "string") return cell;

    const props = cell.props || {};
    const { dynamicId, hydrate, initialValue, mask, readOnly, subType } = props;

    // If input is readonly, display text instead of input
    if (readOnly) {
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

    if (subType === ReportFormFieldType.NUMBER) {
      return (
        <NumberFieldDisplay
          ariaLabelledby={""}
          disabled={false}
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

    return (
      <Flex>
        <Box sx={sx.label}>
          <label htmlFor={dynamicId}>{label}</label>
        </Box>
        <CmsdsTextField
          errorMessage={errorMessage}
          hint={undefined}
          id={dynamicId}
          label={undefined}
          name={`${cell.id}[${rowIndex}]`}
          onChange={onChangeHandler}
          onBlur={onBlurHandler}
          value={hydrate}
        />
      </Flex>
    );
  };

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // Scroll to row when newly added
  useEffect(() => {
    if (focusedRowIndex !== null) {
      rowRefs.current[focusedRowIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focusedRowIndex]);

  // On displayValue change, set field array value to match
  useEffect(() => {
    form.setValue(name, displayValues, { shouldValidate: true });
  }, displayValues);

  useEffect(() => {}, [localDynamicRows]);

  return (
    <>
      {localDynamicRows.map((row, rowIndex: number) => (
        <Tr
          key={`tbody-dynamicRow-${rowIndex}`}
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
  label?: string;
  tableId: string;
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
};
