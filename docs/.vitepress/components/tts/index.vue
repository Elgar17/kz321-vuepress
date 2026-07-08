<template>
  <section class="tts-card">
    <div class="tts-header">
      <div>
        <p class="tts-eyebrow">语音工具</p>
        <p class="tts-description">
          在浏览器本地生成哈萨克语语音。支持西里尔文输入或阿拉伯字母转写，可调节语速、音高与音色，首次使用需要加载语音合成资源。
        </p>
      </div>
      <span class="tts-badge" role="status" aria-live="polite">{{ statusText }}</span>
    </div>

    <div class="tts-tabs" role="tablist" aria-label="输入方式">
      <button
        v-for="mode in inputModes"
        :key="mode.value"
        type="button"
        role="tab"
        class="tts-tab"
        :class="{ 'tts-tab-active': inputMode === mode.value }"
        :aria-selected="inputMode === mode.value"
        @click="inputMode = mode.value"
      >
        {{ mode.label }}
      </button>
    </div>

    <template v-if="inputMode === 'cyrillic'">
      <label class="tts-label" for="kazakh-tts-input">输入西里尔文哈萨克语文本</label>
      <textarea
        id="kazakh-tts-input"
        ref="textInput"
        v-model="text"
        class="tts-input"
        rows="6"
        spellcheck="false"
        placeholder="请使用西里尔文输入，例如：Мәтінді осы жерге жазыңыз..."
        :disabled="isGenerating"
        :readonly="keyboardVisible"
        aria-describedby="kazakh-tts-meta"
        @focus="handleTextInputFocus"
        @click="captureTextSelection"
        @keyup="captureTextSelection"
        @select="captureTextSelection"
      />
    </template>

    <template v-else>
      <label class="tts-label" for="kazakh-tts-arabic">输入阿拉伯字母（Tote）哈萨克语文本</label>
      <textarea
        id="kazakh-tts-arabic"
        v-model="arabicText"
        class="tts-input tts-input-rtl"
        dir="rtl"
        rows="5"
        spellcheck="false"
        placeholder="ءماتىندى وسى اراعا جازىڭىز..."
        :disabled="isGenerating"
      />
      <div class="tts-actions">
        <button
          class="tts-button tts-button-primary"
          type="button"
          :disabled="!arabicText.trim() || isGenerating"
          @click="transliterateArabic"
        >
          转写为西里尔文并填入
        </button>
      </div>
      <p v-if="text" class="tts-preview">当前西里尔文：{{ text }}</p>
    </template>

    <div class="tts-controls">
      <label class="tts-control">
        <span class="tts-control-label">音色</span>
        <select v-model="voiceName" class="tts-select" :disabled="isGenerating || isLoadingEngine">
          <option v-for="voice in voices" :key="voice.name" :value="voice.name">
            {{ voice.label }}{{ voice.source === 'remote' ? '（在线）' : '' }}
          </option>
        </select>
      </label>

      <label class="tts-control">
        <span class="tts-control-label">语速 {{ speedLabel }}</span>
        <input
          v-model.number="speed"
          class="tts-range"
          type="range"
          min="0.5"
          max="2"
          step="0.05"
          :disabled="isGenerating"
        />
      </label>

      <label class="tts-control">
        <span class="tts-control-label">音高 {{ pitchLabel }}</span>
        <input
          v-model.number="pitch"
          class="tts-range"
          type="range"
          min="-6"
          max="6"
          step="1"
          :disabled="isGenerating"
        />
      </label>
    </div>

    <div class="tts-actions">
      <button
        class="tts-button tts-button-primary"
        type="button"
        :disabled="!canSynthesize"
        @click="synthesize"
      >
        {{ primaryButtonText }}
      </button>
      <button
        v-if="inputMode === 'cyrillic'"
        class="tts-button"
        type="button"
        :class="{ 'tts-button-active': keyboardVisible }"
        :disabled="isGenerating"
        @click="toggleKeyboard"
      >
        {{ keyboardButtonText }}
      </button>
      <button
        class="tts-button"
        type="button"
        :disabled="!audioUrl || isGenerating"
        @click="togglePlay"
      >
        {{ isPlaying ? '暂停' : '播放' }}
      </button>
      <a
        v-if="audioUrl"
        class="tts-button tts-link-button"
        :href="audioUrl"
        :download="wavFileName"
      >
        下载 WAV
      </a>
      <button
        v-if="audioUrl"
        class="tts-button tts-link-button"
        type="button"
        :disabled="isExportingMp3"
        @click="downloadMp3"
      >
        {{ isExportingMp3 ? '导出中...' : '下载 MP3' }}
      </button>
      <a class="tts-button tts-link-button" href="/about">
        支持作者
      </a>
    </div>

    <div class="tts-meta" id="kazakh-tts-meta">
      <span :class="{ 'tts-meta-warn': overLimit }">字符数：{{ charCount }} / {{ softLimit }}</span>
      <span v-if="sentenceCount">句子：{{ sentenceCount }}</span>
      <span v-if="durationText">音频：{{ durationText }}</span>
    </div>

    <div v-if="isLoadingEngine && loadResources.length" class="tts-resources" aria-live="polite">
      <div class="tts-resources-head">
        <span class="tts-label">正在加载语音资源</span>
        <span class="tts-resources-total">
          {{ formatBytes(loadedBytesTotal) }} / {{ formatBytes(expectedBytesTotal) }}
        </span>
      </div>
      <div
        v-for="resource in loadResources"
        :key="resource.key"
        class="tts-resource"
        :class="{ 'tts-resource-error': resource.status === 'error' }"
      >
        <div class="tts-resource-row">
          <span class="tts-resource-name">{{ resource.label }}</span>
          <span class="tts-resource-size">{{ formatBytes(resource.total) }}</span>
          <span class="tts-resource-status">{{ resourceStatusText(resource) }}</span>
        </div>
        <div class="tts-progress-track">
          <div
            class="tts-progress-bar"
            :class="{
              'tts-progress-indeterminate':
                resource.status === 'loading' && resourcePercent(resource) === null,
            }"
            :style="
              resourcePercent(resource) !== null
                ? { width: resourcePercent(resource) + '%' }
                : {}
            "
          />
        </div>
      </div>
    </div>

    <div v-if="isGenerating && genProgress" class="tts-progress" aria-live="polite">
      <div class="tts-progress-label">
        <span>合成语音…（{{ genProgress.current }}/{{ genProgress.total }} 句）</span>
      </div>
      <div class="tts-progress-track">
        <div class="tts-progress-bar" :style="{ width: genPercent + '%' }" />
      </div>
    </div>

    <audio
      v-show="audioUrl"
      ref="player"
      class="tts-player"
      :src="audioUrl"
      controls
      preload="auto"
      @timeupdate="onTimeUpdate"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="onPlaybackEnded"
    />

    <div v-if="sentences.length > 1" class="tts-transcript" aria-label="跟读文本">
      <span
        v-for="(sentence, index) in sentences"
        :key="index"
        class="tts-sentence"
        :class="{ 'tts-sentence-active': index === activeSentenceIndex }"
        @click="seekToSentence(index)"
      >
        {{ sentence.text }}
      </span>
    </div>

    <p v-if="message" class="tts-message" :class="{ error: hasError }" role="status" aria-live="polite">
      {{ message }}
    </p>

    <p v-if="cacheSupported" class="tts-cache-note">
      语音模型会缓存到本地，刷新或再次访问可秒级加载。
      <button class="tts-text-button" type="button" @click="clearCache">清除模型缓存</button>
    </p>

    <div v-if="history.length" class="tts-history">
      <div class="tts-history-head">
        <span class="tts-label">历史记录</span>
        <button class="tts-text-button" type="button" @click="clearHistory">清空</button>
      </div>
      <ul class="tts-history-list">
        <li v-for="item in history" :key="item.id" class="tts-history-item">
          <button class="tts-history-text" type="button" :title="item.text" @click="applyHistory(item)">
            {{ item.text }}
          </button>
          <span class="tts-history-tags">{{ voiceLabel(item.voiceName) }} · {{ item.speed }}x</span>
        </li>
      </ul>
    </div>

    <KazakhCyrillicKeyboard
      :visible="keyboardVisible"
      @update:visible="keyboardVisible = $event"
      @close="keyboardVisible = false"
      @input-char="insertTextAtCursor"
      @backspace="deleteTextBeforeCursor"
      @delete-forward="deleteTextAfterCursor"
      @enter="insertTextAtCursor('\n')"
    />
  </section>
