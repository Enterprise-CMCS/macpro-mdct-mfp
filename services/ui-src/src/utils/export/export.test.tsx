// types
import { FormField, NumberMask, PageTypes } from "types";
// utils
import {
  parseFormFieldInfo,
  renderResponseData,
  renderDefaultFieldResponse,
  renderDataCell,
} from "./export";
import {
  mockFormField,
  mockNestedFormField,
  mockPlanField,
  mockOptionalFormField,
} from "utils/testing/setupJest";
import { render, screen } from "@testing-library/react";

const emailInput: FormField = {
  id: "email-field-id",
  type: "text",
  validation: "email",
};

describe("utils/export", () => {
  describe("renderDataCell()", () => {
    test("Correctly renders an email inside of a drawer data cell", () => {
      const formField: FormField = {
        id: "mockFieldId",
        type: "email", // neither "checkbox" nor "radio"
        validation: "email",
      };
      const allResponseData = {
        mockEntityType: [
          // entityResponseData
          {
            id: "mockEntityId",
            name: "mockEntityName",
            mockFieldId: "test@example.com",
          },
        ],
      };
      const pageType = PageTypes.DRAWER;
      const entityType = "mockEntityType";
      const parentFieldCheckedChoiceIds = ["mockEntityId"];

      const result = renderDataCell(
        formField,
        allResponseData,
        pageType,
        entityType,
        parentFieldCheckedChoiceIds
      );
      render(result);

      const emailLink = screen.getByText("test@example.com", { selector: "a" });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute("href", "mailto:test@example.com");
    });

    test("renders dynamic field", () => {
      render(
        renderDataCell(
          mockPlanField,
          {
            [mockPlanField.id]: [
              {
                id: "mockId1",
                name: "Mock dynamic value",
              },
            ],
          },
          "mockPageType"
        )
      );
      expect(screen.getByText("Mock dynamic value")).toBeVisible();
    });
  });

  describe("renderResponseData()", () => {
    test("Correctly renders choice list field response", () => {
      const fieldResponseData = [
        {
          key: "test_option3uuid",
          value: "option 3 value",
          children: [
            {
              id: "test_option3uuid-otherText",
              type: "text",
            },
          ],
        },
      ];

      const result = renderResponseData(mockNestedFormField, fieldResponseData);

      expect(result[0].key).toEqual("option3uuid");
      expect(result[0].props.children).toEqual("option 3");
    });

    test("Correctly renders a link or url field", () => {
      const result = renderResponseData(mockFormField, emailInput);
      expect(result.props.children.id).toEqual("email-field-id");
    });

    test("renders dynamic field", () => {
      render(
        renderResponseData(mockPlanField, [
          {
            id: "mockId1",
            name: "Mock dynamic value",
          },
        ])
      );
      expect(screen.getByText("Mock dynamic value")).toBeVisible();
    });

    test("renders required message", () => {
      render(renderResponseData(mockFormField, null));
      expect(screen.getByText("Not answered; required")).toBeVisible();
    });

    test("renders optional message", () => {
      render(renderResponseData(mockOptionalFormField, null));
      expect(screen.getByText("Not answered, optional")).toBeVisible();
    });
  });

  describe("parseFormFieldInfo()", () => {
    test("Correctly parses field info when full props are provided", () => {
      const input = { label: "A.1 Label", hint: "Hint" };
      const result = parseFormFieldInfo(input);
      expect(result.number).toEqual("A.1");
      expect(result.label).toEqual("Label");
      expect(result.hint).toEqual("Hint");
    });

    test("Correctly parses field info when empty props are provided", () => {
      const result = parseFormFieldInfo({});
      expect(result.number).toEqual(undefined);
      expect(result.label).toEqual(undefined);
      expect(result.hint).toEqual(undefined);
    });
  });

  describe("renderDefaultFieldResponse()", () => {
    test("Properly masks field data", () => {
      const textField = renderDefaultFieldResponse(
        { props: { mask: NumberMask.CURRENCY } } as unknown as FormField,
        "1234"
      );
      expect(textField.props.children).toBe("$1,234");
    });

    test("Properly masks currency decimal data", () => {
      const textField = renderDefaultFieldResponse(
        { props: { mask: NumberMask.CURRENCY } } as unknown as FormField,
        "1.10"
      );
      expect(textField.props.children).toBe("$1.10");
    });
  });
});
