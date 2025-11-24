# 🎨 Character Counter - Visual Examples

## 📊 Main Counter States

### State 1: Starting (Empty)
```
┌─────────────────────────────────────────────┐
│ Topic (required)                      [🪄 AI]│
├─────────────────────────────────────────────┤
│                                             │
│  [Type your content here...]                │
│                                             │
└─────────────────────────────────────────────┘
```
*Counter hidden until typing starts*

---

### State 2: Safe Zone (0-79%) 🟢
```
┌─────────────────────────────────────────────┐
│ Topic (required)                      [🪄 AI]│
├─────────────────────────────────────────────┤
│ Check out this amazing AI tool! 🚀          │
│ #AI #Tech                                   │
└─────────────────────────────────────────────┘

✓ 45 / 280                        [▼ Show all]
   235 characters left
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░ 16.1%
```

---

### State 3: Warning Zone (80-89%) 🟡
```
┌─────────────────────────────────────────────┐
│ Lorem ipsum dolor sit amet, consectetur     │
│ adipiscing elit, sed do eiusmod tempor      │
│ incididunt ut labore et dolore magna aliqua.│
│ Ut enim ad minim veniam, quis nostrud       │
│ exercitation ullamco laboris nisi ut        │
│ aliquip ex ea commodo consequat. Duis aute  │
└─────────────────────────────────────────────┘

⚡ 240 / 280                       [▲ Hide]
   40 characters left
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░ 85.7%

⚠️ Approaching character limit
```

---

### State 4: Danger Zone (90-99%) 🟠
```
┌─────────────────────────────────────────────┐
│ Lorem ipsum dolor sit amet, consectetur     │
│ adipiscing elit, sed do eiusmod tempor      │
│ incididunt ut labore et dolore magna aliqua.│
│ Ut enim ad minim veniam, quis nostrud       │
│ exercitation ullamco laboris nisi ut        │
│ aliquip ex ea commodo consequat. Duis aute  │
│ irure dolor in reprehenderit in voluptate   │
│ velit.                                      │
└─────────────────────────────────────────────┘

⚠️ 270 / 280                      [▼ Show all]
   10 characters left
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░ 96.4%

⚠️ Approaching character limit
```

---

### State 5: Over Limit (100%+) 🔴 (Pulsing!)
```
┌─────────────────────────────────────────────┐
│ Lorem ipsum dolor sit amet, consectetur     │
│ adipiscing elit, sed do eiusmod tempor      │
│ incididunt ut labore et dolore magna aliqua.│
│ Ut enim ad minim veniam, quis nostrud       │
│ exercitation ullamco laboris nisi ut        │
│ aliquip ex ea commodo consequat. Duis aute  │
│ irure dolor in reprehenderit in voluptate   │
│ velit esse cillum dolore eu fugiat nulla    │
│ pariatur.                                   │
└─────────────────────────────────────────────┘

❌ 300 / 280                      [▼ Show all]
   20 characters over
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 107.1%
💥 PULSE ANIMATION 💥

❌ Post exceeds character limit for X (Twitter)
```

---

## 📱 Multi-Platform View

When you click **"▼ Show all"**:

```
┌────────────────────────────────────────────────────────────┐
│ ✓ 150 / 280                                  [▲ Hide]      │
│    130 characters left                                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░ 53.6%     │
└────────────────────────────────────────────────────────────┘

┌─ 📊 Character limits for all platforms: ──────────────────┐
│                                                            │
│  ┌──────────────────────────┐  ┌──────────────────────┐  │
│  │ 𝕏 X (Twitter)        [✓] │  │ 💼 LinkedIn      [✓] │  │
│  │         ┏━━━━━━━━━━━━━┓  │  │    ┏━━━━━━━━━━━━━┓   │  │
│  │         ┃ SELECTED    ┃  │  │    ┃ 150 / 3000   ┃   │  │
│  │         ┗━━━━━━━━━━━━━┛  │  │    ┗━━━━━━━━━━━━━┛   │  │
│  │       150 / 280      ✓   │  │                      │  │
│  └──────────────────────────┘  └──────────────────────┘  │
│                                                            │
│  ┌──────────────────────────┐  ┌──────────────────────┐  │
│  │ 📸 Instagram         [✓] │  │ 👥 Facebook      [✓] │  │
│  │       150 / 2200         │  │     150 / 63206      │  │
│  └──────────────────────────┘  └──────────────────────┘  │
│                                                            │
│  ┌──────────────────────────┐  ┌──────────────────────┐  │
│  │ 🎵 TikTok            [✓] │  │ ▶️ YouTube       [✓] │  │
│  │       150 / 2200         │  │     150 / 5000       │  │
│  └──────────────────────────┘  └──────────────────────┘  │
│                                                            │
│  ┌─ 💡 Tip: ───────────────────────────────────────────┐  │
│  │ Perfect length for X (Twitter)!                     │  │
│  └─────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 🎯 Floating Badge (Bottom Right)

### When typing 50+ characters:

```
                                              Browser Window
