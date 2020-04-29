import { define } from "../src/index";

export const HtnaPaginator = define("htna-paginator", {
  render: () => /*html*/`<div id="cnt">
    <button id="first"></button>
    <button id="prev"></button>
    <div id="pages"></div>
    <button id="next"></button>
    <button id="last"></button>
  </div>`,
  style: /*css*/`
    #cnt {
      display: flex;
    }
    #pages {
      display: flex;
    }
    .page.active {
      font-weight: bold;
    }
  `,
  attributesSchema: {
    page: {
      type: Number,
      observed: true,
      property: true
    },
    totalpages: {
      type: Number,
      observed: true,
      property: true
    },
    perpage: {
      type: Number,
      observed: true,
      property: true
    }
  },
  controller: ({ shadow, light, attributes }) => {

    const generatePages = (): void => {
      const page = attributes.get("page") || 1;
      const totalPages = attributes.get("totalpages") || 1;
      const html: string[] = [];
      for(let i = 1; i <= totalPages; i++) {
        html.push(`<button class="page${page === i ? " active" : ""}" data-page="${i}">${i}</button>`);
      }
      shadow.$("#pages").innerHTML = html.join("");
      light.fire("change");
    };

    shadow.delegate("#pages", "click", ".page", function () {
      const page = this.dataset.page;
      attributes.set("page", page);
    });


    return {
      connectedCallback: generatePages,
      attributeChangedCallback: {
        page: generatePages,
        totalpages: generatePages
      }
    };
  }
});
