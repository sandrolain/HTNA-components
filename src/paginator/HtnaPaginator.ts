import { define, AttributeTypes } from "htna";

export const HtnaPaginator = define("htna-paginator", {
  render: () => /*html*/`<div id="cnt">
    <button id="first"></button>
    <button id="prev"></button>
    <div id="pages"></div>
    <button id="next"></button>
    <button id="last"></button>
    <select id="per-page" class="hidden"></select>
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
    #per-page.hidden {
      display: none;
    }
  `,
  attributesSchema: {
    "page": {
      type: Number,
      observed: true,
      property: true,
      value: 1
    },
    "total-pages": {
      type: Number,
      observed: true,
      property: true,
      value: 10
    },
    "per-page": {
      type: Number,
      observed: true,
      property: true,
      value: 10
    },
    "per-page-options": {
      type: AttributeTypes.CSVNumber,
      observed: true,
      property: true,
      value: [10, 25, 50, 100]
    },
    "first-lbl": {
      observed: true,
      property: true,
      value: "<<"
    },
    "prev-lbl": {
      observed: true,
      property: true,
      value: "<"
    },
    "next-lbl": {
      observed: true,
      property: true,
      value: ">"
    },
    "last-lbl": {
      observed: true,
      property: true,
      value: ">>"
    }
  },
  controller: ({ shadow, light, attributes }) => {

    const $first = shadow.$("#first");
    const $prev = shadow.$("#prev");
    const $next = shadow.$("#next");
    const $last = shadow.$("#last");
    const $perp = shadow.$<HTMLSelectElement>("#per-page");

    const updateLabels = (): void => {
      $first.innerText = attributes.get("first-lbl") || "";
      $prev.innerText = attributes.get("prev-lbl") || "";
      $next.innerText = attributes.get("next-lbl") || "";
      $last.innerText = attributes.get("last-lbl") || "";
    };

    const updatePerPage = (): void => {
      const perPageOptions = attributes.get("per-page-options") || [];
      const perPage = attributes.get("per-page") || perPageOptions[0];
      if(perPageOptions && perPageOptions.length > 0) {
        const html: string[] = [];
        for(const num of perPageOptions) {
          html.push(`<option value="${num}"${(perPage === num) ? " selected" : ""}>${num}</option>`);
        }
        $perp.innerHTML = html.join("");
        $perp.classList.remove("hidden");
        light.dispatch("change:per-page", {
          perPage,
          perPageOptions
        });
      } else {
        $perp.classList.add("hidden");
      }
    };

    const generatePages = (): void => {
      const page           = attributes.get("page") || 1;
      const totalPages     = attributes.get("total-pages") || 1;
      const html: string[] = [];
      for(let i = 1; i <= totalPages; i++) {
        html.push(`<button class="page${page === i ? " active" : ""}" data-page="${i}">${i}</button>`);
      }
      shadow.$("#pages").innerHTML = html.join("");
      light.dispatch("change:page", {
        page,
        totalPages
      });
    };

    $first.addEventListener("click", () => {
      attributes.set("page", 1);
    });
    $prev.addEventListener("click", () => {
      const page = attributes.get("page") || 1;
      const newPage = Math.max(page - 1, 1);
      attributes.set("page", newPage);
    });
    $next.addEventListener("click", () => {
      const page = attributes.get("page") || 1;
      const totalPages = attributes.get("total-pages") || 1;
      const newPage = Math.min(page + 1, totalPages);
      attributes.set("page", newPage);
    });
    $last.addEventListener("click", () => {
      const totalPages = attributes.get("total-pages") || 1;
      attributes.set("page", totalPages);
    });
    shadow.delegate("#pages", "click", ".page", function () {
      const page = this.dataset.page;
      attributes.set("page", page);
    });
    $perp.addEventListener("change", () => {
      attributes.set("per-page", $perp.value);
    });

    return {
      connectedCallback: (): void => {
        updateLabels();
        generatePages();
        updatePerPage();
      },
      attributeChangedCallback: {
        "page": generatePages,
        "total-pages": generatePages,
        "first-lbl": updateLabels,
        "prev-lbl": updateLabels,
        "next-lbl": updateLabels,
        "last-lbl": updateLabels,
        "per-page": updatePerPage,
        "per-page-options": updatePerPage
      }
    };
  }
});
