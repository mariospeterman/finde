type EnvValue = string | undefined;

const read = (value: EnvValue, fallback = "") => (typeof value === "string" && value.length > 0 ? value : fallback);

const warn = (message: string) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[env] ${message}`);
  }
};

export const serverEnv = (() => {
  const openaiApiKey = read(process.env.OPENAI_API_KEY);
  const posthogServerKey = read(process.env.POSTHOG_SERVER_KEY);
  const posthogServerHost = read(process.env.POSTHOG_SERVER_HOST, "https://us.i.posthog.com");

  if (!openaiApiKey) {
    warn("OPENAI_API_KEY is not set. AI-powered features will be disabled.");
  }

  if (!posthogServerKey) {
    warn("POSTHOG_SERVER_KEY is not set. PostHog instrumentation for OpenAI will be disabled.");
  }

  return {
    openaiApiKey,
    posthogServerKey,
    posthogServerHost,
  } as const;
})();


