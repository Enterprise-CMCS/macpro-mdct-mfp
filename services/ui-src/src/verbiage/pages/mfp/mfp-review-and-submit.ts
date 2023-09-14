export default {
  print: {
    printPageUrl: "/wp/export",
    printButtonText: "Review PDF",
    downloadButtonText: "Download PDF",
  },
  review: {
    intro: {
      header: "Review & Submit",
      infoHeader: "Ready to Submit?",
      info: [
        {
          type: "text",
          as: "span",
          content:
            "Double check that everything in your MFP submission is accurate. You won’t be able to make edits after submitting, unless you send a request to CMS to unlock your report. After compliance review, a CMS representative will contact you if there are corrections to be made and your report status will change to “In revision” in the MFP dashboard. Once you’ve reviewed your report, certify that it’s in compliance with XXXX.",
        },
      ],
    },
    table: {
      headRow: ["Section", "Status", ""],
    },
    modal: {
      structure: {
        heading: "Are you sure you want to submit Work Plan?",
        actionButtonText: "Submit WP",
        closeButtonText: "Cancel",
      },
      body: "You won’t be able to make edits after submitting unless you send a request to CMS to unlock your submission. After compliance review, a CMS representative will contact you if there are corrections to be made and your report status will change to “In revision” in the Work Plan dashboard.",
    },
    pageLink: {
      text: "Submit WP",
    },
  },
  submitted: {
    intro: {
      header: "Successfully Submitted",
      infoHeader: "Thank you",
      additionalInfoHeader: "What happens now?",
      additionalInfo:
        "No further action is needed at this point. CMS will contact you with questions or if corrections are needed. Your Work Plan dashboard will indicate the status of this report as “Submitted”.",
    },
  },
  alertBox: {
    title: "Your form is not ready for submission",
    description:
      "Some sections of the WP submission have errors or are missing required responses. Please ensure all required fields are completed with valid responses before submitting.",
  },
};
