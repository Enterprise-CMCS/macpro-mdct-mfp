import { API } from "aws-amplify";
import { printPdf } from "utils";
import config from "config";

const testBody = "<noscript>removed</noscript><h1>Hello</h1><";
const mockPost = jest.fn().mockResolvedValue(btoa(testBody));
API.post = mockPost;
const originalURLConfig = config.DEV_API_URL;
window.open = jest.fn();
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
      config.DEV_API_URL = "test.com";
      document.body.innerHTML = testBody;
      await printPdf();

      expect(mockPost.mock.calls[0][0]).toEqual("mfpDev");
      expect(window.open).toBeCalled();
    });

    test("Calls normal API env flag is not provided", async () => {
      config.DEV_API_URL = null;
      await printPdf();

      expect(mockPost.mock.calls[0][0]).not.toEqual("mfpDev");
      expect(window.open).toBeCalled();
    });
  });
});
