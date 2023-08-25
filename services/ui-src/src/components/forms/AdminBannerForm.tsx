import { useState } from "react";
// components
import { Button, Flex, Spinner } from "@chakra-ui/react";
import { ErrorAlert, Form, PreviewBanner } from "components";
// utils
import { bannerId } from "../../constants";
import { bannerErrors } from "verbiage/errors";
import { convertDatetimeStringToNumber } from "utils";
import { FormJson } from "types";
// data
import formJson from "forms/addAdminBanner/addAdminBanner.json";

export const AdminBannerForm = ({ writeAdminBanner, ...props }: Props) => {
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // add validation to formJson
  const form: FormJson = formJson;

  const onSubmit = async () => {
    setSubmitting(true);
    const newBannerData = {
      key: bannerId,
      title: "TEST NEW BANNER",
      description: "BANNER DESCRIPTION",
      link: "EXAMPLE LINK" || undefined,
      startDate: convertDatetimeStringToNumber("11/11/2011", "startDate"),
      endDate: convertDatetimeStringToNumber("11/11/2024", "endDate"),
    };
    try {
      await writeAdminBanner(newBannerData);
      window.scrollTo(0, 0);
    } catch (error: any) {
      setError(bannerErrors.REPLACE_BANNER_FAILED);
    }
    setSubmitting(false);
  };

  return (
    <>
      <ErrorAlert error={error} sxOverride={sx.errorAlert} />
      <Form
        id={form.id}
        formJson={formJson}
        onSubmit={onSubmit}
        validateOnRender={false}
        onError={onSubmit}
        dontReset={false}
        {...props}
      >
        <PreviewBanner />
      </Form>
      <Flex sx={sx.previewFlex}>
        <Button form={form.id} type="submit" sx={sx.replaceBannerButton}>
          {submitting ? <Spinner size="md" /> : "Replace Current Banner"}
        </Button>
      </Flex>
    </>
  );
};

interface Props {
  writeAdminBanner: Function;
  [key: string]: any;
}

const sx = {
  errorAlert: {
    maxWidth: "40rem",
  },
  previewFlex: {
    flexDirection: "column",
  },
  replaceBannerButton: {
    width: "14rem",
    marginTop: "1rem !important",
    alignSelf: "end",
  },
};
