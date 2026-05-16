<template>
  <transition name="kbd-slide">
    <div
      v-show="visible"
      class="kbd-shell"
      role="dialog"
      aria-label="哈萨克语西里尔文键盘"
    >
      <div class="kbd-panel">
        <div class="kbd-panel-inner">
          <div class="kbd-toolbar">
            <span class="kbd-title">Қазақша</span>
            <button
              type="button"
              class="kbd-close"
              aria-label="关闭"
              @click="onClose"
              v-html="svgClose"
            />
          </div>

          <div class="kbd-rows kbd-rows--desktop">
            <div class="kbd-row">
              <button
                v-for="(k, i) in desktopRow1"
                :key="'d1-' + i"
                type="button"
                class="kbd-key"
                :class="keyClass(k)"
                :style="keyFlex(k)"
                @click="onKey(k)"
                v-html="keyLabel(k)"
              />
            </div>
            <div class="kbd-row">
              <button
                v-for="(k, i) in desktopRow2"
                :key="'d2-' + i"
                type="button"
                class="kbd-key"
                :class="keyClass(k)"
                :style="keyFlex(k)"
                @click="onKey(k)"
                v-html="keyLabel(k)"
              />
            </div>
            <div class="kbd-row">
              <button
                v-for="(k, i) in desktopRow3"
                :key="'d3-' + i"
                type="button"
                class="kbd-key"
                :class="keyClass(k)"
                :style="keyFlex(k)"
                @click="onKey(k)"
                v-html="keyLabel(k)"
              />
            </div>
            <div class="kbd-row">
              <button
                v-for="(k, i) in desktopRow4"
                :key="'d4-' + i"
                type="button"
                class="kbd-key"
                :class="keyClass(k)"
                :style="keyFlex(k)"
                @click="onKey(k)"
                v-html="keyLabel(k)"
              />
            </div>
          </div>

          <div class="kbd-rows kbd-rows--mobile">
            <div v-for="(row, ri) in mobileRows" :key="'m' + ri" class="kbd-row">
              <button
                v-for="(k, ki) in row"
                :key="'m' + ri + '-' + ki"
                type="button"
                class="kbd-key"
                :class="keyClass(k)"
                :style="keyFlex(k)"
                @click="onKey(k)"
                v-html="keyLabel(k)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  lucideToSvg,
  iconSearch,
  iconX,
  iconDelete,
  iconCornerDownLeft,
} from "./utils/lucideSvg.js";
import { physicalKeyToChar } from "./utils/kazakhPhysicalKeymap.js";

