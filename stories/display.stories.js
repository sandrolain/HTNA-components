import { action } from "@storybook/addon-actions";
import HtnaTabs from "../src/display/HtnaTabs.ts";
import HtnaToast from "../src/display/HtnaToast.ts";
import HtnaTooltip from "../src/display/HtnaTooltip.ts";

try {
HtnaTabs.register();
HtnaToast.register();
HtnaTooltip.register();
} catch(e) {
  window.location.reload();
}

export default {
  title: "Display"
};

export const Tabs = () => {
  const html =  /*html*/`
  <style>
    [slot="tab"].active {
      font-weight: bold;
    }
    [slot="content"].inactive {
      display: none
    }
  </style>
  <htna-tabs>
    <button slot="tab">Tab 1</button>
    <button slot="tab">Tab 2</button>
    <button slot="tab">Tab 3</button>
    <div slot="content">Cnt 1</div>
    <div slot="content">Cnt 2</div>
    <div slot="content">Cnt 3</div>
  </htna-tabs>`;
  return html;
};


export const Toast = () => {
  const $f = document.createDocumentFragment();
  const style = document.createElement("style");
  style.innerHTML = /*css*/`
  htna-toast {
    background: #CCCCCC;
    padding: 1em;
  }
  `;
  $f.appendChild(style);


  const position = document.createElement("select");
  position.innerHTML = /*html*/`
    <option value="top-left">top-left</option>
    <option value="top-right">top-right</option>
    <option value="top-center">top-center</option>
    <option value="bottom-left">bottom-left</option>
    <option value="bottom-right">bottom-right</option>
    <option value="bottom-center">bottom-center</option>
  `;
  $f.appendChild(position);

  const btn = document.createElement("button");
  btn.innerText = "Show";
  btn.addEventListener("click", () => {
    const toast = document.createElement("htna-toast");
    toast.setAttribute("position", position.value);
    toast.setAttribute("show-style-from", "transform: scale(0)");
    toast.setAttribute("show-style-to", "transform: scale(1)");
    toast.setAttribute("hide-style-from", "transform: scale(1)");
    toast.setAttribute("hide-style-to", "transform: scale(0)");
    toast.setAttribute("autohide", "3000");
    toast.innerHTML = "Hello World!";
    btn.parentNode.appendChild(toast);
    toast.show();
  });
  $f.appendChild(btn);

  return $f;
};



export const Tooltip = () => {
  const $f = document.createDocumentFragment();
  const style = document.createElement("style");
  style.innerHTML = /*css*/`
  htna-tooltip {
    background: #CCCCCC;
    padding: 1em;
  }
  `;
  $f.appendChild(style);


  const btn = document.createElement("button");
  btn.setAttribute("id", "test-btn");
  btn.innerText = "Button";
  $f.appendChild(btn);

  const ttip = document.createElement("htna-tooltip");
  ttip.setAttribute("for", "0.5:0 test-btn 0.5:1+5");
  ttip.setAttribute("show-style-from", "transform: scale(0)");
  ttip.setAttribute("show-style-to", "transform: scale(1)");
  ttip.setAttribute("hide-style-from", "transform: scale(1)");
  ttip.setAttribute("hide-style-to", "transform: scale(0)");
  ttip.innerHTML = "Hello World!";
  $f.appendChild(ttip);

  return $f;
};
