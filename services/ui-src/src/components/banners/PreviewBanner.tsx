import { Banner } from "components";

export const PreviewBanner = ({answers}: {answers: {[key:string]: any}}) => {
  // set banner preview data
  // const formData = form.getValues();
  const bannerData = {
    title: answers["bannerTitle"] || "New banner title",
    description: answers["bannerDescription"] || "New banner description",
    link: answers["bannerLink"] || "",
  };

  return <Banner bannerData={bannerData} />;
};
