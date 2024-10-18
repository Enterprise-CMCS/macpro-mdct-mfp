import { getRequestHeaders } from "utils";
import { post } from "aws-amplify/api";
import config from "config";

export const printPdf = async () => {
  const noscriptTag = document.querySelector("noscript");
  if (noscriptTag) {
    noscriptTag.remove();
  }
  const htmlString = document!
    .querySelector("html")!
    .outerHTML.replaceAll(
      '<link href="',
      `<link href="https://${window.location.host}`
    )
    .replaceAll(`’`, `'`)
    .replaceAll(`‘`, `'`)
    .replaceAll(`”`, `"`)
    .replaceAll(`“`, `"`)
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-");
  const base64String = btoa(unescape(encodeURIComponent(htmlString)));
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
    body: { encodedHtml: base64String },
  };
  const path = `/print_pdf`;
  let response;
  if (config.DEV_API_URL) {
    const { body } = await post({ apiName: "mfpDev", path, options }).response;
    response = (await body.json()) as string;
  } else {
    const { body } = await post({ apiName: "mfp", path, options }).response;
    response = (await body.json()) as string;
  }
  openPdf(response);
};

const openPdf = (basePdf: string) => {
  let byteCharacters = atob(basePdf);
  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  let byteArray = new Uint8Array(byteNumbers);
  let file = new Blob([byteArray], { type: "application/pdf;base64" });
  let fileURL = URL.createObjectURL(file);
  window.open(fileURL);
};
