import { HTNAElement, HTNAElementConfig } from "htna";
import { setStyle, parsePropertiesString, animateTo } from "htna-tools";
import { parsePositionalTarget, applyPositionalTarget } from "../commons/utils";

export class HtnaTooltip extends HTNAElement {
  static config: HTNAElementConfig = {
    elementName: "htna-tooltip",
    render: () => /*html*/`<slot></slot>`,
    style: /*css*/`
:host {
  display: block;
  position: fixed;
  visibility: hidden;
  pointer-events: none;
}
    `,
    attributesSchema: {
      "for": {
        type: String,
        observed: true,
        property: true,
        value: 0
      },
      "open-style-from": {
        type: String,
        property: true
      },
      "open-style-to": {
        type: String,
        property: true
      },
      "close-style-from": {
        type: String,
        property: true
      },
      "close-style-to": {
        type: String,
        property: true
      }
    },
    controller: ({ element, attributes }) => {

      const adjustPosition = (): void => {
        applyPositionalTarget(element, attributes.get("for"), true);

        const animationStyles: Keyframe[] = [];

        const openStyleTo = attributes.get("open-style-to");
        if(openStyleTo) {
          const openStyleFrom = attributes.get("open-style-from");
          if(openStyleFrom) {
            animationStyles.push(parsePropertiesString(openStyleFrom));
          }
          animationStyles.push(parsePropertiesString(openStyleTo));
        } else {
          animationStyles.push({ opacity: 0 });
          animationStyles.push({ opacity: 1 });
        }

        animateTo(element, animationStyles);
      };

      const show = (): void => {
        adjustPosition();
        setStyle(element, {
          visibility: "visible"
        });
      };

      const hide = (): void => {
        const animationStyles: Keyframe[] = [];

        const closeStyleTo = attributes.get("close-style-to");
        if(closeStyleTo) {
          const closeStyleFrom = attributes.get("close-style-from");
          if(closeStyleFrom) {
            animationStyles.push(parsePropertiesString(closeStyleFrom));
          }
          animationStyles.push(parsePropertiesString(closeStyleTo));
        } else {
          animationStyles.push({ opacity: 1 });
          animationStyles.push({ opacity: 0 });
        }

        animateTo(element, animationStyles, undefined, () => {
          setStyle(element, {
            visibility: "hidden"
          });
        });
      };

      const showListener = (): void => show();
      const hideListener = (): void => hide();

      let actTargetNode: HTMLElement;

      const removeEventListener = (): void => {
        if(actTargetNode) {
          actTargetNode.removeEventListener("mouseenter", showListener);
          actTargetNode.removeEventListener("focus", showListener);
          actTargetNode.removeEventListener("mouseleave", hideListener);
          actTargetNode.removeEventListener("blur", hideListener);
          actTargetNode = null;
        }
      };

      const addListeners = (): void => {
        removeEventListener();

        const targetInfo = parsePositionalTarget(attributes.get("for"));
        if(targetInfo && targetInfo.target) {
          const targetNode = document.getElementById(targetInfo.target);
          if(targetNode) {
            targetNode.addEventListener("mouseenter", showListener);
            targetNode.addEventListener("focus", showListener);
            targetNode.addEventListener("mouseleave", hideListener);
            targetNode.addEventListener("blur", hideListener);
            actTargetNode = targetNode;
          }
        }
      };

      return {
        connectedCallback: (): void => {
          addListeners();
        },
        disconnectedCallback: (): void => {
          removeEventListener();
        },
        attributeChangedCallback: {
          "for": addListeners
        },
        properties: {
          "show": {
            value: show
          },
          "hide": {
            value: hide
          }
        }
      };
    }
  }
}

export default HtnaTooltip;
