import { ReactNode, useMemo, createContext } from "react";
import { useStore } from "utils";
import { AnyObject, EntityShape } from "types";

interface EntityContextShape {
  prepareEntityPayload: Function;
}

export const EntityContext = createContext<EntityContextShape>({
  prepareEntityPayload: Function,
});

/**
 * EntityProvider controls passing entity related information to deeply nested components.
 *
 * Many reports have repeatable entities, like plans or submissions. Form items that are
 * directly related to an entity can use the EntityProvider to understand which
 * field data they should be modifying.
 *
 * @param children - React nodes
 */
export const EntityProvider = ({ children }: EntityProviderProps) => {
  // state management
  const { selectedEntity, report } = useStore();

  /**
   * prepareEntityPayload updates the user's selected entity with their changes, and
   * replaces the selected entity in the entities list.
   *
   * When we submit an entity related field for autosave, we need to send
   * the updated list of all entities, not just the selected one.
   *
   * @param updateData - updated entity information
   */
  const prepareEntityPayload = (updateData: AnyObject) => {
    // read the freshest report so a queued write builds on the previous one
    const latestReport = useStore.getState?.()?.report ?? report;
    const entityType = selectedEntity!.type;
    const currentEntities = latestReport?.fieldData?.[entityType];
    const selectedEntityIndex = currentEntities?.findIndex(
      (x: EntityShape) => x.id === selectedEntity?.id
    );
    if (currentEntities && selectedEntityIndex > -1) {
      const newEntities = [...currentEntities];
      newEntities[selectedEntityIndex] = {
        ...currentEntities[selectedEntityIndex],
        ...updateData,
      };
      return newEntities;
    }
    return currentEntities;
  };

  const providerValue = useMemo(
    () => ({
      prepareEntityPayload,
    }),
    [selectedEntity, report]
  );

  return (
    <EntityContext.Provider value={providerValue}>
      {children}
    </EntityContext.Provider>
  );
};

interface EntityProviderProps {
  children?: ReactNode;
}
