import React from 'react'
import App from 'next/app'
import ReactGA from 'react-ga'
import AppContext from '../contexts/AppContext';
import '../css/tailwind.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-palenight.css'

class MyApp extends App {
  static async getInitialProps({ isServer, Component, ctx }) {
    let pageProps = {}
    const { getServerSideProps } = Component
    if (isServer && getServerSideProps) pageProps = await getServerSideProps(ctx)
    return {
      pageProps: pageProps.props,
      context: {
        user: ctx.req.userPublicInfo,
        url: {
          full: ctx.req.url,
          query: ctx.req.query,
          path: ctx.req.path,
        },
      }
    }
  }

  render() {
    const { Component, pageProps, context } = this.props

    if (typeof window !== 'undefined') {
      ReactGA.initialize('UA-109278936-4');
      ReactGA.pageview(window.location.pathname + window.location.search);
    }

    return (
      <AppContext.Provider value={context || {}}>
        <Component {...pageProps} />
      </AppContext.Provider>
    )
  }
}

export default MyApp
