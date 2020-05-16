import { define, AttributeTypes } from "htna";

export const HtnaNumberRange = define("htna-number-range", {
  render: () => /*html*/`<div id="range">
<div class="range-row"><label for="range-from"></label><input type="range" id="range-from" min="0" max="100" /><output for="range-from"></output></div>
<div class="range-row"><label for="range-to"></label><input type="range" id="range-to" min="0" max="100" /><output for="range-to"></output></div>
</div>`,
  style: /*css*/`
#range {
  height: 1em;
  position: relative;
}
.range-row {
  width: 100%;
  display: flex;
}
label {
  width: 50px;
}
input {
  flex: 1;
}
output {
  width: 50px;
  text-align: right;
}
  `,
  attributesSchema: {
    "step": {
      type: AttributeTypes.Number,
      observed: true,
      property: true,
      value: 1
    },
    "min": {
      type: AttributeTypes.Number,
      observed: true,
      property: true,
      value: 0
    },
    "max": {
      type: AttributeTypes.Number,
      observed: true,
      property: true,
      value: 0
    },
    "value": {
      type: AttributeTypes.CSVNumber,
      observed: true,
      property: true,
      value: [0, 0]
    },
    "label-from": {
      type: AttributeTypes.String,
      observed: true,
      property: true,
      value: "FROM"
    },
    "label-to": {
      type: AttributeTypes.String,
      observed: true,
      property: true,
      value: "TO"
    }
  },
  controller: ({ light, shadow, attributes }) => {

    const $from       = shadow.$<HTMLInputElement>("#range-from");
    const $to         = shadow.$<HTMLInputElement>("#range-to");
    const $fromOutput = shadow.$<HTMLOutputElement>("output[for=\"range-from\"");
    const $toOutput   = shadow.$<HTMLOutputElement>("output[for=\"range-to\"");
    const $fromLabel  = shadow.$<HTMLLabelElement>("label[for=\"range-from\"");
    const $toLabel    = shadow.$<HTMLLabelElement>("label[for=\"range-to\"");

    const updateValue = function (source: string = "from"): void {
      const value     = attributes.get("value") as [number, number];
      const min       = attributes.get("min") as number;
      const max       = attributes.get("max") as number;
      const valueFrom = Number($from.value);
      const valueTo   = Number($to.value);

      let newValueFrom = Math.max(Math.min(valueFrom, max), min);
      let newValueTo   = Math.max(Math.min(valueTo, max), min);

      if(source === "to") {
        newValueFrom = Math.min(newValueTo, newValueFrom);
      } else {
        newValueTo = Math.max(newValueTo, newValueFrom);
      }

      if(newValueFrom !== valueFrom) {
        $from.value = newValueFrom.toString();
      }

      if(newValueTo !== valueTo) {
        $to.value = newValueFrom.toString();
      }

      if(value[0] !== newValueFrom || value[1] !== newValueTo) {
        attributes.set("value", [newValueFrom, newValueTo]);
        light.dispatch("change");
      }

      $fromOutput.value = $from.value;
      $toOutput.value   = $to.value;
    };

    const setNewValue = (): void => {
      const value = attributes.get("value") as [number, number];
      if(value) {
        $from.value = value[0].toString();
        $to.value = value[1].toString();
      }
    };

    const updateAttributes = function (): void {
      const min  = attributes.get("min");
      const max  = attributes.get("max");
      const step = attributes.get("step");
      $from.min  = min || 0;
      $from.max  = max || 100;
      $from.step = step || 1;
      $to.min    = min || 0;
      $to.max    = max || 100;
      $to.step   = step || 1;

      updateValue();
    };

    $from.addEventListener("input", () => {
      updateValue("from");
    });
    $to.addEventListener("input", () => {
      updateValue("to");
    });

    const updateLabel = (): void => {
      $fromLabel.innerText = attributes.get("label-from");
      $toLabel.innerText   = attributes.get("label-to");
    };

    return {
      connectedCallback: (): void => {
        setNewValue();
        updateAttributes();
        updateLabel();
      },
      attributeChangedCallback: {
        "step": updateAttributes,
        "min": updateAttributes,
        "max": updateAttributes,
        "value": (): void => {
          setNewValue();
          updateValue();
        },
        "label-from": updateLabel,
        "label-frtoom": updateLabel
      }
    };
  }
});
