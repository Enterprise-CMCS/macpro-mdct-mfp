export const accordionWithFmapLink = {
  buttonLabel: "Instructions",
  intro: [
    {
      type: "html",
      content:
        "Enter your total computable costs for each service during the reporting period. Of note,",
    },
    {
      type: "ul",
      props: {
        style: {
          paddingLeft: "1rem",
        },
      },
      children: [
        {
          type: "li",
          content: "If a service is used but you incurred no costs, enter ”0”.",
        },
        {
          type: "li",
          content: "If you did not use that service, leave the field blank.",
        },
      ],
    },
    {
      type: "p",
      content:
        "Previously this information was reported in Form A (Services) in the Excel version of the MFP Financial Reporting Form.",
    },
    {
      type: "p",
      content:
        "Your state or territory’s share for each service will be calculated using the Enhanced FMAP that you provided. If you have entered the wrong rate, return to the FMAP Percentages section of the report to revise it.",
    },
    {
      type: "html",
      content: "Unlike previous years, you ",
    },
    {
      type: "html",
      content: "<b>do not need</b>",
    },
    {
      type: "html",
      content:
        " to report prior period adjustments as separate line items. Incorporate all prior period adjustments directly into the total computable value for each specific service.",
    },
  ],
};

export const errorMessageWithFmapLink = [
  {
    type: "html",
    content:
      "This report is missing FMAP Percentages. In order to start entering data, ",
  },
  {
    type: "internalLink",
    content: "add FMAP Percentages",
    props: {
      to: "/expenditure/fmap-percentages",
      style: {
        textDecoration: "underline",
      },
    },
  },
  {
    type: "html",
    content: ".",
  },
];
