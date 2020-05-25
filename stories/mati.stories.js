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
  button.appendChild(document.createTextNode("PINK"));
  button.addEventListener("click", action("click"));
  return button;
};
