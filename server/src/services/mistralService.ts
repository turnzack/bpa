import axios from 'axios';

export interface MistralConfig {
  apiKey: string;
  baseUrl: string;
  models: {
    tiny: { name: string; maxTokens: number; temperature: number };
    small: { name: string; maxTokens: number; temperature: number };
    medium: { name: string; maxTokens: number; temperature: number };
  };
}

export class MistralService {
  private config: MistralConfig;

  constructor() {
    this.config = {
      apiKey: process.env.MISTRAL_API_KEY || '',
      baseUrl: 'https://api.mistral.ai/v1/chat/completions',
      models: {
        tiny: { name: 'mistral-tiny', maxTokens: 150, temperature: 0.7 },
        small: { name: 'mistral-small', maxTokens: 2000, temperature: 0.8 },
        medium: { name: 'mistral-medium', maxTokens: 4000, temperature: 0.8 },
      },
    };
  }

  async generateDescription(text: string): Promise<{ success: boolean; description?: string; error?: string }> {
    if (!this.config.apiKey) {
      return { success: false, error: 'Mistral API key not configured' };
    }

    try {
      const response = await axios.post(this.config.baseUrl, {
        model: this.config.models.tiny.name,
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant francophone spécialisé dans l\'amélioration des descriptions. Crée une description courte (2-3 phrases maximum) et créative en français. Utilise un ton positif et inspirant.',
          },
          {
            role: 'user',
            content: `Crée une belle description pour ce texte en français: ${text}`,
          },
        ],
        temperature: this.config.models.tiny.temperature,
        max_tokens: this.config.models.tiny.maxTokens,
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const description = response.data.choices[0].message.content;
      return { success: true, description };
    } catch (error) {
      console.error('Error calling Mistral API:', error);
      return { success: false, error: error.response?.data?.error?.message || 'Failed to generate description' };
    }
  }

  async generateQuote(prompt: string, model: 'tiny' | 'small' | 'medium' = 'small'): Promise<{ success: boolean; content?: string; error?: string }> {
    if (!this.config.apiKey) {
      return { success: false, error: 'Mistral API key not configured' };
    }

    try {
      const selectedModel = this.config.models[model];

      const response = await axios.post(this.config.baseUrl, {
        model: selectedModel.name,
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant expert en génération de devis pour le bâtiment. Génère des devis détaillés et professionnels.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: selectedModel.temperature,
        max_tokens: selectedModel.maxTokens,
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const content = response.data.choices[0].message.content;
      return { success: true, content };
    } catch (error) {
      console.error('Error calling Mistral API for quote generation:', error);
      return { success: false, error: error.response?.data?.error?.message || 'Failed to generate quote' };
    }
  }
}

export const mistralService = new MistralService();