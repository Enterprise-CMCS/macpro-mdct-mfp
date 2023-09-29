// utils
import { AnyObject } from "types";

export const EntityCardBottomSection = ({ entityType }: Props) => {
  switch (entityType) {
    default:
      return <></>;
  }
};

interface Props {
  entityType: string;
  formattedEntityData: AnyObject;
  printVersion?: boolean;
  verbiage?: {
    entityMissingResponseMessage?: string;
    entityEmptyResponseMessage?: string;
  };
}
