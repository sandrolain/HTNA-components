import { create } from "htna";

export const HtnaModalOverlay = create({
  elementName: "htna-modal-overlay",
  render: () => /*html*/`<div id="overlay"><div id="overlay-wrp"><div id="overlay-cnt"><slot></slot></div></div></div>`,
  style: /*css*/`
  :host {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
    width: 100%;
    height: 100%;
  }
  #overlay {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  #overlay.blurred {
    backdrop-filter: blur(4px);
  }
  #overlay-wrp {
    min-width: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #overlay-cnt {

  }
  `,
  attributesSchema: {
    "background": {
      type: String,
      observed: true,
      property: true,
      value: "rgba(0, 0, 0, 0.8)"
    },
    "padding": {
      type: String,
      observed: true,
      property: true,
      value: "5vh"
    }
  },
  controller: ({ element, light, shadow, attributes }) => {
    const $overlay = shadow.$("#overlay");
    const $cnt = shadow.$("#overlay-cnt");

    const updateStyles = (): void => {
      $overlay.style.backgroundColor = attributes.get("background") || "transparent";
      $cnt.style.padding = attributes.get("padding");
    };

    light.on(element, "scroll", (e: Event): void => {
      e.stopPropagation();
    });

    light.on(element, "click", (e): void => {
      if(e.target === element) {
        light.dispatch("dismiss");
      }
    });

    return {
      connectedCallback: updateStyles,
      attributeChangedCallback: {
        "background": updateStyles,
        "padding": updateStyles
      }
    };
  }
});

export default HtnaModalOverlay;
