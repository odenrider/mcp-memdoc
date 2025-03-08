import { MCPserver, Tool } from '@modelcontextprotocol/sdk'; // Corrected import
import axios from 'axios';
require('dotenv').config();

// Define tools for the LLM
const tools: Tool[] = [
  {
  name: 'getMarketData',
  description: 'Fetch real-time price, volume, and market cap for a memecoin using CoinGecko API.',
  parameters: { coinId: 'string' },
  execute: async ({ coinId }) => {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`
    );
    return response.data[0];
  },
},
  {
    name: 'getTwitterSentiment',
    description: 'Analyze recent Twitter sentiment for a memecoin.',
    parameters: { coinName: 'string' },
    execute: async ({ coinName }) => {
      const response = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent?query=${coinName}`,
        { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } }
      );
      // Basic sentiment (expand later with NLP if desired)
      return { tweetCount: response.data.meta.result_count };
    },
  },
  {
    name: 'getOnChainData',
    description: 'Fetch transaction volume and top holders for a memecoin on Solana.',
    parameters: { tokenAddress: 'string' },
    execute: async ({ tokenAddress }) => {
      const heliusResponse = await axios.post(
        `https://api.helius.xyz/v0/addresses/${tokenAddress}/transactions?api-key=${process.env.HELIUS_API_KEY}`
      );
      return { txCount: heliusResponse.data.length };
    },
  },
];

// Initialize MCP server
const server = new MCPserver({ tools });
server.start();