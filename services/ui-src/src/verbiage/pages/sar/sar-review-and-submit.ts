export default {
  print: {
    printPageUrl: "/sar/export",
    printButtonText: "Review PDF",
    downloadButtonText: "Download PDF",
  },
  review: {
    intro: {
      header: "Review & Submit",
      infoHeader: "Ready to Submit?",
      info: [
        {
          sectionHeader: "Ready to Submit?",
          type: "text",
          content:
            "Double check that everything in your MFP SAR submission is accurate. You will be able to make edits after submitting if you contact your CMS MFP Project Officer to unlock your report while it is in “Submitted” status.",
        },
        {
          sectionHeader: "Compliance review",
          type: "text",
          content:
            "Your Project Officer will review your report and may contact you and unlock your report for editing if there are corrections to be made.",
        },
      ],
    },
    table: {
      headRow: ["Section", "Status", ""],
    },
    modal: {
      structure: {
        heading: "Are you sure you want to submit MFP SAR?",
        actionButtonText: "Submit SAR",
        closeButtonText: "Cancel",
      },
      body: "You won’t be able to make edits after submitting unless you send a request to CMS to unlock your submission. After review, a CMS MFP Project Officer will contact you if there are corrections to be made and your report status will change to “In revision” in the MFP SAR dashboard.",
    },
    pageLink: {
      text: "Submit SAR",
    },
    adminInfo: {
      header: "Admin Review",
      list: [
        {
          content:
            "To allow a state or territory to make corrections or edits to a submission use “Unlock” to release the submission, then email the state contact and inform them. The status will change to “In revision”.",
        },
      ],
      modal: {
        unlockModal: {
          heading: "You unlocked this MFP SAR",
          actionButtonText: "Return to dashboard",
          body: "Email the state contact and let them know it requires edits.",
        },
      },
      unlockLink: {
        text: "Unlock",
      },
    },
  },
  submitted: {
    intro: {
      header: "Successfully Submitted",
      infoHeader: "Thank you",
      additionalInfoHeader: "What happens now?",
      additionalInfo: [
        {
          type: "text",
          as: "p",
          content:
            "Your dashboard will indicate the status of this MFP SAR as “Submitted” and it is now locked from editing.",
        },
        {
          type: "text",
          as: "p",
          content:
            "<b>Email your CMS MFP Project Officer to inform them you submitted the SAR and it is ready for their review.</b>",
        },
      ],
      list: [
        {
          content:
            "If CMS has questions or requested corrections your Project Officer will contact you.",
          children: [],
        },
        {
          content: "If CMS determines corrections are not needed:",
          children: [
            {
              content:
                "You can start updating your MFP Work Plan for the next reporting period.",
            },
          ],
        },
      ],
    },
  },
  alertBox: {
    title: "Your form is not ready for submission",
    description:
      "Some sections of the SAR submission have errors or are missing required responses. Ensure all required fields are completed with valid responses before submitting.",
  },
};
