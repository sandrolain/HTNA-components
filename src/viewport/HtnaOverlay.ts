import { create } from "htna";

export const HtnaOverlay = create({
  elementName: "htna-overlay",
  render: () => /*html*/`<div id="overlay"><slot></slot></div>`,
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
  }
  `,
  attributesSchema: {
    "background": {
      type: String,
      observed: true,
      property: true,
      value: "transparent"
    }
  },
  controller: ({ element, light, shadow, attributes }) => {
    const $overlay = shadow.$("#overlay");

    const updateStyles = (): void => {
      $overlay.style.backgroundColor = attributes.get("background") || "transparent";
    };

    light.on(element, "scroll", (e: Event): void => {
      e.stopPropagation();
    });

    light.on(element, "click", (e): void => {
      if(e.target === $overlay) {
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

export default HtnaOverlay;
