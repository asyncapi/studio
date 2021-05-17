const ReactGA = require('react-ga');
const googleAnalytics = module.exports;

googleAnalytics.init = (window) => {
    console.log(window)
    ReactGA.initialize('UA-000000-01', {
        debug: true
    });
    ReactGA.pageview(window.location.pathname + window.location.search);
}