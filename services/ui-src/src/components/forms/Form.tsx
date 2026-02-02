import { ReactNode, useLayoutEffect } from "react";
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
import { CalculationTable } from "components";
// utils
import {
  compileValidationJsonFromFields,
  formFieldFactory,
  hydrateFormFields,
  mapValidationTypesToSchema,
  sortFormErrors,
  updateRenderFields,
  useStore,
  sanitizeAndParseHtml,
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

export const Form = ({
  id,
  formJson,
  onSubmit,
  onFormChange,
  onError,
  formData,
  validateOnRender,
  autosave,
  dontReset,
  children,
  reportStatus,
  ...props
}: Props) => {
  const { editableByAdmins, fields, options, tables = [], verbiage } = formJson;

  let location = useLocation();
  const { report } = useStore();
  const { userIsEndUser } = useStore().user ?? {};

  // determine if fields should be disabled (based on admin roles)
  const submittedReport = reportStatus === ReportStatus.SUBMITTED;
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
  mapValidationTypesToSchema;
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
            return choice;
          } else {
            return choice;
          }
        });
      return fieldsToRenderWithAriaLabels;
    };

    return formFieldFactory(
      updateFieldsToRenderWithAriaLabels(fieldsToRender),
      {
        disabled: !!fieldInputDisabled,
        autosave,
        validateOnRender,
      }
    );
  };

  const renderTable = (table: FormTable, index: number) => {
    const { id, tableType, ...props } = table;

    if (tableType === FormTableType.CALCULATION) {
      return (
        <CalculationTable
          formData={formData}
          id={id}
          key={id}
          order={index}
          report={report}
          {...props}
        />
      );
    }
    return <></>;
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

  /*
   * Exclude forTableOnly fields in renderFormFields,
   * they'll be rendered with renderTable
   */
  const regularFields = fields.filter(({ forTableOnly }) => !forTableOnly);

  return (
    <FormProvider {...form}>
      <form
        id={id}
        autoComplete="off"
        onChange={onChange}
        onSubmit={form.handleSubmit(onSubmit as any, onError || onErrorHandler)}
        {...props}
      >
        <Box sx={sx}>
          {displayRetError ? (
            <Text sx={sx.retAlert}>
              Your associated MFP Work Plan does not contain any target
              populations.
            </Text>
          ) : (
            <>
              {tables.map((table, index) => renderTable(table, index))}
              {verbiage?.title && (
                <Heading as="h3" className="verbiage-title">
                  {verbiage.title}
                </Heading>
              )}
              {renderFormFields(regularFields)}
            </>
          )}
        </Box>
        {children}
      </form>
    </FormProvider>
  );
};

interface Props {
  id: string;
  formJson: FormJson;
  onSubmit: Function;
  validateOnRender: boolean;
  dontReset: boolean;
  onError?: SubmitErrorHandler<FieldValues>;
  formData?: AnyObject;
  autosave?: boolean;
  children?: ReactNode;
  onFormChange?: Function;
  reportStatus?: ReportStatus;
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
