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
      ":last-of-type": {
        textAlign: "center",
      },
    },
    td: {
      borderColor: "gray_light",
      textAlign: "left",
      "&:last-of-type": {
        paddingRight: 0,
      },
      ":first-of-type": {
        img: {
          minHeight: "22px",
          minWidth: "22px",
        },
      },
      ":last-of-type": {
        img: {
          minHeight: "24px",
          minWidth: "24px",
        },
        div: {
          display: "flex",
          justifyContent: "center",
        },
      },
    },
    ".ds-c-inline-error": {
      color: "error_dark !important",
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

const dashboardVariant = {
  table: {
    tr: {
      paddingLeft: 0,
      borderBottom: "1px solid",
      borderColor: "gray_light",
    },
    th: {
      ":not(:last-child)": {
        padding: "8px 16px 8px 0px",
      },
    },
    tbody: {
      th: {
        color: "base",
        fontSize: "16px",
      },
      "th, td": {
        padding: "8px 16px 8px 0px",
      },
    },
  },
};

const initiativeVariant = {
  table: {
    borderBottom: "1px solid",
    tr: {
      paddingLeft: 0,
      borderBottom: "1px solid",
      borderColor: "gray_light",
    },
    td: {
      ":last-of-type": {
        div: {
          display: "grid",
          gridTemplateColumns: "120px 80px 24px",
          justifyContent: "end",
          ".editAction": {
            gridColumn: "2",
          },
        },
      },
    },
    th: {
      ":last-of-type": {
        textAlign: "right",
        paddingRight: "calc(24px + 1.75rem)",
      },
    },
  },
};

const variants = {
  calculation: calculationVariant,
  initiative: initiativeVariant,
  dashboard: dashboardVariant,
};

const sizes = {};

const tableTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  sizes: sizes,
  variants: variants,
};

export default tableTheme;
