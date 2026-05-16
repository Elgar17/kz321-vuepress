<template>
  <div class="container">
    <h1>الپپە</h1>
    <div class="card-grid">
      <div v-for="item in alphabet" :key="item.letter" class="card">
        <div class="card-content">
          <div class="letter-container">
            <span class="letter" :class="{'vowel': item.vowel}">{{ item.letter }}</span>
          </div>
          <div class="word-shape-container">
            <div v-if="item.shape && item.shape[4]"  class="word-shape">{{ item.shape && item.shape[4]}}</div>
            <div v-if="item.shape && item.shape[1]" class="word-shape">{{ item.shape && item.shape[1] }}</div>
            <div v-if="item.shape && item.shape[2]"  class="word-shape">{{ item.shape && item.shape[2]}}</div>
            <div v-if="item.shape && item.shape[3]"  class="word-shape">{{ item.shape && item.shape[3]}}</div>
          </div>
          <div class="card-footer">
            <div></div>
            <div class="word-container">
              <span class="emoji" :aria-label="`Emoji for ${item.word}`">{{ item.emoji }}</span>
              <span class="word">{{ item.word }}</span>
            </div>
            <button
              class="play-button"
              type="button"
              @click="playPronunciation(item)"
              :disabled="item.isGenerating || isLoadingEngine"
              :aria-label="`播放 ${item.word} 的发音`"
              :title="item.cyrlWord ? `播放：${item.cyrlWord}` : '播放单词'"
            >
              <svg v-if="item.isPlaying || item.isGenerating" class="icon icon-playing" viewBox="0 0 24 24">
                <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M18 3a9 9 0 0 1 0 18"></path>
              </svg>
              <svg v-else class="icon" viewBox="0 0 24 24">
                <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <p v-if="ttsMessage" class="tts-message" :class="{ error: hasTtsError }">
      {{ ttsMessage }}
    </p>
  </div>
</template>

<script>
import { markRaw } from "vue"
import { createKazakhTtsEngine, KAZAKH_TTS_VOICE_NAME } from "./tts/piperEngine.js"
import { Tote2Cyrl } from "./utils/WordConversion.js"

