import {
  forwardRef,
  Fragment,
  ReactNode,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { useLocation } from "react-router";
import { object as yupSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box, Heading, Text } from "@chakra-ui/react";
import {
  CalculationTable,
  DynamicTableProvider,
  ModalCalculationTable,
  SummationTable,
} from "components";
// utils
import {
  compileValidationJsonFromFields,
  formFieldFactory,
  getFieldParts,
  hydrateFormFields,
  mapValidationTypesToSchema,
  sanitizeAndParseHtml,
  sortFormErrors,
  updateRenderFields,
  useStore,
} from "utils";
import {
  AnyObject,
  FormJson,
  FormField,
  FormTable,
  FormTableType,
  isFieldElement,
  FormLayoutElement,
  ReportStatus,
} from "types";

export const Form = forwardRef<HTMLFormElement, Props>(function Form(
  {
    autosave,
    children,
    dontReset,
    formData,
    formJson,
    id,
    nestedForm,
    onError,
    onFormChange,
    onSubmit,
    reportStatus,
    validateOnRender,
    ...props
  },
  ref?
) {
  const { editableByAdmins, fields, options, tables = [] } = formJson;

  let location = useLocation();
  const { report } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  // determine if fields should be disabled (based on admin roles)
  const status = reportStatus || report?.status;
  const submittedReport = status === ReportStatus.SUBMITTED;
  const fieldInputDisabled =
    !editableByAdmins && (!userIsEndUser || submittedReport);

  // For the SAR RE&T sections, display an alert if the MFP WP does not contain any target populations
  const displayRetError =
    report?.populations?.length === 0 &&
    location.pathname.startsWith("/sar/recruitment-enrollment-transitions");

  // create validation schema
  const formValidationJson = compileValidationJsonFromFields(
    fields.filter(isFieldElement)
  );
  const formValidationSchema = mapValidationTypesToSchema(formValidationJson);
  const formResolverSchema = yupSchema(formValidationSchema || {});

  // make form context
  const form = useForm({
    resolver: !fieldInputDisabled ? yupResolver(formResolverSchema) : undefined,
    shouldFocusError: false,
    mode: "onChange",
    ...(options as AnyObject),
  });

  // will run if any validation errors exist on form submission
  const onErrorHandler: SubmitErrorHandler<FieldValues> = (
    errors: AnyObject
  ) => {
    // sort errors in order of registration/page display
    const sortedErrors: string[] = sortFormErrors(formValidationSchema, errors);
    // focus the first error on the page and scroll to it
    const fieldToFocus = document.querySelector(
      `[name='${sortedErrors[0]}']`
    )! as HTMLElement;
    fieldToFocus?.scrollIntoView({ behavior: "smooth", block: "center" });
    fieldToFocus?.focus({ preventScroll: true });
  };

  // hydrate and create form fields using formFieldFactory
  const renderFormFields = (fields: (FormField | FormLayoutElement)[]) => {
    const fieldsToRender = hydrateFormFields(
      updateRenderFields(report!, fields, formData),
      formData
    );
    const updateFieldsToRenderWithAriaLabels = (
      fieldsToRender: FormField | FormLayoutElement[]
    ) => {
      const fieldsToRenderWithAriaLabels = JSON.parse(
        JSON.stringify(fieldsToRender)
      );
      let choiceList: [] =
        fieldsToRenderWithAriaLabels[1] &&
        fieldsToRenderWithAriaLabels[1].props?.choices;

      //add aria label to hint hint
      sanitizeAndParseHtml(
        fieldsToRenderWithAriaLabels[1] &&
          fieldsToRenderWithAriaLabels[1].props.hint
      );

      // add aria label to choicelist
      choiceList &&
        choiceList.map((choice: AnyObject) => {
          if (choice?.label.includes("*")) {
            let asteriskIndex = choice?.label.includes("*if applicable")
              ? choice?.label.indexOf("*") - 1
              : choice?.label.indexOf("*");
            let newOption = sanitizeAndParseHtml(
              `${choice?.label.slice(
                0,
                asteriskIndex
              )} <span aria-label="(required topic at least once across all initiatives)"> ${choice?.label.charAt(
                asteriskIndex
              )}</span>${choice?.label.slice(asteriskIndex + 1)}`
            );
            choice.label = newOption;
          }
          return choice;
        });
      return fieldsToRenderWithAriaLabels;
    };

    return formFieldFactory(
      updateFieldsToRenderWithAriaLabels(fieldsToRender),
      {
        disabled: fieldInputDisabled,
        autosave,
        validateOnRender,
      }
    );
  };

  const renderTable = (table: FormTable, index: number) => {
    const { id, tableType, ...props } = table;

    switch (tableType) {
      case FormTableType.CALCULATION:
        return (
          <DynamicTableProvider key={id}>
            <CalculationTable
              disabled={fieldInputDisabled}
              formData={formData}
              id={id}
              order={index}
              report={report}
              {...props}
            />
          </DynamicTableProvider>
        );

      case FormTableType.MODAL_CALCULATION:
        return (
          <DynamicTableProvider key={id}>
            <ModalCalculationTable
              disabled={fieldInputDisabled}
              id={id}
              key={id}
              {...props}
            />
          </DynamicTableProvider>
        );

      case FormTableType.SUMMATION:
        return (
          <DynamicTableProvider key={id}>
            <SummationTable
              disabled={fieldInputDisabled}
              formData={formData}
              id={id}
              order={index}
              report={report}
              {...props}
            />
          </DynamicTableProvider>
        );

      default:
        return null;
    }
  };

  /*
   * useLayoutEffect fires before the browser repaints the screen
   *
   * Fixes an issue where some fields registered before the reset and some after.
   * We want a fresh form state before form fields render and
   * for every field on the page to register into the form.
   */
  useLayoutEffect(() => {
    if (!dontReset && !validateOnRender) {
      form?.reset();
    }
  }, [location?.pathname]);

  const onChange = () => {
    if (onFormChange) {
      onFormChange(form);
    }
  };

  const renderFieldOrTable = (
    fields: (FormField | FormLayoutElement)[],
    tables: FormTable[]
  ) => {
    const renderedTableIds = new Set<string>();
    let tableIndex = 0;

    const renderedFieldsAndTables = fields.map((field) => {
      const { tableId } = getFieldParts(field.id);

      if (field.forTableOnly) {
        const table = tables.find((t) => t.id === tableId);
        if (!table || renderedTableIds.has(tableId)) {
          return null;
        }

        renderedTableIds.add(tableId);
        return renderTable(table, tableIndex++);
      }

      return (
        <Fragment key={field.id}>
          {field.props?.title && (
            <Heading as="h3" className="verbiage-title">
              {field.props.title}
            </Heading>
          )}
          {renderFormFields([field])}
        </Fragment>
      );
    });

    return renderedFieldsAndTables;
  };

  const FormTag = nestedForm ? "fieldset" : "form";

  const submit = form.handleSubmit(onSubmit as any, onError || onErrorHandler);

  // Submit fieldset ref like a form
  useImperativeHandle(
    ref,
    () =>
      ({
        requestSubmit: submit,
      }) as any
  );

  return (
    <FormProvider {...form}>
      <FormTag
        id={id}
        autoComplete="off"
        onChange={onChange}
        {...(!nestedForm && { onSubmit: submit })}
        {...props}
      >
        <Box sx={sx}>
          {displayRetError ? (
            <Text sx={sx.retAlert}>
              Your associated MFP Work Plan does not contain any target
              populations.
            </Text>
          ) : (
            renderFieldOrTable(fields, tables)
          )}
        </Box>
        {children}
      </FormTag>
    </FormProvider>
  );
});

interface Props {
  autosave?: boolean;
  children?: ReactNode;
  dontReset: boolean;
  formData?: AnyObject;
  formJson: FormJson;
  id: string;
  nestedForm?: boolean;
  onError?: SubmitErrorHandler<FieldValues>;
  onFormChange?: Function;
  onSubmit: Function;
  reportStatus?: ReportStatus;
  validateOnRender: boolean;
  [key: string]: any;
}

const sx = {
  ".tbs-bottom-margin": {
    marginBottom: "spacer5",
  },
  // default
  ".ds-c-field, .ds-c-label": {
    maxWidth: "32rem",
  },

  ".ds-c-field": {
    margin: "0.5rem 0 0.25rem",
  },
  ".number-field .ds-c-field": {
    maxWidth: "15rem",
    paddingLeft: "spacer1",
    paddingRight: "spacer1",
  },
  // disabled field
  ".ds-c-field[disabled]": {
    color: "base",
  },
  // field hint
  ".ds-c-field__hint": {
    marginBottom: "spacer_half",
  },
  // field hint and error message
  ".ds-c-field__hint, .ds-c-field__error-message ": {
    fontSize: "sm",
    ul: {
      paddingLeft: "spacer4",
    },
    ol: {
      margin: "0.25rem 0.5rem",
      padding: "spacer1",
    },
    a: {
      color: "primary",
      textDecoration: "underline",
    },
  },
  // nested child fields
  ".ds-c-choice__checkedChild.nested": {
    paddingY: "spacer_half",
    paddingTop: 0,
    // makes the blue line continuous
    marginTop: 0,
    ".ds-c-fieldset, label": {
      marginTop: "spacer2",
    },
  },
  // optional text
  ".optional-text": {
    fontWeight: "lighter",
  },
  // RE&T warning message
  retAlert: {
    color: "error_dark",
    paddingTop: "spacer2",
  },
  // dividers for R,E,T pages
  ".sectionHeader": {
    borderTop: "1px solid #A6A6A6",
    marginTop: "spacer6",
    "&:first-of-type": {
      margin: "0",
      borderTop: "none",
    },
    "&:last-of-type": {
      margin: "0",
      borderTop: "none",
    },
  },
  // verbiage
  ".verbiage-title": {
    fontSize: "xl",
    paddingBottom: 0,
  },
};
