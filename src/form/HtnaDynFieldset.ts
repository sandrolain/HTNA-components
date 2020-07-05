import { HTNAElement, HTNAElementConfig, AttributeTypes } from "htna";
import { createElement } from "htna-tools";

interface Field {
  label?: string;
  name: string;
  value?: any;
  inputNode?: HTMLElement;
  fieldNode?: HTMLElement;
  render?: (fieldInfo: Field) => HTMLElement;
  tagName?: string;
  attributes?: Record<string, any>;
}

export class HTNADynFieldset extends HTNAElement {
  public static config: HTNAElementConfig = {
    elementName: "htna-dyn-fieldset",
    render: () => /*html*/``,
    style: /*css*/`
    `,
    attributesSchema: {
      "value": {
        type: AttributeTypes.Entries,
        observed: true,
        property: true,
        value: []
      }
    },
    controller: ({ element, attributes }) => {
      return {
        attributeChangedCallback: {
          "value": (): void => {
            element.setValues(attributes.get("value"));
          }
        }
      };
    }
  }

  private fields: Field[] = [];
  private sortFn: (a: Field, b: Field) => number;
  private renderFieldFn: (fieldInfo: Field) => HTMLElement;

  addField (fieldInfo: Field): void {
    this.fields.push(fieldInfo);
  }

  removeFieldByName (fieldName: string): void {
    this.fields = this.fields.filter((fieldInfo) => (fieldInfo.name !== fieldName));
  }

  removeAllFields (): void {
    this.fields = [];
  }

  private renderInput (fieldInfo: Field): HTMLElement {
    if(fieldInfo.render) {
      return fieldInfo.render(fieldInfo);
    }

    if(fieldInfo.tagName) {
      return createElement(fieldInfo.tagName, fieldInfo.attributes);
    }

    return createElement("input", {
      type: "text"
    });
  }

  private renderField (fieldInfo: Field): HTMLElement {
    const { label, inputNode } = fieldInfo;
    const cnt = document.createElement("div");
    cnt.className = "field";
    const labelNode = document.createElement("label");
    cnt.appendChild(labelNode);
    const labelCnt = document.createElement("div");
    labelCnt.className = "field-label";
    labelCnt.innerText = label;
    labelNode.appendChild(labelCnt);
    const inputCnt = document.createElement("div");
    inputCnt.className = "field-input";
    inputCnt.appendChild(inputNode);
    labelNode.appendChild(inputCnt);
    return cnt;
  }

  render (force = false): void {
    const fragment = document.createDocumentFragment();
    const fields   = this.fields.slice(0);

    if(this.sortFn) {
      fields.sort(this.sortFn);
    }

    fields.forEach((fieldInfo) => {
      const value = fieldInfo.inputNode ? (fieldInfo.inputNode as HTMLInputElement).value : fieldInfo.value;
      if(!fieldInfo.inputNode || force) {
        fieldInfo.inputNode = this.renderInput(fieldInfo);
      }
      if(!fieldInfo.fieldNode || force) {
        fieldInfo.fieldNode = this.renderField(fieldInfo);
      }
      if(value !== null && value !== undefined) {
        (fieldInfo.inputNode as HTMLInputElement).value = value;
      }
      fragment.appendChild(fieldInfo.fieldNode);
    });

    this.access.shadow.empty();
    this.access.shadow.append(fragment);
  }

  setSortFunction (sortFn: (a: Field, b: Field) => number): void {
    this.sortFn = sortFn;
  }

  setFieldValue (name: string, value: any): void {
    this.fields.forEach((fieldInfo) => {
      if(fieldInfo.name === name) {
        fieldInfo.value = value;
        if(fieldInfo.inputNode) {
          (fieldInfo.inputNode as HTMLInputElement).value = value;
        }
      }
    });
  }

  getFieldValue (name: string): string {
    for(const fieldInfo of this.fields) {
      if(fieldInfo.name === name) {
        return (fieldInfo.inputNode as HTMLInputElement).value;
      }
    }
    return null;
  }

  setValue (data: Record<string, any>, allValues: boolean = false): void {
    this.fields.forEach((fieldInfo) => {
      const name = fieldInfo.name;
      if(name in data) {
        fieldInfo.value = data[name];
        if(fieldInfo.inputNode) {
          (fieldInfo.inputNode as HTMLInputElement).value = data[name];
        }
      } else if(allValues) {
        (fieldInfo.inputNode as HTMLInputElement).value = "";
      }
    });
  }

  getValue (): Record<string, string> {
    const data: Record<string, string> = {};
    for(const fieldInfo of this.fields) {
      data[fieldInfo.name] = (fieldInfo.inputNode as HTMLInputElement).value;
    }
    return data;
  }
}


export default HTNADynFieldset;
