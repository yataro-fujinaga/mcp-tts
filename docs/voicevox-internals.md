# VOICEVOXの仕組み

## 概要
無料のテキスト読み上げソフト。ローカルで動く音声合成エンジン。
「VOICE」+「VOX」(ラテン語で「声」)。

## 内部処理の流れ

```
テキスト「完了なのだ」
  ↓ ① テキスト解析（辞書ベース、NNではない）
音素列: k a N ry o u n a n o d a
  + アクセント・イントネーション情報
  ↓ ② 音声合成NN（ONNX形式の軽量モデル）
音声波形（WAV）
```

- ①は辞書で日本語の読みとアクセントを引くだけ
- ②だけがニューラルネット。「音素列→波形」の変換
- 入出力のフォーマットが固定されており自由度が低いため、小さいモデルで十分

## API（2段階）

```bash
# Step 1: テキスト → 音声クエリ（発音・アクセント・間の情報）
curl -X POST "localhost:50021/audio_query?text=完了なのだ&speaker=3"

# Step 2: 音声クエリ → WAVデータ
curl -X POST -H "Content-Type: application/json" \
  -d @query.json "localhost:50021/synthesis?speaker=3"
```

2段階なのは、間の調整やイントネーションを途中で微調整できるようにするため。

## 起動方法（Docker）

```bash
docker run --rm -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest
```

Apple Silicon ネイティブ対応。GUIアプリ不要。

## キャラクター

数十キャラ × 複数スタイル（ノーマル、あまあま、ツンツン、セクシー等）。
1キャラ = 1モデル。スタイル違いも別モデル。

主なspeaker ID:
- 3: ずんだもん（ノーマル）
- 1: 四国めたん（ノーマル）
- 8: 春日部つむぎ
- 10: 雨晴はう

全一覧: https://voicevox.hiroshiba.jp/dormitory/
起動中のエンジンから取得: `curl localhost:50021/speakers`
