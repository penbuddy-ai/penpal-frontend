/**
 * AI Demo Service
 * Handles API calls to the AI demo functionality
 */

import { DemoChatRequest, DemoChatResponse } from '@/types/chat';

export class AIDemoService {
  private static readonly TIMEOUT = 30000; // 30 seconds timeout

  /**
   * Send a message to the AI demo chat
   */
  static async sendMessage(request: DemoChatRequest): Promise<DemoChatResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    try {
      const response = await fetch('/api/demo/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: DemoChatResponse = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

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
