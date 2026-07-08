import { withBase } from "vitepress"

const LOCAL_MODELS_BASE = withBase("/piper/models/")
const REMOTE_MODELS_BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/"

export const KAZAKH_TTS_VOICES = [
  { name: "kk_KZ-raya-x_low", label: "Raya · 女声", quality: "x_low", source: "local" },
  { name: "kk_KZ-iseke-x_low", label: "Iseke · 男声", quality: "x_low", source: "remote" },
  { name: "kk_KZ-issai-high", label: "Issai · 高音质", quality: "high", source: "remote" },
]

export const KAZAKH_TTS_VOICE_NAME = KAZAKH_TTS_VOICES[0].name

export function getVoiceMeta(name) {
  return KAZAKH_TTS_VOICES.find((voice) => voice.name === name) || KAZAKH_TTS_VOICES[0]
}

export class TtsError extends Error {
  constructor(message, code) {
    super(message)
    this.name = "TtsError"
    this.code = code
  }
}

function baseUrlForVoice(name) {
  return getVoiceMeta(name).source === "remote" ? REMOTE_MODELS_BASE : LOCAL_MODELS_BASE
}

function voiceFilePath(baseUrl, name) {
  const parts = name.split("-")
  const family = parts[0].split("_")[0]
  return `${baseUrl}${family}/${parts.join("/")}/${parts.join("-")}`
}

const RESOURCE_CACHE_NAME = "kazakh-tts-cache-v1"

async function openResourceCache() {
  if (typeof caches === "undefined") return null
  try {
    return await caches.open(RESOURCE_CACHE_NAME)
  } catch (error) {
    return null
  }
}

export async function clearTtsCache() {
  if (typeof caches === "undefined") return false
  try {
    const keys = await caches.keys()
    const targets = keys.filter((key) => key.startsWith("kazakh-tts"))
    const results = await Promise.all(targets.map((key) => caches.delete(key)))
    return results.some(Boolean)
  } catch (error) {
    return false
  }
}

async function readBodyWithProgress(response, onProgress) {
  const total = Number(response.headers.get("content-length")) || 0
  if (!response.body || !total) {
    const buffer = await response.arrayBuffer()
    onProgress?.(buffer.byteLength, buffer.byteLength)
    return buffer
  }

  const reader = response.body.getReader()
  const chunks = []
  let received = 0

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    received += value.length
    onProgress?.(received, total)
  }

  const merged = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.length
  }
  return merged.buffer
}

// 优先读取持久化的 Cache Storage，命中则不再走网络；未命中时下载并写入缓存，
// 使模型在刷新 / 重访后仍可秒级加载，不受 HTTP 缓存过期限制。
async function fetchArrayBufferWithProgress(url, onProgress) {
  const cache = await openResourceCache()

  if (cache) {
    const hit = await cache.match(url)
    if (hit) return readBodyWithProgress(hit, onProgress)
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new TtsError(`资源下载失败（${response.status}）。`, "model")
  }

  if (cache) {
    try {
      await cache.put(url, response.clone())
    } catch (error) {
      // 存储空间不足等场景下忽略缓存写入，不影响本次加载。
    }
  }

  return readBodyWithProgress(response, onProgress)
}

async function fetchJsonCached(url) {
  const cache = await openResourceCache()

  if (cache) {
    const hit = await cache.match(url)
    if (hit) return hit.json()
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new TtsError(`语音配置下载失败（${response.status}）。`, "model")
  }

  if (cache) {
    try {
      await cache.put(url, response.clone())
    } catch (error) {
      // 忽略缓存写入失败。
    }
  }

  return response.json()
}

// 自定义 VoiceProvider：按音色来源路由到本地或 HuggingFace，
// 并对体积最大的 .onnx 模型下载上报进度。
class ProgressVoiceProvider {
  constructor() {
    this.configCache = new Map()
    this.modelUrlCache = new Map()
    this.onProgress = null
  }

