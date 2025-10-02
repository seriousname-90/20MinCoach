// services/dailyService.js
import { DailyConfig } from '../config/daily';

class DailyService {
  constructor() {
    this.apiKey = DailyConfig.apiKey;
    this.baseUrl = DailyConfig.baseUrl;
  }

  async createRoom(roomConfig = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            exp: Math.round(Date.now() / 1000) + 60 * 60, // 1 hour expiry
            enable_chat: true,
            enable_knocking: true,
            ...roomConfig,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async validateRoom(roomName) {
    try {
      const response = await fetch(`${this.baseUrl}/rooms/${roomName}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default new DailyService();