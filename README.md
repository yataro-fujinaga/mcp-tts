# mcp-tts

An MCP server that gives AI agents the ability to speak. Supports multiple TTS engines through a unified interface.

## Why

AI agents work in text. Sometimes you want them to talk — read out results, announce when a task is done, or just make the terminal less silent. This MCP server adds a `speak` tool that any MCP-compatible client (Claude Code, etc.) can call.

## Supported Engines

| Engine | Description | Voices |
|---|---|---|
| **VOICEVOX** | Open-source Japanese TTS with character voices | Zundamon, Metan, Tsumugi, and more |
| **Style-BERT-VITS2** | High-quality neural TTS with style control | Configurable |

## Quick Start

### 1. Start a TTS engine

```bash
# VOICEVOX (Docker)
docker run --rm -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:cpu-latest
```

### 2. Build and register

```bash
git clone https://github.com/yataro-fujinaga/mcp-tts.git
cd mcp-tts
npm install && npm run build

# Register with Claude Code
claude mcp add tts -- node $(pwd)/dist/index.js
```

### 3. Use it

In Claude Code (or any MCP client):

```
"Read this out loud: Hello, world!"
→ Agent calls speak("Hello, world!")
→ Audio plays through your speakers
```

## MCP Tools

### `speak`

Synthesize text and play it.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `text` | string | required | Text to speak |
| `engine` | string | `"voicevox"` | TTS engine (`voicevox`, `style-bert-vits2`) |
| `voice` | string | engine default | Voice alias (e.g., `"zundamon"`, `"tsumugi"`) |
| `async` | boolean | `true` | Non-blocking playback |

### `list_voices`

List available voices for an engine.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `engine` | string | `"voicevox"` | TTS engine to query |

## Voice Aliases (VOICEVOX)

No need to remember numeric IDs — use friendly names:

| Alias | Character |
|---|---|
| `zundamon` | Zundamon (default) |
| `zundamon-ama` | Zundamon (sweet) |
| `zundamon-tsun` | Zundamon (tsundere) |
| `metan` | Shikoku Metan |
| `tsumugi` | Kasukabe Tsumugi |
| `hau` | Goki Hau |

## Architecture

```
Claude Code / MCP Client
  │
  │  MCP protocol (stdio)
  ▼
┌─────────────────────────┐
│  mcp-tts server         │
│  ┌───────────────────┐  │
│  │  speak / list_voices  │
│  └────────┬──────────┘  │
│           │ adapter      │
│  ┌────────▼──────────┐  │
│  │ VOICEVOX adapter  │  │
│  │ SBV2 adapter      │  │
│  └────────┬──────────┘  │
│           │ audio        │
│  ┌────────▼──────────┐  │
│  │ audio-player      │  │
│  │ (afplay / aplay)  │  │
│  └───────────────────┘  │
└─────────────────────────┘
  │
  ▼
TTS Engine (localhost API)
```

- **Adapter pattern**: Engine-specific details (API format, voice IDs, parameters) are isolated inside each adapter
- **Voice aliases**: Human-readable names mapped to engine-specific IDs in config
- **Audio playback**: OS-native player (`afplay` on macOS, `aplay` on Linux)

## Tech Stack

- TypeScript
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Zod (input validation)

## License

MIT
