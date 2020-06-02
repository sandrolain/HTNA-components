import { action } from "@storybook/addon-actions";
import HtnaMatiButton from "../src/mati/HtnaMatiButton.ts";

HtnaMatiButton.register();

export default {
  title: "Mati",
  parameters: {
    info: () => "<htna-mati-button>PINK</htna-mati-button>"
  }
};


export const MatiButton = () => {
  const button = document.createElement("htna-mati-button");
  button.setAttribute("size", "48px");
  button.appendChild(document.createTextNode("A"));
  button.addEventListener("click", action("click"));
  return button;
};


export const MatiButtonBlue = () => {
  const button = document.createElement("htna-mati-button");
  button.setAttribute("color", "#0000FF");
  button.appendChild(document.createTextNode("BLUE"));
  button.addEventListener("click", action("click"));
  return button;
};
