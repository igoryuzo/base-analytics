import { NextRequest, NextResponse } from 'next/server';
import sdk from '@farcaster/frame-sdk';
import { getDuneAnalytics } from '@/lib/dune';

export async function GET(req: NextRequest) {
  const baseUrl = new URL(req.url).origin;
  
  // Initial frame
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Base Analytics Frame</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/api/image" />
        <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
        <meta property="fc:frame:button:1" content="View Base Analytics" />
      </head>
      <body>
        <h1>Base Analytics Frame</h1>
        <p>This HTML page contains Frame metadata for Farcaster.</p>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(req: NextRequest) {
  const baseUrl = new URL(req.url).origin;
  
  try {
    // Validate the frame request
    const body = await req.json();
    const { isValid, message } = await sdk.verifyRequest(body);
    
    if (!isValid) {
      return new NextResponse('Invalid frame request', { status: 400 });
    }

    // Get analytics data from Dune
    const analyticsData = await getDuneAnalytics();
    
    // Create response with new frame
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Base Analytics Frame</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/image?data=${encodeURIComponent(JSON.stringify(analyticsData))}" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
          <meta property="fc:frame:button:1" content="Refresh Data" />
        </head>
        <body>
          <h1>Base Analytics Updated</h1>
          <p>This HTML page contains updated Frame metadata for Farcaster.</p>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error processing frame request:', error);
    
    // Error frame
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Base Analytics Error</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${baseUrl}/api/image?error=true" />
          <meta property="fc:frame:post_url" content="${baseUrl}/api/frame" />
          <meta property="fc:frame:button:1" content="Try Again" />
        </head>
        <body>
          <h1>Error Loading Data</h1>
          <p>There was an error loading the analytics data.</p>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}