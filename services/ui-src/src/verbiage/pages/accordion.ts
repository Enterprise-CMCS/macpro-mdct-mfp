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
            "<br>This reporting tool is to be used to describe state or territory-specific initiatives. Start or amend a new MFP Work Plan below to capture these initiatives designed to increase the use and quality of home and community-based services. <br><br> <b> MFP Work Plan to Semi-Annual Progress Report Process</b> <br><br>You must create, submit, and get your MFP Work Plan approved by your CMS MFP Project Officer in order to start the corresponding MFP Semi-Annual Progress Report (SAR). Once the first MFP Work Plan is approved, for each sequential reporting period you must update it, which also requires CMS approval to start the corresponding SAR. This is to ensure that your tracked target populations, transition benchmarks, initiatives, evaluation plan objectives, and funding sources are all available to report on in the SAR. <br><br> You will be able to view all MFP Work Plans from previous periods. For additional guidance on completing this form, see the associated ",
        },
        {
          type: "externalLink",
          content: "User Guide",
          props: {
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)", // TO-DO: currently placeholder, replace when correct link available
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
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)", // TO-DO: currently placeholder, replace when correct link available
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
        "To view a state or territory's submission, use “View”.",
        "To allow a state or territory to make corrections or edits to a submission use “Unlock” to release the submission. The status will change to “In revision”.",
        "Submission count is shown in the # column. Submissions started and submitted once have a count of 1. When a state or territory resubmits a previous submission, the count increases by 1.",
        "To archive a submission and hide it from a state or territory’s dashboard, use “Archive”. To re-show the submission, use “Unarchive”.",
        "To review a submission, go to the “Review & Submit” page. You can review the submission by section, download a PDF, unlock, and find further instructions on approval and next steps.",
        "To approve a submission, go to “Review & Submit” page and select “Approve”. The status will change to “Approved” and the content will be eligible for import into the MFP Semi-Annual Progress Report and will be available for view-only reference.",
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
            "This reporting tool is to be used to describe state or territory-specific initiatives. Start or amend a new MFP Work Plan below to capture these initiatives designed to increase the use and quality of home and community-based services. <br><br> <strong> MFP Work Plan to Semi-Annual Progress Report Process </strong> <br><br> You must create, submit, and get your MFP Work Plan approved by your CMS MFP Project Officer in order to start the corresponding MFP Semi-Annual Progress Report (SAR). Once the first MFP Work Plan is approved, for each sequential reporting period you must update it, which also requires CMS approval to start the corresponding SAR. This is to ensure that your tracked target populations, transition benchmarks, initiatives, evaluation plan objectives, and funding sources are all available to report on in the SAR. <br> <br> You will be able to view all MFP Work Plans from previous periods. For additional guidance on completing this form, see the associated ",
        },
        {
          type: "externalLink",
          content: "User Guide",
          props: {
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)", // TO-DO: currently placeholder, replace when correct link available
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
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)", // TO-DO: currently placeholder, replace when correct link available
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
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)", // TO-DO: currently placeholder, replace when correct link available
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
            href: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-438/subpart-A/section-438.8#p-438.8(k)", // TO-DO: currently placeholder, replace when correct link available
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
        "To allow a state to make corrections or edits to a submission use “Unlock” to release the submission. The status will change to “In revision”.",
        "Submission count is shown in the # column. Submissions started and submitted once have a count of 1. When a state resubmits a previous submission, the count increases by 1.",
        "To archive a submission and hide it from a state’s dashboard, use “Archive”.",
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
            " Click “Add new MFP SAR submission” below to begin reporting for the current reporting period. For additional guidance on completing this form, see the associated ",
        },
        {
          type: "externalLink",
          content: "User Guide",
          props: {
            href: "https://www.google.com",
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
            href: "https://www.google.com",
            target: "_blank",
            "aria-label": "Help File (Link opens in new tab)",
          },
        },
        {
          type: "text",
          as: "span",
          content:
            ".If you are amending a previously submitted report, ask your CMS MFP Project Officer to unlock it. Then make the updates including the resubmission question at the top of the “General Information” section, resubmit, and notify your Project Officer it’s ready for their review.",
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
