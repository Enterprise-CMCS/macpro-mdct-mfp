// types
import { CustomHtmlElement, ErrorVerbiage } from "types";

type ReviewAdminModal = {
  actionButtonText: string;
  body: string;
  closeButtonText?: string;
  heading: string;
};

type ReviewAdminInfo = {
  header: string;
  list: ReviewList;
  modal: {
    approveModal?: ReviewAdminModal;
    unlockModal: ReviewAdminModal;
  };
  submitLink?: {
    text: string;
  };
  unlockLink: {
    text: string;
  };
};

type ReviewIntro = {
  header: string;
  info: {
    content: string;
    sectionHeader: string;
  }[];
  infoHeader: string;
};

type ReviewList = {
  content: string | CustomHtmlElement;
  children?: {
    content: string | CustomHtmlElement;
  }[];
}[];

type ReviewModal = {
  body: string;
  structure: {
    actionButtonText: string;
    closeButtonText: string;
    heading: string;
  };
};

type SubmittedIntro = {
  additionalInfo: (string | CustomHtmlElement)[];
  additionalInfoHeader: string;
  header: string;
  infoHeader: string;
  list?: ReviewList;
};

export interface ReviewSubmitPageVerbiage {
  alertBox: {
    description: string;
    title: string;
  };
  print: {
    downloadButtonText: string;
    printButtonText: string;
    printPageUrl: string;
  };
  review: {
    adminInfo: ReviewAdminInfo;
    intro: ReviewIntro;
    modal: ReviewModal;
    pageLink: {
      text: string;
    };
    table: {
      headRow: string[];
    };
  };
  submitted: {
    intro: SubmittedIntro;
  };
}

type WorkPlanReportPageMetaTableHeaders = {
  dueDate: string;
  editedBy: string;
  lastEdited: string;
  status: string;
  submissionName: string;
};

type SarReportPageMetaTableHeaders = {
  reportName: string;
  reportingPeriod: string;
  reportingYear: string;
  status: string;
};

type FinancialReportPageMetaTableHeaders = {
  lastEdited: string;
  reportingPeriod: string;
  reportingYear: string;
  status: string;
};

type WorkPlanEmptyEntityMessage = {
  evaluationPlan: string;
  fundingSources: string;
  objectiveProgress: string;
};

type SarEmptyEntityMessage = {
  accessMeasures: string;
  qualityMeasures: string;
  sanctions: string;
};

type SarDashboardTitle = {
  objectiveProgress: string;
};

export interface ExportPageVerbiage {
  dashboardTitle?: WorkPlanEmptyEntityMessage | SarDashboardTitle;
  emptyEntityMessage?: WorkPlanEmptyEntityMessage | SarEmptyEntityMessage;
  generalInformationTable?: {
    headings: string[];
  };
  missingEntry: {
    noResponse: string;
    notApplicable: string;
  };
  metadata: {
    author: string;
    language: string;
    subject: string;
  };
  reportBanner: {
    intro: string;
    pdfButton: string;
  };
  reportPage: {
    combinedDataTable?: {
      subtitle: string;
      title: string;
    };
    heading: string;
    metadataTableHeaders:
      | WorkPlanReportPageMetaTableHeaders
      | SarReportPageMetaTableHeaders
      | FinancialReportPageMetaTableHeaders;
    sarDetailsTable?: {
      headers: {
        indicator: string;
        response: string;
      };
      indicators: string[];
    };
    reportTitle: string;
  };
  tableHeaders: {
    indicator: string;
    number?: string;
    response: string;
  };
}

export interface DashboardPageVerbiage {
  intro: {
    header: string;
    body: [];
  };
  body: {
    table: {
      caption: string;
      headRow: string[];
    };
    empty: string;
    callToAction: string;
    callToActionAdditions?: string;
  };
  modalUnlock: {
    actionButtonText: string;
    heading: string;
    subheading: string;
  };
  modalArchive?: {
    actionButtonText: string;
    body: string;
    closeButtonText: string;
    heading: string;
  };
  alertBanner?: {
    body: string;
    title: string;
  };
}

export interface AlertsVerbiage {
  initiative: ErrorVerbiage;
}
