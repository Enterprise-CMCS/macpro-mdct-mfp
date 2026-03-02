import { useEffect, useState } from "react";
// components
import {
  Box,
  Button,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VisuallyHidden,
} from "@chakra-ui/react";
// types
import { AnyObject, FormField, FormTable, ReportShape } from "types";
// utils
import {
  formFieldFactory,
  hydrateFormFields,
  maskResponseData,
  parseCustomHtml,
  translate,
  updateRenderFields,
  updatedReportOnFieldChange,
} from "utils";
import { AddCalculationModal } from "components/modals/AddCalculationModal";

export const ModalCalculationTable = ({
  bodyRows = [],
  disabled,
  footRows,
  formData,
  headRows,
  id: tableId,
  options,
  order = 0,
  report = {} as ReportShape,
  verbiage,
}: Props) => {
  const [localReport, setLocalReport] = useState({} as ReportShape);

  const {
    isOpen: calculationModalIsOpen,
    onOpen: calculationModalOnOpenHandler,
    onClose: calculationModalOnCloseHandler,
  } = useDisclosure();
  const openModal = () => calculationModalOnOpenHandler();
  const calculationModal = (
    <AddCalculationModal
      modalDisclosure={{
        isOpen: calculationModalIsOpen,
        onClose: calculationModalOnCloseHandler,
      }}
      userIsAdmin={false}
    />
  );

  return (
    <Box sx={sx.box}>
      <Heading as="h2">{verbiage?.title}</Heading>

      <Button
        type="button"
        variant="primary"
        disabled={disabled}
        onClick={openModal}
      >
        {" "}
        {verbiage?.modal}
      </Button>
      {calculationModal}
      <Table id={tableId} sx={sx.table}>
        <TableCaption placement="top" sx={sx.captionBox}>
          <VisuallyHidden>{verbiage?.title}</VisuallyHidden>
        </TableCaption>
        <Thead>
          {headRows.map((row, rowIndex: number) => (
            <Tr key={`thead-row-${rowIndex}`}></Tr>
          ))}
        </Thead>
        <Tbody>
          {bodyRows.map((row, rowIndex: number) => (
            <Tr key={`tbody-row-${rowIndex}`}>
              {row.map((cell, cellIndex: number) => (
                <Td
                  id={`tbody-row-${rowIndex}-cell-${cellIndex}`}
                  key={`tbody-row-${rowIndex}-cell-${cellIndex}`}
                ></Td>
              ))}
            </Tr>
          ))}
        </Tbody>
        <Tfoot>
          {footRows.map((row, rowIndex: number) => (
            <Tr key={`tfoot-row-${rowIndex}`}>
              {row.map((cell, cellIndex: number) => (
                <Td
                  id={`tfoot-row-${rowIndex}-cell-${cellIndex}`}
                  key={`tfoot-row-${rowIndex}-cell-${cellIndex}`}
                ></Td>
              ))}
            </Tr>
          ))}
        </Tfoot>
      </Table>
    </Box>
  );
};

interface Props extends Omit<FormTable, "tableType"> {
  disabled: boolean;
  formData?: AnyObject;
  order?: number;
  report?: ReportShape;
}

interface DisplayCellOptions {
  cell: string | FormField;
  columnId?: string;
  rowId?: string;
}

const sx = {
  box: {
    h2: {
      fontSize: "2xl",
      marginBottom: "spacer1",
      marginTop: "spacer4",
      paddingBottom: 0,
    },
  },
  calculated: {
    display: "block",
    fontWeight: "bold",
    textAlign: "right",
  },
  error: {
    fontWeight: "bold",
    marginBottom: "spacer4",
    a: {
      color: "primary",
    },
  },
  text: {
    color: "gray_dark",
    fontWeight: "bold",
    marginBottom: "spacer3",
  },
  captionBox: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  table: {
    marginBottom: "spacer5",
    tbody: {
      "tr:nth-of-type(even)": {
        td: {
          backgroundColor: "gray_lightest_highlight",
        },
      },
      td: {
        border: "none",
        paddingBottom: "spacer1",
        paddingInlineEnd: "spacer2",
        paddingInlineStart: "spacer2",
        paddingTop: "spacer1",
      },
      label: {
        margin: 0,
      },
    },
    tfoot: {
      td: {
        backgroundColor: "gray_lighter",
        border: "none",
        fontWeight: "bold",
        paddingInlineEnd: "spacer2",
        paddingInlineStart: "spacer2",
      },
    },
    thead: {
      th: {
        backgroundColor: "primary_darkest",
        color: "white",
        fontSize: "lg",
        letterSpacing: "normal",
        lineHeight: "normal",
        paddingBottom: "spacer1",
        paddingInlineEnd: "spacer2",
        paddingInlineStart: "spacer2",
        paddingTop: "spacer1",
        textTransform: "none",
      },
    },
  },
};
