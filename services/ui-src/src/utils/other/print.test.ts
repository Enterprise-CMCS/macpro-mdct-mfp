import { printPdf, RequestOptions } from "utils";

const mockPost = jest.fn();
jest.mock("utils/api/apiLib", () => ({
  post: (path: string, opts?: RequestOptions) => mockPost(path, opts),
}));

const testBody = "<noscript>removed</noscript><h1>Hello</h1><";
window.open = jest.fn();

const path = "/print_pdf";
const options = {
  body: {
    encodedHtml:
      "PGh0bWw+PGhlYWQ+PC9oZWFkPjxib2R5PjxkaXYgaWQ9ImNoYWtyYS10b2FzdC1wb3J0YWwiPjx1bCBpZD0iY2hha3JhLXRvYXN0LW1hbmFnZXItdG9wIiBzdHlsZT0icG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiA1NTAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgbWFyZ2luOiAwcHggYXV0bzsiPjwvdWw+PHVsIGlkPSJjaGFrcmEtdG9hc3QtbWFuYWdlci10b3AtbGVmdCIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgei1pbmRleDogNTUwMDsgcG9pbnRlci1ldmVudHM6IG5vbmU7IGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47Ij48L3VsPjx1bCBpZD0iY2hha3JhLXRvYXN0LW1hbmFnZXItdG9wLXJpZ2h0IiBzdHlsZT0icG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiA1NTAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsiPjwvdWw+PHVsIGlkPSJjaGFrcmEtdG9hc3QtbWFuYWdlci1ib3R0b20tbGVmdCIgc3R5bGU9InBvc2l0aW9uOiBmaXhlZDsgei1pbmRleDogNTUwMDsgcG9pbnRlci1ldmVudHM6IG5vbmU7IGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47Ij48L3VsPjx1bCBpZD0iY2hha3JhLXRvYXN0LW1hbmFnZXItYm90dG9tIiBzdHlsZT0icG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiA1NTAwOyBwb2ludGVyLWV2ZW50czogbm9uZTsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgbWFyZ2luOiAwcHggYXV0bzsiPjwvdWw+PHVsIGlkPSJjaGFrcmEtdG9hc3QtbWFuYWdlci1ib3R0b20tcmlnaHQiIHN0eWxlPSJwb3NpdGlvbjogZml4ZWQ7IHotaW5kZXg6IDU1MDA7IHBvaW50ZXItZXZlbnRzOiBub25lOyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyI+PC91bD48L2Rpdj48L2JvZHk+PC9odG1sPg==", //pragma: allowlist secret
  },
};

describe("utils/print", () => {
  describe("printPdf()", () => {
    beforeEach(() => {
      global.URL.createObjectURL = jest.fn();
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    test("Calls normal API", async () => {
      mockPost.mockImplementation(() =>
        Buffer.from(testBody).toString("base64")
      );

      await printPdf();

      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockPost).toHaveBeenCalledWith(path, options);
      expect(window.open).toBeCalled();
    });
  });
});
