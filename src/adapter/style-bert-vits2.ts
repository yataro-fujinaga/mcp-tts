import type { TtsAdapter, SynthesisResult, VoiceInfo } from "../types.js";
import { engineConfigs } from "../config.js";

const config = engineConfigs["style-bert-vits2"];

export class StyleBertVits2Adapter implements TtsAdapter {
  readonly name = "style-bert-vits2";

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${config.endpoint}/models/info`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async synthesize(text: string, voice: string): Promise<SynthesisResult> {
    const voiceConfig = config.voiceMap[voice];
    if (!voiceConfig) {
      throw new Error(
        `Unknown voice "${voice}". Available: ${Object.keys(config.voiceMap).join(", ")}`
      );
    }

    const params = new URLSearchParams({
      text,
      model_id: String(voiceConfig.modelId),
      speaker_id: String(voiceConfig.styleId),
      language: "JP",
      length: String(config.defaults.length),
    });

    const res = await fetch(`${config.endpoint}/voice?${params}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`SBV2 /voice failed: ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    return {
      audioData: Buffer.from(arrayBuffer),
      format: "wav",
    };
  }

  async listVoices(): Promise<VoiceInfo[]> {
    try {
      const res = await fetch(`${config.endpoint}/models/info`);
      if (!res.ok) return this.listConfigVoices();

      const models = (await res.json()) as Record<
        string,
        { id2spk?: Record<string, string> }
      >;
      const voices: VoiceInfo[] = [];
      for (const [modelId, model] of Object.entries(models)) {
        if (model.id2spk) {
          for (const [spkId, spkName] of Object.entries(model.id2spk)) {
            voices.push({
              id: `${modelId}:${spkId}`,
              name: spkName,
            });
          }
        }
      }
      return voices.length > 0 ? voices : this.listConfigVoices();
    } catch {
      return this.listConfigVoices();
    }
  }

  private listConfigVoices(): VoiceInfo[] {
    return Object.entries(config.voiceMap).map(([alias, v]) => ({
      id: alias,
      name: `${alias} (model=${v.modelId}, style=${v.styleId})`,
    }));
  }
}
