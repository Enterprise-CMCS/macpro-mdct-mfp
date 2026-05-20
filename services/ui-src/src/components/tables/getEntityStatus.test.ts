import {
  getValidationList,
  getEntityStatus,
  getInitiativeStatus,
  getInitiativeDashboardStatus,
  getCloseoutStatus,
} from "./getEntityStatus";
// types
import {
  EntityDetailsOverlayShape,
  EntityDetailsOverlayTypes,
  EntityShape,
  EntityStatuses,
  EntityType,
  FormField,
  OverlayModalPageShape,
  OverlayModalTypes,
  ReportFormFieldType,
  ReportRoute,
  ReportShape,
  ValidationType,
} from "types";
// utils
import {
  mockSARReportWithOverlays,
  mockWPFullReport,
  mockWPReportWithOverlays,
} from "utils/testing/setupJest";

describe("tables/getEntityStatus", () => {
  describe("getValidationList()", () => {
    test("should gather field IDs, nested and otherwise", () => {
      const fields = [
        {
          id: "field1",
          type: ReportFormFieldType.TEXT,
          validation: ValidationType.TEXT,
        },
        {
          id: "field2",
          type: ReportFormFieldType.RADIO,
          validation: ValidationType.RADIO,
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
        type: EntityType.INITIATIVE,
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

    test("should not throw when entity field values are null", () => {
      // typeof null === "object", so null values must be filtered out
      // before accessing `.key` on them.
      const fields = [
        {
          id: "field1",
          type: ReportFormFieldType.TEXT,
          validation: ValidationType.TEXT,
        },
        {
          id: "field2",
          type: ReportFormFieldType.RADIO,
          validation: ValidationType.RADIO,
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
        type: EntityType.INITIATIVE,
        field1: null,
        field2: [null, { key: "choice1key" }],
      };

      expect(getValidationList(fields, entity)).toEqual([
        "field1",
        "field2",
        "nestedField3",
      ]);
    });
  });

  describe("getEntityStatus()", () => {
    test("returns complete status", () => {
      const report = {
        formTemplate: {
          flatRoutes: [
            {
              entityType: "mockEntityType",
              form: {
                fields: [
                  {
                    id: "field1",
                    type: ReportFormFieldType.TEXT,
                    validation: ValidationType.TEXT,
                  },
                ],
              },
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "mockEntityId",
        type: EntityType.INITIATIVE,
        field1: "mock text data",
      };
      const entityType = "mockEntityType";

      const result = getEntityStatus(report, entity, entityType);

      expect(result).toBe(EntityStatuses.COMPLETE);
    });

    test("returns incomplete status", () => {
      const report = {
        formTemplate: {
          flatRoutes: [
            {
              entityType: "mockEntityType",
              form: {
                fields: [
                  {
                    id: "field1",
                    type: ReportFormFieldType.TEXT,
                    validation: ValidationType.TEXT,
                  },
                  {
                    id: "field2",
                    type: ReportFormFieldType.TEXT,
                    validation: ValidationType.TEXT,
                  },
                ],
              },
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "mockEntityId",
        type: EntityType.INITIATIVE,
        field1: "mock text data",
      };
      const entityType = "mockEntityType";

      const result = getEntityStatus(report, entity, entityType);

      expect(result).toBe(EntityStatuses.INCOMPLETE);
    });

    test("returns complete status, ignoring non-matching entityType route", () => {
      const report = {
        formTemplate: {
          flatRoutes: [
            {
              entityType: "different entity type",
              form: {
                fields: [
                  {
                    id: "field2",
                    type: ReportFormFieldType.TEXT,
                    validation: ValidationType.TEXT,
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
                    type: ReportFormFieldType.TEXT,
                    validation: ValidationType.TEXT,
                  },
                ],
              },
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "mockEntityId",
        type: EntityType.INITIATIVE,
        field1: "mock text data",
      };
      const entityType = "mockEntityType";

      const result = getEntityStatus(report, entity, entityType);

      expect(result).toBe(EntityStatuses.COMPLETE);
    });

    test("returns incomplete status for non-matching entityType route", () => {
      const report = {
        formTemplate: {
          flatRoutes: [
            {
              entityType: "different entity type",
              form: {
                fields: [
                  {
                    id: "field2",
                    type: ReportFormFieldType.TEXT,
                    validation: ValidationType.TEXT,
                  },
                ],
              },
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "mockEntityId",
        type: EntityType.INITIATIVE,
        field1: "mock text data",
      };
      const entityType = "mockEntityType";

      const result = getEntityStatus(report, entity, entityType);

      expect(result).toBe(EntityStatuses.INCOMPLETE);
    });

    test("returns complete status for multiple routes of same entityType", () => {
      const report = {
        formTemplate: {
          flatRoutes: [
            {
              entityType: "mockEntityType",
              form: {
                fields: [
                  {
                    id: "field1",
                    type: ReportFormFieldType.TEXT,
                    validation: ValidationType.TEXT,
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
                    type: ReportFormFieldType.TEXT,
                    validation: ValidationType.TEXT,
                  },
                ],
              },
            },
          ],
        },
      } as ReportShape;
      const entity = {
        id: "mockEntityId",
        type: EntityType.INITIATIVE,
        field1: "mock text data",
        field2: "mock text data",
      };
      const entityType = "mockEntityType";

      const result = getEntityStatus(report, entity, entityType);

      expect(result).toBe(EntityStatuses.COMPLETE);
    });
  });

  describe("getInitiativeStatus()", () => {
    const entity = {
      id: "entity1",
      type: EntityType.INITIATIVE,
      isInitiativeClosed: false,
    } as EntityShape;

    describe("closed initiative", () => {
      const closedEntity = {
        ...entity,
        isInitiativeClosed: true,
      } as EntityShape;

      test("returns close status for Work Plan", () => {
        const result = getInitiativeStatus(
          mockWPReportWithOverlays,
          closedEntity
        );

        expect(result).toBe(EntityStatuses.CLOSE);
      });

      test("returns incomplete status for SAR", () => {
        const result = getInitiativeStatus(
          mockSARReportWithOverlays,
          closedEntity
        );

        expect(result).toBe(EntityStatuses.INCOMPLETE);
      });
    });

    describe("initiativeV1", () => {
      test("returns incomplete status for missing WP initiative page", () => {
        const report = {
          ...mockWPReportWithOverlays,
          formTemplate: {
            ...mockWPFullReport.formTemplate,
            routes: [
              {
                name: "mock-initiatives-route",
                path: "/wp/state-or-territory-specific-initiatives",
                children: [
                  {
                    path: "/mock/child-page",
                    entityType: "other entity type",
                  },
                ],
              } as ReportRoute,
            ],
          },
        } as ReportShape;
        const result = getInitiativeStatus(report, entity);

        expect(result).toBe(EntityStatuses.INCOMPLETE);
      });

      test("returns incomplete status for missing SAR initiative page", () => {
        const report = {
          ...mockSARReportWithOverlays,
          formTemplate: {
            ...mockWPFullReport.formTemplate,
            routes: [],
          },
        } as ReportShape;
        const result = getInitiativeStatus(report, entity);

        expect(result).toBe(EntityStatuses.INCOMPLETE);
      });

      test("returns incomplete status for missing child routes", () => {
        const report = {
          ...mockWPReportWithOverlays,
          formTemplate: {
            ...mockWPFullReport.formTemplate,
            routes: [
              {
                name: "mock-initiatives-route",
                path: "/wp/state-or-territory-specific-initiatives",
              } as ReportRoute,
            ],
          },
        } as ReportShape;
        const result = getInitiativeStatus(report, entity);

        expect(result).toBe(EntityStatuses.INCOMPLETE);
      });

      test("returns incomplete status for unknown reportType", () => {
        const report = {
          ...mockWPReportWithOverlays,
          reportType: "unknown",
        } as ReportShape;
        const result = getInitiativeStatus(report, entity);
        expect(result).toBe(EntityStatuses.INCOMPLETE);
      });

      describe("filled initiative", () => {
        test("returns complete status", () => {
          const updatedEntity = {
            ...entity,
            mockStepId1: "mock value",
            mockStepId2: "mock value",
            mockCloseOutStepId: "mock value",
          } as EntityShape;
          expect(
            getInitiativeStatus(mockWPReportWithOverlays, updatedEntity)
          ).toBe(EntityStatuses.COMPLETE);
        });

        test("returns incomplete status", () => {
          const updatedEntity = {
            ...entity,
            mockStepId1: "mock value",
            mockStepId2: "mock value",
          } as EntityShape;

          expect(
            getInitiativeStatus(mockWPReportWithOverlays, updatedEntity)
          ).toBe(EntityStatuses.INCOMPLETE);
        });
      });

      describe("ignored steps", () => {
        const updatedEntity = {
          ...entity,
          mockStepId1: "mock value",
          mockCloseOutStepId: "mock value",
        } as EntityShape;

        test("returns complete status", () => {
          expect(
            getInitiativeStatus(
              mockWPReportWithOverlays,
              updatedEntity,
              false,
              ["other step type" as EntityDetailsOverlayTypes]
            )
          ).toBe(EntityStatuses.COMPLETE);
        });

        test("returns incomplete status", () => {
          expect(
            getInitiativeStatus(
              mockWPReportWithOverlays,
              updatedEntity,
              false,
              []
            )
          ).toBe(EntityStatuses.INCOMPLETE);
        });
      });

      describe("PDF", () => {
        const updatedEntity = {
          ...entity,
          mockStepId1: "mock value",
          mockStepId2: "mock value",
        } as EntityShape;

        test("returns complete status for PDF", () => {
          expect(
            getInitiativeStatus(mockWPReportWithOverlays, updatedEntity, true)
          ).toBe(EntityStatuses.COMPLETE);
        });

        test("returns incomplete status for non-PDF", () => {
          expect(
            getInitiativeStatus(mockWPReportWithOverlays, updatedEntity, false)
          ).toBe(EntityStatuses.INCOMPLETE);
        });
      });
    });

    describe("initiativeV2", () => {
      describe("filled WP initiative", () => {
        const report = {
          ...mockWPReportWithOverlays,
          formTemplate: {
            ...mockWPFullReport.formTemplate,
            routes: [
              {
                name: "mock-initiatives-route",
                path: "/wp/state-or-territory-specific-initiatives",
                children: [
                  {
                    path: "/wp/state-or-territory-specific-initiatives/initiatives",
                    entityType: OverlayModalTypes.INITIATIVE,
                    overlayForm: {
                      fields: [
                        {
                          id: "mockFieldId",
                          type: ReportFormFieldType.TEXT,
                          validation: ValidationType.TEXT,
                        },
                      ],
                    },
                  },
                ],
              } as ReportRoute,
            ],
            flatRoutes: [
              {
                name: "mock-initiatives-route",
                path: "/wp/state-or-territory-specific-initiatives",
              },
              {
                path: "/wp/state-or-territory-specific-initiatives/initiatives",
                entityType: OverlayModalTypes.INITIATIVE,
                overlayForm: {
                  fields: [
                    {
                      id: "mockFieldId",
                      type: ReportFormFieldType.TEXT,
                      validation: ValidationType.TEXT,
                    },
                  ],
                },
              } as ReportRoute,
            ],
          },
        };

        test("returns complete status", () => {
          const updatedEntity = {
            ...entity,
            mockFieldId: "mock value",
          } as EntityShape;
          expect(getInitiativeStatus(report, updatedEntity)).toBe(
            EntityStatuses.COMPLETE
          );
        });

        test("returns incomplete status", () => {
          expect(getInitiativeStatus(report, entity)).toBe(
            EntityStatuses.INCOMPLETE
          );
        });
      });

      describe("filled SAR initiative", () => {
        const report = {
          ...mockSARReportWithOverlays,
          formTemplate: {
            ...mockWPFullReport.formTemplate,
            routes: [
              {
                path: "/sar/state-or-territory-specific-initiatives",
                entityType: OverlayModalTypes.INITIATIVE,
                overlayForm: {
                  fields: [
                    {
                      id: "mockFieldId",
                      type: ReportFormFieldType.TEXT,
                      validation: ValidationType.TEXT,
                    },
                  ],
                },
              } as ReportRoute,
            ],
            flatRoutes: [
              {
                path: "/sar/state-or-territory-specific-initiatives",
                entityType: OverlayModalTypes.INITIATIVE,
                overlayForm: {
                  fields: [
                    {
                      id: "mockFieldId",
                      type: ReportFormFieldType.TEXT,
                      validation: ValidationType.TEXT,
                    },
                  ],
                },
              } as ReportRoute,
            ],
          },
        };

        test("returns complete status", () => {
          const updatedEntity = {
            ...entity,
            mockFieldId: "mock value",
          } as EntityShape;
          expect(getInitiativeStatus(report, updatedEntity)).toBe(
            EntityStatuses.COMPLETE
          );
        });

        test("returns incomplete status", () => {
          expect(getInitiativeStatus(report, entity)).toBe(
            EntityStatuses.INCOMPLETE
          );
        });
      });
    });
  });

  describe("getInitiativeDashboardStatus()", () => {
    test("should find completed fields", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          fields: [
            {
              id: "field1",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
            },
          ],
        },
      } as EntityDetailsOverlayShape;
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
        mockStepType: [
          {
            field1: "mock value",
          },
        ],
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(EntityStatuses.COMPLETE);
    });

    test("should find completed fields for modal form", () => {
      const formEntity = {
        stepType: "mockStepType",
        modalForm: {
          fields: [
            {
              id: "field1",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
            },
          ],
        },
      } as OverlayModalPageShape;
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
        mockStepType: [
          {
            field1: "mock value",
          },
        ],
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(EntityStatuses.COMPLETE);
    });

    test("should find when fields are not completed", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          fields: [
            {
              id: "field1",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
            },
          ],
        },
      } as EntityDetailsOverlayShape;
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
        mockStepType: [
          {
            /* no data */
          },
        ],
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(EntityStatuses.INCOMPLETE);
    });

    test("should find fields in modalForm when there is no form", () => {
      const formEntity = {
        stepType: "mockStepType",
        modalForm: {
          fields: [
            {
              id: "field1",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
            },
          ],
        },
      } as OverlayModalPageShape;
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(EntityStatuses.INCOMPLETE);
    });

    test("should work for entities without steps", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          fields: [
            {
              id: "field1",
              type: ReportFormFieldType.TEXT,
              validation: ValidationType.TEXT,
            },
          ],
        },
      } as EntityDetailsOverlayShape;
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
        field1: "mock value",
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(EntityStatuses.COMPLETE);
    });

    test("should require nested form fields", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          fields: [
            {
              id: "field1",
              type: ReportFormFieldType.RADIO,
              validation: ValidationType.RADIO,
              props: {
                choices: [
                  {
                    id: "choice1",
                    children: [
                      {
                        id: "nestedField2",
                        type: ReportFormFieldType.TEXT,
                        validation: ValidationType.TEXT,
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
        type: EntityType.INITIATIVE,
        field1: "mock value",
        mockObj: {
          key: "choice1Key",
        },
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(EntityStatuses.INCOMPLETE);
    });

    test("should find values for required nested form fields", () => {
      const formEntity = {
        stepType: "mockStepType",
        form: {
          fields: [
            {
              id: "field1",
              type: ReportFormFieldType.RADIO,
              validation: ValidationType.RADIO,
              props: {
                choices: [
                  {
                    id: "choice1",
                    children: [
                      {
                        id: "nestedField2",
                        type: ReportFormFieldType.TEXT,
                        validation: ValidationType.TEXT,
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
        type: EntityType.INITIATIVE,
        field1: "mock value",
        mockObj: {
          key: "choice1Key",
        },
        nestedField2: "mock value",
      };

      const result = getInitiativeDashboardStatus(formEntity, entity);

      expect(result).toBe(EntityStatuses.COMPLETE);
    });
  });

  describe("getCloseoutStatus()", () => {
    test("should return true when an entity includes all fields ", () => {
      const form = {
        id: "form1",
        fields: [
          {
            id: "field1",
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.TEXT,
          },
        ],
      };
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
        field1: "mock value",
      };

      const result = getCloseoutStatus(form, entity);

      expect(result).toBe(true);
    });

    test("should return false when an entity does not include all fields", () => {
      const form = {
        id: "form1",
        fields: [
          {
            id: "field1",
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.TEXT,
          },
        ],
      };
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
      };

      const result = getCloseoutStatus(form, entity);

      expect(result).toBe(false);
    });

    test("should return false for no entity", () => {
      const form = {
        id: "form1",
        fields: [
          {
            id: "field1",
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.TEXT,
          },
        ],
      };

      const result = getCloseoutStatus(form);

      expect(result).toBe(false);
    });

    test("should not require optional fields", () => {
      const form = {
        id: "form1",
        fields: [
          {
            id: "field1",
            type: ReportFormFieldType.TEXT,
            validation: ValidationType.TEXT_OPTIONAL,
          },
          {
            id: "field2",
            type: ReportFormFieldType.TEXT,
            validation: {
              type: ValidationType.TEXT_OPTIONAL,
            },
          },
        ],
      };
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
      };

      const result = getCloseoutStatus(form, entity);

      expect(result).toBe(true);
    });

    test("should require the termination reason for discontinued initiatives", () => {
      const form = {
        id: "form1",
        fields: [],
      };
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
        closeOutInformation_initiativeStatus: [
          {
            value: "Discontinued initiative",
          },
        ],
      } as EntityShape;

      // Without
      let result = getCloseoutStatus(form, entity);
      expect(result).toBe(false);

      // With
      entity["closeOutInformation_initiativeStatus-terminationReason"] =
        "mock text";
      result = getCloseoutStatus(form, entity);
      expect(result).toBe(true);
    });

    test("should require the alternate funding for Medicaid-sustained initiatives", () => {
      const form = {
        id: "form1",
        fields: [],
      };
      const entity = {
        id: "entity1",
        type: EntityType.INITIATIVE,
        closeOutInformation_initiativeStatus: [
          {
            value: "Sustaining initiative through a Medicaid authority",
          },
        ],
      } as EntityShape;

      // Without
      let result = getCloseoutStatus(form, entity);
      expect(result).toBe(false);

      // With
      entity["closeOutInformation_initiativeStatus-alternateFunding"] =
        "mock text";
      result = getCloseoutStatus(form, entity);
      expect(result).toBe(true);
    });
  });
});
