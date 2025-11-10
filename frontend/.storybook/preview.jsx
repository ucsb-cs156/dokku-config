import "../src/index.css";
import "bootstrap/dist/css/bootstrap.css";
import 'react-toastify/dist/ReactToastify.css';


import { MemoryRouter } from "react-router";
import { ToastContainer } from "react-toastify";


const currentUrl = window.location.href;
const isLocalhost = currentUrl.startsWith("http://localhost:6006/");


// Per https://storybook.js.org/docs/react/writing-stories/decorators#context-for-mocking
// Here, we provide the context needed for some of the components,
// e.g. the ones that rely on currentUser

export const decorators = [
  (Story) => (
      <MemoryRouter>
        <ToastContainer />
        <Story />
      </MemoryRouter>
  )
];

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
