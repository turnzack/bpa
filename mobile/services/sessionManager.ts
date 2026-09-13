import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

class SessionManager {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_ID_KEY = 'user_id';
  private readonly USER_EMAIL_KEY = 'user_email';

  async saveSession(accessToken: string, refreshToken?: string, user?: any) {
    try {
      await SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, refreshToken);
      }
      if (user) {
        // Store only essential user data to avoid 2048 bytes limit
        await SecureStore.setItemAsync(this.USER_ID_KEY, user.id || '');
        await SecureStore.setItemAsync(this.USER_EMAIL_KEY, user.email || '');
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async getUser(): Promise<any | null> {
    try {
      const userId = await SecureStore.getItemAsync(this.USER_ID_KEY);
      const userEmail = await SecureStore.getItemAsync(this.USER_EMAIL_KEY);
      if (userId || userEmail) {
        return { id: userId, email: userEmail };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async clearSession() {
    try {
      await SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(this.USER_ID_KEY);
      await SecureStore.deleteItemAsync(this.USER_EMAIL_KEY);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  async restoreSession() {
    try {
      const accessToken = await this.getAccessToken();
      const user = await this.getUser();
      if (accessToken && user) {
        // Validate token if needed
        return { accessToken, user };
      }
      return null;
    } catch (error) {
      console.error('Error restoring session:', error);
      return null;
    }
  }

  async isSessionValid(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return false;

    // Basic check - in production, you might want to validate with backend
    try {
      // Decode JWT to check expiration
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }
}

export const sessionManager = new SessionManager();