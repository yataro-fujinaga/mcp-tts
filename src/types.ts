export interface SynthesisResult {
  audioData: Buffer;
  format: "wav" | "mp3";
}

export interface VoiceInfo {
  id: string;
  name: string;
}

export interface TtsAdapter {
  readonly name: string;
  healthCheck(): Promise<boolean>;
  synthesize(text: string, voice: string): Promise<SynthesisResult>;
  listVoices(): Promise<VoiceInfo[]>;
}
