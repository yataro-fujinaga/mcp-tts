import { writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";

export interface PlayOptions {
  async?: boolean;
}

export async function playAudio(
  audioData: Buffer,
  format: "wav" | "mp3",
  options: PlayOptions = { async: true }
): Promise<void> {
  const tmpFile = join(tmpdir(), `mcp-tts-${randomUUID()}.${format}`);
  await writeFile(tmpFile, audioData);

  const command = getPlayCommand(tmpFile);

  const child = spawn(command.cmd, command.args, {
    stdio: "ignore",
    detached: options.async,
  });

  if (options.async) {
    child.unref();
    // 非同期: 再生時間を推定して後で削除
    setTimeout(() => unlink(tmpFile).catch(() => {}), 30_000);
    return;
  }

  return new Promise<void>((resolve, reject) => {
    child.on("close", (code) => {
      unlink(tmpFile).catch(() => {});
      if (code === 0) resolve();
      else reject(new Error(`playback exited with code ${code}`));
    });
    child.on("error", (err) => {
      unlink(tmpFile).catch(() => {});
      reject(err);
    });
  });
}

function getPlayCommand(filePath: string): { cmd: string; args: string[] } {
  switch (process.platform) {
    case "darwin":
      return { cmd: "afplay", args: [filePath] };
    case "linux":
      return { cmd: "aplay", args: [filePath] };
    case "win32":
      return {
        cmd: "powershell",
        args: [
          "-c",
          `(New-Object Media.SoundPlayer '${filePath}').PlaySync()`,
        ],
      };
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}
