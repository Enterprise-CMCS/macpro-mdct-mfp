import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Flex, Image, Td, Text, Tr } from "@chakra-ui/react";
import { Table } from "components";
// types
import { ReportPageProgress } from "types";
// utils
import { useBreakpoint } from "utils";
// verbiage

// assets
import editIcon from "assets/icons/icon_edit.png";
// import errorIcon from "assets/icons/icon_error_circle_bright.png";
import successIcon from "assets/icons/icon_check_circle.png";

export const StatusTable = () => {
  return (
    <Box sx={sx.container}>
      <Table content={{}} sx={sx.table}>
        <ChildRow page={{ name: "placeholder", path: "/" }} depth={1} />
      </Table>
    </Box>
  );
};

const ChildRow = ({ page, depth }: RowProps) => {
  const { name, children } = page;

  return (
    <Fragment key={name}>
      <TableRow page={page} depth={depth} />
      {children?.map((child) => (
        <ChildRow key={child.path} page={child} depth={depth + 1} />
      ))}
    </Fragment>
  );
};

export const StatusIcon = () => {
  return (
    <Flex sx={sx.status}>
      <Image src={successIcon} alt="Success notification" />
      <Text>Complete</Text>
    </Flex>
  );
};

const TableRow = ({ page, depth }: RowProps) => {
  const { isMobile } = useBreakpoint();
  const { name, path, children } = page;
  const buttonAriaLabel = `Edit  ${name}`;

  return (
    <Tr>
      {depth == 1 ? (
        <Td sx={sx.parent} pl={!isMobile ? "1rem" : "0"}>
          <Text>{name}</Text>
          {isMobile && !children && EditButton(buttonAriaLabel, path)}
        </Td>
      ) : (
        <Td sx={sx.subparent} pl={!isMobile ? `${1.25 * depth}rem` : "0"}>
          <Text>{name}</Text>
          {isMobile && !children && EditButton(buttonAriaLabel, path)}
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
        <StatusIcon />
      </Td>
      {!isMobile && (
        <Td>{!children && EditButton(buttonAriaLabel, path, true)}</Td>
      )}
    </Tr>
  );
};

const EditButton = (
  buttonAriaLabel: string,
  path: string,
  showIcon = false
) => {
  const navigate = useNavigate();
  return (
    <Button
      sx={sx.enterButton}
      variant="outline"
      aria-label={buttonAriaLabel}
      onClick={() => navigate(path, { state: { validateOnRender: true } })}
    >
      {showIcon && <Image src={editIcon} alt="Edit Program" />}
      Edit
    </Button>
  );
};

interface RowProps {
  page: ReportPageProgress;
  depth: number;
}

const sx = {
  container: {
    marginTop: "2rem",
    table: {
      td: {
        borderBottom: "none",
      },
    },
  },
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
  enterButton: {
    width: "4.25rem",
    height: "1.75rem",
    fontSize: "md",
    fontWeight: "normal",
    border: "1px solid",
    borderColor: "palette.gray_lighter",
    color: "palette.primary",
    ".mobile &": {
      width: "6rem",
      borderColor: "palette.primary",
      marginTop: ".5rem",
    },
    img: {
      width: "1rem",
      marginRight: "0.5rem",
    },
  },
  statusColumn: {
    ".mobile &": {
      display: "flex",
      borderTop: 0,
      paddingLeft: 0,
    },
  },
  status: {
    gap: "0.5rem",
    alignItems: "center",
    img: {
      width: "1.25rem",
    },
    margin: 0,
    padding: 0,
  },

  table: {
    marginBottom: "2.5rem",
    th: {
      padding: "1rem 0 1rem 1rem",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
      color: "palette.gray_medium",
      fontWeight: "600",
      fontSize: "sm",
      lineHeight: "1.125rem",
      ".mobile &": {
        padding: "0.75rem 0rem",
      },
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
      color: "palette.base",
      "&:last-child": {
        borderBottom: 0,
      },
    },
    td: {
      minWidth: "6rem",
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_lighter",
      textAlign: "left",
      color: "palette.base",
      "&:nth-of-type(1)": {
        width: "20rem",
      },
      "&:last-of-type": {
        textAlign: "right",
        paddingRight: ".5rem",
      },
    },
  },
};
