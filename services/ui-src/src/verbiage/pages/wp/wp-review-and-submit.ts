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
          sectionHeader: "Ready to Submit?",
          type: "text",
          content:
            "Double check that everything in your MFP Work Plan submission is accurate. You will only be able to make edits after submitting if you contact your CMS MFP Project Officer to unlock your report while it is still in “Submitted” status. ",
        },
        {
          sectionHeader: "Compliance review",
          type: "text",
          content:
            "Your Project Officer will review your report and may contact you and unlock your report for editing if there are corrections to be made. If there are no corrections to be made, your Project Officer will approve the report, its status will change to “Approved”, and it will no longer be editable because its information will be used in the MFP Semi-Annual Progress Report for the same reporting period.",
        },
      ],
    },
    adminInfo: {
      header: "Admin Review",
      list: [
        {
          content:
            "To allow a state or territory to make corrections or edits to a submission use “Unlock” to release the submission, then email the state or territory contact and inform them. The status will change to “In revision”.",
        },
        {
          content:
            "To approve a submission, review the submission and select “Approve”. The status will change to “Approved” and the content will be eligible for import into the MFP SAR. <strong>You will not be able to unapprove or unlock it.</strong>",
        },
      ],
      modal: {
        unlockModal: {
          heading: "You unlocked this Work Plan",
          actionButtonText: "Return to dashboard",
          body: "Email the state or territory contact and let them know it requires edits.",
        },
        approveModal: {
          heading: "Are you sure you want to approve this MFP Work Plan?",
          closeButtonText: "",
          actionButtonText: "",
          body: "This action can’t be undone. Once the MFP Work Plan is approved, the initiatives and benchmarks will be pulled into the MFP Semi-Annual Progress Report and this MFP Work Plan can’t be unlocked or edited.",
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
        heading: "Are you sure you want to submit MFP Work Plan?",
        actionButtonText: "Submit MFP Work Plan",
        closeButtonText: "Cancel",
      },
      body: "You won’t be able to make edits after submitting unless you contact your CMS MFP Project Officer to unlock your submission. ",
    },
    pageLink: {
      text: "Submit MFP Work Plan",
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
            "Your dashboard will indicate the status of this MFP Work Plan as “Submitted” and it is now locked from editing.",
        },
        {
          type: "text",
          as: "p",
          content:
            "<b>Email your CMS MFP Project Officer to inform them you submitted the MFP Work Plan and it is ready for their review.</b>",
        },
      ],
      list: [
        {
          content:
            "If CMS has questions or requested corrections: Your Project Officer will contact you.",
          children: [],
        },
        {
          content:
            "If CMS determines corrections are <i>not</i> needed: Your Project Officer will approve the MFP Work Plan and the status will change to “Approved”:",
          children: [
            {
              content:
                "This MFP Work Plan will be permanently locked from editing.",
            },
            {
              content:
                "You can now start the MFP Semi-Annual Progress Report for the same reporting period.",
            },
          ],
        },
      ],
    },
  },
  alertBox: {
    title: "Your form is not ready for submission",
    description:
      "Some sections of the MFP Work Plan submission have errors or are missing required responses. Ensure all required fields are completed with valid responses before submitting.",
  },
};
