import { post } from "utils";

export const printPdf = async () => {
  const noscriptTag = document.querySelector("noscript");
  if (noscriptTag) {
    noscriptTag.remove();
  }
  const path = "/print_pdf";

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

  const base64String = Buffer.from(htmlString, "utf-8").toString("base64");
  const options = {
    body: { encodedHtml: base64String },
  };
  const response = await post<string>(path, options);
  openPdf(response);
};

const openPdf = (basePdf: string) => {
  const byteArray = new Uint8Array(Buffer.from(basePdf, "base64"));
  const file = new Blob([byteArray], { type: "application/pdf" });
  const fileURL = URL.createObjectURL(file);
  window.open(fileURL);
};
