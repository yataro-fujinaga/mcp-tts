# ロードマップ

## Phase 1: VOICEVOX連携（基本動作） ← 今ここ

MCPサーバー経由でずんだもんの声が出るところまで。

### 完了済み
- [x] プロジェクト初期化（TypeScript, MCP SDK）
- [x] 設計: Flat Adapterパターン、統一インターフェース
- [x] types.ts — TtsAdapter, SynthesisResult
- [x] config.ts — VOICEVOX / SBV2 のエンジン設定
- [x] audio-player.ts — OS依存の音声再生
- [x] adapter/voicevox.ts — VOICEVOX adapter
- [x] adapter/style-bert-vits2.ts — SBV2 adapter
- [x] index.ts — MCPサーバー本体（speak + list_voices）
- [x] ビルド成功
- [x] VOICEVOXエンジン Docker起動確認
- [x] curl経由でずんだもん音声再生確認
- [x] Claude CodeにMCPサーバー登録

### TODO
- [ ] 新セッションでspeakツール動作確認
- [ ] Claude Codeのフック設定（タスク開始/完了時に自動で喋らせる）
- [ ] VOICEVOX Dockerの自動起動（speakツール呼び出し時 or セッション開始時）

## Phase 2: フック連携（実用化）

Claude Codeの作業に連動して自動で声が出るようにする。

### TODO
- [ ] hooks設定: タスク開始時 →「了解なのだ！取りかかるのだ」
- [ ] hooks設定: タスク完了時 →「できたのだ！確認してほしいのだ」
- [ ] hooks設定: エラー時 →「うまくいかなかったのだ…」
- [ ] セリフのカスタマイズ方法を整理
- [ ] 複数セッション運用時の通知として機能するか検証

## Phase 3: Style-Bert-VITS2連携（カスタム音声）

自作モデルやHugging Faceのモデルで好きな声を使えるようにする。

### TODO
- [ ] Style-Bert-VITS2のローカル起動確認
- [ ] SBV2 adapterの実動作テスト
- [ ] Hugging Faceからモデルをダウンロードして試す
- [ ] config.tsにモデル追加の手順を整理

## Phase 4: パーソナライズ（発展）

アプリケーションとしての価値を追求する。ロックマンエグゼ的パーソナルナビ構想。

### TODO
- [ ] アプリケーション設計の壁打ち（PMと）
- [ ] 状況に応じたセリフ変化（成功/失敗/開始で声色を変える）
- [ ] 自分の声で学習させてみる（SBV2ファインチューニング）
- [ ] 名前呼びの実装
