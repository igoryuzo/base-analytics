import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsData } from '@/lib/dune';

// Simple function to generate an SVG with analytics data
function generateAnalyticsSVG(data?: AnalyticsData, error: boolean = false): string {
  if (error) {
    return `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#0052FF"/>
        <text x="600" y="315" font-family="Arial" font-size="48" fill="white" text-anchor="middle">Error loading Base analytics data</text>
        <text x="600" y="375" font-family="Arial" font-size="32" fill="white" text-anchor="middle">Please try again</text>
      </svg>
    `;
  }

  if (!data) {
    // Initial frame without data
    return `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="#0052FF"/>
        <text x="600" y="200" font-family="Arial" font-size="64" fill="white" text-anchor="middle">Base Analytics</text>
        <text x="600" y="315" font-family="Arial" font-size="32" fill="white" text-anchor="middle">Click to view the latest analytics data</text>
        <text x="600" y="375" font-family="Arial" font-size="32" fill="white" text-anchor="middle">Powered by Dune Analytics</text>
      </svg>
    `;
  }

  // Data visualization
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#0052FF"/>
      <text x="600" y="100" font-family="Arial" font-size="64" fill="white" text-anchor="middle">Base Analytics</text>
      
      <text x="600" y="200" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Total Transactions: ${data.totalTxCount.toLocaleString()}</text>
      <text x="600" y="280" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Active Users: ${data.activeUsers.toLocaleString()}</text>
      <text x="600" y="360" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Average Gas Price: ${data.avgGasPrice} Gwei</text>
      
      <text x="600" y="480" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Last Updated: ${new Date(data.timestamp).toLocaleString()}</text>
      <text x="600" y="550" font-family="Arial" font-size="20" fill="white" text-anchor="middle">Powered by Dune Analytics</text>
    </svg>
  `;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const errorParam = searchParams.get('error');
  const dataParam = searchParams.get('data');
  
  let analyticsData: AnalyticsData | undefined;
  let hasError = false;
  
  if (dataParam) {
    try {
      analyticsData = JSON.parse(decodeURIComponent(dataParam));
    } catch (error) {
      console.error('Error parsing data parameter:', error);
      hasError = true;
    }
  }
  
  if (errorParam === 'true') {
    hasError = true;
  }
  
  const svg = generateAnalyticsSVG(analyticsData, hasError);
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}