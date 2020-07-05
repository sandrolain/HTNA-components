import { HTNAElement, HTNAElementConfig } from "htna";
import { copyToClipboard } from "htna-tools";

export class HtnaCopyToClipboard extends HTNAElement {
  static config: HTNAElementConfig = {
    elementName: "htna-copytoclipboard",
    render: () => /*html*/`<slot></slot>`,
    attributesSchema: {
      "value": {
        type: String,
        property: true,
        value: ""
      }
    },
    controller: ({ element, light, attributes }) => {
      light.on(element, "click", () => {
        const value = attributes.get("value");
        copyToClipboard(value).then(() => {
          light.dispatch("copied", {
            value
          });
        }).catch((error) => {
          light.dispatch("error", {
            error
          });
        });
      });
    }
  }
}

export default HtnaCopyToClipboard;
