/**
 * AI Demo Service
 * Handles API calls to the AI demo functionality
 */

import { DemoChatRequest, DemoChatResponse } from '@/types/chat';

export class AIDemoService {
  private static readonly TIMEOUT = 30000; // 30 seconds timeout
  private static readonly AI_SERVICE_URL =
    process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:3003/api/v1';
  private static readonly AI_API_KEY = process.env.NEXT_PUBLIC_AI_API_KEY || 'your-api-key';

  /**
   * Send a message to the AI demo chat
   */
  static async sendMessage(request: DemoChatRequest): Promise<DemoChatResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    try {
      // Validate required fields
      if (
        !request.message ||
        typeof request.message !== 'string' ||
        request.message.trim() === ''
      ) {
        throw new Error('Message is required and must be a non-empty string');
      }

      // Prepare request to AI service
      const aiServiceUrl = `${this.AI_SERVICE_URL}/demo/chat`;
      const requestBody: DemoChatRequest = {
        message: request.message.trim(),
        language: request.language || 'English',
        level: request.level || 'intermediate',
        mode: request.mode || 'tutor',
      };

      console.log('Sending request to AI service:', {
        url: aiServiceUrl,
        body: requestBody,
      });

      const response = await fetch(aiServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.AI_API_KEY,
          'x-service-name': 'frontend-app',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('AI service error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          errorData.error?.message || `AI service returned status ${response.status}`
        );
      }

      const result: DemoChatResponse = await response.json();
      console.log('AI service response:', result);

      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      console.error('AIDemoService error:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - the AI service took too long to respond');
        }
        throw error;
      }
      throw new Error('Unknown error occurred while sending message');
    }
  }

  /**
   * Check if a response indicates an error
   */
  static isErrorResponse(response: DemoChatResponse): boolean {
    return !response.success || !!response.error;
  }

  /**
   * Extract error message from response
   */
  static getErrorMessage(response: DemoChatResponse): string {
    if (response.error) {
      return response.error.message;
    }
    return 'Unknown error occurred';
  }
}
