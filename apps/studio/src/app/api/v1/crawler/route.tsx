import { NextRequest, NextResponse } from 'next/server';
import parseURL from '@/helpers/parser';
import { DocumentInfo } from '@/types';
import axios from 'axios';
import { metadata } from '@/app/page';

export async function GET(request: NextRequest) {
  const Base64searchParams = request.nextUrl.searchParams.get('base64');
  const URLsearchParams = request.nextUrl.searchParams.get('url');

  try {
    if (!Base64searchParams && !URLsearchParams) return new NextResponse(null, { status: 200 });
    let info: DocumentInfo | null = null;

    if (Base64searchParams) {
      // directly run the parsing function
      info = await parseURL(Base64searchParams);
    }
    if (URLsearchParams) {
      // fetch the document information from the URL
      try {
        const response = await axios.get(URLsearchParams);
        if (response.status === 200) {
          info = await parseURL(response.data);
        } else {
          return new NextResponse('Not a valid URL', { status: 500 });
        }
      } catch (error) {
        return new NextResponse('Not a valid URL', { status: 500 });
      }
    }

    if (!info) {
      const ogImage = 'https://raw.githubusercontent.com/asyncapi/studio/master/apps/studio-next/public/img/meta-studio-og-image.jpeg';

      const crawlerInfo = `
       <!DOCTYPE html>
       <html lang="en">
       <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>"${metadata.openGraph?.title}"</title>
        <meta property="og:title" content="${metadata.openGraph?.title}" />
        <meta property="og:description" content="${metadata.openGraph?.description}" />
        <meta property="og:url" content="${metadata.openGraph?.url}" />
        <meta property="og:image" content="${ogImage}" />
      `
      return new NextResponse(crawlerInfo, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }

    const ogImageParams = new URLSearchParams();

    if (info.title) {
      ogImageParams.append('title', info.title.toString());
    }
    if (info.description) {
      ogImageParams.append('description', info.description.toString());
    }
    if (info.numServers) {
      ogImageParams.append('numServers', info.numServers.toString());
    }
    if (info.numChannels) {
      ogImageParams.append('numChannels', info.numChannels.toString());
    }
    if (info.numOperations) {
      ogImageParams.append('numOperations', info.numOperations.toString());
    }
    if (info.numMessages) {
      ogImageParams.append('numMessages', info.numMessages.toString());
    }

    const ogImageurl = `https://ogp-studio.vercel.app/api/og?${ogImageParams.toString()}`;

    const crawlerInfo = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${info.title}</title>
        ${info.title ? `<meta property="og:title" content="${info.title}" />` : ''}
        ${info.description ? `<meta property="og:description" content="${info.description}" />` : ''}
        <meta property="og:image" content=${ogImageurl} />
      </head>
      </html>
    `;
    console.log(crawlerInfo);
    return new NextResponse(crawlerInfo, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (err) {
    return new NextResponse('Not a valid URL', { status: 500 });
  }
}
