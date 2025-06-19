import { SubscriptionPlan } from '@/lib/stripe';

// API Configuration
const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL || 'http://localhost:3004';

// Types
export interface CreateSubscriptionRequest {
  userId: string;
  email: string;
  name: string;
  plan: SubscriptionPlan;
}

export interface CreateSubscriptionWithCardRequest {
  userId: string;
  email: string;
  name: string;
  plan: SubscriptionPlan;
  paymentMethodId: string;
}

export interface CreateSubscriptionResponse {
  subscriptionId: string;
  clientSecret?: string;
  status: string;
  trialEnd?: string;
}

export interface SubscriptionStatus {
  id: string;
  userId: string;
  status: 'trial' | 'active' | 'past_due' | 'canceled' | 'unpaid';
  plan: SubscriptionPlan;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface ActivateSubscriptionRequest {
  paymentMethodId: string;
}

export interface ActivateSubscriptionResponse {
  status: string;
  clientSecret?: string;
}

/**
 * Payment Service
 * Handles all communication with the payment backend
 */
export class PaymentService {
  private static baseURL = PAYMENT_API_URL;

  /**
   * Create a new subscription
   */
  static async createSubscription(
    data: CreateSubscriptionRequest
  ): Promise<CreateSubscriptionResponse> {
    const response = await fetch(`${this.baseURL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Failed to create subscription');
    }

    return response.json();
  }

  /**
   * Create a new subscription with card validation
   */
  static async createSubscriptionWithCard(
    data: CreateSubscriptionWithCardRequest
  ): Promise<CreateSubscriptionResponse> {
    const response = await fetch(`${this.baseURL}/subscriptions/with-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Failed to create subscription with card');
    }

    return response.json();
  }

  /**
   * Get subscription status for a user
   */
  static async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus | null> {
    const response = await fetch(`${this.baseURL}/subscriptions/user/${userId}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404) {
      return null; // No subscription found
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Failed to get subscription status');
    }

    return response.json();
  }

  /**
   * Activate subscription (after trial)
   */
  static async activateSubscription(
    userId: string,
    data: ActivateSubscriptionRequest
  ): Promise<ActivateSubscriptionResponse> {
    const response = await fetch(`${this.baseURL}/subscriptions/user/${userId}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Failed to activate subscription');
    }

    return response.json();
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(userId: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/subscriptions/user/${userId}/cancel`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Failed to cancel subscription');
    }

    return response.json();
  }

  /**
   * Change subscription plan
   */
  static async changeSubscriptionPlan(
    userId: string,
    newPlan: SubscriptionPlan
  ): Promise<{ message: string }> {
    const response = await fetch(`${this.baseURL}/subscriptions/user/${userId}/change-plan`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan: newPlan }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Failed to change subscription plan');
    }

    return response.json();
  }
}
