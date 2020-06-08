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
      "autohide": {
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
      "show-style-from": {
        type: String,
        property: true
      },
      "show-style-to": {
        type: String,
        property: true
      },
      "hide-style-from": {
        type: String,
        property: true
      },
      "hide-style-to": {
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

        const showStyleTo = attributes.get("show-style-to");
        if(showStyleTo) {
          const showStyleFrom = attributes.get("show-style-from");
          if(showStyleFrom) {
            animationStyles.push(parsePropertiesString(showStyleFrom));
          }
          animationStyles.push(parsePropertiesString(showStyleTo));
        } else {
          animationStyles.push({ opacity: 0 });
          animationStyles.push({ opacity: 1 });
        }

        setStyle(element, style);
        animateTo(element, animationStyles);
      };

      const show = (): void => {
        adjustPosition();
        element.style.visibility = "visible";
      };

      const hide = (): void => {
        const animationStyles: Keyframe[] = [];

        const hideStyleTo = attributes.get("hide-style-to");
        if(hideStyleTo) {
          const hideStyleFrom = attributes.get("hide-style-from");
          if(hideStyleFrom) {
            animationStyles.push(parsePropertiesString(hideStyleFrom));
          }
          animationStyles.push(parsePropertiesString(hideStyleTo));
        } else {
          animationStyles.push({ opacity: 1 });
          animationStyles.push({ opacity: 0 });
        }

        animateTo(element, animationStyles, undefined, () => {
          removeNode(element);
        });
      };

      let autohideTO: number;
      const cancelAutohide = (): void => {
        if(autohideTO) {
          window.clearTimeout(autohideTO);
          autohideTO = null;
        }
      };
      const updateAutohide = (): void => {
        cancelAutohide();
        const timeout = attributes.get("autohide");
        if(timeout > 0) {
          autohideTO = window.setTimeout(() => hide(), timeout);
        }
      };

      light.on(element, "click", () => {
        cancelAutohide();
        hide();
      });

      // TODO: show sound if attribute defined

      return {
        connectedCallback: (): void => {
          updateAutohide();
        },
        attributeChangedCallback: {
          "autohide": updateAutohide
        },
        properties: {
          "show": {
            value: show
          }
        }
      };
    }
  }
}

export default HtnaToast;
