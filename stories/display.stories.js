import { action } from "@storybook/addon-actions";
import HtnaTabs from "../src/display/HtnaTabs.ts";
import HtnaToast from "../src/display/HtnaToast.ts";

try {
HtnaTabs.register();
HtnaToast.register();
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

  const btn = document.createElement("toast");
  btn.innerText = "Show";
  btn.addEventListener("click", () => {
    const toast = document.createElement("htna-toast");
    toast.setAttribute("position", position.value);
    toast.innerHTML = "Hello World!";
    btn.parentNode.appendChild(toast);
    toast.open();
  });
  $f.appendChild(btn);

  return $f;
};
