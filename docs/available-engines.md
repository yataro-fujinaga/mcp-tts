# 利用可能な音声合成エンジン一覧

## ローカル（無料・オフライン動作）

| エンジン | 種類 | 特徴 | 入手先 |
|---|---|---|---|
| VOICEVOX | TTS | 日本語特化。キャラ声。CPU動作。Docker対応 | https://voicevox.hiroshiba.jp/ |
| COEIROINK | TTS | VOICEVOXと似た構造。別キャラが使える | https://coeiroink.com/ |
| Style-Bert-VITS2 | TTS+Cloning | 自然な感情表現。自分の声で学習可能 | https://github.com/litagin02/Style-Bert-VITS2 |
| RVC | Voice Conversion | 声→声の変換。学習が最も簡単 | https://github.com/RVC-Project |

## クラウドAPI（有料・高品質）

| エンジン | 種類 | 特徴 |
|---|---|---|
| ElevenLabs | TTS+Cloning | 声のクローンが得意。日本語対応 |
| CoeFont | TTS | 声優が公式にライセンス提供。権利クリア |
| OpenAI TTS | TTS | 英語が自然。日本語も対応 |
| Google Cloud TTS | TTS | 多言語対応 |
| GPT-4o | TTS | リアルタイムAPI。声のプリセットあり |

## mcp-ttsで対応済み

- VOICEVOX — adapter/voicevox.ts
- Style-Bert-VITS2 — adapter/style-bert-vits2.ts

## 新しいエンジンを追加するには

どのエンジンも「テキストを投げたら音声が返ってくるAPI」という点は同じ。
adapter/ に新しいファイルを作り、TtsAdapterインターフェースを実装するだけ。

```
MCPサーバー (speak ツール)
  └─ adapter (TtsAdapter を実装)
       └─ 任意の音声合成APIを叩く
            └─ WAV/MP3を返す
```
