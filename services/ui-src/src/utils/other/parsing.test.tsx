import { render, screen } from "@testing-library/react";
import DOMPurify from "dompurify";
import { CustomHtmlElement } from "types";
// utils
import {
  labelTextWithOptional,
  parseAllowedHtml,
  parseCustomHtml,
} from "utils";

jest.mock("dompurify", () => ({
  sanitize: jest.fn((el) => el),
}));

const mockHtmlString = "<span><em>whatever</em></span>";
const testElementArray = [
  {
    type: "text",
    as: "span",
    content: "Mock text ",
  },
  {
    type: "externalLink",
    content: "with link",
    props: {
      href: "mockURL.com",
    },
  },
  {
    type: "text",
    as: "span",
    content: ".",
  },
  {
    type: "p",
    content: "Paragraph tag.",
  },
  {
    type: "html",
    content: mockHtmlString,
  },
];

const undefinedElement: any = [
  {
    type: "ul",
    content: "",
    props: {
      "data-test-id": "foo",
    },
    children: [
      {
        type: "li",
        content: "",
        props: {
          "data-test-id": "bar",
        },
        children: [
          {
            type: "span",
            content: "Foo",
            props: {
              "data-test-id": "biz",
            },
          },
        ],
      },
    ],
  },
  {
    type: "ol",
    content: "",
    props: {
      "data-test-id": "foo",
    },
    children: [
      {
        type: "li",
        content: "",
        props: {
          "data-test-id": "bar",
        },
        children: [
          {
            content: "Undefined element",
            props: {
              "data-test-id": "biz",
            },
          },
        ],
      },
    ],
  },
];

const mockElementsWithChildren: CustomHtmlElement[] = [
  {
    type: "ul",
    content: "",
    props: {
      "data-test-id": "foo",
    },
    children: [
      {
        type: "li",
        content: "",
        props: {
          "data-test-id": "bar",
        },
        children: [
          {
            type: "span",
            content: "Foo",
            props: {
              "data-test-id": "biz",
            },
          },
        ],
      },
    ],
  },
  {
    type: "ol",
    content: "",
    props: {
      "data-test-id": "foo",
    },
    children: [
      {
        type: "li",
        content: "",
        props: {
          "data-test-id": "bar",
        },
        children: [
          {
            type: "span",
            content: "Foo",
            props: {
              "data-test-id": "biz",
            },
          },
        ],
      },
    ],
  },
];

const testComponent = <div>{parseCustomHtml(testElementArray)}</div>;

const testComponentWithChildren = (
  <div>{parseCustomHtml(mockElementsWithChildren)}</div>
);

const undefinedTypeComponent = <div>{parseCustomHtml(undefinedElement)}</div>;

describe("utils/parsing", () => {
  describe("parseCustomHtml()", () => {
    describe("Test parseCustomHtml", () => {
      const sanitizationSpy = jest.spyOn(DOMPurify, "sanitize");
      beforeEach(() => {
        render(testComponent);
      });

      test("Custom element renders correctly", () => {
        const link = screen.getByText("with link");
        expect(link).toBeVisible();
      });

      test("Non-custom element renders correctly", () => {
        const element = screen.getByText("Paragraph tag.");
        expect(element).toBeVisible();
      });

      test("Type 'html' is sanitized and parsed", () => {
        expect(sanitizationSpy).toHaveBeenCalled();
      });
    });

    describe("Test createElementWithChildren", () => {
      test("should correctly create ul elements", async () => {
        const { container } = render(testComponentWithChildren);
        expect(await container.querySelector("ul")).toBeVisible();
        expect(
          await container.querySelector('[data-test-id="foo"]')
        ).toBeVisible();
        expect(
          await container.querySelector('[data-test-id="bar"]')
        ).toBeVisible();
        expect(
          await container.querySelector('[data-test-id="biz"]')
        ).toBeVisible();
      });

      test("should correctly create ol elements", async () => {
        const { container } = render(testComponentWithChildren);
        expect(await container.querySelector("ol")).toBeVisible();
        expect(
          await container.querySelector('[data-test-id="foo"]')
        ).toBeVisible();
        expect(
          await container.querySelector('[data-test-id="bar"]')
        ).toBeVisible();
        expect(
          await container.querySelector('[data-test-id="biz"]')
        ).toBeVisible();
      });
    });

    describe("Handling undefined elementType", () => {
      beforeEach(() => {
        render(undefinedTypeComponent);
      });

      test("Should handle and convert undefined element type to text", () => {
        const element = screen.getByText("Undefined element");
        expect(element).toBeVisible();
      });
    });
  });

  describe("labelTextWithOptional()", () => {
    test("if a string gets passed into labelTextWithOptional, the 'optional' text will appear", () => {
      const label = "field title";
      const testComponent = <>{labelTextWithOptional(label)}</>;
      render(testComponent);

      const fieldText = screen.getByText("field title");
      expect(fieldText).toBeVisible();

      const optionalText = screen.getByText("(optional)");
      expect(optionalText).toBeVisible();
    });

    test("string with colon puts colon after optional text", () => {
      const label = "field title:";
      const testComponent = <>{labelTextWithOptional(label)}</>;
      render(testComponent);

      const fieldText = screen.getByText("field title");
      expect(fieldText).toBeVisible();

      const optionalText = screen.getByText("(optional):");
      expect(optionalText).toBeVisible();
    });
  });
});

describe("Test parseAllowedHtml", () => {
  test("Should render allowed HTML tags", () => {
    const text = `<strong>strong</strong>
    <em>em</em>
    <a href="https://mock.com/" target="_blank" title="notAllowed">Link</a>
    <img src="mock.jpg" class="mock" alt="mock image" id="notAllowed">
    <input type="text" name="notAllowed>"`;
    const sanitized = parseAllowedHtml(text);
    render(sanitized);

    const strong = screen.getByText("strong");
    expect(strong.tagName).toBe("STRONG");

    const em = screen.getByText("em");
    expect(em.tagName).toBe("EM");

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://mock.com/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).not.toHaveAttribute("title");

    const img = screen.queryByRole("img");
    expect(img).not.toBeInTheDocument();

    const input = screen.queryByRole("input");
    expect(input).not.toBeInTheDocument();

    const divText = screen.queryByText("Not Allowed");
    expect(divText).not.toBeInTheDocument();
  });
});
