import { useContext, useEffect, useRef, useState } from "react";
// components
import { Button, Flex, Image, Td, Text, Tr } from "@chakra-ui/react";
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
  emptyTableMessage,
  formData,
  formPercentage,
  hasDynamicModalForm,
  hasStaticRows,
  openModal = () => {},
  tableId,
  updatedFieldsCallback = () => [],
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
  const [showEmptyRows, setShowEmptyRows] = useState<boolean>(false);
  const emptyRowsColspan =
    (dynamicRowsTemplate.props?.dynamicFields.length || 0) + 1;

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

  useEffect(() => {
    const hasEmptyRows =
      !!emptyTableMessage && !hasStaticRows && localDynamicRows.length === 0;

    setShowEmptyRows(hasEmptyRows);
  }, [emptyTableMessage, hasStaticRows, localFieldData, localDynamicRows]);

  return (
    <>
      {showEmptyRows && (
        <Tr>
          <Td colSpan={emptyRowsColspan}>
            <Text sx={sx.emptyTableMessage}>{emptyTableMessage}</Text>
          </Td>
        </Tr>
      )}

      {localDynamicRows.map((row, rowIndex: number) => {
        const dynamicId = row.id;
        const name = row.name || dynamicId;

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
              <Flex>
                {!disabled && hasDynamicModalForm && (
                  <Button
                    aria-label={`Edit ${name}`}
                    onClick={() => openModal(dynamicId)}
                    sx={sx.editButton}
                    type="button"
                    variant={"unstyled"}
                  >
                    Edit
                  </Button>
                )}
                {!disabled && (
                  <Button
                    onClick={() =>
                      removeDynamicRow(
                        dynamicRowsTemplate.id,
                        dynamicId,
                        updatedFieldsCallback(dynamicId, localFieldData)
                      )
                    }
                    sx={sx.removeButton}
                    type="button"
                    variant={"unstyled"}
                  >
                    <Image src={cancelIcon} alt={`Delete ${name}`} />
                  </Button>
                )}
              </Flex>
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
  emptyTableMessage?: string;
  formData?: AnyObject;
  formPercentage: number;
  hasDynamicModalForm: boolean;
  hasStaticRows: boolean;
  openModal?: Function;
  label?: string;
  tableId: string;
  updatedFieldsCallback?: Function;
}

const sx = {
  calculated: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
  editButton: {
    color: "primary",
    marginRight: "spacer4",
    textDecoration: "underline",
  },
  emptyTableMessage: {
    fontWeight: "bold",
    paddingBottom: "spacer2",
    paddingTop: "spacer2",
    textAlign: "center",
  },
  removeButton: {
    minWidth: "0",
    width: "1.75rem",
  },
};
