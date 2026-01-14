export const accordionWithFmapLink = {
  buttonLabel: "Instructions",
  intro: [
    {
      type: "html",
      content:
        "Enter your total computable costs for each service during the reporting period. If a service is used but you incurred no costs, enter “0”. For services that are not used, leave the field blank. Your state or territory’s share for each service will be calculated using the Enhanced FMAP that you provided. If you have entered the wrong rate, ",
    },
    {
      type: "internalLink",
      content: "return to the FMAP Percentages section",
      props: {
        to: "/expenditure/fmap-percentages",
        style: {
          textDecoration: "underline",
        },
      },
    },
    {
      type: "html",
      content: " of the report to re-enter it.",
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
