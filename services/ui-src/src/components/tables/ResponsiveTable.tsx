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
import { JSX } from "react";

const HorizontalTable = (
  id: string,
  title: string | undefined,
  headers: string[][],
  rows: any[],
  dynamicRows: JSX.Element | undefined,
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
              <Th>{col}</Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {rows.map((row: any[]) => (
          <Tr>
            {row.map((col) => (
              <Td>{col}</Td>
            ))}
          </Tr>
        ))}
        {dynamicRows}
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

const VerticalTable = (
  header: string[][],
  rows: any[],
  dynamicRows: JSX.Element | undefined,
  foot: string[][],
) => {
  return (
    <VStack sx={sx.mobile}>
      {rows.map((row) =>
        row.map((col: any, index: number) => {
          if (index == 0) {
            return (
              <Box
                background="primary_darkest"
                fontWeight="bold"
                color="white"
                width="100%"
                padding=".75rem"
              >
                {col}
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
                {header[0][index]}
              </Box>
              <Box alignSelf={{ base: "start", sm: "center" }}>{col}</Box>
            </Flex>
          );
        }),
      )}
      {foot.map((row) =>
        header[0].map((col: string, index: number) => {
          if (index === 0)
            return (
              <Box
                background="gray_lighter"
                fontWeight="bold"
                width="100%"
                padding=".75rem"
              >
                {row[index]}
              </Box>
            );
          else
            return (
              <Flex
                width="100%"
                justifyContent="space-evenly"
                padding=".75rem"
                flexFlow={{ base: "column", sm: "row" }}
                textAlign="left"
              >
                <Box flex="1 1 50%" alignSelf={{ base: "start", sm: "center" }}>
                  {col}
                </Box>
                <Box alignSelf={{ base: "start", sm: "center" }}>
                  {row[index]}
                </Box>
              </Flex>
            );
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
  dynamicRows: JSX.Element | undefined;
  foot: any[];
}) => {
  const { id, title, headers, rows, dynamicRows, foot } = data;

  return (
    <>
      <Hide below="lg" key="table">
        {HorizontalTable(id, title, headers, rows, dynamicRows, foot)}
      </Hide>
      <Show below="lg" key="table-mobile">
        {VerticalTable(headers, rows, dynamicRows, foot)}
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
