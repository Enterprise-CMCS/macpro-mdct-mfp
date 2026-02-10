# Semi-Annual Progress Report (SAR) Schema Documentation

## Overview

The SAR (Semi-Annual Progress Report) is a form schema used for MFP (Money Follows the Person) demonstration reporting. This document explains the schema structure and, critically, how **target populations** and **state/territory-specific initiatives** are dynamically generated from the associated Work Plan (WP), creating a ripple effect on field IDs throughout the SAR.

## Table of Contents

1. [Schema Metadata](#schema-metadata)
2. [Dynamic Content Relationship with Work Plan](#dynamic-content-relationship-with-work-plan)
3. [Static SAR Sections](#static-sections)
   a. [General Information](#static-general)
   b. [Organization & Administration](#static-oa)
   c. [Additional Achievements](#static-aa)
4. [Dynamic SAR Sections](#dynamic-sections)
   a. [Retirement, Enrollment, and Transitions](#dynamic-ret)
   b. [State or Territory-Specific Initiatives](#dynamic-initiatives)
5. [Appendix: Validation Types](#appendix-validation)
6. [Appendix: Common Target Populations](#appendix-populations)
7. [Appendix: Common Initiative Topics](#appendix-topics)
8. [Appendix: RET Index Mapping](#appendix-ret)

---

## Schema Metadata

```json
{
  "type": "SAR",
  "name": "MFP Semi-Annual Progress Report (SAR)",
  "basePath": "/sar",
  "version": "SAR_2023-08-21" // Note: this version attribute is never updated and to date is not used for anything
}
```

| Property   | Description                |
| ---------- | -------------------------- |
| `type`     | Report type identifier     |
| `name`     | Human-readable report name |
| `basePath` | URL base path for routing  |
| `version`  | Schema version (unused)    |

---

## Dynamic Content Relationship with Work Plan

### The Core Challenge

The SAR schema is **not fully static**. Two key elements are dynamically populated from the state/territory's approved MFP Work Plan:

1. **Target Populations** - The populations served by the MFP program
2. **Initiatives** - State/territory-specific initiatives with their objectives, funding sources, and evaluation plans

This creates a **ripple effect** where field IDs throughout the SAR contain embedded references to:

- Target population names
- Reporting periods (e.g., `Period2`)
- Initiative IDs (UUIDs)
- Objective IDs (UUIDs)
- Funding source IDs (UUIDs)
- Quarter identifiers (e.g., `2025Q3`, `2025Q4`)

### SAR Schema Generation

When a SAR is created:

1. The system determines the approved Work Plan (WP) based on reporting period and year
2. Static sections are generated from the SAR form template
3. Target populations and initiatives are extracted from the WP
4. These entities are used to transform template fields into actual SAR form fields

- The WP target populations are used to generate the SAR's RET fields
- The WP initiatives are used to generate the initiative sections of the SAR
- For each WP initiative, the system iterates over its funding sources and objectives to generate form fields within the initiative section

5. The resulting schema is unique to each state/territory's specific configuration

### How Dynamic Field IDs Are Constructed

#### Target Population Fields

For fields that require per-population data, the field ID follows this pattern:

```
{section}_{subsection}_populations_{Period}_{POPULATION_NAME}
```

Where `{POPULATION_NAME}` comes from the Work Plan and could be any of:

- `Older adults`
- `Individuals with physical disabilities (PD)`
- `Individuals with intellectual or developmental disabilities (I/DD)`
- `Individuals with mental health and substance use disorders (MH/SUD)`
- Custom population names defined in the Work Plan _(this is free text that will be unique to every state's submission)_

**Example:**

```
ret_psmicf_target_populations_Period2_Older adults
ret_psmicf_target_populations_Period2_Individuals with physical disabilities (PD)
ret_psmicf_target_populations_Period2_Individuals with mental health and substance use disorders (MH/SUD)
```

#### Initiative Fields

Initiative-related fields embed the initiative UUID:

```
fundingSources_actual_{QUARTER}_{FUNDING_SOURCE_UUID}
fundingSources_projected_{QUARTER}_{FUNDING_SOURCE_UUID}
```

**Example:**

```
fundingSources_actual_2025Q3_4771e55-7e8-7a18-a867-d3e3a5cd5e
fundingSources_projected_2025Q4_a84f33-b382-5671-8c42-5bf844ad8c37
```

---

## Static Sections

### 1. General Information (`/sar/general-information`)

| Field ID                                            | Type       | Validation |
| --------------------------------------------------- | ---------- | ---------- |
| `generalInformation_resubmissionInformation`        | `textarea` | `text`     |
| `generalInformation_MfpOperatingOrganizationName`   | `text`     | `text`     |
| `generalInformation_stateTerritoryMedicaidAgency`   | `text`     | `text`     |
| `generalInformation_stateTerritoryMedicaidDirector` | `text`     | `text`     |
| `generalInformation_mfpProgramPublicName`           | `text`     | `text`     |
| `generalInformation_mfpProgramWebsite`              | `text`     | `url`      |
| `generalInformation_aorName`                        | `text`     | `text`     |
| `generalInformation_aorTitleAgency`                 | `text`     | `text`     |
| `generalInformation_aorEmail`                       | `text`     | `email`    |
| `generalInformation_hasAorChangedSinceLastReport`   | `radio`    | `radio`    |
| `generalInformation_projectDirectorName`            | `text`     | `text`     |
| `generalInformation_projectDirectorTitle`           | `text`     | `text`     |
| `generalInformation_projectDirectorEmail`           | `text`     | `email`    |
| `generalInformation_cmsProjectOfficerName`          | `text`     | `text`     |

### 2. Organization & Administration (`/sar/organization-and-administration`)

| Field ID                                           | Type       | Validation      |
| -------------------------------------------------- | ---------- | --------------- |
| `oa_changesOrganizationAdministration`             | `radio`    | `radio`         |
| `oa_describeOAChanges`                             | `textarea` | `text` (nested) |
| `oa_projectDirectorEmployment`                     | `radio`    | `radio`         |
| `oa_provideNameOfEmployerAndReportingRelationship` | `textarea` | `text` (nested) |
| `oa_hiringRetentionChallengesMfpStaff`             | `radio`    | `radio`         |
| `oa_describeHiringRetentionChallenges`             | `textarea` | `text` (nested) |
| `oa_describeTechnicalAssitanceActivities`          | `textarea` | `text`          |
| `oa_additionalTechnicalResourcesSupports`          | `radio`    | `radio`         |
| `oa_describeAdditionalTechnicalResourcesSupports`  | `textarea` | `text` (nested) |

### 3. Additional Achievements (`/sar/additional-achievements`)

| Field ID                                   | Type       | Validation      |
| ------------------------------------------ | ---------- | --------------- |
| `aa_notableAchievementsPromisingPractices` | `textarea` | `text`          |
| `aa_changesMfpProgramAdministration`       | `radio`    | `radio`         |
| `oa_describeDevelopmentsChanges`           | `textarea` | `text` (nested) |

---

## Dynamic Sections

### 1. Recruitment, Enrollment, and Transitions (RET)

The RET section contains multiple subsections, each with fields dynamically generated per target population.

#### RET Subsections and Their Form IDs

| Subsection                      | Form ID       | Field ID Pattern                    | Type     | Validation     |
| ------------------------------- | ------------- | ----------------------------------- | -------- | -------------- |
| People signed informed consent  | `ret-psmicf`  | `ret_psmicf_target_populations_`    | `number` | `validInteger` |
| MFP transitions (quarterly)     | `ret-mtrp`    | `ret_mtrp_quarter_{N}_populations_` | `number` | `validInteger` |
| Transitions from institutions   | `ret-mtfqi`   | `ret-mtfqi-{N}-populations_`        | `number` | `validInteger` |
| Transitions to residences       | `ret-mtfqr`   | `ret-mtfqr-{N}-populations_`        | `number` | `validInteger` |
| Active MFP participants         | `ret-tnamprp` | `ret-tnamprp-1-populations_`        | `number` | `validInteger` |
| Participants completing program | `ret-nmpcprp` | `ret-nmpcprp-1-populations_`        | `number` | `validInteger` |
| Re-enrolled participants        | `ret-npremrp` | `ret-npremrp-1-populations_`        | `number` | `validInteger` |
| Disenrolled participants        | `ret-mpdprp`  | `ret-mpdprp-{N}-populations_`       | `number` | `validInteger` |

The RET section also contains an optional subsection for some reports.

| Subsection        | Field ID Pattern                   | Type     | Validation             |
| ----------------- | ---------------------------------- | -------- | ---------------------- |
| HCBS Participants | `ret_shortTermStayAges{AgeRange}`  | `number` | `validIntegerOptional` |
| HCBS Participants | `ret_mediumTermStayAges{AgeRange}` | `number` | `validIntegerOptional` |
| HCBS Participants | `ret_longTermStayAges{AgeRange}`   | `number` | `validIntegerOptional` |

Where `{AgeRange}` is one of:

- `18to64`
- `65to74`
- `75to84`
- `85AndOlder`

#### Institution Types (ret-mtfqi index mapping)

| Index | Institution Type |
| ----- | ---------------- |
| 1     | Nursing facility |
| 2     | ICF/IID          |
| 3     | IMD              |
| 4     | Hospital         |
| 5     | Other            |

#### Residence Types (ret-mtfqr index mapping)

| Index | Residence Type            |
| ----- | ------------------------- |
| 1     | Home (owned/leased)       |
| 2     | Apartment                 |
| 3     | Group home (≤4 unrelated) |
| 4     | Qualified assisted living |

#### Disenrollment Reasons (ret-mpdprp index mapping)

| Index | Reason                               |
| ----- | ------------------------------------ |
| 1     | Re-institutionalization              |
| 2     | Death                                |
| 3     | Voluntary disenrollment              |
| 4     | Other (checkbox with nested options) |

### 2. State or Territory-Specific Initiatives

This is the most complex dynamic section. Initiatives are entirely imported from the Work Plan.

#### Initiative Structure

```typescript
interface Initiative {
  initiativeId: string; // UUID from Work Plan
  name: string; // Initiative name
  topic: string; // MFP Work Plan topic category
  dashboard: DashboardConfig;
  entitySteps: EntityStep[]; // Always 3 steps: Objectives Progress, Initiative Progress, Expenditures
}
```

#### Initiative Entity Steps

##### Step 1: Objectives Progress

| Subsection          | Field ID                                           | Type       | Validation      |
| ------------------- | -------------------------------------------------- | ---------- | --------------- |
| Objectives Progress | `objectivesProgress_performanceMeasuresIndicators` | `textarea` | `text`          |
| Objectives Progress | `objectivesProgress_deliverablesMet`               | `radio`    | `radio`         |
| Objectives Progress | `objectivesProgress_deliverablesMet_otherText`     | `textarea` | `text` (nested) |
| Objectives Progress | `objectiveTargets_actual_{Quarter}`                | `text`     | `text`          |
| Objectives Progress | `objectiveTargets_projections_{Quarter}`           | `text`     | `text`          |

##### Step 2: Initiative Progress

| Subsection          | Field ID                                                       | Type       | Validation |
| ------------------- | -------------------------------------------------------------- | ---------- | ---------- |
| Initiative Progress | `initiativeProgress_describeProgress`                          | `textarea` | `text`     |
| Initiative Progress | `initiativeProgress_describeIssuesChallenges`                  | `textarea` | `text`     |
| Initiative Progress | `initiativeProgress_describeCollaborationsWithExternalParties` | `textarea` | `text`     |

##### Step 3: Expenditures

This section contains information about the expenditures and funding sources. This section's fields are **entirely dynamic** based on funding sources from the Work Plan.

**Field ID Patterns for funding sources:**

```
fundingSources_actual_{Quarter}_{FundingSourceUUID}
fundingSources_projected_{Quarter}_{FundingSourceUUID}
```

**Example:**

```
fundingSources_projected_2025Q1_3500b73-1db-ead3-3c0b-a0c0e48d486
fundingSources_actual_2025Q1_3500b73-1db-ead3-3c0b-a0c0e48d486
```

**Common fields across all initiatives:**

| Field ID                                          | Type       | Validation      |
| ------------------------------------------------- | ---------- | --------------- |
| `expenditures_onTrackToFullExpendFunds`           | `radio`    | `radio`         |
| `expenditures_onTrackToFullExpendFunds-otherText` | `textarea` | `text` (nested) |

---

## Generalized Field Schema

### Field Types

| Type       | Description            | Example Use                |
| ---------- | ---------------------- | -------------------------- |
| `text`     | Single-line text input | Names, titles              |
| `textarea` | Multi-line text input  | Descriptions, explanations |
| `number`   | Numeric input          | Counts, amounts            |
| `radio`    | Single selection       | Yes/No questions           |
| `checkbox` | Multiple selection     | "Other reasons" options    |

### Nested/Conditional Field Validation

When a field is conditionally shown based on a parent selection:

```typescript
interface NestedValidation {
  type: ValidationType;
  nested: true;
  parentFieldName: string; // ID of parent field
  parentOptionId: string; // ID of parent choice that triggers visibility
}
```

The validation type for these fields only applies if the field with the associated `parentOptionId` is truthy (for example, if the parent field is a checkbox and is checked). These fields may appear in the form data but have empty values, if the field with the associated `parentOptionId` returns false.

---

## Validation Types

The validation types are defined in `services/app-api/utils/types/validations.ts`. The table below lists all available validation types and indicates which are used in the SAR schema.

| Type                   | Description                               | Use Case                                       | Used in SAR |
| ---------------------- | ----------------------------------------- | ---------------------------------------------- | ----------- |
| `checkbox`             | Checkbox selection required               | Required multi-select fields                   |             |
| `checkboxOptional`     | Checkbox (optional)                       | Optional multi-select options                  | ✅          |
| `date`                 | Valid date format                         | Date picker fields                             |             |
| `dynamic`              | Dynamic validation based on field context | Fields with context-dependent rules            |             |
| `dynamicOptional`      | Optional dynamic validation               | Optional context-dependent fields              |             |
| `email`                | Valid email format                        | Email address fields                           | ✅          |
| `endDate`              | Valid end date (must be after start date) | Date range end fields                          |             |
| `number`               | Numeric value required                    | Currency amounts, funding sources              | ✅          |
| `numberComparison`     | Number with comparison validation         | Fields requiring comparison to other values    |             |
| `numberOptional`       | Numeric value (optional)                  | Optional numeric fields                        |             |
| `objectArray`          | Array of entity objects                   | Initiative collection (dynamic from Work Plan) | ✅          |
| `radio`                | Radio selection required                  | Yes/No questions, single-choice fields         | ✅          |
| `text`                 | Non-empty text required                   | Names, titles, descriptions                    | ✅          |
| `textCustom`           | Text with custom validation rules         | Fields with specific text requirements         |             |
| `textOptional`         | Text (optional)                           | Optional text fields                           |             |
| `url`                  | Valid URL format                          | Website fields                                 | ✅          |
| `validInteger`         | Non-negative integer required             | Population counts, transition numbers          | ✅          |
| `validIntegerOptional` | Non-negative integer or empty             | Optional counts (e.g., HCBS age-based fields)  | ✅          |

---

## Appendix: Common Target Populations

While states can define custom populations, these are the standard ones:

1. **Older adults** - Individuals aged 65+
2. **Individuals with physical disabilities (PD)**
3. **Individuals with intellectual or developmental disabilities (I/DD)**
4. **Individuals with mental health and substance use disorders (MH/SUD)**

---

## Appendix: Common Initiative Topics

Initiatives are categorized by MFP Work Plan topic:

- Transitions and transition coordination services
- Housing-related supports
- Quality measurement and improvement
- Self-direction
- Person-centered planning
- No Wrong Door systems
- Workforce development
- Employment support
- Transportation
- Stakeholder engagement
- Financing approaches
- SDOH and equity
