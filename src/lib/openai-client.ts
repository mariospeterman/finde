import { OpenAI } from "@posthog/ai";
import { PostHog } from "posthog-node";

import { serverEnv } from "@/lib/env-server";

declare global {
  var __posthogClient: PostHog | undefined;
  var __openaiClient: OpenAI | undefined;
  var __posthogShutdownHookRegistered: boolean | undefined;
}

const createPosthogClient = () => {
  if (!serverEnv.posthogServerKey) {
    return undefined;
  }

  const client = new PostHog(serverEnv.posthogServerKey, {
    host: serverEnv.posthogServerHost,
  });

  if (!globalThis.__posthogShutdownHookRegistered) {
    const shutdown = () => {
      client.shutdown();
    };
    process.on("exit", shutdown);
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
    globalThis.__posthogShutdownHookRegistered = true;
  }

  return client;
};

const getPosthogClient = () => {
  if (globalThis.__posthogClient) {
    return globalThis.__posthogClient;
  }

  const client = createPosthogClient();

  if (client && process.env.NODE_ENV !== "production") {
    globalThis.__posthogClient = client;
  }

  return client;
};

export const getOpenAIClient = () => {
  if (globalThis.__openaiClient) {
    return globalThis.__openaiClient;
  }

  if (!serverEnv.openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const posthog = getPosthogClient();
  if (!posthog) {
    throw new Error("POSTHOG_SERVER_KEY is required for OpenAI PostHog integration.");
  }

  const client = new OpenAI({
    apiKey: serverEnv.openaiApiKey,
    posthog,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__openaiClient = client;
  }

  return client;
};

export const getPosthogAnalytics = () => getPosthogClient();


