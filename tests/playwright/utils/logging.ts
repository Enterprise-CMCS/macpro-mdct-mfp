/* eslint-disable no-console */
import { Route } from "@playwright/test";

export async function logRequestsAndResponses(source: string, route: Route) {
  const request = route.request();
  const url = request.url();
  const method = request.method();
  const headers = request.headers();
  const postData = request.postData();

  console.log(`[${source}] Intercepted request: ${method} ${url}`);
  console.log(`[${source}] Headers: ${JSON.stringify(headers, null, 2)}`);
  if (postData) {
    console.log(`[${source}] Request Body: ${postData}`);
  }

  await route.continue();

  try {
    const response = await request.response();
    if (response) {
      const status = response.status();
      const responseHeaders = response.headers();
      const responseBody = await response.text();

      console.log(
        `[${source}] Response for ${method} ${url} - Status: ${status}`,
      );
      console.log(
        `[${source}] Response Headers: ${JSON.stringify(
          responseHeaders,
          null,
          2,
        )}`,
      );
      console.log(`[${source}] Response Body: ${responseBody}`);
    } else {
      console.log(`[${source}] No response received for ${method} ${url}`);
    }
  } catch (error) {
    console.log(`[${source}] Error fetching response for ${url}:`, error);
  }
}
