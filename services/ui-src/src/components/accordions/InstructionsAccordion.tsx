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
    <Accordion allowMultiple={true} sx={sx.root} {...props}>
      <AccordionItem label={buttonLabel} sx={sx.item}>
        <Box sx={sx.textBox}>{parseCustomHtml(intro)}</Box>
        {list && parseList(list)}
        {text && <Box sx={sx.textBox}>{parseCustomHtml(text)}</Box>}
      </AccordionItem>
    </Accordion>
  );
};

export const parseList = (list: any, listIndex: number = 0) => {
  return (
    <UnorderedList sx={sx.list} key={`list-${listIndex}`}>
      {list?.map((listItem: string | AnyObject, listItemIndex: number) =>
        typeof listItem === "string" ? (
          <ListItem key={`listitem-${listItemIndex}`}>
            {sanitizeAndParseHtml(listItem)}
          </ListItem>
        ) : (
          parseList(listItem, listIndex + 1)
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
    marginTop: "spacer4",
    color: "base",
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
      color: "primary",
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
