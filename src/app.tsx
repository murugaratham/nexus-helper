import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import muiTheme from './renderer/Theme/muiTheme';
import Routes from './renderer/Routes';

// Create main element
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const render = (Component: () => JSX.Element) => {
  ReactDOM.render(
    <MuiThemeProvider theme={muiTheme}>
      <Component />
    </MuiThemeProvider>,
    mainElement
  );
};
render(Routes);

// Hot Module Replacement API
if (typeof module.hot !== 'undefined') {
  module.hot.accept('./renderer/Routes', () => {
    import('./renderer/Routes').then(Routes => {
      render(Routes.default);
    });
  });
}
/**
 * Electron-focused CSS resets
 */
// css.global("html, body", {
//   // turn off text highlighting
//   userSelect: "none",

//   // reset the cursor pointer
//   cursor: "default",

//   // font
//   font: "caption",

//   // text rendering
//   WebkitFontSmoothing: "subpixel-antialiased",
//   textRendering: "optimizeLegibility",
// })

/**
 * Zooming resets
 */
// webFrame.setVisualZoomLevelLimits(1, 1)
// webFrame.setLayoutZoomLevelLimits(0, 0)

// /**
//  * Drag and drop resets
//  */
// document.addEventListener("dragover", event => event.preventDefault())
// document.addEventListener("drop", event => event.preventDefault())
