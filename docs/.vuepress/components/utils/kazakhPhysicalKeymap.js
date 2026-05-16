/**
 * 标准美式 QWERTY 物理键位（event.code）→ 与界面一致的哈萨克西里尔字符。
 * 首行对应桌面第 1 行；字母区为 йцукенг 布局；若需数字行 Shift 符号，由浏览器原样处理。
 */

export const PHYSICAL_KEYMAP = {
  Backquote: "һ",
  Digit1: "(",
  Digit2: '"',
  Digit3: "ә",
  Digit4: "і",
  Digit5: "ң",
  Digit6: "ғ",
  Digit7: ",",
  Digit8: ".",
  Digit9: "ү",
  Digit0: "ұ",
  Minus: "қ",
  Equal: "ө",
  KeyQ: "й",
  KeyW: "ц",
  KeyE: "у",
  KeyR: "к",
  KeyT: "е",
  KeyY: "н",
  KeyU: "г",
  KeyI: "ш",
  KeyO: "щ",
  KeyP: "з",
  BracketLeft: "х",
  BracketRight: "ъ",
  Backslash: "*",
  KeyA: "ф",
  KeyS: "ы",
  KeyD: "в",
  KeyF: "а",
  KeyG: "п",
  KeyH: "р",
  KeyJ: "о",
  KeyK: "л",
  KeyL: "д",
  Semicolon: "ж",
  Quote: "э",
  KeyZ: "я",
  KeyX: "ч",
  KeyC: "с",
  KeyV: "м",
  KeyB: "и",
  KeyN: "т",
  KeyM: "ь",
  Comma: "б",
  Period: "ю",
  Slash: "-",
};

/**
 * @param {KeyboardEvent} e
 * @returns {string | null}
 */
export function physicalKeyToChar(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return null;
  if (e.isComposing) return null;
  if (e.shiftKey && /^Digit/.test(e.code)) return null;
  if (e.shiftKey && (e.code === "Minus" || e.code === "Equal")) return null;

  const base = PHYSICAL_KEYMAP[e.code];
  if (base == null) return null;

  if (base.length !== 1) return base;

  const lower = base.toLowerCase();
  const upper = base.toUpperCase();
  const actsAsLetter = lower !== upper || /[а-яёәіңғүұқөһ]/i.test(base);

  if (!actsAsLetter) return base;

  const wantUpper = e.getModifierState("CapsLock") !== e.shiftKey;
  try {
    return wantUpper ? base.toLocaleUpperCase("kk-KZ") : base.toLocaleLowerCase("kk-KZ");
  } catch {
    return wantUpper ? base.toUpperCase() : base.toLowerCase();
  }
}
