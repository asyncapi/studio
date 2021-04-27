const ReactGA = require('react-ga');

const googleAnalytics = module.exports;

googleAnalytics.init = (window) => {
    ReactGA.initialize('UA-000000-01');
    ReactGA.pageview(window.location.pathname + window.location.search);
}