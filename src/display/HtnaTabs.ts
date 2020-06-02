import { HTNAElement, HTNAElementConfig } from "htna";

export class HtnaTabs extends HTNAElement {
  static config: HTNAElementConfig = {
    elementName: "htna-tabs",
    render: () => /*html*/`
    <div id="tabs"><div id="tabs-wrp"><slot name="tab"></slot></div></div>
    <div id="contents"><slot name="content"></slot></div>
    `,
    style: /*css*/`
:host {
  display: flex;
  flex-direction: column;
}
#tabs {
overflow: auto;
}
#tabs-wrp {
  display: flex;
  flex-direction: row;
}
    `,
    attributesSchema: {
      "tab-active-class": {
        type: String,
        property: true,
        value: "active"
      },
      "content-active-class": {
        type: String,
        property: true,
        value: "active"
      },
      "tab-inactive-class": {
        type: String,
        property: true,
        value: "inactive"
      },
      "content-inactive-class": {
        type: String,
        property: true,
        value: "inactive"
      },
      "index": {
        type: Number,
        observed: true,
        property: true,
        value: 0
      }
    },
    controller: ({ shadow, light, attributes, slot }) => {

      let tabIndex = -1;

      const updateIndex = (): void => {
        const newIndex = attributes.get("index") || 0;
        if(newIndex !== tabIndex) {
          const prevIndex = tabIndex;
          tabIndex = newIndex;
          const tabActiveClass = attributes.get("tab-active-class");
          const cntActiveClass = attributes.get("content-active-class");
          const tabInactiveClass = attributes.get("tab-inactive-class");
          const cntInactiveClass = attributes.get("content-inactive-class");
          const tabs = Array.from(slot.getAll("tab"));
          const cnts = Array.from(slot.getAll("content"));
          tabs.forEach((tab, i) => {
            tab.classList.toggle(tabActiveClass, (i === newIndex));
            tab.classList.toggle(tabInactiveClass, (i !== newIndex));
          });
          cnts.forEach((cnt, i) => {
            cnt.classList.toggle(cntActiveClass, (i === newIndex));
            cnt.classList.toggle(cntInactiveClass, (i !== newIndex));
          });
          light.dispatch("change", {
            index: newIndex,
            previousIndex: prevIndex
          });
        }
      };

      shadow.$("#tabs").addEventListener("click", (e) => {
        const tabs = Array.from(slot.getAll("tab"));
        const newIndex = tabs.indexOf(e.target as HTMLElement);
        if(newIndex > -1) {
          attributes.set("index", newIndex);
          updateIndex();
        }
      });

      return {
        connectedCallback: (): void => {
          updateIndex();
        },
        attributeChangedCallback: updateIndex,
        mutationObserverCallback: updateIndex
      };
    }
  }
}

export default HtnaTabs;
