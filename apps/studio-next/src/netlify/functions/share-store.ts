import { getStore } from '@netlify/blobs';
import type { Config, Context } from '@netlify/functions';
import { randomUUID } from 'crypto';

export default async (req: Request, context: Context) => {
  const share = getStore('share');
  const shareId = randomUUID();

  const state = await req.json();

  await share.set(shareId, JSON.stringify({
    URL: `${context.site.url  }?share=${  shareId}`,
    ...state,
    created: Date.now(),
  }))

  return new Response(shareId, {
    headers: {
      'content-type': 'text/plain',
    },
  });
};

export const config: Config = {
  path: '/share',
}