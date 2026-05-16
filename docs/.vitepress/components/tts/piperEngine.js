import { withBase } from "vitepress"

export const KAZAKH_TTS_VOICE_NAME = "kk_KZ-raya-x_low"

export async function createKazakhTtsEngine() {
  if (!window.WebAssembly) {
    throw new Error("当前浏览器不支持 WebAssembly，无法运行语音合成功能。")
  }

  const {
    FetchProvider,
    OnnxWebRuntime,
    PhonemizeWebRuntime,
    PiperWebEngine,
    RemoteVoiceProvider,
  } = await import("piper-tts-web")

  const threadCount = Math.max(1, Math.min(4, navigator.hardwareConcurrency || 1))

  return new PiperWebEngine({
    onnxRuntime: new OnnxWebRuntime({
      basePath: withBase("/onnx/"),
      numThreads: threadCount,
    }),
    phonemizeRuntime: new PhonemizeWebRuntime({
      basePath: withBase("/piper/"),
    }),
    voiceProvider: new RemoteVoiceProvider({
      provider: new FetchProvider(),
      baseUrl: withBase("/piper/models/"),
      separator: "-",
    }),
  })
}
