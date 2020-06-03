import { HTNAElement, HTNAElementConfig } from "htna";
import { removeNode, setStyle, parsePropertiesString, animateTo } from "htna-tools";

export class HtnaToast extends HTNAElement {
  static config: HTNAElementConfig = {
    elementName: "htna-toast",
    render: () => /*html*/`<slot></slot>`,
    style: /*css*/`
:host {
  display: block;
  position: fixed;
  visibility: hidden;
}
    `,
    attributesSchema: {
      "autoclose": {
        type: Number,
        observed: true,
        property: true,
        value: 0
      },
      "position": {
        type: String,
        property: true,
        value: "top-right"
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
    controller: ({ element, light, attributes }) => {

      const adjustPosition = (): void => {
        const position = attributes.get("position");
        const rect = element.getBoundingClientRect();
        const style = {
          top: "",
          left: "",
          bottom: "",
          right: ""
        };
        switch(position) {
        case "top-left":
          style.top = "0";
          style.left = "0";
          break;
        default:
        case "top-right":
          style.top = "0";
          style.right = "0";
          break;
        case "top-center":
          style.top = "0";
          style.left = `calc(50% - (${Math.round(rect.width)}px / 2))`;
          break;
        case "bottom-left":
          style.bottom = "0";
          style.left = "0";
          break;
        case "bottom-right":
          style.bottom = "0";
          style.right = "0";
          break;
        case "bottom-center":
          style.bottom = "0";
          style.left = `calc(50% - (${Math.round(rect.width)}px / 2))`;
          break;
        }

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

        setStyle(element, style);
        animateTo(element, animationStyles);
      };

      const open = (): void => {
        adjustPosition();
        element.style.visibility = "visible";
      };

      const close = (): void => {
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
          removeNode(element);
        });
      };

      let autocloseTO: number;
      const cancelAutoclose = (): void => {
        if(autocloseTO) {
          window.clearTimeout(autocloseTO);
          autocloseTO = null;
        }
      };
      const updateAutoclose = (): void => {
        cancelAutoclose();
        const timeout = attributes.get("autoclose");
        if(timeout > 0) {
          autocloseTO = window.setTimeout(() => close(), timeout);
        }
      };

      light.on(element, "click", () => {
        cancelAutoclose();
        close();
      });

      // TODO: show sound if attribute defined

      return {
        connectedCallback: (): void => {
          updateAutoclose();
        },
        attributeChangedCallback: {
          "autoclose": updateAutoclose
        },
        properties: {
          "open": {
            value: open
          }
        }
      };
    }
  }
}

export default HtnaToast;
