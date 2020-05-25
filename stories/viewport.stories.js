import { action } from "@storybook/addon-actions";
import HtnaOverlay from "../src/viewport/HtnaOverlay.ts";
import HtnaModalOverlay from "../src/viewport/HtnaModalOverlay.ts";

HtnaOverlay.register();
HtnaModalOverlay.register();

export default {
  title: "Viewport"
};


export const Overlay = () => {
  const overlay = document.createElement("htna-overlay");
  overlay.addEventListener("dismiss", action("dismiss"));
  overlay.innerHTML = `
    <div style="background: #FFFFFF; width: 200px; height: 100px"> Content </div>
  `;
  return overlay;
};

export const ModalOverlay = () => {
  const overlay = document.createElement("htna-modal-overlay");
  overlay.addEventListener("dismiss", action("dismiss"));
  overlay.innerHTML = `
    <div style="background: #FFFFFF; width: 200px; height: 100px"> Content </div>
  `;
  return overlay;
};
