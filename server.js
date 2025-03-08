"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@modelcontextprotocol/sdk");
const axios_1 = __importDefault(require("axios"));
require('dotenv').config();
// Define tools for the LLM
const tools = [
    {
        name: 'getMarketData',
        description: 'Fetch real-time price, volume, and market cap for a memecoin using CoinGecko API.',
        parameters: { coinId: 'string' },
        execute: (_a) => __awaiter(void 0, [_a], void 0, function* ({ coinId }) {
            const response = yield axios_1.default.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`);
            return response.data[0];
        }),
    },
    {
        name: 'getTwitterSentiment',
        description: 'Analyze recent Twitter sentiment for a memecoin.',
        parameters: { coinName: 'string' },
        execute: (_a) => __awaiter(void 0, [_a], void 0, function* ({ coinName }) {
            const response = yield axios_1.default.get(`https://api.twitter.com/2/tweets/search/recent?query=${coinName}`, { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } });
            return { tweetCount: response.data.meta.result_count };
        }),
    },
    {
        name: 'getOnChainData',
        description: 'Fetch transaction volume and top holders for a memecoin on Solana.',
        parameters: { tokenAddress: 'string' },
        execute: (_a) => __awaiter(void 0, [_a], void 0, function* ({ tokenAddress }) {
            const heliusResponse = yield axios_1.default.post(`https://api.helius.xyz/v0/addresses/${tokenAddress}/transactions?api-key=${process.env.HELIUS_API_KEY}`);
            return { txCount: heliusResponse.data.length };
        }),
    },
];
// Initialize MCP server
const server = new sdk_1.MCPserver({ tools });
server.start();
