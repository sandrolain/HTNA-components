import { create, AttributeTypes } from "htna";

let globalBasePath: string = ".";

export const HtnaFA = create({
  elementName: "htna-fa",
  render: () => /*html*/`<i class=""></i>`,
  style: /*css*/`

  `,
  attributesSchema: {
    "path": {
      type: AttributeTypes.String,
      observed: true,
      property: true,
      value: "."
    },
    "icon": {
      type: AttributeTypes.String,
      observed: true,
      property: true,
      value: ""
    }
  },
  // TODO: styles access object required
  controller: ({ attributes }) => {

    // TODO: listen change of global assets base-path overrided by local base-path
    const updateFAImport = (): void => {
      const basePath = attributes.get("path") || globalBasePath;
      const faPath = `${basePath}/fa/`;
//       styles.set(`
// @import url("${faPath}");
//       `);
    };

    return {
      connectedCallback: (): void => {
        updateFAImport();
      },
      attributeChangedCallback: {
        path: (): void => {
          updateFAImport();
        }
      }
    };
  }
});

// TODO: export method to register fa assets base-path
HtnaFA.setBasePath = function (basePath: string): void {
  globalBasePath = basePath;
};
