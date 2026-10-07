import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@cmsgov/design-system";

export const externalLinkAltText = "(Opens in a new tab)";

export const ExternalLink = (props: any) => (
  <Link target={"_blank"} {...props}>
    {props?.children}
    <ExternalLinkIcon
      ariaHidden={false}
      title={externalLinkAltText}
      className="external-link-icon"
    />
  </Link>
);
