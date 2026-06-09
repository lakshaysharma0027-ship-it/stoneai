export type AIProviderId = "openai" | "claude";

export type AIProviderStatus = {
  id: AIProviderId;
  enabled: false;
};

export const futureAIProviders: AIProviderStatus[] = [
  { id: "openai", enabled: false },
  { id: "claude", enabled: false },
];
