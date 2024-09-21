import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const driverObj = driver({
  popoverClass: 'driverjs-theme',
  showProgress: true,
  showButtons: ['next', 'previous', 'close'],
  nextBtnText: 'Next',
  prevBtnText: 'Back',

  steps: [
    {
      element: '#tour-start',
      popover: {
        title: 'Welcome to AsyncAPI Studio',
        description:
          'Discover a powerful tool for designing, documenting, and managing AsyncAPI-based applications. This tour will guide you through key features to enhance your AsyncAPI development workflow.',
        side: 'left',
        align: 'start',
        onPopoverRender: () => {
          const {activeIndex} = driverObj.getState();
          localStorage.setItem('currentTourStep', activeIndex?.toString() || '0');
        },
      },
    },
    {
      element: '#navbar',
      popover: {
        title: 'Control Center',
        description:
          'This control center allows you to toggle the editor, navigation panel, and HTML preview on or off. It\'s also your gateway to creating new AsyncAPI templates for various protocols like Apache Kafka, WebSocket, HTTP, and more. Customize your workspace and jumpstart your AsyncAPI design process from here.',
        side: 'left',
        align: 'start',
        onPopoverRender: () => {
          const {activeIndex} = driverObj.getState();
          localStorage.setItem('currentTourStep', activeIndex?.toString() || '0');
        },
      },
    },
    {
      element: '#navigation-panel',
      popover: {
        title: 'Navigation Panel',
        description:
          'Explore your API structure using this navigation panel. Quickly access Servers, Channels, Operations, Messages, and Schemas - the building blocks of your AsyncAPI document.',
        side: 'left',
        align: 'start',
        onPopoverRender: () => {
          const {activeIndex} = driverObj.getState();
          localStorage.setItem('currentTourStep', activeIndex?.toString() || '0');
        },
      },
    },
    {
      element: '#editor',
      popover: {
        title: 'The Powerful Editor',
        description:
          'Create and edit your AsyncAPI documents with ease. Enjoy features like syntax highlighting, auto-completion, and real-time validation to streamline your API design process.',
        side: 'bottom',
        align: 'start',
        onPopoverRender: () => {
          const {activeIndex} = driverObj.getState();
          localStorage.setItem('currentTourStep', activeIndex?.toString() || '0');
        },
      },
    },
    {
      element: '#editor-dropdown',
      popover: {
        title: 'Share and Editor Options',
        description:
          'Collaborate on your work and access document management tools. Import, export, and convert your API specifications with just a few clicks.',
        side: 'top',
        align: 'start',
        onPopoverRender: () => {
          const {activeIndex} = driverObj.getState();
          localStorage.setItem('currentTourStep', activeIndex?.toString() || '0');
        },
      },
    },
    {
      element: '#terminal',
      popover: {
        title: 'Terminal',
        description:
          'Quickly identify and resolve issues in your specification. View errors, warnings, and helpful messages to ensure your API documentation is error-free.',
        side: 'bottom',
        align: 'start',
        onPopoverRender: () => {
          const {activeIndex} = driverObj.getState();
          localStorage.setItem('currentTourStep', activeIndex?.toString() || '0');
        },
      },
    },
    {
      element: '#html-preview',
      popover: {
        title: 'Instant HTML Preview',
        description:
          'See your API documentation come to life in real-time. This panel renders a human-readable version of your specification as you make changes.',
        side: 'top',
        align: 'start',
        onPopoverRender: () => {
          const {activeIndex} = driverObj.getState();
          localStorage.setItem('currentTourStep', activeIndex?.toString() || '0');
        },
      },
    },
    {
      element: '#studio-setting',
      popover: {
        title: 'Studio Settings',
        description:
          'Customize your AsyncAPI Studio experience. Adjust preferences and settings to tailor the tool to your workflow.',
        side: 'top',
        align: 'start',
        onPopoverRender: () => {
          const {activeIndex} = driverObj.getState();
          localStorage.setItem('currentTourStep', activeIndex?.toString() || '0');
        },
      },
    },
    {
      element: '#communicate',
      popover: {
        title: 'Join AsyncAPI Community',
        description:
          'Connect with fellow AsyncAPI developers. Join our Slack community to share ideas, get help, and stay updated on AsyncAPI news and events.',
        side: 'top',
        align: 'start',
        onPopoverRender: () => {
          const {activeIndex} = driverObj.getState();
          localStorage.setItem('currentTourStep', activeIndex?.toString() || '0');
        },
      },
    },
    {
      element: '#Thank-you',
      popover: {
        title: 'Thank You',
        description:
          'Thanks for exploring AsyncAPI Studio. We hope you find it valuable for your API projects. Feel free to reach out with any questions or feedback. Happy coding!',
        side: 'top',
        align: 'start',
        onPopoverRender: () => {
          localStorage.setItem('currentTourStep', '0');
        },
      },
    },
  ],
});

