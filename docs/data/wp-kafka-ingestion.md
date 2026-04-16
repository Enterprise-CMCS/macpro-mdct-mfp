# Work Plan Kafka Ingestion Guide

## Overview

This document describes how downstream teams can ingest MFP Work Plan (WP) data from Kafka.

There are three Kafka topics that comprise the WP data surface:

| Topic Name         | Source   | Content                    |
| ------------------ | -------- | -------------------------- |
| `wp-reports`       | DynamoDB | WP report metadata records |
| `wp-form`          | S3       | WP field data JSON         |
| `wp-form-template` | S3       | WP form template JSON      |

Examples of full topic names:

```text
{topicNamespace}aws.mdct.mfp.wp-reports.v0
{topicNamespace}aws.mdct.mfp.wp-form.v0
{topicNamespace}aws.mdct.mfp.wp-form-template.v0
```

---

## MFP Work Plan Topics

### 1. `wp-reports`

| Property             | Type       | Validation | Required? | Nested? | parentFieldName |
| -------------------- | ---------- | ---------- | --------- | ------- | --------------- |
| `reportType`         | text       | string     | true      |         |                 |
| `state`              | text       | string     | true      |         |                 |
| `id`                 | text       | string     | true      |         |                 |
| `submissionName`     | text       | string     | true      |         |                 |
| `status`             | text       | string     | true      |         |                 |
| `fieldDataId`        | text       | string     | true      |         |                 |
| `formTemplateId`     | text       | string     | true      |         |                 |
| `createdAt`          | number     | number     | true      |         |                 |
| `lastAltered`        | number     | number     | true      |         |                 |
| `versionNumber`      | number     | number     |           |         |                 |
| `dueDate`            | text       | string     | true      |         |                 |
| `reportPeriod`       | number     | number     | true      |         |                 |
| `reportYear`         | number     | number     | true      |         |                 |
| `submissionCount`    | number     | number     |           |         |                 |
| `archived`           | boolean    | bool       |           |         |                 |
| `locked`             | boolean    | bool       |           |         |                 |
| `associatedSar`      | text       | string     |           |         |                 |
| `associatedWorkPlan` | text       | string     |           |         |                 |
| `previousRevisions`  | text array | array      |           |         |                 |
| `completionStatus`   | object     | mixed      |           |         |                 |

### 2. `wp-form`

| Property / Field ID                                                              | Type          | Validation         | Required? | Nested? | parentFieldName                                                |
| -------------------------------------------------------------------------------- | ------------- | ------------------ | --------- | ------- | -------------------------------------------------------------- |
| `stateName`                                                                      | text          | text               | true      |         |                                                                |
| `stateOrTerritory`                                                               | text          | text               | true      |         |                                                                |
| `submissionCount`                                                                | number        | number             | true      |         |                                                                |
| `submissionName`                                                                 | text          | text               | true      |         |                                                                |
| `targetPopulations`                                                              | object array  | objectArray        | true      |         |                                                                |
| `initiative`                                                                     | object array  | objectArray        |           |         |                                                                |
| `transitionBenchmarks_targetPopulationName`                                      | text          | text               | true      |         |                                                                |
| `transitionBenchmarks_applicableToMfpDemonstration`                              | radio         | radio              | true      |         |                                                                |
| `quarterlyProjections{YYYY}Q{1-4}`                                               | number        | validInteger       | true      | true    | `transitionBenchmarks_applicableToMfpDemonstration`            |
| `strategy_explanation`                                                           | textarea      | text               | true      |         |                                                                |
| `instructions_selfDirectedInitiatives`                                           | radio         | radio              | true      |         |                                                                |
| `instructions_tribalInitiatives`                                                 | radio         | radio              | true      |         |                                                                |
| `initiative_name`                                                                | textarea      | text               | true      |         |                                                                |
| `initiative_wpTopic`                                                             | radio         | radio              | true      |         |                                                                |
| `initiative_wp_otherTopic`                                                       | text          | text               | true      | true    | `initiative_wpTopic`                                           |
| `defineInitiative_describeInitiative`                                            | textarea      | textCustom         | true      |         |                                                                |
| `defineInitiative_keyActivities`                                                 | dynamic       | dynamic            | true      |         |                                                                |
| `defineInitiative_targetPopulations`                                             | checkbox      | checkbox           | true      |         |                                                                |
| `defineInitiative_startDate`                                                     | radio         | radio              | true      |         |                                                                |
| `defineInitiative_expectedStartDate_value`                                       | date          | date               | true      | true    | `defineInitiative_startDate`                                   |
| `defineInitiative_actualStartDate_value`                                         | date          | date               | true      | true    | `defineInitiative_projectedStartDate`                          |
| `defineInitiative_endDate`                                                       | date          | endDate            | true      |         |                                                                |
| `defineInitiative_purposeAndGoals`                                               | textarea      | text               | true      |         |                                                                |
| `defineInitiative_keyMetrics_performanceIndicators`                              | dynamicObject | dynamicOptional    |           |         |                                                                |
| `defineInitiative_keyMetrics_performanceIndicators-name`                         | text          | text               | true      |         |                                                                |
| `defineInitiative_keyMetrics_performanceIndicators-dataSource`                   | radio         | radio              | true      |         |                                                                |
| `defineInitiative_keyMetrics_performanceIndicators-otherText`                    | text          | text               | true      | true    | `defineInitiative_keyMetrics_performanceIndicators-dataSource` |
| `defineInitiative_keyMetrics_performanceIndicators-baselineValue`                | text          | text               | true      |         |                                                                |
| `defineInitiative_keyMetrics_performanceIndicators-baselineStartDate`            | date          | date               | true      |         |                                                                |
| `defineInitiative_keyMetrics_performanceIndicators-baselineEndDate`              | date          | endDate            | true      |         |                                                                |
| `defineInitiative_keyMetrics_performanceIndicators-targetBenchmarkValue`         | text          | text               | true      |         |                                                                |
| `defineInitiative_keyMetrics_performanceIndicators-targetBenchmarkProjectedDate` | date          | date               | true      |         |                                                                |
| `defineInitiative_qualitativeMethods`                                            | textarea      | textCustomOptional |           |         |                                                                |
| `defineInitiative_fundingSources`                                                | checkbox      | checkbox           | true      |         |                                                                |
| `defineInitiative_projectedEndDate_value`                                        | date          | textOptional       |           |         |                                                                |
| `closeOutInformation_actualEndDate`                                              | date          | dateOptional       |           |         |                                                                |
| `closeOutInformation_initiativeStatus`                                           | checkbox      | checkboxOptional   |           |         |                                                                |
| `closeOutInformation_initiativeStatus-terminationReason`                         | textarea      | text               | true      | true    | `closeOutInformation_initiativeStatus`                         |
| `closeOutInformation_initiativeStatus-alternateFunding`                          | textarea      | text               | true      | true    | `closeOutInformation_initiativeStatus`                         |