export default {
  name: "KazakhCyrillicKeyboard",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      capsLock: false,
      shiftSticky: false,
      _physHandler: null,
    };
  },
  computed: {
    svgClose() {
      return lucideToSvg(iconX, { size: 22, className: "kbd-lucide" });
    },
    upper() {
      return this.capsLock !== this.shiftSticky;
    },
    desktopRow1() {
      return [
        ...this.chars(['(', '"', 'ә', 'і', 'ң', 'ғ', ',', '.', 'ү', 'ұ', 'қ', 'ө', 'һ']),
        { role: "backspace", label: "", wide: 1.6 },
      ];
    },
    desktopRow2() {
      return [
        { role: "tab", label: "Tab", wide: 1.3 },
        ...this.chars(['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '*']),
        { role: "delete", label: "", wide: 1.3 },
      ];
    },
    desktopRow3() {
      return [
        { role: "caps", label: "Caps", wide: 1.5 },
        ...this.chars(['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э']),
        { role: "enter", wide: 2 },
      ];
    },
    desktopRow4() {
      return [
        { role: "shift", label: "Shift", wide: 1.4 },
        ...this.chars(['я', 'ч', 'с', 'м']),
        { role: "space", label: "Қазақша", wide: 4 },
        ...this.chars(['и', 'т', 'ь', 'б', 'ю', '-']),
      ];
    },
    mobileRows() {
      return [
        this.chars(['-', 'ә', 'і', 'ң', 'ғ', 'ү', 'ұ', 'қ', 'ө', 'һ']),
        this.chars(['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х']),
        this.chars(['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э']),
        [...this.chars(['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', 'ъ']), { role: "backspace", label: "" }],
        [
          { role: "case", label: "" },
          { role: "space", label: "Қазақша", wide: 5 },
          { role: "search", label: "" },
        ],
      ];
    },
  },
  watch: {
    visible(v) {
      if (!v) {
        this.shiftSticky = false;
        this.capsLock = false;
        this.teardownPhys();
      } else {
        this.setupPhys();
      }
    },
  },
  mounted() {
    if (this.visible) this.setupPhys();
  },
  beforeUnmount() {
    this.teardownPhys();
  },
  beforeDestroy() {
    this.teardownPhys();
  },
  methods: {
    setupPhys() {
      if (this._physHandler) return;
      this._physHandler = (e) => this.onPhysicalKeydown(e);
      window.addEventListener("keydown", this._physHandler, true);
    },
    teardownPhys() {
      if (this._physHandler) {
        window.removeEventListener("keydown", this._physHandler, true);
        this._physHandler = null;
      }
    },
    onPhysicalKeydown(e) {
      if (!this.visible) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.isComposing) return;

      if (e.code === "Escape") {
        e.preventDefault();
        this.onClose();
        return;
      }

      if (e.code === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        this.$emit("backspace");
        return;
      }

      if (e.code === "Delete") {
        e.preventDefault();
        e.stopPropagation();
        this.$emit("delete-forward");
        return;
      }

      if (e.code === "Enter" || e.code === "NumpadEnter") {
        e.preventDefault();
        e.stopPropagation();
        this.$emit("enter");
        this.onClose();
        return;
      }

      if (e.code === "Tab") {
        e.preventDefault();
        e.stopPropagation();
        this.$emit("input-char", "\t");
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        e.stopPropagation();
        this.$emit("input-char", " ");
        return;
      }

      const mapped = physicalKeyToChar(e);
      if (mapped != null) {
        e.preventDefault();
        e.stopPropagation();
        this.$emit("input-char", mapped);
      }
    },
    chars(list) {
      return list.map((c) => ({ role: "char", c }));
    },
    keyFlex(k) {
      if (k.role === "space") {
        const g = k.wide != null ? k.wide : 5;
        return { flex: g + " 1 0%", minWidth: 0 };
      }
      if (k.wide != null) {
        return { flex: k.wide + " 1 0%", minWidth: 0 };
      }
      return { flex: "1 1 0%", minWidth: 0 };
    },
    keyClass(k) {
      return {
        "kbd-key--wide": !!k.wide && k.role !== "space",
        "kbd-key--space": k.role === "space",
        "kbd-key--icon":
          k.role === "case" ||
          k.role === "search" ||
          k.role === "backspace" ||
          k.role === "delete" ||
          k.role === "enter",
        "kbd-key--active": (k.role === "caps" && this.capsLock) || (k.role === "case" && this.upper),
        "kbd-key--active-shift": k.role === "shift" && this.shiftSticky,
      };
    },
    keyLabel(k) {
      if (k.role === "case") {
        return '<span class="kbd-case-label">' + (this.upper ? "Аа" : "аа") + "</span>";
      }
      if (k.role === "search") {
        return lucideToSvg(iconSearch, { size: 22, className: "kbd-lucide" });
      }
      if (k.role === "backspace" || k.role === "delete") {
        return lucideToSvg(iconDelete, { size: 20, className: "kbd-lucide" });
      }
      if (k.role === "enter") {
        return (
          '<span class="kbd-enter-inner">' +
          lucideToSvg(iconCornerDownLeft, { size: 18, className: "kbd-lucide kbd-lucide--inline" }) +
          '<span class="kbd-enter-txt">Enter</span></span>'
        );
      }
      if (k.role === "char") {
        const ch = this.applyCase(k.c);
        return this.escapeHtml(ch);
      }
      return this.escapeHtml(k.label || "");
    },
    escapeHtml(s) {
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    },
    applyCase(ch) {
      if (!this.upper) return ch;
      try {
        return ch.toLocaleUpperCase("kk-KZ");
      } catch (e) {
        return ch.toUpperCase();
      }
    },
    onKey(k) {
      const role = k.role || "char";
      if (role === "char") {
        this.$emit("input-char", this.applyCase(k.c));
        if (this.shiftSticky) this.shiftSticky = false;
        return;
      }
      if (role === "backspace") {
        this.$emit("backspace");
        return;
      }
      if (role === "delete") {
        this.$emit("delete-forward");
        return;
      }
      if (role === "space") {
        this.$emit("input-char", " ");
        if (this.shiftSticky) this.shiftSticky = false;
        return;
      }
      if (role === "tab") {
        this.$emit("input-char", "\t");
        return;
      }
      if (role === "enter" || role === "search") {
        this.$emit("enter");
        this.onClose();
        return;
      }
      if (role === "caps") {
        this.capsLock = !this.capsLock;
        return;
      }
      if (role === "shift") {
        this.shiftSticky = !this.shiftSticky;
        return;
      }
      if (role === "case") {
        this.shiftSticky = false;
        this.capsLock = !this.capsLock;
        return;
      }
    },
    onClose() {
      this.$emit("close");
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped>
.kbd-slide-enter-active,
.kbd-slide-leave-active {
  transition:
    transform 0.22s ease,
    opacity 0.2s ease;
}
.kbd-slide-enter-from,
.kbd-slide-leave-to {
  transform: translateY(12px);
  opacity: 0;
}

.kbd-shell {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10050;
  pointer-events: none;
}

.kbd-shell > .kbd-panel {
  pointer-events: auto;
}

.kbd-panel {
  width: 100%;
  background: #ededed;
  border-radius: 12px 12px 0 0;
  padding: 8px 8px calc(12px + env(safe-area-inset-bottom, 0));
  box-shadow: 0 -6px 28px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  max-height: min(46vh, 420px);
  overflow: hidden;
}

.kbd-panel-inner {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
}

.kbd-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 0 4px;
}

.kbd-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.kbd-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  line-height: 0;
  color: #555;
}

.kbd-close:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #111;
}

