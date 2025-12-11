import { ParentRoute } from "../../../../../../utils/types";
import { initiativesRoute } from "./initiatives";
import { instructionsRoute } from "./instructions";

export const stateOrTerritorySpecificInitiativesRoute: ParentRoute = {
  name: "State or Territory-Specific Initiatives",
  path: "/wp/state-or-territory-specific-initiatives",
  children: [instructionsRoute, initiativesRoute],
};
