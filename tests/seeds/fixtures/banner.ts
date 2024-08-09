import { faker } from "@faker-js/faker";
import { SeedBannerDataShape } from "../types";

export const newBanner = (key: string): SeedBannerDataShape => ({
  key,
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  startDate: faker.date.past({ years: 1 }).getTime(),
  endDate: faker.date.future({ years: 1 }).getTime(),
});
