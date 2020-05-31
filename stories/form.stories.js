import { action } from "@storybook/addon-actions";
import HtnaNumberRange from "../src/form/HtnaNumberRange.ts";
import HtnaDateRange from "../src/form/HtnaDateRange.ts";
import { HtnaLabelCheckbox, HtnaLabelRadio } from "../src/form/HtnaLabelCheckebox.ts";

HtnaNumberRange.register();
HtnaDateRange.register();
HtnaLabelCheckbox.register();
HtnaLabelRadio.register();

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

export const LabelCheckbox = () => {
  const $f = document.createElement("form");
  $f.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData($f);
    console.log(JSON.stringify(Array.from(data.entries())));
  });
  for(let i = 0; i < 5; i++) {
    const el = document.createElement(i % 2 === 0 ? "htna-label-checkbox" : "htna-label-radio");
    el.setAttribute("name", "test");
    el.setAttribute("value", i);
    el.innerHTML = `<span slot="label">Checkbox Label</span>`;
    el.addEventListener("change", action("change"));
    const btn = document.createElement("button");
    btn.innerHTML = "Toggle";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      el.checked = !el.checked;
    });
    $f.appendChild(el);
    $f.appendChild(document.createElement("br"));
    $f.appendChild(btn);
    $f.appendChild(document.createElement("br"));
    $f.appendChild(document.createElement("br"));
  }
  $f.insertAdjacentHTML("beforeend", `<button type="submit">Submit</button>`);
  return $f;
};
