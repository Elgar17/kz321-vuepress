<template>
  <div class="container">
    <h1>الپپە</h1>
    <div class="card-grid">
      <div v-for="item in alphabet" :key="item.letter" class="card">
        <div class="card-content">
          <div class="letter-container">
            <span class="letter">{{ item.letter }}</span>
          </div>
          <div class="card-footer">
            <div></div>
            <div class="word-container">
              <span class="emoji" :aria-label="`Emoji for ${item.word}`">{{ item.emoji }}</span>
              <span class="word">{{ item.word }}</span>
            </div>
            <!-- <button
              @click="playPronunciation(item)"
              :aria-label="`Pronounce ${item.letter} for ${item.word}`"
            >
              <svg v-if="item.isPlaying" class="icon icon-playing" viewBox="0 0 24 24">
                <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M18 3a9 9 0 0 1 0 18"></path>
              </svg>
              <svg v-else class="icon" viewBox="0 0 24 24">
                <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alphabet: [
        { letter: "ا", word: "الما", emoji: "🍎", isPlaying: false },
        { letter: "ءا", word: "ءاتەش", emoji: "🐓", isPlaying: false },
        { letter: "ب", word: "بانان", emoji: "🍌", isPlaying: false },
        { letter: "ۆ", word: "ۆەلوسيپەد", emoji: "🚴🏻", isPlaying: false },
        { letter: "گ", word: "گۇل", emoji: "💐", isPlaying: false },
        { letter: "ع", word: "عالىم", emoji: "👨‍🔬", isPlaying: false },
        { letter: "د", word: "دوپ", emoji: "⚽", isPlaying: false },
        { letter: "ە", word: "ەسىك", emoji: "🚪", isPlaying: false },
        { letter: "ج", word: "جولبارىس", emoji: "🐅", isPlaying: false },
        { letter: "ز", word: "زەبرا", emoji: "🦓", isPlaying: false },
        { letter: "ي", word: "يت", emoji: "🐕", isPlaying: false },
        { letter: "ك", word: "كوبەلەك", emoji: "🦋", isPlaying: false },
        { letter: "ق", word: "قويان", emoji: "🐰", isPlaying: false },
        { letter: "ل", word: "ليمون", emoji: "🍋", isPlaying: false },
        { letter: "م", word: "مىسىق", emoji: "🐈", isPlaying: false },
        { letter: "ن", word: "نار", emoji: "🐪", isPlaying: false },
        { letter: "ڭ", word: "", emoji: "", isPlaying: false },
        { letter: "و", word: "ورىندىق", emoji: "🪑", isPlaying: false },
        { letter: "ءو", word: "ورمەكشى", emoji: "🕷️", isPlaying: false },
        { letter: "پ", word: "ءپىل", emoji: "🐘", isPlaying: false },
        { letter: "ر", word: "راديو", emoji: "📻", isPlaying: false },
        { letter: "س", word: "ساعات", emoji: "⏰", isPlaying: false },
        { letter: "ت", word: "تاس", emoji: "🪨", isPlaying: false },
        { letter: "ۋ", word: "ۋىق", emoji: "", isPlaying: false },
        { letter: "ۇ", word: "ۇلۋ", emoji: "🐌", isPlaying: false },
        { letter: "ءۇ", word: "ءۇي", emoji: "🏠", isPlaying: false },
        { letter: "ف", word: "فونتان", emoji: "⛲", isPlaying: false },
        { letter: "ح", word: "حات", emoji: "📨", isPlaying: false },
        { letter: "ھ", word: "ايداھار", emoji: "🐲", isPlaying: false },
        { letter: "چ", word: "چەك", emoji: "🎫", isPlaying: false },
        { letter: "ش", word: "شار", emoji: "🎈", isPlaying: false },
        { letter: "ى", word: "ىدىس", emoji: "🥣", isPlaying: false },
        { letter: "ءى", word: "ءىز", emoji: "👣", isPlaying: false },
      ]
    }
  },
  methods: {
    playPronunciation(item) {
      item.isPlaying = true;
      // In a real implementation, you would trigger audio playback here
      // For this example, we'll just simulate it with a timeout
      setTimeout(() => {
        item.isPlaying = false;
      }, 1000);
    }
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
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.letter-container {
  /* flex-grow: 1; */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 15px 0;
}

.letter {
  font-size: 4rem;
  font-weight: bold;
  color: #333;
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

button:hover {
  background-color: #f0f0f0;
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #e0e0e0;
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

.icon-playing {
  color: #4a90e2;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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