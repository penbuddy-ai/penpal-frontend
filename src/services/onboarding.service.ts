import { OnboardingData } from '@/types/onboarding';
import { authenticatedPatch, authenticatedGet } from '@/lib/api-utils';

/**
 * Onboarding API service
 */
export class OnboardingService {
  /**
   * Save onboarding progress
   */
  static async saveProgress(data: Partial<OnboardingData>): Promise<void> {
    await authenticatedPatch('/onboarding/progress', data, true);
  }

  /**
   * Complete onboarding and update user profile
   */
  static async completeOnboarding(data: OnboardingData): Promise<void> {
    const requestData = {
      preferredName: data.preferredName,
      learningLanguages: [data.learningLanguage],
      proficiencyLevels: {
        [data.learningLanguage]: data.proficiencyLevel,
      },
      onboardingCompleted: true,
    };

    await authenticatedPatch('/onboarding/complete', requestData, true);
  }

  /**
   * Get available languages
   */
  static async getAvailableLanguages(): Promise<any[]> {
    return authenticatedGet('/languages/active', false);
  }

  /**
   * Check if user needs onboarding
   */
  static async checkOnboardingStatus(): Promise<{ needsOnboarding: boolean }> {
    return authenticatedGet('/onboarding/status', true);
  }
}

export default OnboardingService;
