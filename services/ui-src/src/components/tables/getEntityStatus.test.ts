import {
  EntityDetailsOverlayShape,
  EntityShape,
  EntityStatuses,
  FormField,
  OverlayModalPageShape,
  OverlayModalTypes,
  PageTypes,
  ReportShape,
} from "types";
import {
  getValidationList,
  getEntityStatus,
  getInitiativeStatus,
  getInitiativeDashboardStatus,
  getCloseoutStatus,
} from "./getEntityStatus";

describe("Entity status utilities", () => {
  describe("getValidationList", () => {
    it("should gather field IDs, nested and otherwise", () => {
      const fields = [
        {
          id: "field1",
          type: "text",
          validation: "text",
        },
        {
          id: "field2",
          type: "radio",
          validation: "radio",
          props: {
            choices: [
              {
                id: "choice1",
                children: [
                  {
                    id: "nestedField3",
                  },
                ],
              },
            ],
          },
        },
      ];
      const entity = {
        id: "entity1",
        type: "initiative" as const,
        field1: {
          key: "field1key",
        },
        field2: {
          key: "choice1key",
        },
      };

      const result = getValidationList(fields, entity);

      expect(result).toEqual(["field1", "field2", "nestedField3"]);
    });
  });

  describe("getEntityStatus", () => {
    it("should recognize when an entity is complete", () => {
      const report = {
        formTemplate: {
          flatRoutes: [
            {
              entityType: "mockEntityType",
              form: {
                fields: [
                  {
                    id: "field1",
                    type: "text",
                    validation: "text",
                  },
                ],
              },
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "mockEntityId",
        type: "initiative" as const,
        field1: "mock text data",
      };
      const entityType = "mockEntityType";

      const result = getEntityStatus(report, entity, entityType);

      expect(result).toBe(true);
    });

    it("should recognize when an entity is not complete", () => {
      const report = {
        formTemplate: {
          flatRoutes: [
            {
              entityType: "mockEntityType",
              form: {
                fields: [
                  {
                    id: "field1",
                    type: "text",
                    validation: "text",
                  },
                  {
                    id: "field2",
                    type: "text",
                    validation: "text",
                  },
                ],
              },
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "mockEntityId",
        type: "initiative" as const,
        field1: "mock text data",
      };
      const entityType = "mockEntityType";

      const result = getEntityStatus(report, entity, entityType);

      expect(result).toBe(false);
    });

    it("should ignore irrelevant routes", () => {
      const report = {
        formTemplate: {
          flatRoutes: [
            {
              entityType: "different entity type",
              form: {
                fields: [
                  {
                    id: "field2",
                    type: "text",
                    validation: "text",
                  },
                ],
              },
            },
            {
              entityType: "mockEntityType",
              form: {
                fields: [
                  {
                    id: "field1",
                    type: "text",
                    validation: "text",
                  },
                ],
              },
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "mockEntityId",
        type: "initiative" as const,
        field1: "mock text data",
      };
      const entityType = "mockEntityType";

      const result = getEntityStatus(report, entity, entityType);

      expect(result).toBe(true);
    });

    // TODO this feels like a bug, right? Or can it never come up?
    it("should ignore subsequent routes?", () => {
      const report = {
        formTemplate: {
          flatRoutes: [
            {
              entityType: "mockEntityType",
              form: {
                fields: [
                  {
                    id: "field1",
                    type: "text",
                    validation: "text",
                  },
                ],
              },
            },
            {
              entityType: "mockEntityType",
              form: {
                fields: [
                  {
                    id: "field2",
                    type: "text",
                    validation: "text",
                  },
                ],
              },
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "mockEntityId",
        type: "initiative" as const,
        field1: "mock text data",
      };
      const entityType = "mockEntityType";

      const result = getEntityStatus(report, entity, entityType);

      expect(result).toBe(true);
    });
  });

  describe("getInitiativeStatus", () => {
    it("should return CLOSE for closed initiatives in the Work Plan", () => {
      const report = {
        reportType: "WP",
        formTemplate: {
          routes: [
            {},
            {},
            {},
            {
              children: [
                {
                  // we are in reportChild
                  entityType: OverlayModalTypes.INITIATIVE,
                  entitySteps: [
                    {
                      stepType: "mock step type",
                      form: {
                        fields: [
                          {
                            id: "field1",
                            type: "text",
                            validation: "text",
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "entity1",
        type: "initiative",
        isInitiativeClosed: true,
      } as EntityShape;
      const isPdf = false;
      const ignore: string[] = [];

      const result = getInitiativeStatus(report, entity, isPdf, ignore);

      expect(result).toBe(EntityStatuses.CLOSE);
    });

    it("should not return CLOSE for closed initiatives in the SAR", () => {
      const entity = {
        id: "entity1",
        type: "initiative",
        isInitiativeClosed: true,
      } as EntityShape;

      const report = {
        reportType: "SAR",
        formTemplate: {
          routes: [
            {},
            {},
            {
              pageType: PageTypes.DYNAMIC_MODAL_OVERLAY,
              entityType: "initiative",
              entityInfo: ["initiative_name", "initiative_wpTopic"],
              verbiage: {
                intro: {
                  section: "",
                },
              },
              initiatives: [entity],
            },
          ],
        },
      } as ReportShape;
      const isPdf = false;
      const ignore: string[] = [];

      const result = getInitiativeStatus(report, entity, isPdf, ignore);

      expect(result).not.toBe(EntityStatuses.CLOSE);
    });

    it("should return false for entities without steps", () => {
      const report = {
        formTemplate: {
          routes: [
            {},
            {},
            {},
            {
              children: [
                {
                  entityType: OverlayModalTypes.INITIATIVE,
                },
              ],
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "entity1",
        type: "initiative",
        isInitiativeClosed: false,
      } as EntityShape;
      const isPdf = false;
      const ignore: string[] = [];

      const result = getInitiativeStatus(report, entity, isPdf, ignore);

      expect(result).toBe(false);
    });

    it("should check all steps for completeness", () => {
      const report = {
        reportType: "WP",
        formTemplate: {
          routes: [
            {},
            {},
            {},
            {
              children: [
                {
                  // we are in reportChild
                  entityType: OverlayModalTypes.INITIATIVE,
                  entitySteps: [
                    {
                      stepType: "mock step type",
                      form: {
                        fields: [
                          {
                            id: "field1",
                            type: "text",
                            validation: "text",
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "entity1",
        type: "initiative",
        isInitiativeClosed: false,
      } as EntityShape;
      const isPdf = false;
      const ignore: string[] = [];

      let result = getInitiativeStatus(report, entity, isPdf, ignore);
      expect(result).toBe(false);

      (entity as any).field1 = "mock data";
      result = getInitiativeStatus(report, entity, isPdf, ignore);
      expect(result).toBe(true);
    });
  });

  it("should ignore specified step types", () => {
    const report = {
      reportType: "WP",
      formTemplate: {
        routes: [
          {},
          {},
          {},
          {
            children: [
              {
                // we are in reportChild
                entityType: OverlayModalTypes.INITIATIVE,
                entitySteps: [
                  {
                    stepType: "mock step type",
                    form: {
                      fields: [
                        {
                          id: "field1",
                          type: "text",
                          validation: "text",
                        },
                      ],
                    },
                  },
                  {
                    stepType: "other step type",
                    form: {
                      fields: [
                        {
                          id: "field2",
                          type: "text",
                          validation: "text",
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    } as ReportShape;
    const entity = {
      id: "entity1",
      type: "initiative",
      isInitiativeClosed: false,
      field1: "mock value",
    } as EntityShape;
    const isPdf = false;
    let ignore: string[] = [];

    let result = getInitiativeStatus(report, entity, isPdf, ignore);
    expect(result).toBe(false);

    ignore = ["other step type"];
    result = getInitiativeStatus(report, entity, isPdf, ignore);
    expect(result).toBe(true);
  });

  it("should ignore the closeout step when evaluating for PDF", () => {
    const report = {
      reportType: "WP",
      formTemplate: {
        routes: [
          {},
          {},
          {},
          {
            children: [
              {
                // we are in reportChild
                entityType: OverlayModalTypes.INITIATIVE,
                entitySteps: [
                  {
                    stepType: "fundingSources",
                    form: {
                      fields: [
                        {
                          id: "field1",
                          type: "text",
                          validation: "text",
                        },
                      ],
                    },
                  },
                  {
                    stepType: "closeOutInformation",
                    form: {
                      fields: [
                        {
                          id: "field2",
                          type: "text",
                          validation: "text",
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    } as ReportShape;
    const entity = {
      id: "entity1",
      type: "initiative",
      isInitiativeClosed: false,
      field1: "mock value",
    } as EntityShape;
    let isPdf = false;
    const ignore: string[] = [];

    let result = getInitiativeStatus(report, entity, isPdf, ignore);
    expect(result).toBe(false);

    isPdf = true;
    result = getInitiativeStatus(report, entity, isPdf, ignore);
    expect(result).toBe(true);
  });

  describe("getInitiativeDashboardStatus", () => {
    it("should find completed fields", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          // TODO test modalForm
          fields: [
            {
              id: "field1",
              type: "text",
              validation: "text",
            },
          ],
        },
      } as EntityDetailsOverlayShape;
      const entity = {
        id: "entity1",
        type: "initiative" as const,
        mockStepType: [
          {
            field1: "mock value",
          },
        ],
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(true);
    });

    it("should find when fields are not completed", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          fields: [
            {
              id: "field1",
              type: "text",
              validation: "text",
            },
          ],
        },
      } as EntityDetailsOverlayShape;
      const entity = {
        id: "entity1",
        type: "initiative" as const,
        mockStepType: [
          {
            /* no data */
          },
        ],
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(false);
    });

    it("should find fields in modalForm when there is no form", () => {
      const formEntity = {
        stepType: "mockStepType",
        modalForm: {
          fields: [
            {
              id: "field1",
              type: "text",
              validation: "text",
            },
          ],
        },
      } as OverlayModalPageShape;
      const entity = {
        id: "entity1",
        type: "initiative" as const,
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(false);
    });

    it("should work for entities without steps", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          fields: [
            {
              id: "field1",
              type: "text",
              validation: "text",
            },
          ],
        },
      } as EntityDetailsOverlayShape;
      const entity = {
        id: "entity1",
        type: "initiative" as const,
        field1: "mock value",
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(true);
    });

    it("should require nested form fields", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          fields: [
            {
              id: "field1",
              type: "radio",
              validation: "radio",
              props: {
                choices: [
                  {
                    id: "choice1",
                    children: [
                      {
                        id: "nestedField2",
                        type: "text",
                        validation: "text",
                      } as FormField,
                    ],
                  },
                ],
              },
            } as FormField,
          ],
        },
      } as EntityDetailsOverlayShape;
      const entity = {
        id: "entity1",
        type: "initiative" as const,
        field1: "mock value",
        mockObj: {
          key: "choice1Key",
        },
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(false);
    });

    it("should find values for required nested form fields", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          fields: [
            {
              id: "field1",
              type: "radio",
              validation: "radio",
              props: {
                choices: [
                  {
                    id: "choice1",
                    children: [
                      {
                        id: "nestedField2",
                        type: "text",
                        validation: "text",
                      } as FormField,
                    ],
                  },
                ],
              },
            } as FormField,
          ],
        },
      } as EntityDetailsOverlayShape;
      const entity = {
        id: "entity1",
        type: "initiative" as const,
        field1: "mock value",
        mockObj: {
          key: "choice1Key",
        },
        nestedField2: "mock value",
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(true);
    });
  });

  describe("getCloseoutStatus", () => {
    it("should return true when an entity includes all fields ", () => {
      const form = {
        id: "form1",
        fields: [
          {
            id: "field1",
            type: "text",
            validation: "text",
          },
        ],
      };
      const entity = {
        id: "entity1",
        type: "initiative" as const,
        field1: "mock value",
      };

      const result = getCloseoutStatus(form, entity);

      expect(result).toBe(true);
    });

    it("should return false when an entity does not include all fields", () => {
      const form = {
        id: "form1",
        fields: [
          {
            id: "field1",
            type: "text",
            validation: "text",
          },
        ],
      };
      const entity = {
        id: "entity1",
        type: "initiative" as const,
      };

      const result = getCloseoutStatus(form, entity);

      expect(result).toBe(false);
    });

    it("should not require optional fields", () => {
      const form = {
        id: "form1",
        fields: [
          {
            id: "field1",
            type: "text",
            validation: "textOptional",
          },
          {
            id: "field2",
            type: "text",
            validation: {
              type: "textOptional",
            },
          },
        ],
      };
      const entity = {
        id: "entity1",
        type: "initiative" as const,
      };

      const result = getCloseoutStatus(form, entity);

      expect(result).toBe(true);
    });

    it("should require the termination reason for discontinued initiatives", () => {
      const form = {
        id: "form1",
        fields: [],
      };
      const entity = {
        id: "entity1",
        type: "initiative" as const,
        closeOutInformation_initiativeStatus: [
          {
            value: "Discontinued initiative",
          },
        ],
      };

      // Without
      let result = getCloseoutStatus(form, entity);
      expect(result).toBe(false);

      // With
      (entity as any)[
        "closeOutInformation_initiativeStatus-terminationReason"
      ] = "mock text";
      result = getCloseoutStatus(form, entity);
      expect(result).toBe(true);
    });

    it("should require the alternate funding for Medicaid-sustained initiatives", () => {
      const form = {
        id: "form1",
        fields: [],
      };
      const entity = {
        id: "entity1",
        type: "initiative" as const,
        closeOutInformation_initiativeStatus: [
          {
            value: "Sustaining initiative through a Medicaid authority",
          },
        ],
      };

      // Without
      let result = getCloseoutStatus(form, entity);
      expect(result).toBe(false);

      // With
      (entity as any)["closeOutInformation_initiativeStatus-alternateFunding"] =
        "mock text";
      result = getCloseoutStatus(form, entity);
      expect(result).toBe(true);
    });
  });
});
