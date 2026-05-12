# Financial Report Kafka Ingestion Guide

## Table of Contents

- [Overview](#overview)
- [MFP Financial Report Topics](#mfp-financial-report-topics)
  - [1. `financial-reports`](#1-financial-reports)
  - [2. `financial-form`](#2-financial-form)
  - [3. `financial-form-template`](#3-financial-form-template)
- [Join Strategy](#join-strategy)
  - [Join Example](#join-example)
- [Appendix: Example `financial-reports` message](#appendix-example-financial-reports-message)
- [Appendix: Example `financial-form` message](#appendix-example-financial-form-message)

## Overview

This document describes how downstream teams can ingest MFP Financial Report data from Kafka.

There are three Kafka topics that stream Financial Report data:

| Topic Name                | Source   | Content                             |
| ------------------------- | -------- | ----------------------------------- |
| `financial-reports`       | DynamoDB | Financial report metadata records   |
| `financial-form`          | S3       | Financial report field data JSON    |
| `financial-form-template` | S3       | Financial report form template JSON |

Examples of full topic names:

```text
{topicNamespace}aws.mdct.mfp.financial-reports.v0
{topicNamespace}aws.mdct.mfp.financial-form.v0
{topicNamespace}aws.mdct.mfp.financial-form-template.v0
```

> **Note:** The Financial Report form is feature-gated by a LaunchDarkly flag (`abcdReport`). In environments where the flag is disabled the form will not be available, and no records will appear in these topics.

---

## MFP Financial Report Topics

### 1. `financial-reports`

Contains the report submission metadata, such as submission date, completion status, and due date.

| Property            | Type       | Validation | Required? |
| ------------------- | ---------- | ---------- | --------- |
| `reportType`        | text       | string     | true      |
| `state`             | text       | string     | true      |
| `id`                | text       | string     | true      |
| `submissionName`    | text       | string     | true      |
| `status`            | text       | string     | true      |
| `fieldDataId`       | text       | string     | true      |
| `formTemplateId`    | text       | string     | true      |
| `createdAt`         | number     | number     | true      |
| `dueDate`           | text       | string     | true      |
| `reportPeriod`      | number     | number     | true      |
| `reportYear`        | number     | number     | true      |
| `versionNumber`     | number     | number     |           |
| `completionStatus`  | object     | mixed      |           |
| `isComplete`        | boolean    | bool       |           |
| `lastAltered`       | number     | number     | true      |
| `lastAlteredBy`     | text       | string     |           |
| `submittedBy`       | text       | string     |           |
| `submitterEmail`    | text       | string     |           |
| `submittedOnDate`   | number     | number     |           |
| `previousRevisions` | text array | array      |           |
| `archived`          | boolean    | bool       |           |
| `locked`            | boolean    | bool       |           |
| `submissionCount`   | number     | number     |           |

#### Status values

The `status` field will be one of:

| Value         | Meaning                              |
| ------------- | ------------------------------------ |
| `Not started` | Report created but no data entered   |
| `In progress` | Data entry is underway               |
| `In revision` | Returned for correction after review |
| `Submitted`   | Submitted to CMS                     |
| `Approved`    | Approved by CMS                      |

---

### 2. `financial-form`

The user-entered financial data for a report submission. This topic contains the field data stored as a flat JSON object. Most fields are optional except the two contact fields in General Information; financial amounts are present only when the user has entered data.

Fields are organized by the form's eight routes. Calculated fields (`totalStateTerritoryShare`, `totalFederalShare`) are derived from `totalComputable` and the applicable FMAP percentage stored in `fmap_qualifiedHcbsPercentage` or `fmap_demonstrationServicesPercentage`.

#### Route 1: General Information

| Field ID                          | Type | Validation | Required? |
| --------------------------------- | ---- | ---------- | --------- |
| `generalInformation_contactName`  | text | text       | true      |
| `generalInformation_contactEmail` | text | email      | true      |

Additionally, on submission the following fields are set by the system:

| Field ID                | Notes                         |
| ----------------------- | ----------------------------- |
| `submitterName`         | Full name of submitting user  |
| `submitterEmailAddress` | Email of submitting user      |
| `reportSubmissionDate`  | ET date string, set on submit |

---

#### Route 2: FMAP Percentages

These two percentage fields drive state/territory share and federal share calculations throughout the form. They must be ≤ 90%.

| Field ID                               | Type   | Validation      | Required? | Mask       |
| -------------------------------------- | ------ | --------------- | --------- | ---------- |
| `fmap_qualifiedHcbsPercentage`         | number | number, max 90% | true      | percentage |
| `fmap_demonstrationServicesPercentage` | number | number, max 90% | true      | percentage |

---

#### Route 3: Qualified HCBS

Contains two service tables (State Plan Services and 1915c Waiver Services). Each service row produces three fields following the pattern:

```
{tableId}_{serviceId}-totalComputable
{tableId}_{serviceId}-totalStateTerritoryShare   (calculated, read-only)
{tableId}_{serviceId}-totalFederalShare          (calculated, read-only)
```

All individual service fields use `ValidationType.NUMBER_OPTIONAL` with a currency mask (2 decimal places). Each table also has a totals footer row using the table ID itself as the service ID.

**Table A: State Plan Services** — table ID prefix: `qualifiedHcbs_statePlanServices`

| Service ID (appended to prefix)                   | Label                                                 |
| ------------------------------------------------- | ----------------------------------------------------- |
| `_clinicServices`                                 | Clinic Services                                       |
| `_targetedCaseManagementForLongTermCare`          | Targeted Case Management for Long Term Care           |
| `_pace`                                           | PACE (Program of All-Inclusive Care for the Elderly)  |
| `_rehabilitativeServices`                         | Rehabilitative Services                               |
| `_homeHealthServices`                             | Home Health Services                                  |
| `_hospice`                                        | Hospice                                               |
| `_personalCareServices`                           | Personal Care Services                                |
| `_physicalTherapyServices`                        | Physical Therapy Services                             |
| `_occupationalTherapyServices`                    | Occupational Therapy Services                         |
| `_servicesForSpeechHearingAndLanguageDisorders`   | Services for Speech, Hearing, and Language Disorders  |
| `_selfDirectedPersonalCareServices`               | Self-Directed Personal Care Services                  |
| `_privateDutyNursing`                             | Private Duty Nursing                                  |
| `_otherLicensedPractitionerServices`              | Other Licensed Practitioner Services                  |
| `_preventativeServices`                           | Preventative Services                                 |
| `_healthHomeForEnrolleesWithChronicConditions`    | Health Home for Enrollees with Chronic Conditions     |
| `_healthHomeForEnrolleesWithSubstanceUseDisorder` | Health Home for Enrollees with Substance Use Disorder |

Totals footer field IDs use the bare table ID:

```
qualifiedHcbs_statePlanServices-totalComputable
qualifiedHcbs_statePlanServices-totalStateTerritoryShare
qualifiedHcbs_statePlanServices-totalFederalShare
```

**Table B: 1915c Waiver Services** — table ID prefix: `qualifiedHcbs_1915cWaiverServices`

| Service ID (appended to prefix)                                  | Label                                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `_caseManagement`                                                | Case Management                                                             |
| `_homemakerServices`                                             | Homemaker Services                                                          |
| `_homeHealthAideServices`                                        | Home Health Aide Services                                                   |
| `_adultDayHealth`                                                | Adult Day Health                                                            |
| `_habilitationResidentialHabilitation`                           | Habilitation: Residential Habilitation                                      |
| `_habilitationDayHabilitation`                                   | Habilitation: Day Habilitation                                              |
| `_expandedHabilitationServices42Cfr440180cPrevocationalServices` | Expanded Habilitation Services (42 CFR §440.180(c)): Prevocational Services |
| `_expandedHabilitationServices42Cfr440180cSupportedEmployment`   | Expanded Habilitation Services (42 CFR §440.180(c)): Supported Employment   |
| `_expandedHabilitationServices42Cfr440180cEducation`             | Expanded Habilitation Services (42 CFR §440.180(c)): Education              |
| `_respiteCare`                                                   | Respite Care                                                                |
| `_dayTreatment`                                                  | Day Treatment                                                               |
| `_partialHospitalization`                                        | Partial Hospitalization                                                     |
| `_psychosocialRehabilitation`                                    | Psychosocial Rehabilitation                                                 |
| `_clinicServices`                                                | Clinic Services                                                             |
| `_liveInCaregiver42Cfr441303f8`                                  | Live-In Caregiver (42 CFR §441.303(f)(8))                                   |
| `_captivatedPaymentsForLongTermCareServices`                     | Captivated Payments for Long Term Care Services                             |

Totals footer field IDs:

```
qualifiedHcbs_1915cWaiverServices-totalComputable
qualifiedHcbs_1915cWaiverServices-totalStateTerritoryShare
qualifiedHcbs_1915cWaiverServices-totalFederalShare
```

**Additional field:**

| Field ID                  | Type     | Validation    | Required? |
| ------------------------- | -------- | ------------- | --------- |
| `qualifiedHcbs_narrative` | textarea | text optional |           |

---

#### Route 4: Demonstration Services

Identical structure to Route 3 (Qualified HCBS), using the prefixes `demonstrationServices_statePlanServices` and `demonstrationServices_1915cWaiverServices`. The service ID suffixes and the three-field pattern (`-totalComputable`, `-totalStateTerritoryShare`, `-totalFederalShare`) are the same. Calculations use `fmap_demonstrationServicesPercentage`.

Totals footer field IDs:

```
demonstrationServices_statePlanServices-totalComputable
demonstrationServices_statePlanServices-totalStateTerritoryShare
demonstrationServices_statePlanServices-totalFederalShare

demonstrationServices_1915cWaiverServices-totalComputable
demonstrationServices_1915cWaiverServices-totalStateTerritoryShare
demonstrationServices_1915cWaiverServices-totalFederalShare
```

**Additional field:**

| Field ID                          | Type     | Validation    | Required? |
| --------------------------------- | -------- | ------------- | --------- |
| `demonstrationServices_narrative` | textarea | text optional |           |

---

#### Route 5: Supplemental Services

Contains one table with four fixed service rows and a dynamic "other categories" array. All service rows use the three-field pattern (`-totalComputable`, `-totalStateTerritoryShare`, `-totalFederalShare`) under the prefix `supplementalServices_category`.

**Fixed services:**

| Service ID (appended to `supplementalServices_category`) | Label                                         |
| -------------------------------------------------------- | --------------------------------------------- |
| `_shortTermHousingAssistance`                            | Short-Term Housing Assistance                 |
| `_foodSecurity`                                          | Food Security                                 |
| `_paymentForActivitiesPriorToTransitioning`              | Payment for Activities Prior to Transitioning |
| `_paymentForSecuringACommunityBasedHome`                 | Payment for Securing a Community-Based Home   |

Totals footer field IDs:

```
supplementalServices_category-totalComputable
supplementalServices_category-totalStateTerritoryShare
supplementalServices_category-totalFederalShare
```

**Dynamic rows — `supplementalServices_category_otherCategories` (array):**

Each entry in the array is an object with the following keys:

| Key                        | Type   | Validation      | Notes                 |
| -------------------------- | ------ | --------------- | --------------------- |
| `category`                 | text   | text optional   | User-entered label    |
| `totalComputable`          | number | number optional | Currency, 2 decimals  |
| `totalStateTerritoryShare` | number | number optional | Calculated, read-only |
| `totalFederalShare`        | number | number optional | Calculated, read-only |

**Additional field:**

| Field ID                         | Type     | Validation    | Required? |
| -------------------------------- | -------- | ------------- | --------- |
| `supplementalServices_narrative` | textarea | text optional |           |

---

#### Route 6: Administrative Costs

Contains four tables: Budget Category, Capacity Building, Sub Recipients, and Personnel.

**Table A: Budget Category** — prefix: `administrativeCosts_budgetCategory`

Fixed categories use four fields per row:

```
{prefix}_{categoryId}-totalComputable
{prefix}_{categoryId}-percentageOverride   (optional, ≤100%, overrides default FMAP %)
{prefix}_{categoryId}-totalStateTerritoryShare
{prefix}_{categoryId}-totalFederalShare
```

| Category ID (appended to prefix) | Label           |
| -------------------------------- | --------------- |
| `_personnel`                     | Personnel       |
| `_fringeBenefits`                | Fringe Benefits |
| `_travel`                        | Travel          |
| `_equipment`                     | Equipment       |
| `_supplies`                      | Supplies        |
| `_indirectCosts`                 | Indirect Costs  |

Totals footer field IDs (no percentageOverride on footer):

```
administrativeCosts_budgetCategory-totalComputable
administrativeCosts_budgetCategory-totalStateTerritoryShare
administrativeCosts_budgetCategory-totalFederalShare
```

**Dynamic rows — `administrativeCosts_budgetCategory_miscellaneousCosts` (array):**

Each entry is an object with:

| Key                        | Type   | Validation             | Notes                 |
| -------------------------- | ------ | ---------------------- | --------------------- |
| `category`                 | text   | text optional          | User-entered label    |
| `totalComputable`          | number | number optional        | Currency, 2 decimals  |
| `percentageOverride`       | number | number optional, ≤100% | Percentage mask       |
| `totalStateTerritoryShare` | number | number optional        | Calculated, read-only |
| `totalFederalShare`        | number | number optional        | Calculated, read-only |

---

**Table B: Capacity Building** — prefix: `administrativeCosts_capacityBuilding`

Single row using four fields:

| Field ID                                                                         | Type   | Validation             |
| -------------------------------------------------------------------------------- | ------ | ---------------------- |
| `administrativeCosts_capacityBuilding_capacityBuilding-totalComputable`          | number | number optional        |
| `administrativeCosts_capacityBuilding_capacityBuilding-percentageOverride`       | number | number optional, ≤100% |
| `administrativeCosts_capacityBuilding_capacityBuilding-totalStateTerritoryShare` | number | number optional        |
| `administrativeCosts_capacityBuilding_capacityBuilding-totalFederalShare`        | number | number optional        |

Totals footer field IDs:

```
administrativeCosts_capacityBuilding-totalComputable
administrativeCosts_capacityBuilding-totalStateTerritoryShare
administrativeCosts_capacityBuilding-totalFederalShare
```

---

**Table C: Sub Recipients** — `administrativeCosts_subRecipients_subRecipients` (dynamic array)

Each entry is an object with:

| Key                        | Type     | Validation             | Notes                                    |
| -------------------------- | -------- | ---------------------- | ---------------------------------------- |
| `name`                     | text     | text optional          | Sub recipient organization name          |
| `description`              | textarea | text (max 100 chars)   | Scope of work description                |
| `totalComputable`          | number   | number optional        | Total expenditures; currency, 2 decimals |
| `percentageOverride`       | number   | number optional, ≤100% | Percentage mask                          |
| `totalStateTerritoryShare` | number   | number optional        | Calculated, read-only                    |
| `totalFederalShare`        | number   | number optional        | Calculated, read-only                    |

Totals footer field IDs:

```
administrativeCosts_subRecipients-totalComputable
administrativeCosts_subRecipients-totalStateTerritoryShare
administrativeCosts_subRecipients-totalFederalShare
```

---

**Table D: Personnel** — `administrativeCosts_personnel_positions` (dynamic array)

Each entry is an object with:

| Key                         | Type   | Validation      | Notes                        |
| --------------------------- | ------ | --------------- | ---------------------------- |
| `title`                     | text   | text optional   | Position title               |
| `budgetedFullTimeEmployees` | number | number optional | Float or integer, 2 decimals |
| `filledFullTimeEmployees`   | number | number optional | Float or integer, 2 decimals |

> **Note:** CMS expects a minimum of two FTE entries per Financial Report: an MFP program director and a data analyst.

---

#### Route 7: Totals Summary

Read-only. The totals summary route displays aggregate calculated values pulled from the footer rows of earlier tables. No distinct field data is written to S3 for this route; the values are derived from fields already present in the `financial-form` message.

#### Route 8: Review & Submit

Read-only. No field data is written to S3 for this route.

---

### 3. `financial-form-template`

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

1. Read the Financial Report metadata record from `financial-reports`.
2. Extract `fieldDataId`, `formTemplateId`, `state`, and `id`.
3. Join to `financial-form` using S3 object key pattern `fieldData/{state}/{fieldDataId}.json`.
4. Join to `financial-form-template` using S3 object key pattern `formTemplates/{formTemplateId}.json`.

| Purpose             | Source Topic        | Field            |
| ------------------- | ------------------- | ---------------- |
| Financial report ID | `financial-reports` | `id`             |
| State               | `financial-reports` | `state`          |
| Field data join     | `financial-reports` | `fieldDataId`    |
| Template join       | `financial-reports` | `formTemplateId` |

### Join Example

If `financial-reports` contains the following metadata:

```json
{
  "state": "AL",
  "id": "fr-123",
  "fieldDataId": "field-456",
  "formTemplateId": "template-789"
}
```

Then the related records are:

```text
financial-form message key: fieldData/AL/field-456.json
financial-form-template message key: formTemplates/template-789.json
```

---

## Appendix: Example `financial-reports` message

**Key:**

`AL#fr-${ksuid}`

**Value:**

```json
{
  "NewImage": {
    "reportType": "FINANCIAL_REPORT",
    "state": "AL",
    "id": "${ksuid}",
    "submissionName": "Alabama MFP Financial Report 2026 - Period 1",
    "status": "Submitted",
    "fieldDataId": "field-${ksuid}",
    "formTemplateId": "template-${ksuid}",
    "createdAt": 1735689600000,
    "lastAltered": 1745769600000,
    "lastAlteredBy": "Jane Smith",
    "submittedBy": "Jane Smith",
    "submitterEmail": "jane.smith@alabama.gov",
    "submittedOnDate": 1745769600000,
    "versionNumber": 1,
    "dueDate": "10/01/2026",
    "reportPeriod": 1,
    "reportYear": 2026,
    "submissionCount": 1,
    "archived": false,
    "locked": false,
    "previousRevisions": [],
    "completionStatus": {
      "/financial-report/general-information": true,
      "/financial-report/fmap-percentages": true,
      "/financial-report/qualified-hcbs": true,
      "/financial-report/demonstration-services": true,
      "/financial-report/supplemental-services": true,
      "/financial-report/administrative-costs": false
    }
  },
  "OldImage": {
    "reportType": "FINANCIAL_REPORT",
    "state": "AL",
    "id": "${ksuid}",
    "submissionName": "Alabama MFP Financial Report 2026 - Period 1",
    "status": "In progress",
    "fieldDataId": "field-${ksuid}",
    "formTemplateId": "template-${ksuid}",
    "createdAt": 1735689600000,
    "lastAltered": 1740000000000,
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
    "id": "fr-${ksuid}"
  }
}
```

#### Notes:

- `createdAt`, `lastAltered`, and `submittedOnDate` are epoch milliseconds.
- `completionStatus` is a free-form object that lists the form's routes and indicates field completion on each route.
- `submittedBy`, `submitterEmail`, and `submittedOnDate` are only present after the report has been submitted.

---

## Appendix: Example `financial-form` message

**Key:**

`fieldData/AL/${ksuid}.json`

**Value:**

```json
{
  "generalInformation_contactName": "Jane Smith",
  "generalInformation_contactEmail": "jane.smith@alabama.gov",

  "fmap_qualifiedHcbsPercentage": "75.32",
  "fmap_demonstrationServicesPercentage": "75.32",

  "qualifiedHcbs_statePlanServices_clinicServices-totalComputable": "50000.00",
  "qualifiedHcbs_statePlanServices_clinicServices-totalStateTerritoryShare": "12340.00",
  "qualifiedHcbs_statePlanServices_clinicServices-totalFederalShare": "37660.00",
  "qualifiedHcbs_statePlanServices_homeHealthServices-totalComputable": "120000.00",
  "qualifiedHcbs_statePlanServices_homeHealthServices-totalStateTerritoryShare": "29616.00",
  "qualifiedHcbs_statePlanServices_homeHealthServices-totalFederalShare": "90384.00",
  "qualifiedHcbs_statePlanServices-totalComputable": "170000.00",
  "qualifiedHcbs_statePlanServices-totalStateTerritoryShare": "41956.00",
  "qualifiedHcbs_statePlanServices-totalFederalShare": "128044.00",

  "qualifiedHcbs_1915cWaiverServices_caseManagement-totalComputable": "80000.00",
  "qualifiedHcbs_1915cWaiverServices_caseManagement-totalStateTerritoryShare": "19744.00",
  "qualifiedHcbs_1915cWaiverServices_caseManagement-totalFederalShare": "60256.00",
  "qualifiedHcbs_1915cWaiverServices-totalComputable": "80000.00",
  "qualifiedHcbs_1915cWaiverServices-totalStateTerritoryShare": "19744.00",
  "qualifiedHcbs_1915cWaiverServices-totalFederalShare": "60256.00",

  "qualifiedHcbs_narrative": "All qualified HCBS services are provided through the existing state plan and approved 1915(c) waivers.",

  "demonstrationServices_statePlanServices_clinicServices-totalComputable": "30000.00",
  "demonstrationServices_statePlanServices_clinicServices-totalStateTerritoryShare": "7404.00",
  "demonstrationServices_statePlanServices_clinicServices-totalFederalShare": "22596.00",
  "demonstrationServices_statePlanServices-totalComputable": "30000.00",
  "demonstrationServices_statePlanServices-totalStateTerritoryShare": "7404.00",
  "demonstrationServices_statePlanServices-totalFederalShare": "22596.00",

  "demonstrationServices_1915cWaiverServices-totalComputable": "0.00",
  "demonstrationServices_1915cWaiverServices-totalStateTerritoryShare": "0.00",
  "demonstrationServices_1915cWaiverServices-totalFederalShare": "0.00",

  "demonstrationServices_narrative": "",

  "supplementalServices_category_shortTermHousingAssistance-totalComputable": "15000.00",
  "supplementalServices_category_shortTermHousingAssistance-totalStateTerritoryShare": "3702.00",
  "supplementalServices_category_shortTermHousingAssistance-totalFederalShare": "11298.00",
  "supplementalServices_category_foodSecurity-totalComputable": "5000.00",
  "supplementalServices_category_foodSecurity-totalStateTerritoryShare": "1234.00",
  "supplementalServices_category_foodSecurity-totalFederalShare": "3766.00",
  "supplementalServices_category_paymentForActivitiesPriorToTransitioning-totalComputable": "0.00",
  "supplementalServices_category_paymentForActivitiesPriorToTransitioning-totalStateTerritoryShare": "0.00",
  "supplementalServices_category_paymentForActivitiesPriorToTransitioning-totalFederalShare": "0.00",
  "supplementalServices_category_paymentForSecuringACommunityBasedHome-totalComputable": "0.00",
  "supplementalServices_category_paymentForSecuringACommunityBasedHome-totalStateTerritoryShare": "0.00",
  "supplementalServices_category_paymentForSecuringACommunityBasedHome-totalFederalShare": "0.00",
  "supplementalServices_category-totalComputable": "20000.00",
  "supplementalServices_category-totalStateTerritoryShare": "4936.00",
  "supplementalServices_category-totalFederalShare": "15064.00",
  "supplementalServices_category_otherCategories": [
    {
      "category": "Transportation Assistance",
      "totalComputable": "8000.00",
      "totalStateTerritoryShare": "1974.40",
      "totalFederalShare": "6025.60"
    }
  ],
  "supplementalServices_narrative": "",

  "administrativeCosts_budgetCategory_personnel-totalComputable": "200000.00",
  "administrativeCosts_budgetCategory_personnel-percentageOverride": "",
  "administrativeCosts_budgetCategory_personnel-totalStateTerritoryShare": "49360.00",
  "administrativeCosts_budgetCategory_personnel-totalFederalShare": "150640.00",
  "administrativeCosts_budgetCategory_fringeBenefits-totalComputable": "40000.00",
  "administrativeCosts_budgetCategory_fringeBenefits-percentageOverride": "",
  "administrativeCosts_budgetCategory_fringeBenefits-totalStateTerritoryShare": "9872.00",
  "administrativeCosts_budgetCategory_fringeBenefits-totalFederalShare": "30128.00",
  "administrativeCosts_budgetCategory_travel-totalComputable": "5000.00",
  "administrativeCosts_budgetCategory_travel-percentageOverride": "",
  "administrativeCosts_budgetCategory_travel-totalStateTerritoryShare": "1234.00",
  "administrativeCosts_budgetCategory_travel-totalFederalShare": "3766.00",
  "administrativeCosts_budgetCategory_equipment-totalComputable": "0.00",
  "administrativeCosts_budgetCategory_equipment-percentageOverride": "",
  "administrativeCosts_budgetCategory_equipment-totalStateTerritoryShare": "0.00",
  "administrativeCosts_budgetCategory_equipment-totalFederalShare": "0.00",
  "administrativeCosts_budgetCategory_supplies-totalComputable": "2000.00",
  "administrativeCosts_budgetCategory_supplies-percentageOverride": "",
  "administrativeCosts_budgetCategory_supplies-totalStateTerritoryShare": "493.60",
  "administrativeCosts_budgetCategory_supplies-totalFederalShare": "1506.40",
  "administrativeCosts_budgetCategory_indirectCosts-totalComputable": "10000.00",
  "administrativeCosts_budgetCategory_indirectCosts-percentageOverride": "50",
  "administrativeCosts_budgetCategory_indirectCosts-totalStateTerritoryShare": "5000.00",
  "administrativeCosts_budgetCategory_indirectCosts-totalFederalShare": "5000.00",
  "administrativeCosts_budgetCategory-totalComputable": "257000.00",
  "administrativeCosts_budgetCategory-totalStateTerritoryShare": "65959.60",
  "administrativeCosts_budgetCategory-totalFederalShare": "191040.40",
  "administrativeCosts_budgetCategory_miscellaneousCosts": [
    {
      "category": "Printing and Publications",
      "totalComputable": "1500.00",
      "percentageOverride": "",
      "totalStateTerritoryShare": "370.20",
      "totalFederalShare": "1129.80"
    }
  ],

  "administrativeCosts_capacityBuilding_capacityBuilding-totalComputable": "25000.00",
  "administrativeCosts_capacityBuilding_capacityBuilding-percentageOverride": "",
  "administrativeCosts_capacityBuilding_capacityBuilding-totalStateTerritoryShare": "6170.00",
  "administrativeCosts_capacityBuilding_capacityBuilding-totalFederalShare": "18830.00",
  "administrativeCosts_capacityBuilding-totalComputable": "25000.00",
  "administrativeCosts_capacityBuilding-totalStateTerritoryShare": "6170.00",
  "administrativeCosts_capacityBuilding-totalFederalShare": "18830.00",

  "administrativeCosts_subRecipients_subRecipients": [
    {
      "name": "Alabama HCBS Support Center",
      "description": "Provides transition coordination for MFP-eligible populations across all regions.",
      "totalComputable": "75000.00",
      "percentageOverride": "",
      "totalStateTerritoryShare": "18510.00",
      "totalFederalShare": "56490.00"
    }
  ],
  "administrativeCosts_subRecipients-totalComputable": "75000.00",
  "administrativeCosts_subRecipients-totalStateTerritoryShare": "18510.00",
  "administrativeCosts_subRecipients-totalFederalShare": "56490.00",

  "administrativeCosts_personnel_positions": [
    {
      "title": "MFP Program Director",
      "budgetedFullTimeEmployees": "1.00",
      "filledFullTimeEmployees": "1.00"
    },
    {
      "title": "Data Analyst",
      "budgetedFullTimeEmployees": "1.00",
      "filledFullTimeEmployees": "0.50"
    }
  ],

  "submitterName": "Jane Smith",
  "submitterEmailAddress": "jane.smith@alabama.gov",
  "reportSubmissionDate": "05/12/2026"
}
```

#### Notes:

- All currency values are stored as strings with 2 decimal places (e.g., `"50000.00"`).
- All percentage values are stored as strings (e.g., `"75.32"`).
- `totalStateTerritoryShare` and `totalFederalShare` are calculated by the UI from `totalComputable` and the applicable FMAP percentage. They are stored as strings in S3.
- `percentageOverride` overrides the default FMAP rate for a specific row. When not set by the user, it is stored as an empty string `""`.
- Fields with no user input are stored as `"0.00"` for currency fields.
- Dynamic row arrays (`otherCategories`, `miscellaneousCosts`, `subRecipients`, `positions`) may be empty arrays `[]` if the user has not added any rows.
- `submitterName`, `submitterEmailAddress`, and `reportSubmissionDate` are added by the system on form submission.
