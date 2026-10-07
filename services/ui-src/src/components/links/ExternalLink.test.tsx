import { render, screen } from "@testing-library/react";
import { ExternalLink } from "./ExternalLink";

describe("<ExternalLink />", () => {
  test("renders", () => {
    render(<ExternalLink href="https://cms.gov/">This is a link</ExternalLink>);
    const link = screen.getByRole("link");
    expect(link).toHaveProperty("href", "https://cms.gov/");
    expect(screen.getByRole("img")).toBeVisible();
    expect(screen.getByText("This is a link")).toBeVisible();
  });
});
