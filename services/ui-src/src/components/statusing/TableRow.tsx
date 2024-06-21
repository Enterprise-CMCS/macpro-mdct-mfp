import { Td, Text, Tr } from "@chakra-ui/react";
import { ReportPageProgress, ReportType } from "types";
import { useBreakpoint, useStore } from "utils";
import { EditButton } from "./EditButton";
import { StatusIcon } from "./StatusIcon";

export const TableRow = ({ page, depth }: RowProps) => {
  const { isMobile } = useBreakpoint();
  const { name, path, children, status } = page;
  const { report, editable } = useStore();
  const buttonAriaLabel = editable ? `Edit  ${name}` : `View  ${name}`;
  return (
    <Tr>
      {depth == 1 ? (
        <Td sx={sx.parent} pl={!isMobile ? "1rem" : "0"}>
          <Text>{name}</Text>
          {isMobile && !children && EditButton(buttonAriaLabel, path, editable)}
        </Td>
      ) : (
        <Td sx={sx.subparent} pl={!isMobile ? `${1.25 * depth}rem` : "0"}>
          <Text>{name}</Text>
          {isMobile && !children && EditButton(buttonAriaLabel, path, editable)}
        </Td>
      )}
      <Td
        sx={sx.statusColumn}
        pt={
          depth == 1
            ? isMobile
              ? "1.5rem"
              : "0.5rem"
            : isMobile
            ? "1rem"
            : "0.5rem"
        }
      >
        <StatusIcon
          reportType={report?.reportType as ReportType}
          status={status}
        />
      </Td>
      {!isMobile && (
        <Td>
          {!children && EditButton(buttonAriaLabel, path, editable, true)}
        </Td>
      )}
    </Tr>
  );
};

interface RowProps {
  page: ReportPageProgress;
  depth: number;
}

const sx = {
  parent: {
    fontWeight: "bold",
    lineHeight: "1.125rem",
    fontSize: "sm",
    paddingTop: "1rem",
    paddingBottom: "1rem",
    ".mobile &": {
      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
    },
  },
  subparent: {
    paddingTop: "1rem",
    paddingBottom: "1rem",
    lineHeight: "1.125rem",
    fontSize: "sm",
  },
  statusColumn: {
    ".mobile &": {
      display: "flex",
      borderTop: 0,
      paddingLeft: 0,
    },
  },
};
