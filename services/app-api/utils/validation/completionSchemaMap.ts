import { DynamicOptions, TextOptions } from "../types";
import * as schema from "./completionSchemas";

export const completionSchemaMap: any = {
  text: schema.text(),
  textOptional: schema.textOptional(),
  textCustom: (options: TextOptions) => schema.textCustom(options),
  number: schema.number(),
  numberOptional: schema.numberOptional(),
  ratio: schema.ratio(),
  email: schema.email(),
  emailOptional: schema.emailOptional(),
  url: schema.url(),
  urlOptional: schema.urlOptional(),
  date: schema.date(),
  dateOptional: schema.dateOptional(),
  dropdown: schema.dropdown(),
  checkbox: schema.checkbox(),
  checkboxOptional: schema.checkboxOptional(),
  checkboxSingle: schema.checkboxSingle(),
  radio: schema.radio(),
  radioOptional: schema.radioOptional(),
  dynamic: (options?: DynamicOptions) => schema.dynamic(options),
  dynamicOptional: (options?: DynamicOptions) =>
    schema.dynamicOptional(options),
  validInteger: schema.validInteger(),
  validIntegerOptional: schema.validIntegerOptional(),
};
