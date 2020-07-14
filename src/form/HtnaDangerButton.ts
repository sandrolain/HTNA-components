import { HTNAElement, HTNAElementConfig } from "htna";
import cssVars from "goodnight-css/dist/vars.css";
import cssBase from "goodnight-css/dist/base.css";
import cssButton from "goodnight-css/dist/button.css";

export class HtnaDangerButton extends HTNAElement {
  static config: HTNAElementConfig = {
    elementName: "htna-danger-button",
    render: () => /*html*/`<button class="btn" type="submit" part="button"><slot name="normal"></slot></button>`,
    style: /*css*/`
:host {
  display: contents;
}
${cssVars}
${cssBase}
${cssButton}
    `,
    attributesSchema: {
      "warning": {
        type: Boolean,
        observed: true,
        property: true,
        value: 0
      },
      "restore-timeout": {
        type: Number,
        observed: true,
        property: true,
        value: 5000
      }
    },
    controller: ({ shadow, attributes }) => {

      const $btn = shadow.$("button");

      let restoreTO: number;

      const cancelRestoreTimeout = (): void => {
        if(restoreTO) {
          window.clearTimeout(restoreTO);
          restoreTO = null;
        }
      };

      const restoreButton = (): void => {
        cancelRestoreTimeout();
        attributes.set("warning", false);
        $btn.innerHTML = `<slot name="normal"></slot>`;
      };

      const setRestoreTimeout = (): void => {
        cancelRestoreTimeout();
        const timeout = attributes.get("restore-timeout");
        restoreTO = window.setTimeout(restoreButton, timeout);
      };

      const setWarningState = (): void => {
        attributes.set("warning", true);
        $btn.innerHTML = `<slot name="warning"></slot>`;
        setRestoreTimeout();
      };

      $btn.addEventListener("click", (e) => {
        const warning = attributes.get("warning");
        if(!warning) {
          e.stopPropagation();
          e.preventDefault();
          setWarningState();
        } else {
          restoreButton();
        }
      });

      return {
        attributeChangedCallback: {
          "warning": (name, oldValue, newValue): void => {
            if(oldValue === newValue) {
              return;
            }
            const warning = attributes.get("warning");
            if(warning) {
              setWarningState();
            } else {
              restoreButton();
            }
          }
        }
      };
    }
  }
}

export default HtnaDangerButton;
