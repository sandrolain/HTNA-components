import { create, AttributeTypes } from "htna";


// THX to https://github.com/aralroca/js-paging
function pagesBadges ({ currentPage, pages, numBadges = 5 }: { currentPage: number; pages: number; numBadges?: number }): number[]  {
  const maxBadgesSide = numBadges - 2;

  // Without separators case
  // ex: [1, 2, 3, 4, 5]
  if(pages <= numBadges) {
    return Array.from({ length: pages }).map((v, i) => i + 1);
  }

  const sideBadges = Array.from({ length: numBadges - 1 });

  // With a separator at the end case
  // ex: [1, 2, 3, 4, null, 49]
  if(currentPage <= maxBadgesSide) {
    return [...sideBadges.map((v, i) => i + 1), null, pages];
  }

  // With a separator at the beginning case
  // ex: [1, null, 46, 47, 48, 49]
  if(currentPage > pages - maxBadgesSide) {
    return [1, null, ...sideBadges.map((v, i) => pages - i).reverse()];
  }

  // In the middle (separator left + right) case
  // ex: [1, null, 26, 27, 28, null, 49]
  sideBadges.pop();
  const curr = Math.floor(sideBadges.length / 2);
  const center = sideBadges.map((v, i) => currentPage - curr + i);

  return [1, null, ...center, null, pages];
}

export const HtnaPaginator = create({
  elementName: "htna-paginator",
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
    "max-pages": {
      type: Number,
      observed: true,
      property: true,
      value: 5
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
      const maxPages       = attributes.get("max-pages") || 0;
      const page           = attributes.get("page") || 1;
      const totalPages     = attributes.get("total-pages") || 1;
      const html: string[] = [];
      const badges         = pagesBadges({
        currentPage: page,
        pages: totalPages,
        numBadges: maxPages
      });
      for(const num of badges) {
        if(num === null) {
          html.push(`<span class="spacer">…</span>`);
        } else {
          html.push(`<button class="page${page === num ? " active" : ""}" data-page="${num}">${num}</button>`);
        }
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
        "max-pages": generatePages,
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
