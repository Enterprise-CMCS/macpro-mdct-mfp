// utils
import { AnyObject } from "types";

export const EntityStepCardBottomSection = ({ stepType }: Props) => {
  switch (stepType) {
    default:
      return <></>;
  }
};

interface Props {
  stepType: string;
  formattedEntityData: AnyObject;
  printVersion?: boolean;
  verbiage?: {
    entityMissingResponseMessage?: string;
    entityEmptyResponseMessage?: string;
  };
}
