import { EntityShape, AnyObject } from "types";

export const entityWasUpdated = (
  originalEntity: EntityShape,
  newEntity: AnyObject,
) => JSON.stringify(originalEntity) !== JSON.stringify(newEntity);

export const getEntityFieldData = (entityId: string, fieldData: AnyObject) => {
  Object.entries(fieldData).forEach((item) => {
    if (item[1].id === entityId) {
      console.log(item[1]);
      return item[1];
    } else {
      if(typeof item[1] === "object")
        return getEntityFieldData(entityId, item[1]);
    }
  });
};