</template>

<script>
import { markRaw } from "vue"
import { withBase } from "vitepress"
import KazakhCyrillicKeyboard from "../KazakhCyrillicKeyboard.vue"
import { Tote2Cyrl } from "../utils/WordConversion.js"
import {
  createKazakhTtsEngine,
  splitIntoSentences,
  getVoiceMeta,
  clearTtsCache,
  KAZAKH_TTS_VOICES,
  KAZAKH_TTS_VOICE_NAME,
  TtsError,
} from "./piperEngine.js"
import {
  decodeWavBlob,
  renderWithPitch,
  concatBuffers,
  audioBufferToWavBlob,
  audioBufferToMp3Blob,
  semitonesToRatio,
} from "./audioUtils.js"

const SOFT_LIMIT = 1000
const HISTORY_KEY = "kazakh-tts-history"
const HISTORY_MAX = 12

export default {
  name: "KazakhTts",
  components: {
    KazakhCyrillicKeyboard,
  },
  data() {
    const initialText = "Сәлеметсіз бе! Бүгін ауа райы жақсы."

    return {
      text: initialText,
      arabicText: "سالەمەتسىز بە! بۇگىن اۋا رايى جاقسى.",
      inputMode: "arabic",
      inputModes: [
        { value: "cyrillic", label: "西里尔文" },
        { value: "arabic", label: "阿拉伯字母转写" },
      ],
      voices: KAZAKH_TTS_VOICES,
      voiceName: KAZAKH_TTS_VOICE_NAME,
      speed: 1,
      pitch: 0,
      softLimit: SOFT_LIMIT,
      engine: null,
      audioUrl: "",
      audioDuration: 0,
      currentBuffer: null,
      sentences: [],
      activeSentenceIndex: -1,
      baseFileName: "kazakh-tts",
      isClient: false,
      isLoadingEngine: false,
      isGenerating: false,
      isPlaying: false,
      isExportingMp3: false,
      loadResources: [],
      genProgress: null,
      keyboardVisible: false,
      textCursorStart: initialText.length,
      textCursorEnd: initialText.length,
      message: "",
      hasError: false,
      history: [],
      cacheSupported: false,
    }
  },
  computed: {
    trimmedText() {
      return this.text.trim()
    },
    charCount() {
      return this.text.length
    },
    overLimit() {
      return this.charCount > this.softLimit
    },
    sentenceCount() {
      return this.sentences.length
    },
    canSynthesize() {
      return (
        this.isClient &&
        !!this.trimmedText &&
        !this.overLimit &&
        !this.isLoadingEngine &&
        !this.isGenerating
      )
    },
    primaryButtonText() {
      if (this.isLoadingEngine) return "准备中..."
      if (this.isGenerating) return "合成中..."
      return "合成语音"
    },
    keyboardButtonText() {
      return this.keyboardVisible ? "收起输入法" : "哈萨克语键盘"
    },
    statusText() {
      if (!this.isClient) return "等待浏览器"
      if (this.isGenerating) return "合成中"
      if (this.isLoadingEngine) return "加载中"
      if (this.isPlaying) return "播放中"
      if (this.audioUrl) return "待播放"
      if (this.engine) return "已就绪"
      return "未加载"
    },
    durationText() {
      if (!this.audioDuration) return ""
      return `${(this.audioDuration / 1000).toFixed(1)} 秒`
    },
    speedLabel() {
      return `${Number(this.speed).toFixed(2)}x`
    },
    pitchLabel() {
      if (this.pitch === 0) return "标准"
      return `${this.pitch > 0 ? "+" : ""}${this.pitch} 半音`
    },
    loadedBytesTotal() {
      return this.loadResources.reduce((sum, item) => sum + (item.loaded || 0), 0)
    },
    expectedBytesTotal() {
      return this.loadResources.reduce((sum, item) => sum + (item.total || 0), 0)
    },
    genPercent() {
      if (!this.genProgress || !this.genProgress.total) return 0
      return Math.round((this.genProgress.current / this.genProgress.total) * 100)
    },
    wavFileName() {
      return `${this.baseFileName}.wav`
    },
    signature() {
      return `${this.voiceName}|${this.speed}|${this.pitch}|${this.trimmedText}`
    },
  },
  created() {
    this.resultCache = new Map()
  },
  mounted() {
    this.isClient = true
    this.cacheSupported = typeof caches !== "undefined"
    this.registerServiceWorker()
    this.loadHistory()
    window.addEventListener("keydown", this.handleShortcut)
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleShortcut)
    this.stopPlayback()
    this.releaseAudioUrl()
    if (this.engine) {
      this.engine.destroy()
      this.engine = null
    }
  },
  methods: {
    async ensureEngine() {
      if (!this.engine) {
        this.message = "正在加载语音合成资源..."
        this.hasError = false
        this.engine = markRaw(await createKazakhTtsEngine())
      }

      if (this.engine.warmedVoice !== this.voiceName) {
        this.isLoadingEngine = true
        try {
          await this.engine.warmUp(this.voiceName, (resources) => {
            this.loadResources = resources
          })
        } finally {
          this.isLoadingEngine = false
          this.loadResources = []
        }
      }

      return this.engine
    },
    async synthesize() {
      if (!this.canSynthesize) return

      if (this.resultCache.has(this.signature)) {
        this.applyResult(this.resultCache.get(this.signature))
        this.message = "已复用之前的合成结果。"
        this.hasError = false
        this.autoPlay()
        return
      }

      this.isGenerating = true
      this.hasError = false
      this.message = "正在合成语音，首次运行会稍慢..."
      this.stopPlayback()

      try {
        const engine = await this.ensureEngine()
        const sentences = splitIntoSentences(this.trimmedText)
        const pitchRatio = semitonesToRatio(this.pitch)
        const speed = Number(this.speed) || 1

        const buffers = []
        const segments = []
        let cursor = 0

        for (let i = 0; i < sentences.length; i += 1) {
          this.genProgress = { current: i + 1, total: sentences.length }
          const response = await engine.synthesize(sentences[i], this.voiceName, {
            speed,
            pitchRatio,
          })
          const decoded = await decodeWavBlob(response.file)
          const rendered = markRaw(await renderWithPitch(decoded, pitchRatio))
          buffers.push(rendered)
          segments.push({
            text: sentences[i],
            start: cursor,
            end: cursor + rendered.duration,
          })
          cursor += rendered.duration
        }

        if (segments.length) {
          segments[segments.length - 1].end += 0.5
        }

        const finalBuffer = markRaw(concatBuffers(buffers))
        const wavBlob = audioBufferToWavBlob(finalBuffer)

        const result = {
          wavBlob,
          buffer: finalBuffer,
          sentences: segments,
          duration: Math.round(finalBuffer.duration * 1000),
          fileName: this.buildFileName(),
        }

        this.resultCache.set(this.signature, result)
        this.applyResult(result)
        this.pushHistory()

        this.message = "语音已合成，正在播放。"
        this.autoPlay()
      } catch (error) {
        this.hasError = true
        this.message =
          error instanceof TtsError || error instanceof Error
            ? error.message
            : "语音合成失败，请稍后重试。"
      } finally {
        this.isLoadingEngine = false
        this.isGenerating = false
        this.genProgress = null
      }
    },
    applyResult(result) {
      this.releaseAudioUrl()
      this.audioUrl = URL.createObjectURL(result.wavBlob)
      this.currentBuffer = result.buffer
      this.sentences = result.sentences
      this.audioDuration = result.duration
      this.baseFileName = result.fileName
      this.activeSentenceIndex = -1
    },
    autoPlay() {
      this.$nextTick(() => {
        const player = this.$refs.player
        if (!player) return
        player.currentTime = 0
        const playPromise = player.play()
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            this.message = "已合成，请点击播放（浏览器阻止了自动播放）。"
          })
        }
      })
    },
    togglePlay() {
      const player = this.$refs.player
      if (!player || !this.audioUrl) return
      if (player.paused) {
        player.play().catch(() => {
          this.hasError = true
          this.message = "浏览器阻止了播放，请再次点击播放。"
        })
      } else {
        player.pause()
      }
    },
    stopPlayback() {
      const player = this.$refs.player
      if (!player) return
      player.pause()
      player.currentTime = 0
      this.isPlaying = false
    },
    onPlaybackEnded() {
      this.isPlaying = false
      this.activeSentenceIndex = -1
      this.message = "播放完成。"
    },
    onTimeUpdate() {
      const player = this.$refs.player
      if (!player || this.sentences.length < 2) return
      const time = player.currentTime
      this.activeSentenceIndex = this.sentences.findIndex(
        (sentence) => time >= sentence.start && time < sentence.end,
      )
    },
    seekToSentence(index) {
      const player = this.$refs.player
      const sentence = this.sentences[index]
      if (!player || !sentence) return
      player.currentTime = sentence.start + 0.001
      player.play().catch(() => {})
    },
    async downloadMp3() {
      if (!this.currentBuffer) return
      this.isExportingMp3 = true
      try {
        const blob = await audioBufferToMp3Blob(this.currentBuffer)
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = `${this.baseFileName}.mp3`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      } catch (error) {
        this.hasError = true
        this.message = "MP3 导出失败，请尝试下载 WAV 文件。"
      } finally {
        this.isExportingMp3 = false
      }
    },
    buildFileName() {
      const base = this.trimmedText
        .replace(/\s+/g, "_")
        .replace(/[^\p{L}\p{N}_-]/gu, "")
        .slice(0, 24)
      const stamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")
      return `${base || "kazakh-tts"}-${stamp}`
    },
    transliterateArabic() {
      const source = this.arabicText.trim()
      if (!source) return
      try {
        const cyrillic = Tote2Cyrl(source)
        this.text = cyrillic
        this.inputMode = "cyrillic"
        this.message = "已转写为西里尔文，可直接合成。"
        this.hasError = false
      } catch (error) {
        this.hasError = true
        this.message = "转写失败，请检查阿拉伯字母输入。"
      }
    },
    voiceLabel(name) {
      return getVoiceMeta(name).label
    },
    registerServiceWorker() {
      if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return
      if (!window.isSecureContext) return
      navigator.serviceWorker.register(withBase("/tts-sw.js")).catch(() => {})
    },
    async clearCache() {
      const cleared = await clearTtsCache()
      this.message = cleared
        ? "已清除本地语音模型缓存，下次将重新下载。"
        : "当前环境不支持清除缓存。"
      this.hasError = false
    },
    formatBytes(bytes) {
      if (!bytes) return "—"
      if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
      if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
      return `${bytes} B`
    },
    resourcePercent(resource) {
      if (resource.status === "done") return 100
      if (!resource.total) return null
      return Math.min(100, Math.round((resource.loaded / resource.total) * 100))
    },
    resourceStatusText(resource) {
      if (resource.status === "done") return "已完成"
      if (resource.status === "error") return "失败"
      if (resource.status === "loading") {
        const percent = this.resourcePercent(resource)
        return percent === null ? "加载中" : `${percent}%`
      }
      return "等待中"
    },
    loadHistory() {
      try {
        const raw = window.localStorage.getItem(HISTORY_KEY)
        this.history = raw ? JSON.parse(raw) : []
      } catch (error) {
        this.history = []
      }
    },
    pushHistory() {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: this.trimmedText,
        voiceName: this.voiceName,
        speed: Number(this.speed),
        pitch: this.pitch,
      }
      const filtered = this.history.filter(
        (item) => !(item.text === entry.text && item.voiceName === entry.voiceName),
      )
      this.history = [entry, ...filtered].slice(0, HISTORY_MAX)
      this.persistHistory()
    },
    applyHistory(item) {
      this.text = item.text
      this.voiceName = item.voiceName
      this.speed = item.speed
      this.pitch = item.pitch
      this.inputMode = "cyrillic"
      this.message = "已载入历史文本，点击“合成语音”生成。"
      this.hasError = false
    },
    clearHistory() {
      this.history = []
      this.persistHistory()
    },
    persistHistory() {
      try {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history))
      } catch (error) {
        // 忽略隐私模式等无法写入的场景。
      }
    },
    handleShortcut(event) {
      const target = event.target
      const isFormField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)

      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault()
        this.synthesize()
        return
      }

      if (event.code === "Space" && !isFormField && this.audioUrl) {
        event.preventDefault()
        this.togglePlay()
      }
    },
    toggleKeyboard() {
      const shouldShow = !this.keyboardVisible

      if (shouldShow) {
        this.captureTextSelection()
        this.keyboardVisible = true
        this.closeNativeKeyboard()
        return
      }

      this.keyboardVisible = false
      this.focusTextInput()
    },
    handleTextInputFocus() {
      if (this.keyboardVisible) {
        this.closeNativeKeyboard()
        return
      }

      this.captureTextSelection()
    },
    captureTextSelection() {
      const input = this.$refs.textInput
      if (!input) return

      this.textCursorStart = input.selectionStart ?? this.text.length
      this.textCursorEnd = input.selectionEnd ?? this.textCursorStart
    },
    closeNativeKeyboard() {
      const blurActiveInput = () => {
        const input = this.$refs.textInput
        if (input) {
          input.readOnly = true
          input.blur()
        }

        const activeElement = document.activeElement
        if (
          activeElement &&
          typeof activeElement.blur === "function" &&
          (activeElement === this.$refs.textInput ||
            activeElement.matches?.("input, textarea, [contenteditable='true']"))
        ) {
          activeElement.blur()
        }
      }

      blurActiveInput()
      this.$nextTick(blurActiveInput)
      window.setTimeout(blurActiveInput, 0)
    },
    focusTextInput() {
      this.$nextTick(() => {
        if (this.$refs.textInput) {
          this.$refs.textInput.focus()
        }
      })
    },
    insertTextAtCursor(value) {
      if (this.isGenerating) return

      const { start, end } = this.getTextCursorRange()
      this.text = this.text.slice(0, start) + value + this.text.slice(end)
      this.setTextCursor(start + value.length)
    },
    deleteTextBeforeCursor() {
      if (this.isGenerating) return

      const { start, end } = this.getTextCursorRange()
      if (start !== end) {
        this.text = this.text.slice(0, start) + this.text.slice(end)
        this.setTextCursor(start)
        return
      }
      if (start === 0) return

      this.text = this.text.slice(0, start - 1) + this.text.slice(end)
      this.setTextCursor(start - 1)
    },
    deleteTextAfterCursor() {
      if (this.isGenerating) return

      const { start, end } = this.getTextCursorRange()
      if (start !== end) {
        this.text = this.text.slice(0, start) + this.text.slice(end)
        this.setTextCursor(start)
        return
      }
      if (start >= this.text.length) return

      this.text = this.text.slice(0, start) + this.text.slice(start + 1)
      this.setTextCursor(start)
    },
    getTextCursorRange() {
      if (!this.keyboardVisible) {
        this.captureTextSelection()
      }

      const start = Math.min(this.textCursorStart, this.text.length)
      const end = Math.min(this.textCursorEnd, this.text.length)

      return {
        start: Math.min(start, end),
        end: Math.max(start, end),
      }
    },
    setTextCursor(position) {
      this.textCursorStart = position
      this.textCursorEnd = position

      this.$nextTick(() => {
        const input = this.$refs.textInput
        if (!input || this.keyboardVisible) return

        input.focus()
        input.setSelectionRange(position, position)
      })
    },
    releaseAudioUrl() {
      if (!this.audioUrl) return
      URL.revokeObjectURL(this.audioUrl)
      this.audioUrl = ""
      this.audioDuration = 0
      this.currentBuffer = null
      this.sentences = []
      this.activeSentenceIndex = -1
    },
  },
}
</script>

