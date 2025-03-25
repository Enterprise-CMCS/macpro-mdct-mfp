import { printPdf, RequestOptions } from "utils";
import config from "config";

const mockPost = jest.fn();
jest.mock("utils/api/apiLib", () => ({
  post: (path: string, opts?: RequestOptions, apiName?: string) =>
    mockPost(path, opts, apiName),
}));

const testBody = "<noscript>removed</noscript><h1>Hello</h1><";
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
      jest.resetAllMocks();
    });

    test("Calls API", async () => {
      mockPost.mockImplementation(() =>
        Buffer.from(testBody).toString("base64")
      );

      await printPdf();

      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith(path, options, undefined);
      expect(window.open).toBeCalled();
    });
  });
});
