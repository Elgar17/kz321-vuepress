<template>
  <section class="tts-card">
    <div class="tts-header">
      <div>
        <p class="tts-eyebrow">语音工具</p>
        <p class="tts-description">
          在浏览器本地生成哈萨克语语音。请使用西里尔文输入文本，首次使用需要加载语音合成资源。
        </p>
      </div>
      <span class="tts-badge">{{ statusText }}</span>
    </div>

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
    />

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
        class="tts-button"
        type="button"
        :class="{ 'tts-button-active': keyboardVisible }"
        :disabled="isGenerating"
        @click="toggleKeyboard"
      >
        {{ keyboardButtonText }}
      </button>
      <button
        v-if="audioUrl"
        class="tts-button tts-button-primary"
        type="button"
        :disabled="isGenerating || isPlaying"
        @click="playAudio"
      >
        播放
      </button>
      <button
        class="tts-button"
        type="button"
        :disabled="!isPlaying"
        @click="stopPlayback"
      >
        停止
      </button>
      <a
        v-if="audioUrl"
        class="tts-button tts-link-button"
        :href="audioUrl"
        download="kazakh-tts.wav"
      >
        下载 WAV
      </a>
    </div>

    <div class="tts-meta">
      <span>字符数：{{ text.length }}</span>
      <span v-if="durationText">音频：{{ durationText }}</span>
    </div>

    <p v-if="message" class="tts-message" :class="{ error: hasError }">
      {{ message }}
    </p>

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
import KazakhCyrillicKeyboard from "../KazakhCyrillicKeyboard.vue"
import { createKazakhTtsEngine, KAZAKH_TTS_VOICE_NAME } from "./piperEngine.js"

export default {
  name: "KazakhTts",
  components: {
    KazakhCyrillicKeyboard,
  },
  data() {
    return {
      text: "Сәлеметсіз бе! Бүгін ауа райы жақсы.",
      engine: null,
      audio: null,
      audioUrl: "",
      audioDuration: 0,
      isClient: false,
      isLoadingEngine: false,
      isGenerating: false,
      isPlaying: false,
      keyboardVisible: false,
      message: "",
      hasError: false,
    }
  },
  computed: {
    trimmedText() {
      return this.text.trim()
    },
    canSynthesize() {
      return this.isClient && this.trimmedText && !this.isLoadingEngine && !this.isGenerating
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
  },
  mounted() {
    this.isClient = true
  },
  beforeUnmount() {
    this.stopPlayback()
    this.releaseAudioUrl()
    if (this.engine) {
      this.engine.destroy()
      this.engine = null
    }
  },
  methods: {
    async ensureEngine() {
      if (this.engine) return this.engine

      this.isLoadingEngine = true
      this.message = "正在加载语音合成资源..."
      this.hasError = false

      const engine = markRaw(await createKazakhTtsEngine())

      this.engine = engine

      this.isLoadingEngine = false
      return engine
    },
    async synthesize() {
      if (!this.canSynthesize) return

      this.isGenerating = true
      this.hasError = false
      this.message = "正在合成语音，首次运行会稍慢..."
      this.stopPlayback()

      try {
        const engine = await this.ensureEngine()
        const response = await engine.generate(this.trimmedText, KAZAKH_TTS_VOICE_NAME, 0)

        this.releaseAudioUrl()
        this.audioUrl = URL.createObjectURL(response.file)
        this.audioDuration = response.duration
        this.audio = markRaw(new Audio(this.audioUrl))
        this.audio.onended = () => {
          this.isPlaying = false
          this.message = "播放完成。"
        }
        this.audio.onerror = () => {
          this.isPlaying = false
          this.hasError = true
          this.message = "音频播放失败，请尝试下载 WAV 文件。"
        }

        this.message = "语音已合成，请点击播放。"
      } catch (error) {
        this.hasError = true
        this.message = error instanceof Error ? error.message : "语音合成失败，请稍后重试。"
      } finally {
        this.isLoadingEngine = false
        this.isGenerating = false
      }
    },
    toggleKeyboard() {
      this.keyboardVisible = !this.keyboardVisible
      this.focusTextInput()
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

      const input = this.$refs.textInput
      if (!input) {
        this.text += value
        return
      }

      const start = input.selectionStart ?? this.text.length
      const end = input.selectionEnd ?? this.text.length
      this.text = this.text.slice(0, start) + value + this.text.slice(end)
      this.setTextCursor(start + value.length)
    },
    deleteTextBeforeCursor() {
      if (this.isGenerating) return

      const input = this.$refs.textInput
      if (!input) {
        this.text = this.text.slice(0, -1)
        return
      }

      const start = input.selectionStart ?? this.text.length
      const end = input.selectionEnd ?? this.text.length
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

      const input = this.$refs.textInput
      if (!input) return

      const start = input.selectionStart ?? this.text.length
      const end = input.selectionEnd ?? this.text.length
      if (start !== end) {
        this.text = this.text.slice(0, start) + this.text.slice(end)
        this.setTextCursor(start)
        return
      }
      if (start >= this.text.length) return

      this.text = this.text.slice(0, start) + this.text.slice(start + 1)
      this.setTextCursor(start)
    },
    setTextCursor(position) {
      this.$nextTick(() => {
        const input = this.$refs.textInput
        if (!input) return
        input.focus()
        input.setSelectionRange(position, position)
      })
    },
    async playAudio() {
      if (!this.audio) return

      try {
        this.hasError = false
        if (this.audio.ended) {
          this.audio.currentTime = 0
        }
        await this.audio.play()
        this.isPlaying = true
        this.message = "正在播放合成语音。"
      } catch (error) {
        this.isPlaying = false
        this.hasError = true
        this.message = "浏览器阻止了播放请求，请再次点击播放，或下载 WAV 文件。"
      }
    },
    stopPlayback() {
      if (!this.audio) return
      this.audio.pause()
      this.audio.currentTime = 0
      this.isPlaying = false
    },
    releaseAudioUrl() {
      if (!this.audioUrl) return
      URL.revokeObjectURL(this.audioUrl)
      this.audioUrl = ""
      this.audioDuration = 0
      this.audio = null
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

.tts-header h2 {
  margin: 0;
  font-size: 1.6rem;
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

.tts-input:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
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

.tts-message {
  margin: 14px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.tts-message.error {
  color: var(--vp-c-danger-1);
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
