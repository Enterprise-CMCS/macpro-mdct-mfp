// components
import { Alert } from "components";
// types
import { AlertTypes, BannerData } from "types";

export const Banner = ({ bannerData, status }: Props) => {
  if (bannerData) {
    const { title, description, link } = bannerData;
    return (
      bannerData && (
        <Alert
          title={title}
          description={description}
          link={link}
          status={status}
        />
      )
    );
  } else return <></>;
};

interface Props {
  bannerData?: BannerData;
  status?: AlertTypes;
}
