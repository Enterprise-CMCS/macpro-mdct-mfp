const { faker } = require("@faker-js/faker");

const newBanner = (key) => ({
  key,
  title: faker.lorem.sentence(),
  description: faker.lorem.sentence(),
  startDate: faker.date.past({ years: 1 }).getTime(),
  endDate: faker.date.future({ years: 1 }).getTime(),
});

module.exports = {
  newBanner,
};
