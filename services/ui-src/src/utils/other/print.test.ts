import { printPdf } from "utils";
import config from "config";

const mockAmplifyApi = require("aws-amplify/api");

const testBody = "<noscript>removed</noscript><h1>Hello</h1><";
const originalURLConfig = config.DEV_API_URL;
window.open = jest.fn();

const expectedDevRequestObject = {
  apiName: "mfpDev",
  options: {
    body: {
      encodedHtml:
        "PGh0bWw+PGhlYWQ+PC9oZWFkPjxib2R5PjxoMT5IZWxsbzwvaDE+Jmx0OzwvYm9keT48L2h0bWw+", //pragma: allowlist secret
    },
    headers: { "x-api-key": undefined },
  },
  path: "/print_pdf",
};

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
      const apiSpy = jest.spyOn(mockAmplifyApi, "post");
      apiSpy.mockImplementation(() => ({
        response: Promise.resolve({
          body: {
            json: () => Promise.resolve(btoa(testBody)),
          },
        }),
      }));
      config.DEV_API_URL = "test.com";
      document.body.innerHTML = testBody;
      await printPdf();

      expect(apiSpy).toHaveBeenCalledTimes(1);
      expect(apiSpy).toHaveBeenCalledWith(expectedDevRequestObject);
      expect(window.open).toBeCalled();
    });

    test("Calls normal API env flag is not provided", async () => {
      const apiSpy = jest.spyOn(mockAmplifyApi, "post");
      apiSpy.mockImplementation(() => ({
        response: Promise.resolve({
          body: {
            json: () => Promise.resolve(btoa(testBody)),
          },
        }),
      }));
      config.DEV_API_URL = null;
      await printPdf();

      expect(apiSpy).toHaveBeenCalledTimes(1);
      expect(apiSpy).toHaveBeenCalledWith({
        ...expectedDevRequestObject,
        apiName: "mfp",
      });
      expect(window.open).toBeCalled();
    });
  });
});
