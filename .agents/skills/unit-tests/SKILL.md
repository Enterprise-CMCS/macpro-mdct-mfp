---
name: unit-tests
description: >
  Use this skill when writing or modifying unit tests.
  Provides instructions on test setup and best practices.
---

# Unit Testing Best Practices

This skill teaches the agent how to write effective unit tests, covering test structure, organization, and best practices for ensuring comprehensive test coverage and maintainable test code in a React & TypeScript application.

## When to Use This Skill

- When writing new unit tests for React components, hooks, or utility functions.
- When modifying existing tests to improve coverage or maintainability.
- When reviewing test code for quality and adherence to best practices.

## Good Patterns

### Structure and Organization

- Nest `describe` blocks to mirror code structure: outer block for the module, inner blocks for functions or scenarios.
- Group related edge cases together within the same `describe` block to improve readability and maintainability.
- Use test names to describe behavior, not implementation details. Focus on what the component should do, not how it does it.
- Follow the AAA pattern (Arrange, Act, Assert) to structure tests.

### Test Isolation

- Ensure each test is independent and does not rely on the state of other tests.
- Use `beforeEach` to set up any necessary state before each test runs.
- Clean up any side effects after each test using `afterEach`.

### Testing Library Usage

- Use queries that reflect how users interact with the component rather than implementation details. Recommended queries:
  - `getByRole`
  - `getByLabelText`
  - `getByText`
  - `getByPlaceholderText`
- Prefer `userEvent` over `fireEvent` for simulating user interactions.
- Use `waitFor` when testing asynchronous behavior, but only when necessary, such as waiting for state changes. Always use `async/await` with `waitFor` to ensure proper handling of asynchronous code.

### Test Coverage

- Cover the happy path and the unhappy path per scenario. This ensures that both expected and unexpected behaviors are tested.
- Explicit edge cases should be tested, such as empty inputs, null values, and boundary conditions. This helps to ensure that the component behaves correctly under all circumstances.
- Build in error resilience by testing edge cases and potential failure points, verifying no exceptions are thrown for bad input.
- Test return value shape explicitly instead of just checking for partial matches.
- Component tests should include accessibility checks using `testA11yAct(component)` to ensure the component meets accessibility standards.

### Code Quality

- Use enums over magic strings (e.g., `PageTypes.STANDARD` instead of `"standard"`)
- Keep test bodies short and focused on a single assertion or behavior. If a test is doing too much, consider breaking it into multiple tests.
- Use `structuredClone` and the spread operator to create deep copies of objects when necessary to avoid unintended mutations in tests.
- Use inline comments to explain domain-specific logic or non-obvious test setups, but avoid over-commenting obvious code.
- If you must use `test.skip`, include an explanatory comment with `/** TODO: ... */` to preserve intent and document technical debt.

## Anti-Patterns

- Do not assert every field in large objects if only one behavior matters.
- Avoid testing implementation details, such as internal state or private methods. Focus on testing the public API and observable behavior of the component.
- Avoid overuse of `act()`. `fireEvent` and `userEvent` handle most cases automatically.
