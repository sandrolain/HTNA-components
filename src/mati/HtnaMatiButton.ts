import { create } from "htna";

export const HtnaMatiButton = create({
  elementName: "htna-mati-button",
  render: () => /*html*/`<button type="button"><span><slot></slot></span></button>`,
  style: /*css*/`
  :host {
    display: inline-block;
  }
  button {
    position: relative;
    padding: 0.25em 0.5em;
    border-radius: 0.5em;
    box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.2) inset;
    background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    color: #FFFFFF;
    font-size: 20px;
    font-family: "Arial Black", Arial, sans-serif;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    border: none;
    font-weight: bold;
    line-height: 1em;
    text-align: center;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.5), 0px 2px 6px rgba(0, 0, 0, 0.2);
  }
  button::before {
    content: '';
    display: block;
    position: absolute;
    bottom: 1px;
    right: 1px;
    left: 1px;
    top: 60%;
    border-radius: 0.2em 0.2em 0.4em 0.4em;
    background-image: linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2));
    filter: blur(0.2em);
  }
  button::after {
    content: '';
    display: block;
    position: absolute;
    top: 1px;
    right: 1px;
    left: 1px;
    bottom: 50%;
    border-radius: calc(0.5em - 1px) calc(0.5em - 1px) 0.2em 0.2em;
    background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2));
  }
  button:focus {
    outline: none;
  }
  button:active {
    filter: brightness(110%) contrast(110%);
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
  `,
  attributesSchema: {
    "color": {
      type: String,
      observed: true,
      property: true,
      value: "#FF0099"
    },
    "size": {
      type: String,
      observed: true,
      property: true,
      value: "16px"
    }
  },
  controller: ({ shadow, attributes }) => {
    const $btn = shadow.$("button");
    const updateButtonColor = (): void => {
      $btn.style.backgroundColor = attributes.get("color");
      $btn.style.fontSize = attributes.get("size");
    };

    return {
      connectedCallback: updateButtonColor,
      attributeChangedCallback: updateButtonColor
    };
  }
});

export default HtnaMatiButton;
