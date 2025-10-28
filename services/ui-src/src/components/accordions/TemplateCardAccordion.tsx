// components
import { Accordion, ListItem, UnorderedList } from "@chakra-ui/react";
import { AccordionItem, Table } from "components";
// utils
import { AnyObject } from "types";
import { parseCustomHtml } from "utils";

export const TemplateCardAccordion = ({ verbiage, ...props }: Props) => (
  <Accordion sx={sx.root} allowToggle={true} {...props}>
    <AccordionItem sx={sx.text} label={verbiage.buttonLabel}>
      {parseCustomHtml(verbiage.text)}
      {verbiage.table && (
        <Table
          content={verbiage.table}
          variant="striped"
          sxOverride={sx.table}
        />
      )}
      {verbiage.list && (
        <UnorderedList sx={sx.list}>
          {verbiage.list.map((listItem: string, index: number) => (
            <ListItem key={index}>{listItem}</ListItem>
          ))}
        </UnorderedList>
      )}
    </AccordionItem>
  </Accordion>
);

interface Props {
  verbiage: AnyObject;
  [key: string]: any;
}

const sx = {
  root: {
    marginTop: "spacer4",
  },
  text: {
    borderColor: "gray_lightest",
    p: {
      marginBottom: "spacer2",
    },
  },
  table: {
    "tr td:last-of-type": {
      fontWeight: "semibold",
    },
  },
  list: {
    paddingLeft: "spacer2",
    "li:last-of-type": {
      fontWeight: "bold",
    },
  },
};
