import { create, AttributeTypes } from "htna";
// TODO: from tools
import { tpl, getDescendantProp } from "../commons/utils";

export const HtnaTable = create({
  elementName: "htna-table",
  render: () => /*html*/`<table>
    <thead></thead>
    <tbody></tbody>
    <tfoot></tfoot>
  </table>`,
  style: /*css*/`
    thead:empty,
    tbody:empty,
    tfoot:empty {
      display: none;
    }
  `,
  attributesSchema: {
    "header": {
      type: AttributeTypes.RichData,
      observed: true,
      property: true,
      value: {}
    },
    "footer": {
      type: AttributeTypes.RichData,
      observed: true,
      property: true,
      value: {}
    },
    "data": {
      type: AttributeTypes.RichData,
      observed: true,
      property: true,
      value: []
    },
    "sort": {
      type: AttributeTypes.String,
      observed: true,
      property: true
    }
  },
  controller: ({ shadow, element, attributes }) => {

    let tplFrag: DocumentFragment;

    const getTemplate = (): DocumentFragment => {
      if(!tplFrag) {
        tplFrag = document.createDocumentFragment();
        for(const child of Array.from(element.childNodes)) {
          tplFrag.appendChild(child.cloneNode(true));
        }
      }
      return tplFrag;
    };

    const getTemplateElementHTML = (name: string): string => {
      const thead = getTemplate().querySelector(name);
      return thead ? thead.innerHTML : "";
    };

    const replaceTemplateValues = (tplString: string, vals: Record<string, any>): string => {
      const tplBld = tpl(tplString);
      return tplBld.html(vals);
    };

    const renderHead = (): void => {
      const tpl      = getTemplateElementHTML("thead");
      const headings = attributes.get("header");
      shadow.$("thead").innerHTML = replaceTemplateValues(tpl, headings);
    };

    const renderBody = (): void => {
      const tpl    = getTemplateElementHTML("tbody");
      let   data   = attributes.get("data") as Record<string, any>[];
      const sortBy = attributes.get("sort");
      const rowsTpls: string[] = [];
      if(sortBy) {
        // TODO: use function from "tools"
        data = data.slice();
        data.sort((a, b) => {
          const aValue = getDescendantProp(a, sortBy);
          const bValue = getDescendantProp(b, sortBy);
          return aValue < bValue ? -1 : 1;
        });
      }
      data.forEach((row) => {
        rowsTpls.push(replaceTemplateValues(tpl, row));
      });
      shadow.$("tbody").innerHTML = rowsTpls.join("");
    };

    const renderFoot = (): void => {
      const tpl      = getTemplateElementHTML("tfoot");
      const headings = attributes.get("footer");
      shadow.$("tfoot").innerHTML = replaceTemplateValues(tpl, headings);
    };

    const renderAll = (): void => {
      renderHead();
      renderBody();
      renderFoot();
    };

    return {
      connectedCallback: (): void => {
        renderAll();
      },
      attributeChangedCallback: {
        header: renderHead,
        footer: renderFoot,
        data: renderBody,
        sort: renderBody
      },
      mutationObserverCallback: (): void => {
        tplFrag = null;
        renderAll();
      }
    };
  }
});
