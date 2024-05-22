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
    marginBottom: "1.5rem",
    borderStyle: "none",
  },
  textBox: {
    ".mobile &": {
      paddingLeft: "1rem",
    },
    a: {
      color: "palette.primary",
      textDecoration: "underline",
    },
    header: {
      marginBottom: "1.5rem",
    },
    p: {
      marginBottom: "1.5rem",
    },
  },
  text: {
    marginBottom: "1rem",
  },
  list: {
    paddingLeft: "1rem",
    margin: "1.5rem",
    li: {
      marginBottom: "1.25rem",
    },
  },
};
