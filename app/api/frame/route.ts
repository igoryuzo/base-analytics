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
  const baseUrl = new URL(req.url).origin;
  
  // Create a default fallback image URL if your service isn't publicly accessible yet
  const fallbackImageUrl = "https://placehold.co/1200x630/0052FF/ffffff?text=Base+Analytics";
  
  // Choose the image URL - use absolute URL for Warpcast validator
  // If testing with ngrok, baseUrl will be your ngrok URL
  // If running locally without ngrok, use the fallback image
  const imageUrl = baseUrl.includes('localhost') 
    ? fallbackImageUrl 
    : `${baseUrl}/api/image`;
  
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
  const baseUrl = new URL(req.url).origin;
  
  try {
    // Get request body - simplified validation
    const body = await req.json();
    
    // Log request for debugging
    console.log('Frame POST request:', JSON.stringify(body, null, 2));

    // Get analytics data from Dune
    const analyticsData = await getDuneAnalytics();
    
    // Encode data for the image endpoint
    const encodedData = encodeURIComponent(JSON.stringify(analyticsData));
    
    // Create fallback image URL
    const fallbackImageUrl = "https://placehold.co/1200x630/0052FF/ffffff?text=Base+Analytics+Updated";
    
    // Choose the image URL - use absolute URL for Warpcast validator
    const imageUrl = baseUrl.includes('localhost') 
      ? fallbackImageUrl 
      : `${baseUrl}/api/image?data=${encodedData}`;
    
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
    
    // Error frame with fallback image
    const fallbackErrorImage = "https://placehold.co/1200x630/FF0000/ffffff?text=Error+Loading+Data";
    
    const imageUrl = baseUrl.includes('localhost') 
      ? fallbackErrorImage 
      : `${baseUrl}/api/image?error=true`;
    
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