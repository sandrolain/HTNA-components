import HtnaInclude from "../src/microfrontend/HtnaInclude.ts";

HtnaInclude.register();

export default {
  title: "MicroFrontend"
};

export const Include = () => {
  const $f = document.createDocumentFragment();
  const inc = document.createElement("htna-include");
  inc.setAttribute("src", "./inclusion-1.html");
  $f.appendChild(inc);
  const btn = document.createElement("button");
  btn.addEventListener("click", () => {
    if(inc.getAttribute("src") === "./inclusion-1.html") {
      inc.setAttribute("src", "./inclusion-2.html");
    } else {
      inc.setAttribute("src", "./inclusion-1.html");
    }
  });
  btn.innerText = "Change Inclusion";
  $f.appendChild(btn);
  return $f;
};
