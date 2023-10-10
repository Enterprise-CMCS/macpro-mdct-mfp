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
  useStore,
} from "utils";
import {
  AnyObject,
  FormJson,
  FormField,
  isFieldElement,
  FormLayoutElement,
  ReportStatus,
  ReportType,
  EntityShape,
} from "types";

export const Form = ({
  id,
  formJson,
  onSubmit,
  onError,
  formData,
  validateOnRender,
  autosave,
  dontReset,
  children,
  ...props
}: Props) => {
  const { fields, options } = formJson;

  // determine if fields should be disabled (based on admin roles )
  const { userIsAdmin, userIsReadOnly } = useStore().user ?? {};

  const { report } = useStore();

  const updateRenderFields = (fields: (FormField | FormLayoutElement)[]) => {
    const updatedTargetPopulationChoices = report?.fieldData?.targetPopulations;
    const defaultTargetPopulationCount = 4;

    const formatChoiceList = updatedTargetPopulationChoices?.map(
      (field: EntityShape, key: string) => {
        return {
          checked: false,
          id: field.id,
          label:
            parseInt(key) < defaultTargetPopulationCount
              ? field.transitionBenchmarks_targetPopulationName
              : `Other: ${field.transitionBenchmarks_targetPopulationName}`,
          name: field.transitionBenchmarks_targetPopulationName,
          value: field.transitionBenchmarks_targetPopulationName,
        };
      }
    );

    const updateTargetPopulationChoiceList = fields.map((field) => {
      return field.id.match("targetPopulations")
        ? {
            ...field,
            props: { ...field?.props, choices: [...formatChoiceList] },
          }
        : { ...field };
    });
    return updateTargetPopulationChoiceList;
  };

  let location = useLocation();
  const fieldInputDisabled =
    ((userIsAdmin || userIsReadOnly) && !formJson.editableByAdmins) ||
    (report?.status === ReportStatus.SUBMITTED &&
      report?.reportType === ReportType.WP);

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
      updateRenderFields(fields),
      formData
    );
    return formFieldFactory(fieldsToRender, {
      disabled: !!fieldInputDisabled,
      autosave,
      validateOnRender,
    });
  };

  useEffect(() => {
    if (!dontReset && !validateOnRender) {
      form?.reset();
    }
  }, [location?.pathname]);

  return (
    <FormProvider {...form}>
      <form
        id={id}
        autoComplete="off"
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
  [key: string]: any;
}

const sx = {
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
