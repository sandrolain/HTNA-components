import { HTNAElement, HTNAElementConfig } from "htna";
import { removeNode, setStyle } from "htna-tools";

function animateTo (node: Element, style: Keyframe[] | PropertyIndexedKeyframes, options: KeyframeEffectOptions = {
  duration: 300,
  easing: "ease",
  iterations: 1,
  direction: "normal",
  fill: "forwards"
}, onFinish?: EventListenerOrEventListenerObject): Animation {
  const animation = node.animate(style, options);
  // animation.commitStyles();
  if(onFinish) {
    animation.addEventListener("finish", onFinish);
  }
  return animation;
}

export class HtnaToast extends HTNAElement {
  static config: HTNAElementConfig = {
    elementName: "htna-toast",
    render: () => /*html*/`<slot></slot>`,
    style: /*css*/`
:host {
  display: block;
  position: fixed;
  visibility: hidden;
  opacity: 0;
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
          console.log("HtnaToast -> style", style)
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
          style.left = `calc(50% - (${rect.width} / 2))`;
          break;
        }

        setStyle(element, style);
        animateTo(element, [{
          opacity: 0
        }, {
          opacity: 1
        }]);
      };

      const open = (): void => {
        adjustPosition();
        element.style.visibility = "visible";
      };

      const close = (): void => {
        element.style.visibility = "hidden";
        removeNode(element);
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
