import { define, AttributeTypes } from "htna";

export const HtnaPaginator = define("htna-paginator", {
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
    "data": {
      type: AttributeTypes.JSON,
      observed: true,
      property: true,
      value: []
    }
  },
  controller: ({ shadow, light, attributes }) => {

    const renderHead = () => {

    };

    const renderBody = () => {

    };

    const renderFoot = () => {

    };

    const updateData = () => {

    };

    return {
      attributeChangedCallback: {
        data: updateData
      }
    };
  }
});
