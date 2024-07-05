import { render, screen } from "@testing-library/react";
import DOMPurify from "dompurify";
import { CustomHtmlElement } from "types";
// utils
import { labelTextWithOptional, parseCustomHtml } from "utils";

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
    // labelTextWithOptional test
    describe("Test labelTextWithOptional", () => {
      test("if a string gets passed into labelTextWithOptional, the 'optional' text will appear", () => {
        const label = "field title";
        const testComponent = <div>{labelTextWithOptional(label)}</div>;
        render(testComponent);
        const optionalText = screen.getByText("(optional)");
        expect(optionalText).toBeVisible();
      });
    });
  });
});
