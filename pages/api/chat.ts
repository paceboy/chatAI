import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BAIDU_API_URL = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro";
const ACCESS_TOKEN = "124.970609bfcbbf963ea060d9c0f3ab48ce.2592000.1738748655.282335-116979119";

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
}

interface ChatResponse {
  message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ChatResponse>
  ) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
    // debugger
  
    try {
      const { messages } = req.body as ChatRequest;
      console.log("req body messages = ", messages);
      const response = await axios.post(
        `${BAIDU_API_URL}?access_token=${ACCESS_TOKEN}`,
        {
          messages,
          temperature: 0.95,
          top_p: 0.8,
          penalty_score: 1,
          enable_system_memory: false,
          disable_search: false,
          enable_citation: false,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("response = ", response);
      const aiResponse = response.data.result;
      res.status(200).json({ message: aiResponse });
    } catch (error) {
      console.error("Error communicating with Baidu API:", error);
      res.status(500).json({ message: "Error communicating with Baidu API" });
    }
  }