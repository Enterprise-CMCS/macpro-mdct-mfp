import { ReactNode, useEffect } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { useLocation } from "react-router-dom";
import { object as yupSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Box } from "@chakra-ui/react";
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
  userDisabled,
  ...props
}: Props) => {
  const { fields, options } = formJson;

  let location = useLocation();

  // determine if fields should be disabled (based on admin roles)
  const { userIsAdmin } = useStore().user ?? {};

  const { report, editable } = useStore();

  const fieldInputDisabled =
    (userIsAdmin && !formJson.editableByAdmins) ||
    !editable ||
    userDisabled ||
    ReportStatus.SUBMITTED;

  // create validation schema
  const formValidationJson = compileValidationJsonFromFields(
    formJson.fields.filter(isFieldElement)
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
      updateRenderFields(report!, fields),
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

  useEffect(() => {
    if (!dontReset && !validateOnRender) {
      form?.reset();
    }
  }, [location?.pathname]);

  const onChange = () => {
    if (onFormChange) {
      onFormChange(form);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        id={id}
        autoComplete="off"
        onChange={onChange}
        onSubmit={form.handleSubmit(onSubmit as any, onError || onErrorHandler)}
        {...props}
      >
        <Box sx={sx}>{renderFormFields(fields)}</Box>
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
  userDisabled?: boolean;
  onFormChange?: Function;
  [key: string]: any;
}

const sx = {
  ".tbs-bottom-margin": {
    marginBottom: "2.5rem",
  },
  // default
  ".ds-c-field, .ds-c-label": {
    maxWidth: "32rem",
  },

  ".ds-c-field": {
    margin: "0.5rem 0 0.25rem",
  },

  // disabled field
  ".ds-c-field[disabled]": {
    color: "palette.gray",
  },
  // field hint
  ".ds-c-field__hint": {
    marginBottom: "0.25rem",
  },
  // field hint and error message
  ".ds-c-field__hint, .ds-c-field__error-message ": {
    fontSize: "sm",
    ul: {
      paddingLeft: "2rem",
    },
    ol: {
      margin: "0.25rem 0.5rem",
      padding: "0.5rem",
    },
    a: {
      color: "palette.primary",
      textDecoration: "underline",
    },
  },
  // nested child fields
  ".ds-c-choice__checkedChild.nested": {
    paddingY: "0.25rem",
    paddingTop: 0,
    // makes the blue line continuous
    marginBottom: 0,
    ".ds-c-fieldset, label": {
      marginTop: "1rem",
    },
  },
  // optional text
  ".optional-text": {
    fontWeight: "lighter",
  },
};
