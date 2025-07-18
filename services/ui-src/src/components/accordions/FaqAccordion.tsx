// components
import { Accordion, Box, Text } from "@chakra-ui/react";
import { AccordionItem } from "components";
// utils
import { AnyObject } from "types";

export const FaqAccordion = ({ accordionItems, ...props }: Props) => {
  return (
    <>
      {/* @ts-ignore Throws TS2590: expression too complex */}
      <Accordion allowToggle={true} allowMultiple={true} {...props}>
        {accordionItems.map((item: AnyObject, index: number) => (
          <AccordionItem key={index} label={item.question} sx={sx.item}>
            <Box sx={sx.answerBox}>
              <Text>{item.answer}</Text>
            </Box>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

interface Props {
  accordionItems: AnyObject;
}

const sx = {
  item: {
    marginBottom: "1.5rem",
    borderStyle: "none",
  },
  answerBox: {
    ".mobile &": {
      paddingLeft: "1rem",
    },
  },
};
