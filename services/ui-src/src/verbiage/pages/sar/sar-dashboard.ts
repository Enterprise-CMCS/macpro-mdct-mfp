export default {
  intro: {
    header: "State MFP Program Work Plan",
    body: [
      {
        type: "text",
        content:
          "This reporting tool is to be used by grantees for reporting of MFP program data. The information provided in this report will allow CMS to monitor grantee progress and identify challenges and improvement opportunities. For additional guidance on completing this form, please see the associated ",
      },

      {
        type: "externalLink",
        content: "User Guide",
        props: {
          href: "https://www.google.com",
          target: "_blank",
          "aria-label": "User Guide (link opens in new tab).",
        },
      },
      {
        type: "externalLink",
        content: "Help File",
        props: {
          href: "https://www.google.com",
          target: "_blank",
          "aria-label": "Help File (link opens in new tab).",
        },
      },
    ],
  },
  body: {
    table: {
      caption: "WP Programs",
      headRow: [
        "",
        "Program name",
        "Due date",
        "Last edited",
        "Edited by",
        "Status",
        "",
      ],
    },
    empty:
      "For this report, a managed care program is defined by a set of distinct benefits and eligibility criteria articulated in a contract between states and the state’s managed care plans",
    callToAction: "Add managed care program",
  },
};
