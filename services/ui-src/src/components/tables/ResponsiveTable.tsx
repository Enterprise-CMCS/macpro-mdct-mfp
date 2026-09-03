import {
  Hide,
  Show,
  Table,
  TableCaption,
  Tbody,
  Tfoot,
  Th,
  Thead,
  Td,
  Box,
  Tr,
  VisuallyHidden,
  VStack,
  Flex,
} from "@chakra-ui/react";

const rightAlign = ["Total State / Territory Share", "Total Federal Share"];

const HorizontalTable = (
  id: string,
  title: string | undefined,
  headers: string[][],
  rows: any[],
  foot: string[][],
) => {
  return (
    <Table id={id} variant="calculation">
      <TableCaption placement="top">
        <VisuallyHidden>{title}</VisuallyHidden>
      </TableCaption>
      <Thead>
        {headers.map((row) => (
          <Tr>
            {row.map((col) => (
              <Th textAlign={rightAlign.includes(col) ? "right" : "left"}>
                {col}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {rows.map((row: any[]) => (
          <Tr>
            {"length" in row ? (
              row.map((col) => <Td>{col}</Td>)
            ) : (
              <Td colSpan={headers[0].length}>{row}</Td>
            )}
          </Tr>
        ))}
      </Tbody>
      <Tfoot>
        {foot.map((row) => (
          <Tr>
            {row.map((col) => (
              <Td>{col}</Td>
            ))}
          </Tr>
        ))}
      </Tfoot>
    </Table>
  );
};

const buildColumns = (
  label: string,
  value: string,
  index: number,
  style: { background: string; color: string },
) => {
  if (index == 0) {
    return (
      <Box
        background={style.background}
        fontWeight="bold"
        color={style.color}
        width="100%"
        padding=".75rem"
      >
        {value}
      </Box>
    );
  }
  return (
    <Flex
      width="100%"
      justifyContent="space-evenly"
      padding=".75rem"
      flexFlow={{ base: "column", sm: "row" }}
      textAlign="left"
    >
      <Box flex="1 1 50%" alignSelf={{ base: "start", sm: "center" }}>
        {label}
      </Box>
      <Box alignSelf={{ base: "start", sm: "center" }}>{value}</Box>
    </Flex>
  );
};

const VerticalTable = (header: string[][], rows: any[], foot: string[][]) => {
  return (
    <VStack sx={sx.mobile}>
      {rows.map((row) =>
        "length" in row
          ? row.map((col: any, index: number) => {
              return buildColumns(header[0][index], col, index, {
                background: "primary_darkest",
                color: "white",
              });
            })
          : row,
      )}
      {foot.map((row) =>
        header[0].map((col: string, index: number) => {
          return buildColumns(col, row[index], index, {
            background: "gray_lighter",
            color: "base",
          });
        }),
      )}
    </VStack>
  );
};

export const ResponsiveTable = (data: {
  id: string;
  title: string | undefined;
  headers: any[];
  rows: any[];
  dynamicRows: any[] | undefined;
  foot: any[];
}) => {
  const { id, title, headers, rows, dynamicRows, foot } = data;
  const mergedRows = [...rows, ...(dynamicRows ?? [])];

  return (
    <>
      <Hide below="lg" key="table">
        {HorizontalTable(id, title, headers, mergedRows, foot)}
      </Hide>
      <Show below="lg" key="table-mobile">
        {VerticalTable(headers, mergedRows, foot)}
      </Show>
    </>
  );
};

export const sx = {
  mobile: {
    textAlign: "left",
    width: "100%",
    maxWidth: "580px",

    label: {
      margin: 0,
    },
  },
};
