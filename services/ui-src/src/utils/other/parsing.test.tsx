import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CustomHtmlElement } from "types";
// utils
import {
  labelTextWithOptional,
  parseAllowedHtml,
  parseCustomHtml,
} from "utils";

const mockHtmlString = "<span><em>whatever</em></span>";
const testElementArray = [
  {
    type: "text",
    as: "span",
    content: "Mock text ",
  },
  {
    type: "externalLink",
    content: "with external link",
    props: {
      href: "mockURL.com",
    },
  },
  {
    type: "internalLink",
    content: "with internal link",
    props: {
      to: "/mock-path",
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
      beforeEach(() => {
        render(<MemoryRouter>{testComponent}</MemoryRouter>);
      });

      test("Custom element renders correctly", () => {
        const link = screen.getByRole("link", { name: "with external link" });
        expect(link).toBeVisible();
      });

      test("internalLink type renders with ds-c-link className by default", () => {
        const link = screen.getByRole("link", { name: "with internal link" });
        expect(link).toHaveClass("ds-c-link");
      });

      test("externalLink type does not get ds-c-link className by default", () => {
        const link = screen.getByRole("link", { name: "with external link" });
        expect(link).not.toHaveClass("ds-c-link");
      });

      test("Non-custom element renders correctly", () => {
        const element = screen.getByText("Paragraph tag.");
        expect(element).toBeVisible();
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

    describe("internalLink className override", () => {
      test("explicit className in props overrides default ds-c-link for internalLink", () => {
        const overrideElement = [
          {
            type: "internalLink",
            content: "custom styled link",
            props: {
              to: "/mock-path",
              className: "custom-class",
            },
          },
        ];
        render(
          <MemoryRouter>
            <div>{parseCustomHtml(overrideElement)}</div>
          </MemoryRouter>
        );

        const link = screen.getByRole("link", { name: "custom styled link" });
        expect(link).toHaveClass("custom-class");
        expect(link).not.toHaveClass("ds-c-link");
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
    <input type="text" name="notAllowed">
    <div>Not Allowed</div>"`;
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

    const input = screen.queryByRole("textbox");
    expect(input).not.toBeInTheDocument();

    const divText = screen.queryByText("Not Allowed");
    expect(divText).not.toBeInTheDocument();
  });
});
