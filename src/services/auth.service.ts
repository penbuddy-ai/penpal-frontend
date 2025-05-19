import axios from 'axios';

/**
 * API response for authentication
 */
interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

/**
 * Authentication service
 */
export class AuthService {
  private static instance: AuthService;
  private readonly baseUrl: string;

  private constructor() {
    // Get the API URL from environment or use default
    this.baseUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? 'http://localhost:3001/auth';
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login with email and password
   */
  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${this.baseUrl}/api/v1/auth/login`, {
        email,
        password,
      });

      this.saveUserToLocalStorage(response.data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Register a new user
   */
  public async register(userData: {
    name: string;
    email: string;
    password: string;
    termsAccepted: boolean;
  }): Promise<any> {
    try {
      // Extract first and last name from full name
      const nameParts = userData.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      const response = await axios.post(`${this.baseUrl}/register`, {
        email: userData.email,
        password: userData.password,
        firstName,
        lastName,
      });

      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * OAuth login (redirect flow handled by the auth page)
   */
  public initiateOAuthLogin(provider: 'google' | 'apple'): void {
    window.location.href = `${this.baseUrl}/oauth/${provider}/login`;
  }

  /**
   * Login with OAuth token (for client-side SDK implementations)
   */
  public async loginWithOAuth(provider: 'google' | 'apple', tokenData: any): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${this.baseUrl}/oauth/${provider}`,
        tokenData
      );

      this.saveUserToLocalStorage(response.data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/logout`);
      this.clearUserFromLocalStorage();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local storage even if API call fails
      this.clearUserFromLocalStorage();
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('user');
  }

  /**
   * Get current user from local storage
   */
  public getCurrentUser(): any {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Save user to local storage
   */
  private saveUserToLocalStorage(authData: AuthResponse): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', authData.access_token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  }

  /**
   * Clear user from local storage
   */
  private clearUserFromLocalStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'An error occurred during authentication';
      throw new Error(message);
    }
    throw error;
  }
}

export default AuthService.getInstance();
