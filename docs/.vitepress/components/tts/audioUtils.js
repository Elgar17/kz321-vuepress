let sharedContext = null

function getAudioContext() {
  if (sharedContext) return sharedContext
  const Ctor = window.AudioContext || window.webkitAudioContext
  if (!Ctor) throw new Error("当前浏览器不支持 Web Audio，无法处理音频。")
  sharedContext = new Ctor()
  return sharedContext
}

export async function decodeWavBlob(blob) {
  const arrayBuffer = await blob.arrayBuffer()
  const ctx = getAudioContext()
  return new Promise((resolve, reject) => {
    ctx.decodeAudioData(
      arrayBuffer.slice(0),
      (buffer) => resolve(buffer),
      (error) => reject(error instanceof Error ? error : new Error("音频解码失败。")),
    )
  })
}

// 通过 OfflineAudioContext 用 playbackRate 变调（同时改变时长，
// 时长已在合成阶段用 length_scale 反向补偿）。
export async function renderWithPitch(buffer, pitchRatio) {
  if (!pitchRatio || Math.abs(pitchRatio - 1) < 1e-3) return buffer

  const frames = Math.max(1, Math.ceil(buffer.length / pitchRatio))
  const Ctor = window.OfflineAudioContext || window.webkitOfflineAudioContext
  if (!Ctor) return buffer

  const offline = new Ctor(1, frames, buffer.sampleRate)
  const source = offline.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = pitchRatio
  source.connect(offline.destination)
  source.start()
  return offline.startRendering()
}

export function concatBuffers(buffers) {
  const usable = buffers.filter(Boolean)
  if (usable.length === 1) return usable[0]

  const ctx = getAudioContext()
  const sampleRate = usable[0].sampleRate
  const total = usable.reduce((sum, buf) => sum + buf.length, 0)
  const output = ctx.createBuffer(1, total, sampleRate)
  const channel = output.getChannelData(0)

  let offset = 0
  for (const buf of usable) {
    channel.set(buf.getChannelData(0), offset)
    offset += buf.length
  }
  return output
}

export function audioBufferToWavBlob(buffer) {
  const sampleRate = buffer.sampleRate
  const samples = buffer.getChannelData(0)
  const dataLength = samples.length * 2
  const view = new DataView(new ArrayBuffer(44 + dataLength))

  const writeString = (offset, text) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i))
    }
  }

  writeString(0, "RIFF")
  view.setUint32(4, 36 + dataLength, true)
  writeString(8, "WAVE")
  writeString(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, "data")
  view.setUint32(40, dataLength, true)

  let offset = 44
  for (let i = 0; i < samples.length; i += 1) {
    let sample = Math.max(-1, Math.min(1, samples[i]))
    sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
    view.setInt16(offset, sample | 0, true)
    offset += 2
  }

  return new Blob([view.buffer], { type: "audio/wav" })
}

export async function audioBufferToMp3Blob(buffer) {
  const { Mp3Encoder } = await import("@breezystack/lamejs")
  const sampleRate = buffer.sampleRate
  const source = buffer.getChannelData(0)

  const pcm = new Int16Array(source.length)
  for (let i = 0; i < source.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, source[i]))
    pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff
  }

  const encoder = new Mp3Encoder(1, sampleRate, 128)
  const blockSize = 1152
  const chunks = []

  for (let i = 0; i < pcm.length; i += blockSize) {
    const slice = pcm.subarray(i, i + blockSize)
    const encoded = encoder.encodeBuffer(slice)
    if (encoded.length > 0) chunks.push(new Uint8Array(encoded))
  }

  const flushed = encoder.flush()
  if (flushed.length > 0) chunks.push(new Uint8Array(flushed))

  return new Blob(chunks, { type: "audio/mpeg" })
}

export function semitonesToRatio(semitones) {
  return 2 ** (semitones / 12)
}
