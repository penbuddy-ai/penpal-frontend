import type { NextApiRequest, NextApiResponse } from 'next';
import { DemoChatRequest, DemoChatResponse } from '@/types/chat';

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:3003/api/v1';
const AI_API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY || 'your-api-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse<DemoChatResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        message: 'Method not allowed',
        details: 'Only POST method is allowed',
      },
    });
  }

  try {
    const body: DemoChatRequest = req.body;

    // Validate required fields
    if (!body.message || typeof body.message !== 'string' || body.message.trim() === '') {
      return res.status(400).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          message: 'Invalid request',
          details: 'Message is required and must be a non-empty string',
        },
      });
    }

    // Prepare request to AI service
    const aiServiceUrl = `${AI_SERVICE_URL}/demo/chat`;
    const requestBody: DemoChatRequest = {
      message: body.message.trim(),
      language: body.language || 'English',
      level: body.level || 'intermediate',
      mode: body.mode || 'tutor',
    };

    // Make request to AI service
    const aiResponse = await fetch(aiServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_API_KEY,
        'x-service-name': 'frontend-app',
      },
      body: JSON.stringify(requestBody),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json().catch(() => ({}));
      return res.status(aiResponse.status).json({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          message: errorData.error?.message || 'AI service error',
          details: errorData.error?.details || `AI service returned status ${aiResponse.status}`,
        },
      });
    }

    const aiData: DemoChatResponse = await aiResponse.json();

    // Return the AI service response
    res.status(200).json(aiData);
  } catch (error) {
    console.error('Demo chat API error:', error);
    res.status(500).json({
      success: false,
      timestamp: new Date().toISOString(),
      error: {
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
    });
  }
}
