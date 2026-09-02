import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  table: {
    th: {
      padding: "0.5rem 0",
      borderBottom: "1px solid",
      borderColor: "gray_light",
      color: "gray",
      fontWeight: "heading_sm_bold",
      textTransform: "none",
      letterSpacing: "normal",
      fontSize: "heading_sm",
    },
    td: {
      paddingLeft: 0,
      borderColor: "gray_light",
      textAlign: "left",
      "&:last-of-type": {
        paddingRight: 0,
      },
    },
  },
};

const calculationVariant = {
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
      "tr.totals-row": {
        td: {
          backgroundColor: "gray_lightest",
          border: "none",
          fontWeight: "bold",
          paddingInlineEnd: "spacer2",
          paddingInlineStart: "spacer2",
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

const variants = {
  calculation: calculationVariant,
};

const sizes = {};

const tableTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  sizes: sizes,
  variants: variants,
};

export default tableTheme;
