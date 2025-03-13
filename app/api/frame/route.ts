import { NextRequest, NextResponse } from 'next/server';
import { getDuneAnalytics } from '@/lib/dune';

// Frame HTML options interface
interface FrameHtmlOptions {
  title: string;
  image: string;
  postUrl: string;
  buttons: string[];
  state?: string;
  bodyContent?: string;
}

// Helper to create Frame HTML with proper metadata
function createFrameHtml({
  title,
  image,
  postUrl,
  buttons,
  state = '',
  bodyContent = '',
}: FrameHtmlOptions) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta property="og:title" content="${title}" />
        <meta property="og:image" content="${image}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${image}" />
        <meta property="fc:frame:post_url" content="${postUrl}" />
        ${buttons.map((btn, i) => 
          `<meta property="fc:frame:button:${i+1}" content="${btn}" />`
        ).join('\n        ')}
        ${state ? `<meta property="fc:frame:state" content="${state}" />` : ''}
      </head>
      <body>
        <h1>${title}</h1>
        ${bodyContent}
      </body>
    </html>
  `;
}

export async function GET(req: NextRequest) {
  const baseUrl = new URL(req.url).origin;
  
  // Initial frame
  const html = createFrameHtml({
    title: "Base Analytics Frame",
    image: `${baseUrl}/api/image`,
    postUrl: `${baseUrl}/api/frame`,
    buttons: ["View Base Analytics"],
    bodyContent: "<p>This HTML page contains Frame metadata for Farcaster.</p>"
  });

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(req: NextRequest) {
  const baseUrl = new URL(req.url).origin;
  
  try {
    // Get request body - simplified validation
    const body = await req.json();
    const { untrustedData } = body;
    
    // Log request for debugging
    console.log('Frame POST request:', JSON.stringify(body, null, 2));

    // Get analytics data from Dune
    const analyticsData = await getDuneAnalytics();
    
    // Encode data for the image endpoint
    const encodedData = encodeURIComponent(JSON.stringify(analyticsData));
    
    // Create response with new frame
    const html = createFrameHtml({
      title: "Base Analytics Updated",
      image: `${baseUrl}/api/image?data=${encodedData}`,
      postUrl: `${baseUrl}/api/frame`,
      buttons: ["Refresh Data"],
      state: encodedData.substring(0, 200), // Limit state to avoid issues with large data
      bodyContent: "<p>This HTML page contains updated Frame metadata for Farcaster.</p>"
    });

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error processing frame request:', error);
    
    // Error frame
    const html = createFrameHtml({
      title: "Base Analytics Error",
      image: `${baseUrl}/api/image?error=true`,
      postUrl: `${baseUrl}/api/frame`,
      buttons: ["Try Again"],
      bodyContent: "<p>There was an error loading the analytics data.</p>"
    });

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}