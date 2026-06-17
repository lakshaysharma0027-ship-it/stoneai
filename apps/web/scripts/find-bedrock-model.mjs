import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

const region = process.env.AWS_REGION ?? "us-east-1";
const apiKey = process.env.AWS_BEDROCK_API_KEY ?? process.env.AWS_BEARER_TOKEN_BEDROCK;

if (!apiKey) {
  console.error("Missing AWS_BEDROCK_API_KEY.");
  process.exit(1);
}

if (!process.env.AWS_BEARER_TOKEN_BEDROCK) {
  process.env.AWS_BEARER_TOKEN_BEDROCK = apiKey;
}

const candidates = [
  process.env.BEDROCK_CLAUDE_MODEL,
  "global.anthropic.claude-opus-4-8",
  "us.anthropic.claude-opus-4-8",
  "global.anthropic.claude-opus-4-6-v1",
  "us.anthropic.claude-opus-4-6-v1",
  "anthropic.claude-opus-4-6-v1",
].filter(Boolean);

const client = new BedrockRuntimeClient({ region });

for (const modelId of [...new Set(candidates)]) {
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
    console.log(`WORKING_MODEL=${modelId}`);
    console.log(`RESPONSE=${text.trim()}`);
    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`FAILED ${modelId}: ${message.split("\n")[0]}`);
  }
}

process.exit(1);
