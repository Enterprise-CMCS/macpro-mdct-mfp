import { getRequestHeaders } from "./getRequestHeaders";
import { apiLib } from "utils";

export async function getSignedTemplateUrl(templateName: string) {
  const requestHeaders = await getRequestHeaders();
  const options = {
    headers: { ...requestHeaders },
  };

  return await apiLib.get(`/templates/${templateName}`, options);
}
