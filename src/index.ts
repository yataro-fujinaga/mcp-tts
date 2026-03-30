#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import type { TtsAdapter } from "./types.js";
import { engineConfigs, defaultEngine, type EngineName } from "./config.js";
import { VoicevoxAdapter } from "./adapter/voicevox.js";
import { StyleBertVits2Adapter } from "./adapter/style-bert-vits2.js";
import { playAudio } from "./audio-player.js";

const adapters = new Map<string, TtsAdapter>([
  ["voicevox", new VoicevoxAdapter()],
  ["style-bert-vits2", new StyleBertVits2Adapter()],
]);

const engineNames = Object.keys(engineConfigs) as EngineName[];

const server = new McpServer({
  name: "mcp-tts",
  version: "0.1.0",
});

server.tool(
  "speak",
  "Synthesize text to speech and play it",
  {
    text: z.string().describe("Text to speak"),
    engine: z
      .enum(engineNames as [string, ...string[]])
      .optional()
      .describe(`TTS engine (default: ${defaultEngine})`),
    voice: z
      .string()
      .optional()
      .describe("Voice alias (default: engine default)"),
    async: z
      .boolean()
      .optional()
      .describe("Async playback (default: true)"),
  },
  async ({ text, engine, voice, async: asyncPlay }) => {
    const engineName = engine ?? defaultEngine;
    const adapter = adapters.get(engineName);
    if (!adapter) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Unknown engine "${engineName}". Available: ${engineNames.join(", ")}`,
          },
        ],
        isError: true,
      };
    }

    const voiceName =
      voice ?? engineConfigs[engineName as EngineName].defaultVoice;

    try {
      const result = await adapter.synthesize(text, voiceName);
      await playAudio(result.audioData, result.format, {
        async: asyncPlay ?? true,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: `Spoke: "${text}" (engine=${engineName}, voice=${voiceName})`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Speech failed: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "list_voices",
  "List available voices for a TTS engine",
  {
    engine: z
      .enum(engineNames as [string, ...string[]])
      .optional()
      .describe(`TTS engine (default: ${defaultEngine})`),
  },
  async ({ engine }) => {
    const engineName = engine ?? defaultEngine;
    const adapter = adapters.get(engineName);
    if (!adapter) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Unknown engine "${engineName}"`,
          },
        ],
        isError: true,
      };
    }

    const voices = await adapter.listVoices();
    const list = voices.map((v) => `  ${v.id}: ${v.name}`).join("\n");
    return {
      content: [
        {
          type: "text" as const,
          text: `Voices for ${engineName}:\n${list}`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("mcp-tts failed to start:", err);
  process.exit(1);
});
