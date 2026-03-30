import { EntityShape, AnyObject } from "types";

export const entityWasUpdated = (
  originalEntity: EntityShape,
  newEntity: AnyObject
) => JSON.stringify(originalEntity) !== JSON.stringify(newEntity);
