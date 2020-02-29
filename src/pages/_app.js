import React from 'react'
import App from 'next/app'
import UserContext from '../contexts/UserContext';
import '../css/tailwind.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-palenight.css'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    const { getInitialProps } = Component;
    if (getInitialProps) pageProps = await getInitialProps(ctx);
    return { ...pageProps, user: ctx.req.user };
  }

  render() {
    const { Component, pageProps, user } = this.props
    return (
      <UserContext.Provider value={user}>
        <Component {...pageProps} />
      </UserContext.Provider>
    )
  }
}

export default MyApp
