import { action } from "@storybook/addon-actions";
import HtnaNumberRange from "../src/form/HtnaNumberRange.ts";
import HtnaDateRange from "../src/form/HtnaDateRange.ts";

HtnaNumberRange.register();
HtnaDateRange.register();

export default {
  title: "Form"
};

export const NumberRange = () => {
  const range = document.createElement("htna-number-range");
  range.addEventListener("change", action("change"));
  return range;
};

export const DateRange = () => {
  const range = document.createElement("htna-date-range");
  range.addEventListener("change", action("change"));
  return range;
};
