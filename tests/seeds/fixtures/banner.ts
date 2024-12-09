import { faker } from "@faker-js/faker";
import { SeedBannerShape } from "../types";

export const newBanner = (key: string): SeedBannerShape => ({
  key,
  createdAt: faker.date.past({ years: 1 }).getTime(),
  lastAltered: faker.date.past({ years: 1 }).getTime(),
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  startDate: faker.date.past({ years: 1 }).getTime(),
  endDate: faker.date.future({ years: 1 }).getTime(),
});
