import { getPositionRespectTarget } from "htna-tools/dist/esm/dom";

export interface PositionalTarget {
  nodeX: number;
  nodeXOffset: number;
  nodeY: number;
  nodeYOffset: number;
  target: string;
  targetX: number;
  targetXOffset: number;
  targetY: number;
  targetYOffset: number;
}

// TODO: add offset

export function parsePositionalTarget (value: string): PositionalTarget | false {
  const reg = /^\s*(?:([0-9.]+([+-][0-9.]+)?)\s*:\s*([0-9.]+([+-][0-9.]+)?)\s+)?([^\s0-9][^\s]+)(?:\s+([0-9.]+([+-][0-9.]+)?)\s*:\s*([0-9.]+([+-][0-9.]+)?))?\s*$/i;
  const match = value.match(reg);
  if(match) {
    return {
      nodeX: parseFloat(match[1] || "0"),
      nodeXOffset: parseFloat(match[2] || "0"),
      nodeY: parseFloat(match[3] || "0"),
      nodeYOffset: parseFloat(match[4] || "0"),
      target: match[5],
      targetX: parseFloat(match[6] || "0"),
      targetXOffset: parseFloat(match[7] || "0"),
      targetY: parseFloat(match[8] || "0"),
      targetYOffset: parseFloat(match[9] || "0")
    };
  }
  return false;
}


export function applyPositionalTarget (node: HTMLElement, value: string, preventExitoOfScreen: boolean = false): boolean {
  const posInfo = parsePositionalTarget(value);
  if(posInfo) {
    const target = document.getElementById(posInfo.target);
    if(target) {
      const pos = getPositionRespectTarget(node, posInfo.nodeX, posInfo.nodeY, target, posInfo.targetX, posInfo.targetY);
      let left  = pos.left - posInfo.nodeXOffset + posInfo.targetXOffset;
      let top   = pos.top - posInfo.nodeYOffset + posInfo.targetYOffset;
      if(preventExitoOfScreen) {
        left = Math.max(0, Math.min(left, (document.documentElement.clientWidth - pos.width)));
        top  = Math.max(0, Math.min(top, (document.documentElement.clientHeight - pos.height)));
      }
      node.style.left = `${Math.round(left)}px`;
      node.style.top  = `${Math.round(top)}px`;
      return true;
    }
  }
  return false;
}




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
