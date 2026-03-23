import { ReviewSubmitPageVerbiage } from "types";

const submitReviewVerbiage: ReviewSubmitPageVerbiage = {
  print: {
    printPageUrl: "/expenditure/export",
    printButtonText: "Review PDF",
    downloadButtonText: "Download PDF",
  },
  review: {
    intro: {
      header: "Review & Submit",
      infoHeader: "Ready to Submit?",
      info: [
        {
          sectionHeader: "Ready to submit?",
          content:
            "Double check that everything in your MFP Financial Reporting Form is accurate. You will be able to make edits after submitting if you contact your CMS Project Officer to unlock your report while it is in “Submitted” status.",
        },
        {
          sectionHeader: "Compliance Review",
          content:
            "Your CMS Project Officer will review your report, and may contact you and unlock your report for editing if there are corrections to be made.",
        },
      ],
    },
    table: {
      headRow: ["Section", "Status", ""],
    },
    modal: {
      structure: {
        heading: "Are you sure you want to submit?",
        actionButtonText: "Submit Report",
        closeButtonText: "Cancel",
      },
      body: "You won’t be able to make edits after submitting unless you send a request to CMS to unlock your submission. After review, your CMS Project Officer will contact you if there are corrections to be made, and your report status will change to “In revision” in the MFP Financial Reporting Form dashboard.",
    },
    pageLink: {
      text: "Submit Report",
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
          heading: "You unlocked this MFP Financial Reporting Form",
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
          type: "p",
          content:
            "Your dashboard will indicate the status of this report as “submitted” and it is now locked from editing.",
        },
        {
          type: "p",
          content:
            "Email your CMS Project Officer to inform them you submitted the MFP Financial Reporting Form and it is ready for their review.",
        },
      ],
    },
  },
  alertBox: {
    title: "Your form is not ready for submission",
    description:
      "Some sections of the MFP Financial Reporting Form have errors or have not been started.",
  },
};

export default submitReviewVerbiage;
