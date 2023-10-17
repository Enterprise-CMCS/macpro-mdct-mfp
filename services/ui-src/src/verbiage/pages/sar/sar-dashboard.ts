export default {
  intro: {
    header: "MFP Semi-Annual Progress Report (SAR)",
    body: [
      {
        type: "text",
        content:
          "This reporting tool is to be used by MFP recipients for semi-annual reporting of MFP program data. The information provided in this report will allow CMS to monitor recipients’ progress and identify challenges and opportunities for improvement. For additional guidance on completing this form, see the associated ",
      },
      {
        type: "externalLink",
        content: "User Guide",
        props: {
          href: "https://www.google.com",
          target: "_blank",
          "aria-label": "User Guide",
        },
      },
      {
        type: "text",
        as: "span",
        content: " and ",
      },
      {
        type: "externalLink",
        content: "Help File",
        props: {
          href: "https://www.google.com",
          target: "_blank",
          "aria-label": "Help File.",
        },
      },
    ],
  },
  body: {
    table: {
      caption: "WP Programs",
      headRow: [
        "",
        "Submission name",
        "Target populations",
        "Due date",
        "Last edited",
        "Edited by",
        "Status",
        "#",
        "",
      ],
    },
    empty: "Once you start a SAR submission, you can access it here.",
    callToAction: "Add new SAR submission",
  },
};