  destroy() {
    for (const url of this.modelUrlCache.values()) {
      URL.revokeObjectURL(url)
    }
    this.configCache.clear()
    this.modelUrlCache.clear()
  }

  async fetch(name) {
    const filePath = voiceFilePath(baseUrlForVoice(name), name)

    if (!this.configCache.has(name)) {
      this.configCache.set(name, await fetchJsonCached(`${filePath}.onnx.json`))
    }

    if (!this.modelUrlCache.has(name)) {
      const buffer = await fetchArrayBufferWithProgress(`${filePath}.onnx`, (loaded, total) => {
        this.onProgress?.(loaded, total)
      })
      const blob = new Blob([buffer], { type: "application/octet-stream" })
      this.modelUrlCache.set(name, URL.createObjectURL(blob))
    }

    return [this.configCache.get(name), this.modelUrlCache.get(name)]
  }
}

export async function createKazakhTtsEngine() {
  if (!window.WebAssembly) {
    throw new TtsError("当前浏览器不支持 WebAssembly，无法运行语音合成功能。", "unsupported")
  }

  let piper
  try {
    piper = await import("piper-tts-web")
  } catch (error) {
    throw new TtsError("语音引擎加载失败，请检查网络后重试。", "engine")
  }

  const { OnnxWebRuntime, PhonemizeWebRuntime } = piper
  const threadCount = Math.max(1, Math.min(4, navigator.hardwareConcurrency || 1))

  const onnxBase = withBase("/onnx/")
  const piperBase = withBase("/piper/")

  const onnxRuntime = new OnnxWebRuntime({
    basePath: onnxBase,
    numThreads: threadCount,
  })
  const phonemizeRuntime = new PhonemizeWebRuntime({
    basePath: piperBase,
  })
  const voiceProvider = new ProgressVoiceProvider()

  return new KazakhTtsEngine({ onnxRuntime, phonemizeRuntime, voiceProvider, onnxBase, piperBase })
}

class KazakhTtsEngine {
  constructor({ onnxRuntime, phonemizeRuntime, voiceProvider, onnxBase, piperBase }) {
    this.onnxRuntime = onnxRuntime
    this.phonemizeRuntime = phonemizeRuntime
    this.voiceProvider = voiceProvider
    this.onnxBase = onnxBase
    this.piperBase = piperBase
    this.warmedVoice = null
    this.defaultScales = new Map()
    this.phonemizeReady = false
  }

  destroy() {
    try {
      this.onnxRuntime.destroy()
      this.phonemizeRuntime.destroy()
      this.voiceProvider.destroy()
    } catch (error) {
      // 忽略资源释放阶段的异常。
    }
  }

