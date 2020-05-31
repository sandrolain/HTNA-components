import { create, AttributeTypes, DefineConfig } from "htna";


const definition: DefineConfig = {
  elementName: "htna-label-checkbox",
  formInput: "checkbox",
  mode: "open",
  render: () => /*html*/`<label id="cnt"><input type="checkbox" id="input" /><span id="label"><slot name="label"></slot></span></label>`,
  style: /*css*/`
:host {
  display: inline-block;
}
label {
  display: flex;
  flex-direction: row;
}
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

export const HtnaLabelCheckbox = create(definition);
export const HtnaLabelRadio = create({
  ...definition,
  elementName: "htna-label-radio",
  formInput: "radio",
  render: () => /*html*/`<label id="cnt"><input type="radio" id="input" /><span id="label"><slot name="label"></slot></span></label>`
});

export default HtnaLabelCheckbox;
