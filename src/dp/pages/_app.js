import React from 'react'
import App from 'next/app'
import AppContext from '../contexts/AppContext';
import '../../css/tailwind.css'

class MyApp extends App {
  static async getInitialProps({ isServer, Component, ctx }) {
    let pageProps = {}
    const { getServerSideProps } = Component
    if (isServer && getServerSideProps) pageProps = await getServerSideProps(ctx)
    return {
      pageProps: pageProps.props,
      context: {
        user: ctx.req.userPublicInfo,
        org: ctx.req.org,
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
    return (
      <AppContext.Provider value={context || {}}>
        <Component {...pageProps} />
      </AppContext.Provider>
    )
  }
}

export default MyApp
