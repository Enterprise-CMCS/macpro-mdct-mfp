import { printPdf, RequestOptions } from "utils";
import config from "config";

const mockPost = jest.fn();
jest.mock("utils/api/apiLib", () => ({
  post: (path: string, opts?: RequestOptions, apiName?: string) =>
    mockPost(path, opts, apiName),
}));

const testBody = "<noscript>removed</noscript><h1>Hello</h1><";
const originalURLConfig = config.DEV_API_URL;
window.open = jest.fn();

const path = "/print_pdf";
const options = {
  body: {
    encodedHtml:
      "PGh0bWw+PGhlYWQ+PC9oZWFkPjxib2R5PjxoMT5IZWxsbzwvaDE+Jmx0OzwvYm9keT48L2h0bWw+", //pragma: allowlist secret
  },
};
const apiName = "mfpDev";

describe("utils/print", () => {
  describe("printPdf()", () => {
    beforeEach(() => {
      global.URL.createObjectURL = jest.fn();
      jest.clearAllMocks();
    });

    afterAll(() => {
      config.DEV_API_URL = originalURLConfig;
      jest.resetAllMocks();
    });

    test("Call to the dev api if an env flag is provided", async () => {
      mockPost.mockImplementation(() =>
        Buffer.from(testBody).toString("base64")
      );
      config.DEV_API_URL = "test.com";
      document.body.innerHTML = testBody;
      await printPdf();

      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith(path, options, apiName);
      expect(window.open).toBeCalled();
    });

    test("Calls normal API env flag is not provided", async () => {
      mockPost.mockImplementation(() =>
        Buffer.from(testBody).toString("base64")
      );

      config.DEV_API_URL = null;
      await printPdf();

      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith(path, options, undefined);
      expect(window.open).toBeCalled();
    });
  });
});
