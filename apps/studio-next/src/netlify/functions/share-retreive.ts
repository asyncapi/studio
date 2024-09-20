import { getStore } from '@netlify/blobs';
import type { Config, Context } from '@netlify/functions';

export default async (req: Request, context: Context) => {
  const share = getStore('share');
  const { shareId } = context.params; 

  if (!shareId) {
    return new Response('Not found', { status: 404 });
  }

  const shareData = await share.get(shareId);

  if (!shareData) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(shareData, {
    headers: {
      'content-type': 'application/json',
    },
  });
}

export const config: Config = {
  path: '/share/:shareId',
};