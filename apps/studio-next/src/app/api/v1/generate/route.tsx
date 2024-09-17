import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = await request.json();
  return new NextResponse(`route POST -> ${JSON.stringify(response)}`, {status: 201});
}
