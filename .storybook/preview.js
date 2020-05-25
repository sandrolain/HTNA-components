import { addParameters } from '@storybook/html';
import { configureActions } from '@storybook/addon-actions';
import '@storybook/addon-console';
import "../stories/style.css";

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