┌────────────────────────────────────────────────────────────┐
│ Header...                                                  │
│                                                            │
│ [Generator Form]                                           │
│                                                            │
│ Topic field...                                             │
│                                                            │
│ Platform: X (Twitter)                                      │
│                                                            │
│ [Long form content...]                                     │
│                                                            │
│ ...                                                        │
│                                                            │
│                                              ┌───────────┐ │
│                                              │  ✓  230   │ │
│                                              │  50/280   │ │
│                                              └───────────┘ │
└────────────────────────────────────────────────────────────┘
                                                  ↑
                                         Floating Badge
                                      (Always visible!)
```

### Badge Color States:

#### 🟢 Green (Safe)
```
┌───────────┐
│  ✓  200   │ ← Remaining chars
│  80/280   │ ← Current / Limit
└───────────┘
```

#### 🟡 Yellow (Warning)
```
┌───────────┐
│  ⚡  50   │
│ 230/280   │
└───────────┘
```

#### 🟠 Orange (Danger)
```
┌───────────┐
│  ⚠️  10   │
│ 270/280   │
└───────────┘
```

#### 🔴 Red + Pulsing (Over!)
```
┌───────────┐
│  ❌ +20   │ ← 20 chars over!
│ 300/280   │
└───────────┘
💥 PULSE! 💥
```

---

## 💻 Dark Mode

### Light Mode:
```
┌─────────────────────────────────────────────┐
│ ✓ 150 / 280               [▼ Show all]      │
│    130 characters left                      │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 53.6%      │
│    ↑ Green bar on white background          │
└─────────────────────────────────────────────┘
```

### Dark Mode:
```
╔═════════════════════════════════════════════╗
║ ✓ 150 / 280               [▼ Show all]      ║
║    130 characters left                      ║
║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 53.6%      ║
║    ↑ Green bar on dark slate background     ║
╚═════════════════════════════════════════════╝
```

---

## 📱 Mobile View

### Desktop (2 columns):
```
┌────────────────────────────────────────┐
│  📊 Character limits for all platforms │
│                                        │
│  [X Twitter]    [LinkedIn]             │
│  [Instagram]    [Facebook]             │
│  [TikTok]       [YouTube]              │
└────────────────────────────────────────┘
```

### Mobile (1 column):
```
┌────────────────────────────────┐
│ 📊 Character limits for all... │
│                                │
│  [X Twitter]                   │
│  [LinkedIn]                    │
│  [Instagram]                   │
│  [Facebook]                    │
│  [TikTok]                      │
│  [YouTube]                     │
└────────────────────────────────┘
```

---

## 🎬 Animation Flow

### Type Flow:
```
1. Empty field
   ↓
2. Start typing
   ↓ (fade in - 300ms)
3. Counter appears (green)
   ↓ (real-time)
4. Progress bar fills
   ↓ (at 80%)
5. Color → Yellow
   ↓ (at 90%)
6. Color → Orange + Warning
   ↓ (at 100%)
7. Color → Red + Error + Pulse!
```

### Platform Switch:
```
1. Select "LinkedIn" from dropdown
   ↓ (instant - 0ms)
2. Counter recalculates
   ↓ (smooth transition - 300ms)
3. Bar adjusts width
   ↓ (color transition - 200ms)
4. Color updates if needed
```

---

## 🔍 Hover Effects

### Main Counter:
- No hover effect (static display)

### "Show all" Button:
```
Default:  [▼ Show all]
Hover:    [▼ Show all] ← Lighter blue, bg appears
```

### Floating Badge:
```
Default:  ┌───────┐
          │ ✓ 200 │
          └───────┘

Hover:    ┌───────────────────────┐
          │ ✓ 200                 │ ← Scales to 105%
          └───────────────────────┘
               ↓
          ┌───────────────────────────┐
          │ 200 characters remaining  │ ← Tooltip appears
          └───────────────────────────┘
```

---

## ⌨️ Keyboard Interaction

### Typing:
```
User types: "H"
→ Counter: ✓ 1 / 280 (279 left)

User types: "e"
→ Counter: ✓ 2 / 280 (278 left)

...instant updates per keystroke
```

### Backspace/Delete:
```
User deletes 10 chars
→ Counter decreases: 150 → 140
→ Bar shrinks: 53.6% → 50%
→ Color might change: Orange → Yellow
```

---

## 💡 Smart Tips Examples

### < 280 chars:
```
💡 Tip: Perfect length for X (Twitter)!
```

### 280-2200 chars:
```
💡 Tip: Great for Instagram, TikTok, and YouTube!
```

### 2200+ chars:
```
💡 Tip: Best for LinkedIn and Facebook!
```

---

**Ready to test? Open:** `http://localhost:3002` → Generator → Start typing! 🚀