  async warmUp(voiceName, onUpdate) {
    const resources = [
      { key: "phon-data", label: "发音数据 (espeak-ng)", loaded: 0, total: 0, status: "pending" },
      { key: "phon-wasm", label: "发音引擎 (wasm)", loaded: 0, total: 0, status: "pending" },
      { key: "voice", label: `语音模型 (${getVoiceMeta(voiceName).label})`, loaded: 0, total: 0, status: "pending" },
      { key: "runtime", label: "推理运行时 (onnxruntime)", loaded: 0, total: 0, status: "pending" },
    ]
    const find = (key) => resources.find((item) => item.key === key)
    const emit = () => onUpdate?.(resources.map((item) => ({ ...item })))
    emit()

    // 发音引擎所需的 wasm / espeak 数据：自行预取（带进度），再喂给运行时，避免重复下载。
    if (!this.phonemizeReady) {
      const dataBuffer = await this.#track(find("phon-data"), `${this.piperBase}piper_phonemize.data`, emit)
      const wasmBuffer = await this.#track(find("phon-wasm"), `${this.piperBase}piper_phonemize.wasm`, emit)
      const dataUrl = URL.createObjectURL(new Blob([dataBuffer], { type: "application/octet-stream" }))
      const wasmUrl = URL.createObjectURL(new Blob([wasmBuffer], { type: "application/wasm" }))
      await this.phonemizeRuntime.loadModule(wasmUrl, dataUrl)
      this.phonemizeReady = true
    } else {
      for (const key of ["phon-data", "phon-wasm"]) {
        const item = find(key)
        item.status = "done"
      }
      emit()
    }

    // 语音模型：通过 provider 拉取（同时供合成使用）。
    const voice = find("voice")
    voice.status = "loading"
    emit()
    this.voiceProvider.onProgress = (loaded, total) => {
      voice.loaded = loaded
      if (total) voice.total = total
      emit()
    }
    try {
      await this.voiceProvider.fetch(voiceName)
    } finally {
      this.voiceProvider.onProgress = null
    }
    voice.total = voice.total || voice.loaded
    voice.loaded = voice.total
    voice.status = "done"
    emit()

    // 推理运行时 wasm：由 onnxruntime 内部加载，先用 HEAD 获取体积，合成预热完成即标记就绪。
    const runtime = find("runtime")
    runtime.status = "loading"
    try {
      const head = await fetch(`${this.onnxBase}ort-wasm-simd-threaded.jsep.wasm`, { method: "HEAD" })
      runtime.total = Number(head.headers.get("content-length")) || 0
    } catch (error) {
      runtime.total = 0
    }
    emit()

    try {
      await this.synthesize("Сәлем.", voiceName, {})
    } catch (error) {
      runtime.status = "error"
      emit()
      throw wrapSynthesisError(error)
    }

    runtime.loaded = runtime.total
    runtime.status = "done"
    this.warmedVoice = voiceName
    emit()
  }

  async #track(resource, url, emit) {
    resource.status = "loading"
    emit()
    try {
      const buffer = await fetchArrayBufferWithProgress(url, (loaded, total) => {
        resource.loaded = loaded
        if (total) resource.total = total
        emit()
      })
      resource.total = resource.total || buffer.byteLength
      resource.loaded = resource.total
      resource.status = "done"
      emit()
      return buffer
    } catch (error) {
      resource.status = "error"
      emit()
      throw error
    }
  }

  async synthesize(text, voiceName, { speed = 1, pitchRatio = 1 } = {}) {
    let config
    try {
      config = await this.voiceProvider.fetch(voiceName)
    } catch (error) {
      throw error instanceof TtsError ? error : new TtsError("语音模型加载失败。", "model")
    }

    const inference = config[0].inference
    if (!this.defaultScales.has(voiceName)) {
      this.defaultScales.set(voiceName, {
        length: inference.length_scale ?? 1,
        noise: inference.noise_scale ?? 0.667,
        noiseW: inference.noise_w ?? 0.8,
      })
    }

    const defaults = this.defaultScales.get(voiceName)
    // length_scale 越大越慢；变调用 playbackRate 提速，需要反向拉长时长补偿。
    inference.length_scale = (defaults.length * pitchRatio) / speed
    inference.noise_scale = defaults.noise
    inference.noise_w = defaults.noiseW

    try {
      const phonemeData = await this.phonemizeRuntime.phonemize(text, config)
      return await this.onnxRuntime.generate(phonemeData, config, 0)
    } catch (error) {
      throw wrapSynthesisError(error)
    }
  }
}

function wrapSynthesisError(error) {
  if (error instanceof TtsError) return error
  const message = error instanceof Error ? error.message : String(error)
  if (/fetch|network|Could not/i.test(message)) {
    return new TtsError("资源下载失败，请检查网络连接后重试。", "network")
  }
  return new TtsError("语音合成失败，请稍后重试或缩短文本。", "synthesis")
}

// 将文本按句子切分，保留终止标点，便于逐句合成与跟读高亮。
export function splitIntoSentences(text) {
  const normalized = text.replace(/\r\n/g, "\n")
  const matches = normalized.match(/[^.!?。！？\n]+[.!?。！？]*\n?/g)
  if (!matches) {
    const trimmed = normalized.trim()
    return trimmed ? [trimmed] : []
  }
  return matches.map((chunk) => chunk.trim()).filter(Boolean)
}
