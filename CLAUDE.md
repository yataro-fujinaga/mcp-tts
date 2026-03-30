# mcp-tts

複数の音声合成エンジンを統一インターフェースで扱えるMCPサーバー。

## 現在の状態

- Phase 1（VOICEVOX連携）のコード実装完了、ビルド通る
- MCPサーバーとしてClaude Codeに登録済み（次のセッションから有効）
- VOICEVOXエンジンはDockerで起動確認済み
- ずんだもんの声でcurl経由の音声再生確認済み

## 前提

- VOICEVOX: `docker run --rm -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest`
- MCPサーバー登録: `claude mcp add tts -- node /Users/yataro/Documents/projects/mcp-tts/dist/index.js`

## 構成

```
src/
  index.ts              — MCPサーバー本体（speak + list_voices ツール）
  types.ts              — TtsAdapter インターフェース
  config.ts             — エンジン設定（voiceMap, defaults）
  audio-player.ts       — OS依存の音声再生（afplay等）
  adapter/
    voicevox.ts         — VOICEVOX adapter
    style-bert-vits2.ts — Style-Bert-VITS2 adapter
```

## 設計方針

- 統一インターフェース: `speak(text, engine?, voice?)` の1ツールで全エンジン対応
- adapterパターン: エンジン固有パラメータは外に漏らさない（adapter内部のconfigで吸収）
- voiceはエイリアスマップで指定（"zundamon", "tsumugi"等。数値IDを覚えなくていい）

## ビルド

```bash
cd /Users/yataro/Documents/projects/mcp-tts
npm run build
```