export default {
  data() {
    return {
      engine: null,
      isLoadingEngine: false,
      activeAudio: null,
      audioCache: {},
      ttsMessage: "",
      hasTtsError: false,
      alphabet: [
        { letter: "ا", vowel: true, shape: { "3": "\uFE8E", "4": "\uFE8D" }, word: "الما", emoji: "🍎", isPlaying: false },
        { letter: "ءا", vowel: true, shape: {"3": "\uFE8E", "4": "\uFE80\uFE8D"}, word: "اتەش", emoji: "🐓", isPlaying: false },
        { letter: "ب", shape: { "1": "\uFE91", "2": "\uFE92", "3": "\uFE90", "4": "\uFE8F" }, word: "بانان", emoji: "🍌", isPlaying: false },
        { letter: "ۆ", shape: { "3": "\uFBDA", "4": "\uFBD9" }, word: "ۆەلوسيپەد", emoji: "🚴🏻", isPlaying: false },
        { letter: "گ", shape: { "1": "\uFB94", "2": "\uFB95", "3": "\uFB93", "4": "\uFB92" }, word: "گۇل", emoji: "💐", isPlaying: false },
        { letter: "ع", shape: { "1": "\uFECB", "2": "\uFECC", "3": "\uFECA", "4": "\uFEC9" }, word: "عالىم", emoji: "👨‍🔬", isPlaying: false },
        { letter: "د", shape: { "3": "\uFEAA", "4": "\uFEA9" }, word: "دوپ", emoji: "⚽", isPlaying: false },
        { letter: "ە", vowel: true, shape: { "3": "\uFEEA", "4": "\uFEE9" }, word: "ەسىك", emoji: "🚪", isPlaying: false },
        { letter: "ج", shape: { "1": "\uFE9F", "2": "\uFEA0", "3": "\uFE9E", "4": "\uFE9D" }, word: "جولبارىس", emoji: "🐅", isPlaying: false },
        { letter: "ز", shape: { "3": "\uFEB0", "4": "\uFEAF" }, word: "زەبرا", emoji: "🦓", isPlaying: false },
        { letter: "ي", shape: { "1": "\uFEF3", "2": "\uFEF4", "3": "\uFEF2", "4": "\uFEF1" }, word: "يت", emoji: "🐕", isPlaying: false },
        { letter: "ك", shape: { "1": "\uFEDB", "2": "\uFEDC", "3": "\uFEDA", "4": "\uFED9" }, word: "كوبەلەك", emoji: "🦋", isPlaying: false },
        { letter: "ق", shape: { "1": "\uFED7", "2": "\uFED8", "3": "\uFED6", "4": "\uFED5" }, word: "قويان", emoji: "🐰", isPlaying: false },
        { letter: "ل", shape: { "1": "\uFEDF", "2": "\uFEE0", "3": "\uFEDE", "4": "\uFEDD" }, word: "ليمون", emoji: "🍋", isPlaying: false },
        { letter: "م", shape: { "1": "\uFEE3", "2": "\uFEE4", "3": "\uFEE2", "4": "\uFEE1" },word: "مىسىق", emoji: "🐈", isPlaying: false },
        { letter: "ن", shape: { "1": "\uFEE7", "2": "\uFEE8", "3": "\uFEE6", "4": "\uFEE5" }, word: "نار", emoji: "🐪", isPlaying: false },
        { letter: "ڭ", shape: { "1": "\uFBD5", "2": "\uFBD6", "3": "\uFBD4", "4": "\uFBD3" }, word: "قوڭىراۋ", emoji: "🔔", isPlaying: false },
        { letter: "و", vowel: true, shape: { "3": "\uFEEE", "4": "\uFEED" }, word: "ورىندىق", emoji: "🪑", isPlaying: false },
        { letter: "ءو", vowel: true, shape: { "3": "\uFEEE", "4": "\uFE80\uFEED" }, word: "ورمەكشى", emoji: "🕷️", isPlaying: false },
        { letter: "پ", shape: { "1": "\uFB58", "2": "\uFB59", "3": "\uFB57", "4": "\uFB56" }, word: "ءپىل", emoji: "🐘", isPlaying: false },
        { letter: "ر", shape: { "3": "\uFEAE", "4": "\uFEAD" }, word: "راديو", emoji: "📻", isPlaying: false },
        { letter: "س",  shape: { "1": "\uFEB3", "2": "\uFEB4", "3": "\uFEB2", "4": "\uFEB1" }, word: "ساعات", emoji: "⏰", isPlaying: false },
        { letter: "ت", shape:{ "1": "\uFE97", "2": "\uFE98", "3": "\uFE96", "4": "\uFE95" }, word: "تاس", emoji: "🪨", isPlaying: false },
        { letter: "ۋ",  shape: { "3": "\uFBDF", "4": "\uFBDE" },word: "ۋىق", emoji: "", isPlaying: false },
        { letter: "ۇ", shape: { "3": "\uFBD8", "4": "\uFE80\uFBD7" }, word: "ۇلۋ", emoji: "🐌", isPlaying: false },
        { letter: "ءۇ", vowel: true, shape: { "3": "\uFBD8", "4": "\uFE80\uFBD7" }, word: "ءۇي", emoji: "🏠", isPlaying: false },
        { letter: "ف", shape: { "1": "\uFED3", "2": "\uFED4", "3": "\uFED2", "4": "\uFED1" }, word: "فونتان", emoji: "⛲", isPlaying: false },
        { letter: "ح", shape: { "1": "\uFEA3", "2": "\uFEA4", "3": "\uFEA2", "4": "\uFEA1" }, word: "حات", emoji: "📨", isPlaying: false },
        { letter: "ھ", shape: { "1": "\uFBAC", "2":" ـھ" }, word: "ايداھار", emoji: "🐲", isPlaying: false },
        { letter: "چ", shape: { "1": "\uFB7C", "2": "\uFB7D", "3": "\uFB7B", "4": "\uFB7A" }, word: "چەك", emoji: "🎫", isPlaying: false },
        { letter: "ش", shape: { "1": "\uFEB7", "2": "\uFEB8", "3": "\uFEB6", "4": "\uFEB5" }, word: "شار", emoji: "🎈", isPlaying: false },
        { letter: "ى", vowel: true, shape: { "1": "\uFBE8", "2": "\uFBE9", "3": "\uFEF0", "4": "\uFEEF" }, word: "ىدىس", emoji: "🥣", isPlaying: false },
        { letter: "ءى", vowel: true, shape: { "1": "\uFE80\uFBE8", "2": "\uFBE9", "3": "\uFEF0", "4": "\uFEEF" }, word: "ءىز", emoji: "👣", isPlaying: false },
      ]
    }
  },
  beforeUnmount() {
    this.stopCurrentAudio()
    Object.values(this.audioCache).forEach(({ url }) => URL.revokeObjectURL(url))
    this.audioCache = {}
    if (this.engine) {
      this.engine.destroy()
      this.engine = null
    }
  },
  methods: {
    async ensureEngine() {
      if (this.engine) return this.engine

      this.isLoadingEngine = true
      this.hasTtsError = false
      this.ttsMessage = "正在加载语音资源，首次使用会稍慢..."

      try {
        this.engine = markRaw(await createKazakhTtsEngine())
        return this.engine
      } finally {
        this.isLoadingEngine = false
      }
    },
    async ensureAudio(item) {
      if (this.audioCache[item.letter]) return this.audioCache[item.letter]

      item.isGenerating = true
      const cyrlWord = Tote2Cyrl(item.word).trim()
      item.cyrlWord = cyrlWord

      try {
        const engine = await this.ensureEngine()
        const response = await engine.generate(cyrlWord, KAZAKH_TTS_VOICE_NAME, 0)
        const url = URL.createObjectURL(response.file)
        const audio = markRaw(new Audio(url))
        const audioEntry = { url, audio }

        audio.onended = () => {
          item.isPlaying = false
          if (this.activeAudio === audio) {
            this.activeAudio = null
          }
        }
        audio.onerror = () => {
          item.isPlaying = false
          this.hasTtsError = true
          this.ttsMessage = `“${item.word}” 播放失败，请稍后重试。`
        }

        this.audioCache[item.letter] = audioEntry
        return audioEntry
      } finally {
        item.isGenerating = false
      }
    },
    async playPronunciation(item) {
      if (item.isGenerating || this.isLoadingEngine) return

      this.hasTtsError = false
      this.ttsMessage = ""
      this.stopCurrentAudio()

      try {
        const { audio } = await this.ensureAudio(item)
        audio.currentTime = 0
        await audio.play()
        this.activeAudio = audio
        item.isPlaying = true
      } catch (error) {
        item.isPlaying = false
        this.hasTtsError = true
        this.ttsMessage = error instanceof Error
          ? error.message
          : `“${item.word}” 语音生成失败，请稍后重试。`
      }
    },
    stopCurrentAudio() {
      if (this.activeAudio) {
        this.activeAudio.pause()
        this.activeAudio.currentTime = 0
        this.activeAudio = null
      }
      this.alphabet.forEach((item) => {
        item.isPlaying = false
      })
    },
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'KazNet', sans-serif;
  direction: rtl;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.card {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: background-color 0.3s;
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.letter-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-bg-alt);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  padding: 15px 0;
  min-height: 100px;
}

.letter {
  font-size: 4rem;
  font-weight: bold;
  color: var(--vp-c-text-1);
  font-family: 'KazNet', sans-serif;
  line-height: 1.2;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.word-container {
  display: flex;
  align-items: center;
}

.word {
  font-size: 1rem;
  font-weight: 600;
  margin-left: 0.5rem;
  font-family: 'KazNet', sans-serif;
}

.emoji {
  font-size: 2rem;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.play-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

button:hover:not(:disabled) {
  background-color: var(--vp-c-bg-alt);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.icon {
  width: 24px;
  height: 24px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}

.word-shape-container {
  direction: rtl;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
  font-family: 'KazNet', sans-serif;
}

.word-shape {
  width: 20px;
  height: 16px;
}

.icon-playing {
  color: #4a90e2;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.tts-message {
  margin: 1rem 0 0;
  color: var(--vp-c-text-2);
  text-align: center;
}

.tts-message.error {
  color: var(--vp-c-danger-1);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

@media (max-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1025px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>