// components
import { Box } from "@chakra-ui/react";
import { Alert } from "components";
// types
import { AlertTypes, BannerData } from "types";
// utils
import { parseAllowedHtml } from "utils";

export const Banner = ({ bannerData, status }: Props) => {
  if (bannerData) {
    const { title, description, link } = bannerData;
    return (
      bannerData && (
        <Alert status={status} title={title} link={link}>
          <Box>{parseAllowedHtml(description)}</Box>
        </Alert>
      )
    );
  } else return <></>;
};

interface Props {
  bannerData?: BannerData;
  status?: AlertTypes;
}
