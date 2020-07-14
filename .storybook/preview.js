import { addParameters, addDecorator } from '@storybook/html';
import { configureActions } from '@storybook/addon-actions';
import '@storybook/addon-console';
import cssMainStyle from "../stories/style.css";
import cssVars from "goodnight-css/dist/vars.css";
import cssBase from "goodnight-css/dist/base.css";
import cssInput from "goodnight-css/dist/input.css";
import cssButton from "goodnight-css/dist/button.css";
import cssToast from "goodnight-css/dist/toast.css";

configureActions({
  depth: 100,
  // Limit the number of items logged into the actions panel
  limit: 20,
});

// https://www.npmjs.com/package/@storybook/addon-backgrounds
addParameters({
  backgrounds: [
    { name: 'white', value: '#FFFFFF', default: true },
    { name: 'mid gray', value: '#999999' },
    { name: 'black', value: '#000000' },
  ],
});


addDecorator(story => {
  const frag = document.createDocumentFragment();
  const style = document.createElement("style");
  style.innerHTML = `
${cssMainStyle}
${cssVars}
${cssBase}
${cssInput}
${cssButton}
${cssToast}
`;
  frag.appendChild(style);
  frag.appendChild(story());
  return frag;
});
