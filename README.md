# Base Analytics Frame

A Farcaster Frame for showcasing Base chain analytics using Dune Analytics API.

## Features

- Display key metrics from Base blockchain
- Interactive Farcaster Frame
- Dynamic data updates
- Built with Next.js and TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- Yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/base-analytics.git
cd base-analytics
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
DUNE_API_KEY=your_dune_api_key
```

### Development

Run the development server:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

The Frame is accessible at [http://localhost:3000/api/frame](http://localhost:3000/api/frame)

### Local Testing with Ngrok

To test your Frame with Farcaster clients, you need a publicly accessible URL. Use Ngrok to expose your local development server:

1. Start the Ngrok tunnel:
```bash
./ngrok.sh
```

2. Use the provided Ngrok URL to test your Frame:
```bash
https://your-ngrok-url.ngrok.io/api/frame
```

3. Validate your Frame using the testing tool:
```bash
./test-frame.sh https://your-ngrok-url.ngrok.io/api/frame
```

4. Or use the browser-based Frame validator:
```bash
http://localhost:3000/api/test?url=https://your-ngrok-url.ngrok.io/api/frame
```

### Deployment

This project is set up to be deployed on Vercel:

1. Push to your GitHub repository
2. Import project in Vercel dashboard
3. Set environment variables in Vercel project settings
4. Deploy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
