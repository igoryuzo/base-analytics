import { NextRequest, NextResponse } from 'next/server';

// A simple testing endpoint to help debug frame metadata
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url') || '';
  
  if (!url) {
    return new NextResponse(`
      <html>
        <head>
          <title>Frame Tester</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            pre { background: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto; }
            input, button { padding: 8px; font-size: 16px; }
            input { width: 70%; }
            .error { color: red; }
            .success { color: green; }
          </style>
        </head>
        <body>
          <h1>Farcaster Frame Tester</h1>
          <p>Enter a URL to test its Frame metadata:</p>
          <form action="/api/test" method="get">
            <input name="url" placeholder="https://your-frame-url.com/api/frame" required>
            <button type="submit">Test</button>
          </form>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
  
  try {
    // Fetch the frame
    const response = await fetch(url);
    const html = await response.text();
    
    // Extract frame metadata
    const frameMetaTags = html.match(/<meta\\s+property=["']fc:frame[^>]*>/g) || [];
    const parsedTags = frameMetaTags.map(tag => {
      const property = tag.match(/property=["']([^"']+)["']/)?.[1] || '';
      const content = tag.match(/content=["']([^"']+)["']/)?.[1] || '';
      return { property, content };
    });
    
    // Validate basic frame requirements
    const hasFrameVersion = parsedTags.some(tag => tag.property === 'fc:frame' && tag.content === 'vNext');
    const hasImage = parsedTags.some(tag => tag.property === 'fc:frame:image');
    const hasPostUrl = parsedTags.some(tag => tag.property === 'fc:frame:post_url');
    const hasButton = parsedTags.some(tag => tag.property.startsWith('fc:frame:button:'));
    
    const isValid = hasFrameVersion && hasImage && hasPostUrl && hasButton;
    
    return new NextResponse(`
      <html>
        <head>
          <title>Frame Test Results</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            pre { background: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto; }
            input, button { padding: 8px; font-size: 16px; }
            input { width: 70%; }
            .error { color: red; }
            .success { color: green; }
            table { width: 100%; border-collapse: collapse; }
            th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
            .validation { margin-top: 20px; padding: 15px; border-radius: 8px; }
            .validation.valid { background: #e6ffe6; }
            .validation.invalid { background: #ffe6e6; }
          </style>
        </head>
        <body>
          <h1>Frame Test Results</h1>
          <p><strong>URL:</strong> ${url}</p>
          
          <div class="validation ${isValid ? 'valid' : 'invalid'}">
            <h2>Validation: ${isValid ? 'PASS ✅' : 'FAIL ❌'}</h2>
            <ul>
              <li>Has fc:frame=vNext: ${hasFrameVersion ? '✅' : '❌'}</li>
              <li>Has image: ${hasImage ? '✅' : '❌'}</li>
              <li>Has post_url: ${hasPostUrl ? '✅' : '❌'}</li>
              <li>Has at least one button: ${hasButton ? '✅' : '❌'}</li>
            </ul>
          </div>
          
          <h2>Found Frame Tags (${parsedTags.length})</h2>
          <table>
            <tr>
              <th>Property</th>
              <th>Content</th>
            </tr>
            ${parsedTags.map(tag => `
              <tr>
                <td>${tag.property}</td>
                <td>${tag.content}</td>
              </tr>
            `).join('')}
          </table>
          
          <h2>Raw HTML</h2>
          <pre>${html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          
          <p><a href="/api/test">Test another URL</a></p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new NextResponse(`
      <html>
        <head>
          <title>Frame Test Error</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .error { color: red; padding: 15px; background: #ffe6e6; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Error Testing Frame</h1>
          <div class="error">
            <p>Failed to fetch or parse the frame at: ${url}</p>
            <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
          </div>
          <p><a href="/api/test">Try again</a></p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}