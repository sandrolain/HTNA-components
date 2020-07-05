import { action } from "@storybook/addon-actions";
import HtnaNumberRange from "../src/form/HtnaNumberRange.ts";
import HtnaDateRange from "../src/form/HtnaDateRange.ts";
import { HtnaLabelCheckbox, HtnaLabelRadio } from "../src/form/HtnaLabelCheckebox.ts";
import { HtnaDangerButton } from "../src/form/HtnaDangerButton";
import { HTNADynFieldset } from "../src/form/HtnaDynFieldset";

try {
  HtnaNumberRange.register();
  HtnaDateRange.register();
  HtnaLabelCheckbox.register();
  HtnaLabelRadio.register();
  HtnaDangerButton.register();
  HTNADynFieldset.register();
} catch(e) {
  window.location.reload();
}

export default {
  title: "Form"
};

export const DangerButton = () => {
  const form = document.createElement("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("submit", e);
  });
  const btn = document.createElement("htna-danger-button");
  btn.innerHTML = `<span slot="normal">Click me!</span><span slot="warning">Sure?</span>`;
  btn.addEventListener("click", action("click"));
  form.appendChild(btn);
  return form;
};

export const NumberRange = () => {
  const range = document.createElement("htna-number-range");
  range.innerHTML = `<span slot="from">FROM</span><span slot="to">TO</span>`;
  range.addEventListener("change", action("change"));
  return range;
};

export const DateRange = () => {
  const range = document.createElement("htna-date-range");
  range.innerHTML = `<span slot="from">FROM</span><span slot="to">TO</span>`;
  range.addEventListener("change", action("change"));
  return range;
};

export const LabelCheckbox = () => {
  const $f = document.createDocumentFragment();
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


export const DynFieldset = () => {
  const $f = document.createElement("form");
  const fs = document.createElement("htna-dyn-fieldset");

  fs.addField({
    label: "Text Input",
    name: "txt",
    tagName: "input",
    attributes: {
      type: "text"
    }
  });

  fs.addField({
    label: "Date Input",
    name: "dt",
    tagName: "input",
    attributes: {
      type: "date"
    }
  });

  fs.addField({
    label: "Number Range",
    name: "nr",
    tagName: "htna-number-range",
    value: [10, 20]
  });

  fs.render();

  $f.appendChild(fs);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.innerHTML = "Get Value";
  btn.addEventListener("click", () => {
    console.log(fs.getValue());
  });
  $f.appendChild(btn);
  return $f;
};
