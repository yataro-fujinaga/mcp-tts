# 自作ボイスモデルの作り方

## 選択肢

| 方法 | 難易度 | 必要な録音量 | 用途 |
|---|---|---|---|
| Style-Bert-VITS2で学習 | 中 | 数分〜数十分 | テキスト→音声（TTS） |
| RVC | 低（一番簡単） | 数分 | 声→声（ボイスチェンジ） |
| VOICEVOX用コアを自作 | 高 | 数時間 | VOICEVOX互換TTS |

## Style-Bert-VITS2（推奨）

テキスト→音声のTTSモデルを自作するなら最も手軽。

### 流れ

```
① 音声データを用意（数分〜数十分の録音）
② テキストと音声のペアを作る（書き起こし）
③ 既存ベースモデルにファインチューニング
④ ローカルでAPIサーバーとして起動（localhost:5000）
```

- Google Colabノートブックあり
- 既存のベースモデルに追加学習させるだけなので、数分の録音でもそれなりの声ができる
- GitHub: https://github.com/litagin02/Style-Bert-VITS2

### API仕様

```bash
# 音声合成
curl "localhost:5000/voice?text=こんにちは&model_id=0" --output output.wav

# モデル一覧
curl "localhost:5000/models/info"
```

レスポンスはWAV形式。

## Hugging Faceの学習済みモデル

Hugging Faceには多数のファン制作ボイスモデルが公開されている。

- **Style-Bert-VITS2モデル** — テキスト→音声用。ダウンロードしてローカルで起動すればそのまま使える
- **RVCモデル** — 声質変換用

注意: ファンが非公式に学習させたものが多い。個人利用はともかく、商用利用や公開は権利的にグレー。
権利クリアで使いたい場合は VOICEVOX や CoeFont を選ぶ。

## mcp-ttsとの接続

自作モデルをStyle-Bert-VITS2で起動すれば、mcp-ttsのSBV2 adapterがそのまま使える。
config.ts の voiceMap にモデルを追加するだけ。

```typescript
"style-bert-vits2": {
  voiceMap: {
    "my-voice": { modelId: 0, styleId: 0 },
  },
}
```
