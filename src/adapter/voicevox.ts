import type { TtsAdapter, SynthesisResult, VoiceInfo } from "../types.js";
import { engineConfigs } from "../config.js";

const config = engineConfigs.voicevox;

export class VoicevoxAdapter implements TtsAdapter {
  readonly name = "voicevox";

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${config.endpoint}/version`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async synthesize(text: string, voice: string): Promise<SynthesisResult> {
    const speakerId = config.voiceMap[voice];
    if (speakerId === undefined) {
      throw new Error(
        `Unknown voice "${voice}". Available: ${Object.keys(config.voiceMap).join(", ")}`
      );
    }

    // Step 1: audio_query
    const queryRes = await fetch(
      `${config.endpoint}/audio_query?text=${encodeURIComponent(text)}&speaker=${speakerId}`,
      { method: "POST" }
    );
    if (!queryRes.ok) {
      throw new Error(`audio_query failed: ${queryRes.status}`);
    }
    const query = (await queryRes.json()) as Record<string, unknown>;

    // Apply defaults
    query.speedScale = config.defaults.speedScale;

    // Step 2: synthesis
    const synthRes = await fetch(
      `${config.endpoint}/synthesis?speaker=${speakerId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      }
    );
    if (!synthRes.ok) {
      throw new Error(`synthesis failed: ${synthRes.status}`);
    }

    const arrayBuffer = await synthRes.arrayBuffer();
    return {
      audioData: Buffer.from(arrayBuffer),
      format: "wav",
    };
  }

  async listVoices(): Promise<VoiceInfo[]> {
    return Object.entries(config.voiceMap).map(([alias, id]) => ({
      id: alias,
      name: `${alias} (speaker=${id})`,
    }));
  }
}