Note: `quarterlyProjections{YYYY}Q{1-4}` is generated by the Work Plan form template's `nextTwelveQuarters` transformation. For a Work Plan with `reportYear = 2026`, this expands to `quarterlyProjections2026Q1` through `quarterlyProjections2028Q4`.

### 3. `wp-form-template`

| Property         | Type   | Validation | Required? | Nested? | parentFieldName |
| ---------------- | ------ | ---------- | --------- | ------- | --------------- |
| `type`           | text   |            | true      |         |                 |
| `name`           | text   |            | true      |         |                 |
| `basePath`       | text   |            | true      |         |                 |
| `version`        | text   |            | true      |         |                 |
| `routes`         | array  |            | true      |         |                 |
| `validationJson` | object |            | true      |         |                 |

---

## Join Strategy

The recommended join flow:

1. Read the Work Plan metadata record from `wp-reports`.
2. Extract `fieldDataId`, `formTemplateId`, `state`, and `id`.
3. Join to `wp-form` using S3 object key pattern `fieldData/{state}/{fieldDataId}.json`.
4. Join to `wp-form-template` using S3 object key pattern `formTemplates/{formTemplateId}.json`.
5. Use `associatedSar` if you need lineage from the Work Plan to a SAR created from it.

| Purpose              | Source Topic | Field            |
| -------------------- | ------------ | ---------------- |
| Work Plan identifier | `wp-reports` | `id`             |
| State                | `wp-reports` | `state`          |
| Field data join      | `wp-reports` | `fieldDataId`    |
| Template join        | `wp-reports` | `formTemplateId` |
| Associated SAR       | `wp-reports` | `associatedSar`  |

### Join Example

If `wp-reports` contains the following metadata:

```json
{
  "state": "AL",
  "id": "wp-123",
  "fieldDataId": "field-456",
  "formTemplateId": "template-789",
  "associatedSar": "sar-321"
}
```

Then the related records are:

```text
wp-form message key: fieldData/AL/field-456.json
wp-form-template message key: formTemplates/template-789.json
```

---

## Technical Notes

### The Work Plan Is The Source For SAR Dynamic Content

WP field data is the upstream source for SAR target populations, initiatives, initiative funding sources, and objective targets.

Consumers using both WP and SAR should treat the Work Plan as the source of definition and the SAR as the source of reporting against those definitions.

### The Template Is Already Transformed

The `wp-form-template` topic contains the form template **after** template transformations have been applied.

For Work Plans, this mainly affects quarter-based fields that are relative to the Work Plan report year and period.

### Non-Applicable Populations May Be Removed From Initiative Population Lists

When a user marks a target population as not applicable to the MFP demonstration, the application may remove that population from initiative-specific population lists before persisting updated field data.

Consumers should not assume that all populations named in `targetPopulations` will continue to appear in each initiative’s `defineInitiative_targetPopulations` list.
