# Semi-Annual Progress Report (SAR) Schema Documentation

## Overview

The SAR (Semi-Annual Progress Report) is a form schema used for MFP (Money Follows the Person) demonstration reporting. This document explains the schema structure and, critically, how **target populations** and **state/territory-specific initiatives** are dynamically generated from the associated Work Plan (WP), creating a ripple effect on field IDs throughout the SAR.

## Table of Contents

1. [Schema Metadata](#schema-metadata)
2. [Dynamic Content Relationship with Work Plan](#dynamic-content-relationship-with-work-plan)
3. [Static SAR Sections](#static-sections)
   - [1. General Information](#1-general-information-sargeneral-information)
   - [2. Organization & Administration](#2-organization--administration-sarorganization-and-administration)
   - [3. Additional Achievements](#3-additional-achievements-saradditional-achievements)
4. [Dynamic SAR Sections](#dynamic-sections)
   - [1. Recruitment, Enrollment, and Transitions (RET)](#1-recruitment-enrollment-and-transitions-ret)
   - [2. State or Territory-Specific Initiatives](#2-state-or-territory-specific-initiatives)
5. [Appendix: Validation Types](#appendix-validation-types)
6. [Appendix: Common Target Populations](#appendix-common-target-populations)
7. [Appendix: Common Initiative Topics](#appendix-common-initiative-topics)
8. [Appendix: RET Index Mapping](#appendix-ret-index-mapping)

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

### 2. State or Territory-Specific Initiatives

This is the most complex dynamic section. Initiatives are entirely imported from the Work Plan. Each initiative has three required steps:

#### Step 1: Objectives Progress

| Subsection          | Field ID                                           | Type       | Validation      |
| ------------------- | -------------------------------------------------- | ---------- | --------------- |
| Objectives Progress | `objectivesProgress_performanceMeasuresIndicators` | `textarea` | `text`          |
| Objectives Progress | `objectivesProgress_deliverablesMet`               | `radio`    | `radio`         |
| Objectives Progress | `objectivesProgress_deliverablesMet_otherText`     | `textarea` | `text` (nested) |
| Objectives Progress | `objectiveTargets_actual_{Quarter}` ✱              | `text`     | `text`          |
| Objectives Progress | `objectiveTargets_projections_{Quarter}` ✱         | `text`     | `text`          |

✱ Only for objectives that have quantitative targets

#### Step 2: Initiative Progress

| Subsection          | Field ID                                                       | Type       | Validation |
| ------------------- | -------------------------------------------------------------- | ---------- | ---------- |
| Initiative Progress | `initiativeProgress_describeProgress`                          | `textarea` | `text`     |
| Initiative Progress | `initiativeProgress_describeIssuesChallenges`                  | `textarea` | `text`     |
| Initiative Progress | `initiativeProgress_describeCollaborationsWithExternalParties` | `textarea` | `text`     |

#### Step 3: Expenditures

This section contains information about the expenditures and funding sources. This section's fields are **entirely dynamic** based on funding sources from the Work Plan.

| Subsection   | Field ID                                                 | Type       | Validation      |
| ------------ | -------------------------------------------------------- | ---------- | --------------- |
| Expenditures | `fundingSources_actual_{Quarter}_{FundingSourceUUID}`    | `number`   | `number`        |
| Expenditures | `fundingSources_projected_{Quarter}_{FundingSourceUUID}` | `number`   | `number`        |
| Expenditures | `expenditures_onTrackToFullExpendFunds`                  | `radio`    | `radio`         |
| Expenditures | `expenditures_onTrackToFullExpendFunds-otherText`        | `textarea` | `text` (nested) |

---

## Appendix: Validation Types

The validation types are defined in `services/app-api/utils/types/validations.ts`. The table below lists all available validation types and indicates which are used in the SAR schema.

| Type                   | Description                               | Used in SAR |
| ---------------------- | ----------------------------------------- | ----------- |
| `checkbox`             | Checkbox selection required               |             |
| `checkboxOptional`     | Checkbox (optional)                       | ✅          |
| `date`                 | Valid date format                         |             |
| `dynamic`              | Dynamic validation based on field context |             |
| `dynamicOptional`      | Optional dynamic validation               |             |
| `email`                | Valid email format                        | ✅          |
| `endDate`              | Valid end date (must be after start date) |             |
| `number`               | Numeric value required                    | ✅          |
| `numberComparison`     | Number with comparison validation         |             |
| `numberOptional`       | Numeric value (optional)                  |             |
| `objectArray`          | Array of entity objects                   | ✅          |
| `radio`                | Radio selection required                  | ✅          |
| `text`                 | Non-empty text required                   | ✅          |
| `textCustom`           | Text with custom validation rules         |             |
| `textOptional`         | Text (optional)                           |             |
| `url`                  | Valid URL format                          | ✅          |
| `validInteger`         | Non-negative integer required             | ✅          |
| `validIntegerOptional` | Non-negative integer or empty             | ✅          |

### Nested/Conditional Field Validation

When a field is conditionally shown based on a parent selection, the field is marked as nested.

The validation type for these fields only applies if the field with the associated parentOptionId is truthy (for example, if the parent field is a checkbox and is checked). These fields may appear in the form data but have empty values, if the field with the associated parentOptionId returns false.

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

---

## Appendix: RET Index Mapping

The numerical indexes that appear in the [RET section](#1-recruitment-enrollment-and-transitions-ret) field IDs map to specific facility or institution types. This section describes the mapping of index and facility type for each subsection of the RET section.

### Institution Types (ret-mtfqi index mapping)

| Index | Institution Type |
| ----- | ---------------- |
| 1     | Nursing facility |
| 2     | ICF/IID          |
| 3     | IMD              |
| 4     | Hospital         |
| 5     | Other            |

### Residence Types (ret-mtfqr index mapping)

| Index | Residence Type            |
| ----- | ------------------------- |
| 1     | Home (owned/leased)       |
| 2     | Apartment                 |
| 3     | Group home (≤4 unrelated) |
| 4     | Qualified assisted living |

### Disenrollment Reasons (ret-mpdprp index mapping)

| Index | Reason                               |
| ----- | ------------------------------------ |
| 1     | Re-institutionalization              |
| 2     | Death                                |
| 3     | Voluntary disenrollment              |
| 4     | Other (checkbox with nested options) |
