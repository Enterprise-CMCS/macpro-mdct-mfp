import { ReactNode, useMemo, createContext } from "react";
import { useStore } from "utils";

interface EntityContextShape {
  updateEntities: Function;
}

export const EntityContext = createContext<EntityContextShape>({
  updateEntities: Function,
});

/**
 * EntityProvider controls passing entity related information to deeply nested components.
 *
 * Many reports have repeatable entities, like plans or submissions. Form items that are
 * directly related to an entity can use the EntityProvider to understand which
 * field data they shoud be modifiying.
 *
 * @param children - React nodes
 */
export const EntityProvider = ({ children }: EntityProviderProps) => {
  // state management
  const { entityId, entityType, entities, selectedEntity } = useStore();

  /**
   * updateEntities updates the user's selected entity with their changes, and
   * replaces the selected entity in the entities list.
   *
   * When we submit an entity related field for autosave, we need to send
   * the updated list of all entities, not just the selected one.
   *
   * this function is needed in MFP but we don't know the shape of entities yet
   * @param updateData - updated entity information
   */
  const updateEntities = () => {};

  // TODO: add entity functions as we build them out
  const providerValue = useMemo(
    () => ({
      updateEntities,
    }),
    [entityId, entityType, entities, selectedEntity]
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
