import { NumberOptions, TextOptions } from "types";
import * as schema from "./schemas";

export const schemaMap: any = {
  text: schema.text(),
  textOptional: schema.textOptional(),
  textCustom: (options: TextOptions) => schema.textCustom(options),
  number: schema.number(),
  numberOptional: schema.numberOptional(),
  numberComparison: (options: NumberOptions) =>
    schema.numberComparison(options),
  ratio: schema.ratio(),
  email: schema.email(),
  emailOptional: schema.emailOptional(),
  url: schema.url(),
  urlOptional: schema.urlOptional(),
  date: schema.date(),
  dateOptional: schema.dateOptional(),
  dropdown: schema.dropdown(),
  dropdownOptional: schema.dropdownOptional(),
  checkbox: schema.checkbox(),
  checkboxOptional: schema.checkboxOptional(),
  checkboxSingle: schema.checkboxSingle(),
  radio: schema.radio(),
  radioOptional: schema.radioOptional(),
  dynamic: schema.dynamic(),
  dynamicOptional: schema.dynamicOptional(),
  validInteger: schema.validInteger(),
  validIntegerOptional: schema.validIntegerOptional(),
};
