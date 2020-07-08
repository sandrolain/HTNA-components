import { AttributeTypes, HTNAElementConfig, HTNAElement } from "htna";

import cssVars from "goodnight-css/dist/vars.css";
import cssBase from "goodnight-css/dist/base.css";
import cssInput from "goodnight-css/dist/input.css";
import cssSelectable from "goodnight-css/dist/selectable.css";


const definition: HTNAElementConfig = {
  elementName: "htna-label-checkbox",
  formInput: "checkbox",
  render: () => /*html*/`<label id="cnt" class="selectable"><input type="checkbox" id="input" /><span id="label"><slot name="label"></slot></span></label>`,
  style: /*css*/`
:host {
  display: content;
}
  ${cssVars}
  ${cssBase}
  ${cssInput}
  ${cssSelectable}

  `,
  attributesSchema: {
    "name": {
      type: AttributeTypes.String,
      observed: true,
      property: true,
      value: ""
    },
    "value": {
      type: AttributeTypes.String,
      observed: true,
      property: true,
      value: ""
    },
    "checked": {
      type: Boolean,
      observed: true,
      property: true,
      value: false
    }
  },
  controller: ({ light, shadow, attributes }) => {
    const $cnt   = shadow.$<HTMLLabelElement>("#cnt");
    const $input = shadow.$<HTMLInputElement>("#input");

    const updateChecked = (): void => {
      const oldChecked = $input.checked;
      const newChecked = attributes.get("checked") as boolean;
      if(oldChecked !== newChecked) {
        $input.checked = newChecked;
        $cnt.classList.toggle("checked", newChecked);
        light.dispatch("change");
      }
    };
    $input.addEventListener("input", () => {
      const oldChecked = attributes.get("checked") as boolean;
      const newChecked = $input.checked;
      if(oldChecked !== newChecked) {
        attributes.set("checked", newChecked);
        light.dispatch("change");
      }
    });

    return {
      connectedCallback: (): void => {
        updateChecked();
      },
      attributeChangedCallback: updateChecked
    };
  }
};

export class HtnaLabelCheckbox extends HTNAElement {
  static config: HTNAElementConfig = definition;
}

export class HtnaLabelRadio extends HTNAElement {
  static config: HTNAElementConfig = {
    ...definition,
    elementName: "htna-label-radio",
    formInput: "radio",
    render: () => /*html*/`<label id="cnt" class="selectable"><input type="radio" id="input" /><span id="label"><slot name="label"></slot></span></label>`
  };
}

export default HtnaLabelCheckbox;
