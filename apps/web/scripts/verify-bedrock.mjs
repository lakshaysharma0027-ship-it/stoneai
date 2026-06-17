/**
 * Smoke-test Bedrock Claude Opus 4.8 access.
 * Usage: node scripts/verify-bedrock.mjs
 */
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const modelId =
  process.env.BEDROCK_CLAUDE_MODEL ??
  process.env.AWS_BEDROCK_CLAUDE_MODEL ??
  "global.anthropic.claude-opus-4-8";
const region = process.env.AWS_REGION ?? "us-east-1";
const apiKey = process.env.AWS_BEDROCK_API_KEY ?? process.env.AWS_BEARER_TOKEN_BEDROCK;

if (!apiKey) {
  console.error("Missing AWS_BEDROCK_API_KEY.");
  process.exit(1);
}

if (!process.env.AWS_BEARER_TOKEN_BEDROCK) {
  process.env.AWS_BEARER_TOKEN_BEDROCK = apiKey;
}

const client = new BedrockRuntimeClient({ region });

try {
  const response = await client.send(
    new ConverseCommand({
      modelId,
      messages: [{ role: "user", content: [{ text: "Reply with exactly: ok" }] }],
      inferenceConfig: { maxTokens: 16, temperature: 0 },
    }),
  );
  const text =
    response.output?.message?.content?.find((block) => "text" in block)?.text ?? "";
  console.log(`Bedrock model ${modelId} responded: ${text.trim()}`);
} catch (error) {
  console.error(`Bedrock verification failed for ${modelId}:`, error);
  process.exit(1);
}
