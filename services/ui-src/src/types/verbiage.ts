// types
import { CustomHtmlElement } from "types";

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
