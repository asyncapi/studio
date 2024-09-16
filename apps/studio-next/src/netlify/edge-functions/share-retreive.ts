import { Config, Context } from "@netlify/edge-functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request, context: Context) => {
  const share = getStore("share");
  const shareId = req.url.split("/").pop();

  if (!shareId) {
    return new Response("Not found", { status: 404 });
  }

  const shareData = await share.get(shareId);

  if (!shareData) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(shareData, {
    headers: {
      "content-type": "application/json",
    },
  });
}

export const config: Config = {
  path: "/share/*",
};