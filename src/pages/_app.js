import React from 'react'
import AppContext from '../contexts/AppContext'
import '../css/tailwind.css'

function AsyncApiStudio({ Component, pageProps, context }) {
  return (
    <AppContext.Provider value={context || {}}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

AsyncApiStudio.getInitialProps = async ({ctx}) => {
      if (!ctx || !ctx.req) return {};

      let user;

      if (ctx.req.user && ctx.req.user.id) {
        user = await ctx.req.studio.users.getUserPublicInfo(ctx.req.user.id);
      }

      return {
        context: {
          user,
          url: {
            full: ctx.req.url,
            query: ctx.req.query,
            path: ctx.req.path,
          },
          ui: ctx.req.studio.ui,
        },
      };
}

export default AsyncApiStudio
