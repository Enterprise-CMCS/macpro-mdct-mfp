// components
import { Accordion, Box, Text } from "@chakra-ui/react";
import { AccordionItem } from "components";
// utils
import { AnyObject } from "types";

export const FaqAccordion = ({ accordionItems, ...props }: Props) => {
  return (
    <Accordion allowMultiple={true} {...props}>
      {accordionItems.map((item: AnyObject, index: number) => (
        <AccordionItem key={index} label={item.question} sx={sx.item}>
          <Box sx={sx.answerBox}>
            <Text>{item.answer}</Text>
          </Box>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

interface Props {
  accordionItems: AnyObject;
}

const sx = {
  item: {
    marginBottom: "spacer3",
    borderStyle: "none",
  },
  answerBox: {
    ".mobile &": {
      paddingLeft: "spacer2",
    },
  },
};
