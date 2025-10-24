// components
import { Accordion, Box, ListItem, UnorderedList } from "@chakra-ui/react";
import { AccordionItem } from "components";
// types
import { AnyObject } from "types";
// utils
import { parseCustomHtml, sanitizeAndParseHtml } from "utils";

export const InstructionsAccordion = ({ verbiage, ...props }: Props) => {
  const { buttonLabel, intro, list, text } = verbiage;
  return (
    <Accordion allowToggle={true} allowMultiple={true} sx={sx.root} {...props}>
      <AccordionItem label={buttonLabel} sx={sx.item}>
        <Box sx={sx.textBox}>{parseCustomHtml(intro)}</Box>
        {list && parseList(list)}
        {text && <Box sx={sx.textBox}>{parseCustomHtml(text)}</Box>}
      </AccordionItem>
    </Accordion>
  );
};

export const parseList = (list: any) => {
  return (
    <UnorderedList sx={sx.list}>
      {list?.map((listItem: string | AnyObject, index: number) =>
        typeof listItem === "string" ? (
          <ListItem key={index}>{sanitizeAndParseHtml(listItem)}</ListItem>
        ) : (
          parseList(listItem)
        )
      )}
    </UnorderedList>
  );
};

interface Props {
  verbiage: AnyObject;
  [key: string]: any;
}

const sx = {
  root: {
    marginTop: "2rem",
    color: "palette.base",
  },
  item: {
    marginBottom: "spacer3",
    borderStyle: "none",
  },
  textBox: {
    ".mobile &": {
      paddingLeft: "spacer2",
    },
    a: {
      color: "palette.primary",
      textDecoration: "underline",
    },
    header: {
      marginBottom: "spacer3",
    },
    p: {
      marginBottom: "spacer3",
    },
  },
  text: {
    marginBottom: "spacer2",
  },
  list: {
    paddingLeft: "spacer2",
    margin: "spacer3",
    li: {
      marginBottom: "1.25rem",
    },
  },
};
