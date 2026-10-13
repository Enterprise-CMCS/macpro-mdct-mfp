import { getBanners, writeBanner, deleteBanner } from "./banner";
// utils
import { mockBannerData } from "utils/testing/setupTest";

const mockDelete = vi.fn();
const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock("utils", () => ({
  del: () => mockDelete(),
  get: () => mockGet(),
  post: () => mockPost(),
}));

const mockBannerKey = mockBannerData.key;

describe("utils/requestMethods/banner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getBanner()", async () => {
    await getBanners();
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  test("postBanner()", async () => {
    await writeBanner(mockBannerData);
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test("deleteBanner()", async () => {
    await deleteBanner(mockBannerKey);
    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});