:deep(.kbd-lucide) {
  display: block;
}

:deep(.kbd-lucide--inline) {
  display: inline-block;
  vertical-align: middle;
  margin-right: 6px;
}

.kbd-enter-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.kbd-enter-txt {
  font-size: 13px;
  font-weight: 600;
}

.kbd-case-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.kbd-rows--mobile {
  display: block;
}
.kbd-rows--desktop {
  display: none;
}

@media (min-width: 769px) {
  .kbd-rows--mobile {
    display: none;
  }
  .kbd-rows--desktop {
    display: block;
  }

  .kbd-panel {
    max-height: min(40vh, 380px);
  }
}

.kbd-row {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
  width: 100%;
}

.kbd-row:last-child {
  margin-bottom: 0;
}

.kbd-key {
  min-width: 0;
  height: 42px;
  border: none;
  border-radius: 6px;
  background: #fff;
  color: #111;
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    sans-serif;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.kbd-key:active {
  background: #e8e8e8;
  transform: scale(0.98);
}

.kbd-key--wide {
  flex-grow: 1.35;
}

.kbd-key--space {
  flex-grow: 5;
  font-size: 14px;
  font-weight: 600;
}

.kbd-key--icon {
  flex: 1.1;
  max-width: 52px;
}

.kbd-key--active,
.kbd-key--active-shift {
  background: #d0e8ff;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
}

@media (min-width: 769px) {
  .kbd-key {
    height: 44px;
    font-size: 14px;
  }
}
</style>
