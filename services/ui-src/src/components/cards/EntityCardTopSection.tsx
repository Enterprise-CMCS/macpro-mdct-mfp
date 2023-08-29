// components
import { Text } from "@chakra-ui/react";
// utils
import { AnyObject } from "types";

export const EntityCardTopSection = ({ entityType }: Props) => {
  switch (entityType) {
    default:
      return <Text>{entityType}</Text>;
  }
};

interface Props {
  entityType: string;
  formattedEntityData: AnyObject;
  printVersion?: boolean;
}
