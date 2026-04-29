# Work Plan Kafka Ingestion Guide

## Table of Contents

- [Overview](#overview)
- [MFP Work Plan Topics](#mfp-work-plan-topics)
  - [1. `wp-reports`](#1-wp-reports)
  - [2. `wp-form`](#2-wp-form)
  - [3. `wp-form-template`](#3-wp-form-template)
- [Join Strategy](#join-strategy)
  - [Join Example](#join-example)
- [Appendix: Example `wp-reports` message](#appendix-example-wp-reports-message)
- [Appendix: Example `wp-form` message](#appendix-example-wp-form-message)

## Overview

This document describes how downstream teams can ingest MFP Work Plan (WP) data from Kafka.

There are three Kafka topics that stream WP data:

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

Contains the report submission metadata, such as submission date, completion status, and due date.

| Property             | Type       | Validation | Required? |
| -------------------- | ---------- | ---------- | --------- |
| `reportType`         | text       | string     | true      |
| `state`              | text       | string     | true      |
| `id`                 | text       | string     | true      |
| `submissionName`     | text       | string     | true      |
| `status`             | text       | string     | true      |
| `fieldDataId`        | text       | string     | true      |
| `formTemplateId`     | text       | string     | true      |
| `createdAt`          | number     | number     | true      |
| `lastAltered`        | number     | number     | true      |
| `versionNumber`      | number     | number     |           |
| `dueDate`            | text       | string     | true      |
| `reportPeriod`       | number     | number     | true      |
| `reportYear`         | number     | number     | true      |
| `submissionCount`    | number     | number     |           |
| `archived`           | boolean    | bool       |           |
| `locked`             | boolean    | bool       |           |
| `associatedSar`      | text       | string     |           |
| `associatedWorkPlan` | text       | string     |           |
| `previousRevisions`  | text array | array      |           |
| `completionStatus`   | object     | mixed      |           |

### 2. `wp-form`

The user-entered data for a report submission. This is unique to each state and each report.

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
| `generalInformation_resubmissionInformation`                                     | textarea      | text               |           |         |                                                                |
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

#### Notes:

- Radio/checkbox fields are arrays of `{ key, value }` objects.
- `quarterlyProjections{YYYY}Q{1-4}` is dynamically generated based on the Work Plan's `reportYear` and `reportPeriod`. For report year 2026, this expands to `2026Q1` - `2028Q4`.
- Target populations marked `applicableToMfpDemonstration = "No"` will not have quarterly projection fields.
- `generalInformation_resubmissionInformation` is only present when the Work Plan is a resubmission.

### 3. `wp-form-template`

The schema for the form. It contains information about the content included for each route of the UI, including text content and form fields, as well as types and validation.

| Property         | Type   | Validation | Required? |
| ---------------- | ------ | ---------- | --------- |
| `type`           | text   |            | true      |
| `name`           | text   |            | true      |
| `basePath`       | text   |            | true      |
| `version`        | text   |            | true      |
| `routes`         | array  |            | true      |
| `validationJson` | object |            | true      |

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

## Appendix: Example `wp-reports` message

**Key:**

`AL#wp-123`

**Value:**

```json
{
  "NewImage": {
    "reportType": "WP",
    "state": "AL",
    "id": "wp-123",
    "submissionName": "Alabama MFP Work Plan 2026 - Period 1",
    "status": "In progress",
    "fieldDataId": "field-456",
    "formTemplateId": "template-789",
    "createdAt": 1735689600000,
    "lastAltered": 1745769600000,
    "versionNumber": 1,
    "dueDate": "10/01/2026",
    "reportPeriod": 1,
    "reportYear": 2026,
    "submissionCount": 0,
    "archived": false,
    "locked": false,
    "associatedSar": "sar-321",
    "previousRevisions": [],
    "completionStatus": {
      "/wp/general-information": true,
      "/wp/transition-benchmarks": true,
      "/wp/transition-benchmark-strategy": true,
      "/wp/state-or-territory-specific-initiatives": false
    }
  },
  "OldImage": {
    "reportType": "WP",
    "state": "AL",
    "id": "wp-123",
    "submissionName": "Alabama MFP Work Plan 2026 - Period 1",
    "status": "Not started",
    "fieldDataId": "field-456",
    "formTemplateId": "template-789",
    "createdAt": 1735689600000,
    "lastAltered": 1735689600000,
    "versionNumber": 1,
    "dueDate": "10/01/2026",
    "reportPeriod": 1,
    "reportYear": 2026,
    "submissionCount": 0,
    "archived": false,
    "locked": false,
    "previousRevisions": []
  },
  "Keys": {
    "state": "AL",
    "id": "wp-123"
  }
}
```

#### Notes:

- `createdAt` and `lastAltered` are epoch milliseconds.
- `associatedSar` is only present if a user has created a SAR from the WP.
- `completionStatus` is a free-form object that lists the form's routes and indicates the completion of fields on each route.

---

## Appendix: Example `wp-form` message

**Key:**

`fieldData/AL/field-456.json`

**Value:**

```json
{
  "stateName": "Alabama",
  "stateOrTerritory": "AL",
  "submissionCount": 1,
  "submissionName": "Alabama MFP Work Plan 2026 - Period 1",
  "strategy_explanation": "Alabama will continue to expand HCBS access through targeted transition initiatives and housing supports.",
  "instructions_selfDirectedInitiatives": [
    {
      "key": "instructions_selfDirectedInitiatives-456wxyz",
      "value": "No"
    }
  ],
  "instructions_tribalInitiatives": [
    {
      "key": "instructions_tribalInitiatives-789abcd",
      "value": "No"
    }
  ],
  "targetPopulations": [
    {
      "id": "2Vd02CVUtKgBETwqzDXpSIhi",
      "isRequired": true,
      "transitionBenchmarks_targetPopulationName": "Older adults",
      "transitionBenchmarks_applicableToMfpDemonstration": [
        {
          "key": "transitionBenchmarks_applicableToMfpDemonstration-1234qwerty",
          "value": "Yes"
        }
      ],
      "quarterlyProjections2026Q1": "10",
      "quarterlyProjections2026Q2": "12",
      "quarterlyProjections2026Q3": "14",
      "quarterlyProjections2026Q4": "16",
      "quarterlyProjections2027Q1": "18",
      "quarterlyProjections2027Q2": "20",
      "quarterlyProjections2027Q3": "22",
      "quarterlyProjections2027Q4": "24",
      "quarterlyProjections2028Q1": "26",
      "quarterlyProjections2028Q2": "28",
      "quarterlyProjections2028Q3": "30",
      "quarterlyProjections2028Q4": "32"
    },
    {
      "id": "123456",
      "isRequired": true,
      "transitionBenchmarks_targetPopulationName": "Individuals with physical disabilities (PD)",
      "transitionBenchmarks_targetPopulationName_short": "PD",
      "transitionBenchmarks_applicableToMfpDemonstration": [
        {
          "key": "transitionBenchmarks_applicableToMfpDemonstration-12abc34",
          "value": "No"
        }
      ]
    },
    {
      "id": "67890",
      "isRequired": true,
      "transitionBenchmarks_targetPopulationName": "Individuals with intellectual and developmental disabilities (I/DD)",
      "transitionBenchmarks_targetPopulationName_short": "I/DD",
      "transitionBenchmarks_applicableToMfpDemonstration": [
        {
          "key": "transitionBenchmarks_applicableToMfpDemonstration-56yz78",
          "value": "Yes"
        }
      ],
      "quarterlyProjections2026Q1": "5",
      "quarterlyProjections2026Q2": "6",
      "quarterlyProjections2026Q3": "7",
      "quarterlyProjections2026Q4": "8",
      "quarterlyProjections2027Q1": "9",
      "quarterlyProjections2027Q2": "10",
      "quarterlyProjections2027Q3": "11",
      "quarterlyProjections2027Q4": "12",
      "quarterlyProjections2028Q1": "13",
      "quarterlyProjections2028Q2": "14",
      "quarterlyProjections2028Q3": "15",
      "quarterlyProjections2028Q4": "16"
    },
    {
      "id": "01357",
      "isRequired": true,
      "transitionBenchmarks_targetPopulationName": "Individuals with mental health and substance use disorders (MH/SUD)",
      "transitionBenchmarks_targetPopulationName_short": "MH/SUD",
      "transitionBenchmarks_applicableToMfpDemonstration": [
        {
          "key": "transitionBenchmarks_applicableToMfpDemonstration-tuv890",
          "value": "No"
        }
      ]
    }
  ],
  "initiative": [
    {
      "id": "abcxyz",
      "type": "initiative",
      "isOtherEntity": true,
      "initiative_name": "Statewide Transition Coordination Expansion",
      "initiative_wpTopic": [
        {
          "key": "initiative_wpTopic-123",
          "value": "Transitions and transition coordination services*"
        }
      ],
      "initiative_wp_otherTopic": "",
      "defineInitiative_describeInitiative": "Expand transition coordination capacity across all regions of the state.",
      "defineInitiative_targetPopulations": [
        {
          "key": "targetPopulations-123abc",
          "value": "Older adults"
        },
        {
          "key": "targetPopulations-456xyz",
          "value": "Individuals with intellectual and developmental disabilities (I/DD)"
        }
      ],
      "defineInitiative_startDate": [
        {
          "key": "defineInitiative_startDate-789tuv",
          "value": "Expected start date"
        }
      ],
      "defineInitiative_expectedStartDate_value": "01/01/2026",
      "defineInitiative_actualStartDate_value": "",
      "defineInitiative_endDate": "12/31/2028",
      "defineInitiative_purposeAndGoals": "Increase the number of successful community transitions for older adults and I/DD populations.",
      "defineInitiative_keyActivities": [
        {
          "id": "123-abc",
          "name": "Hire and train regional transition coordinators."
        }
      ],
      "defineInitiative_keyMetrics_performanceIndicators": [
        {
          "id": "456-def",
          "defineInitiative_keyMetrics_performanceIndicators-name": "Number of successful community transitions",
          "defineInitiative_keyMetrics_performanceIndicators-dataSource": [
            {
              "key": "defineInitiative_keyMetrics_performanceIndicators-dataSource-otherKey",
              "value": "Other, specify"
            }
          ],
          "defineInitiative_keyMetrics_performanceIndicators-otherText": "State MMIS transition tracking report",
          "defineInitiative_keyMetrics_performanceIndicators-baselineValue": "120",
          "defineInitiative_keyMetrics_performanceIndicators-baselineStartDate": "01/01/2025",
          "defineInitiative_keyMetrics_performanceIndicators-baselineEndDate": "12/31/2025",
          "defineInitiative_keyMetrics_performanceIndicators-targetBenchmarkValue": "200",
          "defineInitiative_keyMetrics_performanceIndicators-targetBenchmarkProjectedDate": "12/31/2028"
        }
      ],
      "defineInitiative_qualitativeMethods": "Quarterly stakeholder interviews with transition coordinators and participants.",
      "defineInitiative_fundingSources": [
        {
          "key": "defineInitiative_fundingSources-awTB7dbwBc8x3fRjbWIRlC",
          "value": "MFP administrative cooperative agreement funding"
        }
      ],
      "closeOutInformation_actualEndDate": "",
      "closeOutInformation_initiativeStatus": []
    }
  ]
}
```

#### Notes:

- `defineInitiative_keyMetrics_performanceIndicators` may be an empty array if the user has not yet entered any indicators.
