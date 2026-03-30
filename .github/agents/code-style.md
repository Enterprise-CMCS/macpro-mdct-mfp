# Code Style Guidelines

This document defines the coding conventions and patterns used in the MDCT-MFP codebase, focusing on `services/app-api/` and `services/ui-src/`.

## General Principles

- Favor functional programming patterns over classes
- Use camelCase for functions and variables
- Use PascalCase for types, interfaces, enums, and React components
- Favor early returns for cleaner control flow
- Keep functions small and focused on a single responsibility

## File Organization

- Group related files into feature-based directories (e.g., `reports/`, `users/`)
- Use `index.ts` barrel files for cleaner imports
- Separate frontend and backend code into `ui-src/` and `app-api/` respectively

### Import Organization

Organize imports in this order, separated by blank lines:

```typescript
// 1. React/framework imports
import { useState, useEffect, useContext } from "react";
// 2. Third-party libraries
import { useFormContext } from "react-hook-form";
// 3. Components (use barrel exports)
import { Banner, PageTemplate, TemplateCard } from "components";
// 4. Utils (use barrel exports)
import { checkDateRangeStatus, useStore } from "utils";
// 5. Types
import { ReportShape, MFPUser } from "types";
// 6. Verbiage/constants
import verbiage from "verbiage/pages/home";
```

## TypeScript Patterns

- Use `as const` for immutable object literals
- Avoid `any`; use `unknown` when type is truly unknown
- Use `Pick<T, K>` and `Omit<T, K>` for derived types

```typescript
export const error = {
  UNAUTHORIZED: "User is not authorized to access this resource.",
  NO_KEY: "Must provide key for table.",
} as const;
```

## React Component Patterns (ui-src)

### Component Structure

```tsx
// 1. Imports
import { useState, useEffect, useContext } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { Banner, PageTemplate } from "components";
import { useStore } from "utils";
import verbiage from "verbiage/pages/home";

// 2. Component function (named export preferred)
export const HomePage = () => {
  // 3. Hooks first
  const { bannerData, setBannerActive } = useStore();
  const [localState, setLocalState] = useState<string>("");

  // 4. Effects
  useEffect(() => {
    // effect logic
  }, [dependency]);

  // 5. Event handlers
  const onChangeHandler = (event: InputChangeEvent) => {
    // handler logic
  };

  // 6. Render
  return <PageTemplate data-testid="home-view">{/* JSX */}</PageTemplate>;
};

// 7. Styles object (sx prop pattern with Chakra UI)
const sx = {
  layout: {
    marginTop: "spacer7",
  },
  headerText: {
    marginBottom: "spacer2",
    fontSize: "2rem",
  },
};
```

### Component Props

Define props interfaces inline for small components, or as separate types for reusable components:

```tsx
interface Props {
  name: string;
  label: string;
  hint?: string | CustomHtmlElement[];
  disabled?: boolean;
  autosave?: boolean;
  sxOverride?: SystemStyleObject;
}

export const TextField = ({
  name,
  label,
  hint,
  disabled,
  autosave,
  sxOverride,
}: Props) => {
  // component logic
};
```

### Styling

Use Chakra UI's `sx` prop pattern with a styles object at the bottom of the component file:

```tsx
const sx = {
  container: {
    padding: "spacer4",
    ".nestedSelector": {
      marginTop: "spacer2",
    },
  },
};
```

## API/Backend Patterns (app-api)

### Handler Structure

Use the `handler` wrapper from `handler-lib.ts` for all Lambda handlers:

```typescript
import handler from "../handler-lib";
import {
  badRequest,
  forbidden,
  notFound,
  ok,
} from "../../utils/responses/response-lib";
import { error } from "../../utils/constants/constants";

export const fetchReport = handler(async (event, _context) => {
  // 1. Parse and validate parameters
  const { allParamsValid, reportType, state, id } =
    parseSpecificReportParameters(event);
  if (!allParamsValid) {
    return badRequest(error.NO_KEY);
  }

  // 2. Authorization check
  if (!isAuthorizedToFetchState(event, state)) {
    return forbidden(error.UNAUTHORIZED);
  }

  // 3. Data operations
  const reportMetadata = await getReportMetadata(reportType, state, id);
  if (!reportMetadata) {
    return notFound(error.NO_MATCHING_RECORD);
  }

  // 4. Return response
  return ok({ ...reportMetadata, fieldData });
});
```

### Response Helpers

