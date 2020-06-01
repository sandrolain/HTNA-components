import { create } from "htna";

export class HtnaIncludeCache {
  private static  cache: Map<string, string> = new Map();

  static async getSourceFromCache (url: string): Promise<string> {
    if(this.cache.has(url)) {
      return this.cache.get(url);
    }
    const source = await this.fetchSource(url);
    this.cache.set(url, source);
    return source;
  }

  static async fetchSource (url: string): Promise<string> {
    const result = await fetch(url);
    const html = await result.text();
    return html;
  }
}

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
  controller: ({ element, light, shadow, attributes }) => {
    let latestSrc: string;
    const updateInclusion = async (): Promise<void> => {
      const newSrc = attributes.get("src");
      if(newSrc !== latestSrc) {
        try {
          latestSrc = newSrc;
          shadow.empty();

          const html = await HtnaIncludeCache.getSourceFromCache(newSrc);

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
          shadow.append($f);

          //  Extract element dataset as data arguments for inclusion scripts
          const data: Record<string, any> = {};
          for(const key in element.dataset) {
            data[key] = element.dataset[key];
          }

          if(scripts.length > 0) {
            const fn = new Function("element", "shadowRoot", "dataset", scripts.join("\n\n"));
            fn(light.node, shadow.node, data);
          }

          light.dispatch("load", { src: newSrc });
        } catch(e) {
          latestSrc = null;
          light.dispatch("error", e);
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
