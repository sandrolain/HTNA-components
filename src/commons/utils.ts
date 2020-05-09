export function htmlEntitiesDecode (value: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

export function getDescendantProp (obj: Record<any, any>, desc: string): any {
  const arr = desc.split(/[.[]/);
  while(arr.length > 0 && obj) {
    let prop: string | number = arr.shift();
    if(prop.length === 0) {
      continue;
    }
    if(prop.match(/[0-9]\]$/)) {
      prop = parseInt(prop.replace("]", ""), 10);
    }
    obj = obj[prop];
  }
  return obj;
}

export function tplParseString (tpl: string): [string[], any[]] {
  const strings = [];
  const args = [];
  let index = tpl.indexOf("${");
  while(index > -1) {
    let scopeNum = 0;
    const str = tpl.substring(0, index);
    strings.push(str);
    tpl = tpl.substring(index + 2);
    for(let i = 0, len = tpl.length; i < len; i++) {
      const cha = tpl[i];
      if(cha === "}") {
        if(scopeNum === 0) {
          const arg = tpl.substring(0, i);
          args.push(htmlEntitiesDecode(arg));
          tpl = tpl.substring(i + 1);
          break;
        }
        scopeNum--;
      } else if(cha === "{") {
        scopeNum++;
      }
    }
    index = tpl.indexOf("${");
  }
  strings.push(tpl);
  return [strings, args];
}

export function tpl (tokens: string[] | string, ...values: any[]): HTMLTemplateBuilder {
  if(typeof tokens === "string") {
    [tokens, values] = tplParseString(tokens);
    values = values.map((scriptStr) => {
      const func = new Function(`return ${scriptStr};`);
      return func();
    });
  }
  return new HTMLTemplateBuilder(tokens, values);
}

class HTMLTemplateBuilder {
  constructor (private tokens: string[], private values: any[]) {}

  template (vars = {}): HTMLTemplateElement {
    const html = this.html(vars);
    const node = document.createElement("template");
    node.innerHTML = html;
    return node;
  }

  html (vars: Record<string | number, any> = {}): string  {
    const html = [];
    const len = this.tokens.length;
    for(let i = 0; i < len; i++) {
      html.push(this.tokens[i]);
      const value = this.values[i];
      if(value !== null && value !== undefined) {
        const type: string = typeof value;
        let result;
        if(type === "function") {
          result = value(vars);
        } else if(type === "number") {
          result = vars[value];
        } else if(type === "string") {
          result = getDescendantProp(vars, value);
        }
        if(result !== null && result !== undefined) {
          html.push(result);
        }
      }
    }
    return html.join("");
  }
}
