// BANNER

export interface BannerData {
  title: string;
  description: string;
  link?: string;
  [key: string]: any;
}

export interface AdminBannerData extends BannerData {
  key: string;
  startDate: number;
  endDate: number;
}

export interface AdminBannerMethods {
  fetchAdminBanner: Function;
  fetchAllBanners: Function;
  writeAdminBanner: Function;
  deleteAdminBanner: Function;
}

export interface AdminBannerShape extends AdminBannerMethods {}
