export const MISTRAL_CONFIG = {
  apiKey: process.env.MISTRAL_API_KEY!,
  baseUrl: 'https://api.mistral.ai/v1/chat/completions',
  models: {
    tiny: { name: 'mistral-tiny', maxTokens: 150, temperature: 0.7 },
    small: { name: 'mistral-small', maxTokens: 2000, temperature: 0.8 },
    medium: { name: 'mistral-medium', maxTokens: 4000, temperature: 0.8 },
  },
  security: {
    maxInputLength: 10000,
    enableInjectionFilter: true,
    enableOutputValidation: true,
  },
};