import { render, screen } from "@testing-library/react";
//components
import { EmailCard } from "components";
import { createEmailLink } from "utils/other/email";
import verbiage from "verbiage/pages/help";
import { testA11yAct } from "utils/testing/commonTests";

const emailCardComponent = (
  <EmailCard
    verbiage={verbiage.cards.helpdesk}
    icon="settings"
    cardprops={{ "data-testid": "email-card" }}
  />
);

describe("<EmailCard />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(emailCardComponent);
    });

    test("EmailCard is visible", () => {
      expect(screen.getByTestId("email-card")).toBeVisible();
    });

    test("Email links are created correctly", () => {
      const mockEmailData = {
        address: "test@test.com",
        subject: "the subject",
        body: "the body",
      };
      const expectedEmailLink = "mailto:test@test.com?the%20subject";
      expect(createEmailLink(mockEmailData)).toEqual(expectedEmailLink);
    });

    test("Email links are visible", () => {
      expect(screen.getByRole("link")).toBeVisible();
    });
  });

  testA11yAct(emailCardComponent);
});
