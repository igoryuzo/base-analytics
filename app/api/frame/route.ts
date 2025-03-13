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
  // Make sure image is an absolute URL (required by Warpcast validator)
  if (!image.startsWith('http')) {
    console.warn('Image URL must be absolute for Frames to work correctly');
  }
  
  // Create basic HTML with proper meta tags
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${title}</title>
    <meta property="og:title" content="${title}">
    <meta property="og:image" content="${image}">
    
    <!-- Frame metadata -->
    <meta property="fc:frame" content="vNext">
    <meta property="fc:frame:image" content="${image}">
    <meta property="fc:frame:post_url" content="${postUrl}">
    ${buttons.map((btn, i) => 
      `<meta property="fc:frame:button:${i+1}" content="${btn}">`
    ).join('\n    ')}
    ${state ? `<meta property="fc:frame:state" content="${state}">` : ''}
  </head>
  <body>
    <h1>${title}</h1>
    ${bodyContent}
  </body>
</html>`;
}

export async function GET(req: NextRequest) {
  // Check for X-Forwarded-Host header (used by ngrok)
  const xForwardedHost = req.headers.get('x-forwarded-host');
  const xForwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  
  // Use X-Forwarded-Host if available (for ngrok), otherwise use the request URL
  let baseUrl = new URL(req.url).origin;
  if (xForwardedHost) {
    baseUrl = `${xForwardedProto}://${xForwardedHost}`;
  }
  
  console.log('Base URL:', baseUrl);
  
  // Use a reliable image service that's known to work with Farcaster
  const imageUrl = "https://assets.imgix.net/examples/kingfisher.jpg?w=1200&h=630&txt=Base%20Analytics&txtsize=64&txtclr=fff&txtalign=center,middle&txtfont=Avenir%20Next%20Demi,Bold&bg=0052FF&blend-mode=normal";
  
  // Initial frame
  const html = createFrameHtml({
    title: "Base Analytics Frame",
    image: imageUrl,
    postUrl: `${baseUrl}/api/frame`,
    buttons: ["View Base Analytics"],
    bodyContent: "<p>This HTML page contains Frame metadata for Farcaster.</p>"
  });

  return new NextResponse(html, {
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, max-age=0' 
    },
  });
}

export async function POST(req: NextRequest) {
  // Check for X-Forwarded-Host header (used by ngrok)
  const xForwardedHost = req.headers.get('x-forwarded-host');
  const xForwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  
  // Use X-Forwarded-Host if available (for ngrok), otherwise use the request URL
  let baseUrl = new URL(req.url).origin;
  if (xForwardedHost) {
    baseUrl = `${xForwardedProto}://${xForwardedHost}`;
  }
  
  console.log('Base URL (POST):', baseUrl);
  
  try {
    // Get request body - simplified validation
    const body = await req.json();
    
    // Log request for debugging
    console.log('Frame POST request:', JSON.stringify(body, null, 2));

    // Get analytics data from Dune
    const analyticsData = await getDuneAnalytics();
    
    // Format analytics data for display in the image
    const totalTx = analyticsData.totalTxCount.toLocaleString();
    const users = analyticsData.activeUsers.toLocaleString();
    const gas = analyticsData.avgGasPrice;
    
    // Create text for the image
    const imageText = encodeURIComponent(`Base Analytics: ${totalTx} Txs, ${users} Users, ${gas} Gwei`);
    
    // Use imgix.net which is known to work well with Farcaster
    const imageUrl = `https://assets.imgix.net/examples/kingfisher.jpg?w=1200&h=630&txt=${imageText}&txtsize=48&txtclr=fff&txtalign=center,middle&txtfont=Avenir%20Next%20Demi,Bold&bg=0052FF&blend-mode=normal`;
    
    // Encode data for state
    const encodedData = encodeURIComponent(JSON.stringify(analyticsData));
    
    // Create response with new frame
    const html = createFrameHtml({
      title: "Base Analytics Updated",
      image: imageUrl,
      postUrl: `${baseUrl}/api/frame`,
      buttons: ["Refresh Data"],
      state: encodedData.substring(0, 200), // Limit state to avoid issues with large data
      bodyContent: "<p>This HTML page contains updated Frame metadata for Farcaster.</p>"
    });

    return new NextResponse(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store, max-age=0'
      },
    });
  } catch (error) {
    console.error('Error processing frame request:', error);
    
    // Error frame with reliable image service
    const imageUrl = "https://assets.imgix.net/examples/kingfisher.jpg?w=1200&h=630&txt=Error%20Loading%20Data&txtsize=64&txtclr=fff&txtalign=center,middle&txtfont=Avenir%20Next%20Demi,Bold&bg=FF0000&blend-mode=normal";
    
    const html = createFrameHtml({
      title: "Base Analytics Error",
      image: imageUrl,
      postUrl: `${baseUrl}/api/frame`,
      buttons: ["Try Again"],
      bodyContent: "<p>There was an error loading the analytics data.</p>"
    });

    return new NextResponse(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store, max-age=0'
      },
    });
  }
}