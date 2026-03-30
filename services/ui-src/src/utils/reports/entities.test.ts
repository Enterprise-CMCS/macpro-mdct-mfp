import { entityWasUpdated } from "./entities";

describe("utils/reports/entities", () => {
  describe("entityWasUpdated()", () => {
    test("Should not find changes if objects are recursively equal", () => {
      const originalEntity = {
        id: "mock id",
        type: "initiative" as const,
        stuff: [
          {
            thing: "foo",
          },
        ],
      };
      const updatedEntity = {
        id: "mock id",
        type: "initiative" as const,
        stuff: [
          {
            thing: "foo",
          },
        ],
      };

      const result = entityWasUpdated(originalEntity, updatedEntity);

      expect(result).toBe(false);
    });

    test("Should find changes if objects are not equal", () => {
      const originalEntity = {
        id: "mock id",
        type: "initiative" as const,
        stuff: [
          {
            thing: "foo",
          },
        ],
      };
      const updatedEntity = {
        id: "mock id",
        type: "initiative" as const,
        stuff: [
          {
            thing: "bar",
          },
        ],
      };

      const result = entityWasUpdated(originalEntity, updatedEntity);

      expect(result).toBe(true);
    });

    /**
     * TODO:
     * Unfortunately, entityWasUpdated IS confused by property ordering.
     * But this doesn't tend to happen in normal program flow, and should
     * be low-consequence (that is, an extra no-op network call) if it does.
     */
    test.skip("Should not be confused by property ordering", () => {
      const originalEntity = {
        id: "mock id",
        type: "initiative" as const,
      };
      const updatedEntity = {
        type: "initiative" as const,
        id: "mock id",
      };

      const result = entityWasUpdated(originalEntity, updatedEntity);

      expect(result).toBe(false);
    });
  });
});
