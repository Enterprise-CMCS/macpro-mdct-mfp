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
    adminInfo: {
      header: "Admin Review",
      info: [
        {
          type: "text",
          as: "div",
          content:
            "<ul><li>To allow a state or territory to make corrections or edits to a submission use “Unlock” to release the submission, then email the state or territory contact and inform them. The status will change to “In revision”.</li><br/><li>To approve a submission, review the submission and select “Approve”. The status will change to “Approved” and the content will be eligible for import into the SAR. <strong>You will not be able to unapprove or unlock it.</strong></li></ul>",
        },
      ],
      modal: {
        unlockModal: {
          heading: "You unlocked this Work Plan",
          actionButtonText: "Return to dashboard",
          body: "Email the state or territory contact and let them know it requires edits.",
        },
        approveModal: {
          heading: "Are you sure you want to approve this Work Plan?",
          closeButtonText: "",
          actionButtonText: "",
          body: "This action can’t be undone. Once the Work Plan is approved, the initiatives and benchmarks will be pulled into the Semi-Annual Report and this Work Plan can’t be unlocked or edited.",
        },
      },
      unlockLink: {
        text: "Unlock",
      },
      submitLink: {
        text: "Approve",
      },
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