Use the response helper functions from `response-lib.ts`:

```typescript
// Success responses
ok(body); // 200 - Success with body
created(body); // 201 - Resource created
noContent(); // 204 - Success, no body

// Error responses
badRequest(body); // 400 - Invalid request
forbidden(body); // 403 - Not authorized
notFound(body); // 404 - Resource not found
conflict(body); // 409 - State conflict
internalServerError(body); // 500 - Server error
```

### Error Constants

Define error messages in `utils/constants/constants.ts`:

```typescript
export const error = {
  UNAUTHORIZED: "User is not authorized to access this resource.",
  NO_KEY: "Must provide key for table.",
  NO_MATCHING_RECORD: "No matching record found.",
} as const;
```

## Testing Patterns

### Backend Tests (Jest)

```typescript
import { fetchReport } from "./fetch";
import { proxyEvent } from "../../utils/testing/proxyEvent";
import { mockDynamoData, mockReportJson } from "../../utils/testing/setupJest";
import { StatusCodes } from "../../utils/responses/response-lib";

// Mock external dependencies
jest.mock("../../storage/reports", () => ({
  getReportMetadata: jest.fn(),
  getReportFieldData: jest.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { reportType: "WP", state: "NJ", id: "mock-id" },
};

describe("handlers/reports/fetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test Report not found in DynamoDB", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(undefined);
    const res = await fetchReport(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
  });

  test("Test Successful Report Fetch", async () => {
    (getReportMetadata as jest.Mock).mockResolvedValue(mockDynamoData);
    const res = await fetchReport(testEvent, null);
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
```

### Frontend Tests (React Testing Library)

```tsx
import { render, screen } from "@testing-library/react";
import { HomePage } from "components";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { testA11yAct } from "utils/testing/commonTests";

const homeView = (
  <RouterWrappedComponent>
    <HomePage />
  </RouterWrappedComponent>
);

describe("<HomePage />", () => {
  test("Check that HomePage renders", () => {
    render(homeView);
    expect(screen.getByTestId("home-view")).toBeVisible();
  });

  // Use shared accessibility test helper
  testA11yAct(homeView);
});
```

### Test File Naming

- Test files live alongside source files: `Component.tsx` → `Component.test.tsx`
- Use descriptive test names: `"Test Successful Report Fetch"`, not `"test 1"`

## Validation Patterns

Both frontend and backend use Yup for validation schemas:

```typescript
import { string, object } from "yup";
import { validationErrors as error } from "verbiage/errors";

// Required text field
export const text = () =>
  string()
    .typeError(error.INVALID_GENERIC)
    .required(error.REQUIRED_GENERIC)
    .test({
      test: (value) => value?.trim().length !== 0,
      message: error.REQUIRED_GENERIC,
    });

// Optional text field
export const textOptional = () =>
  string()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .typeError(error.INVALID_GENERIC);
```

## State Management (ui-src)

Use Zustand for state management with separate stores for different concerns:

```typescript
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Store slice pattern
const userStore = (set: Function) => ({
  user: undefined,
  setUser: (newUser?: MFPUser) =>
    set(() => ({ user: newUser }), false, { type: "setUser" }),
});

// Combined store
export const useStore = create<CombinedState>()(
  devtools(
    persist(
      (...a) => ({
        ...userStore(...a),
        ...bannerStore(...a),
        ...reportStore(...a),
      }),
      { name: "mfp-store" }
    )
  )
);
```

## Naming Conventions Summary

| Element     | Convention         | Example                              |
| ----------- | ------------------ | ------------------------------------ |
| Functions   | camelCase          | `fetchReport`, `onChangeHandler`     |
| Variables   | camelCase          | `reportData`, `isComplete`           |
| Components  | PascalCase         | `HomePage`, `TextField`              |
| Interfaces  | PascalCase         | `ReportShape`, `MFPUser`             |
| Types       | PascalCase         | `ReportPageShape`                    |
| Enums       | PascalCase         | `ReportType`, `UserRoles`            |
| Enum values | UPPER_SNAKE_CASE   | `FINANCIAL_REPORTING`, `STATE_USER`  |
| Constants   | UPPER_SNAKE_CASE   | `DEFAULT_TARGET_POPULATIONS`         |
| Test files  | `*.test.ts(x)`     | `fetch.test.ts`, `HomePage.test.tsx` |
| Type files  | `*.ts` in `types/` | `reports.ts`, `users.ts`             |
