// utils
import { AnyObject, EntityShape } from "types";

export const getFormattedEntityData = () => {
  return {};
};

export const entityWasUpdated = (
  originalEntity: EntityShape,
  newEntity: AnyObject
) => JSON.stringify(originalEntity) !== JSON.stringify(newEntity);
