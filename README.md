# S.H.I.F.A. — HUD Interface

**Smart Holographic Interface For Assistance**

A fully animated Iron Man–inspired HUD with female voice interaction. Built by **Shifanth Jasim** with pure HTML, CSS, JavaScript, and Canvas — no frameworks, no API keys, 100% free.

## Features

- **Animated HUD** — Rotating arcs, radar sweep with blips, particle field, hexagonal grid, crosshairs, dashed reference circles
- **Central Orb** — 3D rotating rings with pulsing core, changes color based on state (idle/listening/speaking)
- **Voice Input** — Speak commands via your microphone (Web Speech API)
- **Voice Output** — S.H.I.F.A. responds with a synthesized female voice
- **System Panels** — Simulated CPU, memory, network, power metrics with animated bars
- **Voice Log** — Scrolling log of all commands and responses
- **Typing Effect** — Responses appear with a character-by-character animation
- **Boot Sequence** — Cinematic startup with system initialization messages
- **Scanline Effect** — Subtle CRT-style scanline overlay
- **Keyboard Controls** — Press SPACE to toggle voice, ENTER to send typed commands

## Commands

| Command | Example |
|---------|---------|
| **Greetings** | "Hello", "Hey Shifa", "Good morning" |
| **Time** | "What time is it?", "Current time" |
| **Date** | "What's the date?", "What day is it?" |
| **Jokes** | "Tell me a joke", "Make me laugh" |
| **Facts** | "Tell me a fact", "Fun fact" |
| **Math** | "Calculate 25 * 4", "What's 100 / 3?" |
| **Compliments** | "Say something nice", "Compliment me" |
| **Status** | "System status", "How are you?" |
| **Identity** | "What's your name?", "Who built you?" |
| **Goodbye** | "Goodbye", "See you later" |

## Quick Start

No installation needed — just open `index.html` in Chrome!

```bash
git clone https://github.com/shifanthjasim/jarvis-hud.git
cd jarvis-hud
```

Then open `index.html` in Chrome (double-click it, or drag it into a browser window).

> **Note:** Voice features require Chrome (Web Speech API). Other browsers may not support speech recognition.

## Tech Stack

- HTML5 Canvas (particles, HUD elements, radar)
- CSS3 Animations (rotating orb rings, scanline, pulse effects)
- Vanilla JavaScript (voice, commands, state management)
- Google Fonts (Orbitron, Rajdhani)
- Web Speech API (speech recognition + synthesis)

## Project Structure

```
jarvis-hud/
├── index.html          # Main page
├── css/
│   └── style.css       # All styles and animations
├── js/
│   ├── particles.js    # Background particle network
│   ├── hud-canvas.js   # HUD canvas (arcs, radar, grid, ticks)
│   ├── voice.js        # Web Speech API wrapper (female voice)
│   ├── commands.js     # Command processor
│   └── app.js          # Main controller
└── README.md
```

## Created By

**Shifanth Jasim**

## License

MIT
