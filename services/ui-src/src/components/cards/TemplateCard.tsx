// components
import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Card, ExternalLink, TemplateCardAccordion } from "components";
// utils
import { useNavigate } from "react-router";
import { useBreakpoint } from "utils";
import { AnyObject } from "types";
// assets\
import nextIcon from "assets/icons/icon_next_white.png";
import spreadsheetIcon from "assets/icons/icon_spreadsheet.svg";

export const TemplateCard = ({
  verbiage,
  cardprops,
  isHidden,
  ...props
}: Props) => {
  const { isDesktop } = useBreakpoint();
  const navigate = useNavigate();

  return (
    <Card boxShadow="0px 3px 9px rgba(0, 0, 0, 0.2)" {...cardprops}>
      <Flex sx={sx.root} {...props}>
        {isDesktop && (
          <Image
            src={spreadsheetIcon}
            alt="Spreadsheet icon"
            sx={sx.spreadsheetIcon}
          />
        )}
        <Flex sx={sx.cardContentFlex}>
          <Heading sx={sx.cardTitleText}>{verbiage.title}</Heading>
          <Text>
            {verbiage.body.available}
            {verbiage.linkText && (
              <ExternalLink href={verbiage.linkLocation}>
                {verbiage.linkText}
              </ExternalLink>
            )}
            {verbiage.postLinkText}
          </Text>
          <Flex sx={sx.actionsFlex}>
            {!isHidden && (
              <Button
                sx={sx.formLink}
                onClick={() => navigate(verbiage.link.route)}
                rightIcon={
                  <Image src={nextIcon} alt="Link Icon" height="1rem" />
                }
              >
                {verbiage.link.text}
              </Button>
            )}
          </Flex>
          <TemplateCardAccordion verbiage={verbiage.accordion} />
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  verbiage: AnyObject;
  isHidden?: boolean;
  [key: string]: any;
}

const sx = {
  root: {
    flexDirection: "row",
  },
  spreadsheetIcon: {
    marginRight: "spacer4",
    boxSize: "5.5rem",
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
  },
  cardTitleText: {
    marginBottom: "spacer1",
    fontSize: "heading_lg",
    fontWeight: "heading_lg",
    lineHeight: "heading_lg",
  },
  actionsFlex: {
    flexFlow: "wrap",
    gridGap: "spacer2",
    justifyContent: "end",
    margin: "1rem 0 0 0",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  templateDownloadButton: {
    justifyContent: "start",
    marginRight: "spacer2",
    padding: "0",
    span: {
      marginLeft: "0rem",
      marginRight: "spacer1",
    },
    ".mobile &": {
      marginRight: "0",
    },
  },
  formLink: {
    justifyContent: "start",
    span: {
      marginLeft: "spacer1",
      marginRight: "-0.25rem",
    },
  },
};
