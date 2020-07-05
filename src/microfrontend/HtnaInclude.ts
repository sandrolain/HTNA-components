import { HTNAElement, HTNAElementConfig } from "htna";

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
    if(result.ok && result.status === 200) {
      const html = await result.text();
      return html;
    }
    throw new Error("Bad Request");
  }
}

export class HtnaInclude extends HTNAElement {
  static config: HTNAElementConfig = {
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
      },
      "allow-script": {
        type: Boolean,
        property: true,
        value: false
      },
      "disable-cache": {
        type: Boolean,
        property: true,
        value: false
      }
    },
    controller: ({ element, light, shadow, attributes }) => {
      let latestSrc: string;
      const updateInclusion = async (): Promise<void> => {
        const newSrc = (new window.URL(attributes.get("src"), window.location.href)).href;
        if(newSrc !== latestSrc && window.location.href !== newSrc) {
          try {
            latestSrc = newSrc;
            shadow.empty();

            const html = attributes.get("disable-cache")
              ? await HtnaIncludeCache.fetchSource(newSrc)
              : await HtnaIncludeCache.getSourceFromCache(newSrc);

            const div = document.createElement("div");
            div.innerHTML = html;

            const $f = document.createDocumentFragment();
            const scripts: { type: string; source: string }[] = Array.from(div.getElementsByTagName("script")).map((script) => ({
              type: script.type || "text/javascript",
              source: script.innerHTML
            }));

            for(const child of Array.from(div.childNodes)) {
              if(!(child instanceof HTMLScriptElement)) {
                $f.appendChild(child);
              }
            }
            shadow.append($f);

            if(attributes.get("allow-script") && scripts.length > 0) {
              //  Extract element dataset as data arguments for inclusion scripts
              const data: Record<string, any> = {};
              for(const key in element.dataset) {
                data[key] = element.dataset[key];
              }
              scripts.forEach((script) => {
                if(script.type === "text/javascript") {
                  const fn = new Function("element", "shadowRoot", "dataset", script.source);
                  fn(light.node, shadow.node, data);
                } else if(script.type === "module") {
                  const node = document.createElement("script");
                  node.type = "module";
                  node.innerHTML = script.source;
                  shadow.append(node);
                }
              });
            }

            light.dispatch("load", { src: newSrc });
          } catch(e) {
            shadow.empty();
            shadow.append(document.createElement("slot"));
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
  }
}

export default HtnaInclude;
