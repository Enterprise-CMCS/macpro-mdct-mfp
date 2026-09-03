import { Banner } from "components";
import { FIELD_DATA } from "types";

export const PreviewBanner = ({fields}: {fields: Map<string, FIELD_DATA>}) => {
  // set banner preview data
  const bannerData = {
    title: fields.get("bannerTitle")?.answer || "New banner title",
    description: fields.get("bannerDescription")?.answer || "New banner description",
    link: fields.get("bannerLink")?.answer || "",
  };

  return <Banner bannerData={bannerData} />;
};