<style scoped>
.tts-card {
  max-width: 760px;
  margin: 24px auto;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.tts-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.tts-eyebrow {
  margin: 0 0 6px;
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tts-description {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.tts-badge {
  flex: 0 0 auto;
  padding: 6px 12px;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-size: 0.85rem;
  font-weight: 600;
}

.tts-tabs {
  display: inline-flex;
  gap: 4px;
  margin-bottom: 16px;
  padding: 4px;
  border-radius: 10px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.tts-tab {
  padding: 6px 14px;
  border: none;
  border-radius: 7px;
  color: var(--vp-c-text-2);
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}

.tts-tab-active {
  color: #fff;
  background: var(--vp-c-brand-1);
}

.tts-label {
  display: block;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.tts-input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font: inherit;
  line-height: 1.7;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.tts-input-rtl {
  font-family: "KazNet", sans-serif;
  font-size: 18px;
}

.tts-input:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.tts-preview {
  margin: 10px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  line-height: 1.6;
  word-break: break-word;
}

.tts-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.tts-control {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tts-control-label {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 600;
}

.tts-select {
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font: inherit;
}

.tts-range {
  width: 100%;
  accent-color: var(--vp-c-brand-1);
}

.tts-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.tts-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s;
}

.tts-button:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  transform: translateY(-1px);
}

.tts-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.tts-button-primary {
  border-color: var(--vp-c-brand-1);
  color: #fff;
  background: var(--vp-c-brand-1);
}

.tts-button-primary:hover:not(:disabled) {
  color: #fff;
  background: var(--vp-c-brand-2);
}

.tts-button-active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.tts-link-button {
  color: var(--vp-c-brand-1);
}

.tts-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 14px;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.tts-meta-warn {
  color: var(--vp-c-danger-1);
  font-weight: 600;
}

.tts-resources {
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.tts-resources-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.tts-resources-head .tts-label {
  margin-bottom: 0;
}

.tts-resources-total {
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
}

.tts-resource {
  margin-bottom: 10px;
}

.tts-resource:last-child {
  margin-bottom: 0;
}

.tts-resource-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 0.83rem;
}

.tts-resource-name {
  flex: 1;
  color: var(--vp-c-text-1);
}

.tts-resource-size {
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.tts-resource-status {
  flex: 0 0 auto;
  min-width: 48px;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.tts-resource-error .tts-resource-status {
  color: var(--vp-c-danger-1);
}

.tts-resource-error .tts-progress-bar {
  background: var(--vp-c-danger-1);
}

.tts-progress {
  margin-top: 16px;
}

.tts-progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.tts-progress-track {
  position: relative;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.tts-progress-bar {
  height: 100%;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  transition: width 0.2s ease;
}

.tts-progress-indeterminate {
  width: 40% !important;
  animation: tts-indeterminate 1.1s ease-in-out infinite;
}

@keyframes tts-indeterminate {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(320%);
  }
}

.tts-player {
  width: 100%;
  margin-top: 16px;
}

.tts-transcript {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  padding: 12px;
  border-radius: 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  line-height: 1.8;
}

.tts-sentence {
  padding: 2px 6px;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.tts-sentence:hover {
  background: var(--vp-c-bg-soft);
}

.tts-sentence-active {
  color: #fff;
  background: var(--vp-c-brand-1);
}

.tts-message {
  margin: 14px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.tts-message.error {
  color: var(--vp-c-danger-1);
}

.tts-cache-note {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 12px 0 0;
  color: var(--vp-c-text-3);
  font-size: 0.82rem;
}

.tts-history {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.tts-history-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tts-text-button {
  border: none;
  background: none;
  color: var(--vp-c-brand-1);
  font-size: 0.85rem;
  cursor: pointer;
}

.tts-history-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.tts-history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.tts-history-text {
  flex: 1;
  overflow: hidden;
  border: none;
  background: none;
  color: var(--vp-c-text-1);
  font: inherit;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.tts-history-text:hover {
  color: var(--vp-c-brand-1);
}

.tts-history-tags {
  flex: 0 0 auto;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .tts-card {
    padding: 18px;
  }

  .tts-header {
    display: block;
  }

  .tts-badge {
    display: inline-flex;
    margin-top: 12px;
  }
}
</style>
