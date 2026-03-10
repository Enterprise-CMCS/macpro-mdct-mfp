// components
import {
  Box,
  Button,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VisuallyHidden,
} from "@chakra-ui/react"; // types
import { FormTable, FormTableRow } from "types";
// utils
import { AddCalculationModal } from "components/modals/AddCalculationModal";

export const ModalCalculationTable = ({
  bodyRows,
  disabled,
  footRows,
  headRows,
  id: tableId,
  verbiage,
}: Props) => {
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

  const generateRows = (
    section: string,
    row: FormTableRow,
    rowIndex: number
  ) => {
    const Cell = section === "thead" ? Th : Td;

    return (
      <Tr key={`${section}-row-${rowIndex}`}>
        {row.map((cell, cellIndex: number) => {
          console.log("What the cell be", cell);
          return (
            <Cell
              id={`${section}-row-${rowIndex}-cell-${cellIndex}`}
              key={`${section}-row-${rowIndex}-cell-${cellIndex}`}
            >
              {cell.toString()}
            </Cell>
          );
        })}
      </Tr>
    );
  };

  return (
    <Box sx={sx.box}>
      <Heading as="h2">{verbiage?.title}</Heading>

      <Button
        type="button"
        variant="primary"
        disabled={disabled}
        onClick={openModal}
      >
        {verbiage?.modalButtonText}
      </Button>

      {calculationModal}

      <Table id={tableId} sx={sx.table}>
        <TableCaption placement="top" sx={sx.captionBox}>
          <VisuallyHidden>{verbiage?.title}</VisuallyHidden>
        </TableCaption>
        <Thead>
          {headRows.map((row, rowIndex: number) =>
            generateRows("thead", row, rowIndex)
          )}
        </Thead>
        <Tbody>
          {bodyRows.map((row, rowIndex: number) =>
            generateRows("tbody", row, rowIndex)
          )}
        </Tbody>
        <Tfoot>
          {footRows.map((row, rowIndex: number) =>
            generateRows("tfoot", row, rowIndex)
          )}
        </Tfoot>
      </Table>
    </Box>
  );
};

interface Props extends Omit<FormTable, "tableType"> {
  disabled: boolean;
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
  captionBox: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  table: {
    marginBottom: "spacer5",
    marginTop: "spacer1",
    width: "58rem",
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
