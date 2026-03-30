export interface VoicevoxEngineConfig {
  endpoint: string;
  defaultVoice: string;
  voiceMap: Record<string, number>;
  defaults: {
    speedScale: number;
  };
}

export interface Sbv2EngineConfig {
  endpoint: string;
  defaultVoice: string;
  voiceMap: Record<string, { modelId: number; styleId: number }>;
  defaults: {
    length: number;
  };
}

export const engineConfigs: {
  voicevox: VoicevoxEngineConfig;
  "style-bert-vits2": Sbv2EngineConfig;
} = {
  voicevox: {
    endpoint: "http://localhost:50021",
    defaultVoice: "zundamon",
    voiceMap: {
      zundamon: 3,
      "zundamon-ama": 4,
      "zundamon-tsun": 5,
      "zundamon-sexy": 6,
      metan: 1,
      "metan-ama": 2,
      "metan-tsun": 3,
      tsumugi: 8,
      hau: 10,
    },
    defaults: {
      speedScale: 1.3,
    },
  },

  "style-bert-vits2": {
    endpoint: "http://localhost:5000",
    defaultVoice: "default",
    voiceMap: {
      default: { modelId: 0, styleId: 0 },
    },
    defaults: {
      length: 1.0,
    },
  },
};

export type EngineName = keyof typeof engineConfigs;
export const defaultEngine: EngineName = "voicevox";
