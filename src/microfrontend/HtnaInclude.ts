import { create } from "htna";

export const HtnaInclude = create({
  elementName: "htna-include",
  render: () => /*html*/`<slot></slot>`,
  style: /*css*/`
  :host {
    display: contents;
  }
  `,
  attributesSchema: {
    "src": {
      type: String,
      observed: true,
      property: true,
      value: ""
    }
  },
  controller: ({ light, shadow, attributes }) => {
    let latestSrc: string;
    const updateInclusion = async (): Promise<void> => {
      const newSrc = attributes.get("src");
      if(newSrc !== latestSrc) {
        latestSrc = newSrc;
        const result = await fetch(newSrc);
        const html = await result.text();

        const div = document.createElement("div");
        div.innerHTML = html;

        const $f = document.createDocumentFragment();
        const scripts: string[] = [];

        for(const child of Array.from(div.childNodes)) {
          if(child instanceof HTMLScriptElement) {
            scripts.push(child.innerHTML);
          } else {
            $f.appendChild(child);
          }
        }

        shadow.empty();
        shadow.append($f);

        if(scripts.length > 0) {
          const fn = new Function("element", "shadowRoot", scripts.join("\n\n"));
          fn(light.node, shadow.node);
        }
      }
    };

    return {
      connectedCallback: updateInclusion,
      attributeChangedCallback: updateInclusion
    };
  }
});

export default HtnaInclude;
