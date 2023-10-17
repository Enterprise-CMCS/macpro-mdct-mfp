export default {
  WP: {
    adminDashboard: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "text",
          as: "header",
          content: "<strong>State or Territory User Instructions<strong>",
        },
        {
          type: "text",
          as: "span",
          content:
            "<br>This reporting tool is to be used by grantees for reporting of MFP program data. The information provided in this report will allow CMS to monitor grantee progress and identify challenges and improvement opportunities. For additional guidance on completing this form, please see the associated ",
        },
        {
          type: "externalLink",
          content: "User Guide",
          props: {
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)",
            target: "_blank",
            "aria-label": "User Guide (Link opens in new tab)",
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
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)",
            target: "_blank",
            "aria-label": "Help File (Link opens in new tab)",
          },
        },
        {
          type: "text",
          as: "span",
          content: ".<br>",
        },
        {
          type: "text",
          as: "span",
          content: "<br><strong>Admin Instructions</strong>",
        },
      ],
      list: [
        "To allow a state or territory to make corrections or edits to a submission use “Unlock” to release the submission. The status will change to “In revision”.",
        "Submission count is shown in the # column. Submissions started and submitted once have a count of 1. When a state resubmits a previous submission, the count increases by 1.",
        "To archive a submission and hide it from a state or territory’s dashboard, use “Archive”.",
        "To approve a submission, review the submission, go to the Review & Submit page and select “Approve”. The status will change to “Approved” and the content will be eligible for import into the SAR and will be available for view-only reference.",
      ],
      text: "",
    },
    stateUserDashboard: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "text",
          as: "span",
          content:
            "This reporting tool is to be used by grantees for reporting of MFP program data. The information provided in this report will allow CMS to monitor grantee progress and identify challenges and improvement opportunities. For additional guidance on completing this form, please see the associated ",
        },
        {
          type: "externalLink",
          content: "User Guide",
          props: {
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)",
            target: "_blank",
            "aria-label": "User Guide (Link opens in new tab)",
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
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)",
            target: "_blank",
            "aria-label": "Help File (Link opens in new tab)",
          },
        },
        {
          type: "text",
          as: "span",
          content: ".<br>",
        },
      ],
      list: [],
      text: "",
    },
    formIntro: {
      buttonLabel: "Instructions",
      intro: "",
      list: [],
      text: "",
    },
  },
  SAR: {
    adminDashboard: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "text",
          as: "header",
          content: "<strong>State or Territory User Instructions<strong>",
        },
        {
          type: "text",
          as: "span",
          content:
            "<br>This reporting tool is to be used by grantees for reporting of MFP program data. The information provided in this report will allow CMS to monitor grantee progress and identify challenges and improvement opportunities. For additional guidance on completing this form, please see the associated ",
        },
        {
          type: "externalLink",
          content: "User Guide",
          props: {
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)",
            target: "_blank",
            "aria-label": "User Guide (Link opens in new tab)",
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
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)",
            target: "_blank",
            "aria-label": "Help File (Link opens in new tab)",
          },
        },
        {
          type: "text",
          as: "span",
          content: ".<br>",
        },
        {
          type: "text",
          as: "span",
          content: "<br><strong>Admin Instructions</strong>",
        },
      ],
      list: [
        "To allow a state or territory to make corrections or edits to a submission use “Unlock” to release the submission. The status will change to “In revision”.",
        "Submission count is shown in the # column. Submissions started and submitted once have a count of 1. When a state resubmits a previous submission, the count increases by 1.",
        "To archive a submission and hide it from a state or territory’s dashboard, use “Archive”.",
        "To approve a submission, review the submission, go to the Review & Submit page and select “Approve”. The status will change to “Approved” and the content will be eligible for import into the SAR and will be available for view-only reference.",
      ],
      text: "",
    },
    stateUserDashboard: {
      buttonLabel: "Instructions",
      intro: [
        {
          type: "text",
          as: "span",
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
        {
          type: "text",
          as: "span",
          content: ".",
        },
      ],
      list: [],
      text: "",
    },
    formIntro: {
      buttonLabel: "Instructions",
      intro: "",
      list: [],
      text: "",
    },
  },
};
