/**
 * Main Application Controller
 */
(function () {
  /* ---- DOM refs ---- */
  const voiceBtn = document.getElementById("voiceBtn");
  const textInput = document.getElementById("textInput");
  const sendBtn = document.getElementById("sendBtn");
  const statusText = document.getElementById("statusText");
  const responseText = document.getElementById("responseText");
  const orbContainer = document.getElementById("orbContainer");
  const logContainer = document.getElementById("logContainer");
  const clockDisplay = document.getElementById("clockDisplay");
  const dateDisplay = document.getElementById("dateDisplay");

  /* ---- Metric elements ---- */
  const metrics = {
    cpu: { bar: document.getElementById("cpuBar"), val: document.getElementById("cpuValue") },
    mem: { bar: document.getElementById("memBar"), val: document.getElementById("memValue") },
    net: { bar: document.getElementById("netBar"), val: document.getElementById("netValue") },
    pwr: { bar: document.getElementById("pwrBar"), val: document.getElementById("pwrValue") },
  };

  let startTime = Date.now();

  /* ---- Clock & Date ---- */
  function updateClock() {
    const now = new Date();
    clockDisplay.textContent = now.toLocaleTimeString("en-US", { hour12: false });
    dateDisplay.textContent = now.toISOString().split("T")[0];

    // Uptime
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const s = String(elapsed % 60).padStart(2, "0");
    const uptimeEl = document.getElementById("uptimeVal");
    if (uptimeEl) uptimeEl.textContent = `${h}:${m}:${s}`;
  }

  setInterval(updateClock, 1000);
  updateClock();

  /* ---- Simulated Metrics ---- */
  function updateMetrics() {
    Object.keys(metrics).forEach((key) => {
      const target = 30 + Math.random() * 60;
      const el = metrics[key];
      el.bar.style.width = target + "%";
      el.val.textContent = Math.round(target) + "%";
    });

    // Temperature
    const temp = (35 + Math.random() * 5).toFixed(1);
    const tempEl = document.getElementById("tempVal");
    if (tempEl) tempEl.textContent = temp + "°C";
  }

  setInterval(updateMetrics, 3000);

  /* ---- State Management ---- */
  function setState(state) {
    orbContainer.classList.remove("listening", "speaking");
    statusText.classList.remove("listening", "speaking");

    switch (state) {
      case "listening":
        orbContainer.classList.add("listening");
        statusText.classList.add("listening");
        statusText.textContent = "LISTENING...";
        voiceBtn.classList.add("active");
        break;
      case "speaking":
        orbContainer.classList.add("speaking");
        statusText.classList.add("speaking");
        statusText.textContent = "SPEAKING";
        voiceBtn.classList.remove("active");
        break;
      case "processing":
        statusText.textContent = "PROCESSING...";
        voiceBtn.classList.remove("active");
        break;
      default:
        statusText.textContent = "STANDBY";
        voiceBtn.classList.remove("active");
        break;
    }
  }

  /* ---- Log ---- */
  function addLog(type, text) {
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });
    const entry = document.createElement("div");
    entry.className = `log-entry log-entry--${type}`;
    const timeSpan = document.createElement("span");
    timeSpan.className = "log-time";
    timeSpan.textContent = now;
    const textSpan = document.createElement("span");
    textSpan.className = "log-text";
    textSpan.textContent = text;
    entry.appendChild(timeSpan);
    entry.appendChild(textSpan);
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;

    // Keep max 50 entries
    while (logContainer.children.length > 50) {
      logContainer.removeChild(logContainer.firstChild);
    }
  }

  /* ---- Response Display with Typing Effect ---- */
  function displayResponse(text) {
    responseText.textContent = "";
    let i = 0;
    const speed = 30;

    function typeChar() {
      if (i < text.length) {
        responseText.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, speed);
      }
    }
    typeChar();
  }

  /* ---- Handle User Input ---- */
  function handleInput(text) {
    if (!text.trim()) return;

    addLog("user", text);
    const response = CommandProcessor.process(text);
    addLog("jarvis", response);
    displayResponse(response);
    VoiceSystem.speak(response);
  }

  /* ---- Voice System Init ---- */
  VoiceSystem.init({
    onResult: function (transcript) {
      textInput.value = transcript;
      handleInput(transcript);
    },
    onStateChange: setState,
  });

  /* ---- Event Listeners ---- */
  voiceBtn.addEventListener("click", function () {
    if (VoiceSystem.listening) {
      VoiceSystem.stopListening();
    } else {
      VoiceSystem.startListening();
    }
  });

  sendBtn.addEventListener("click", function () {
    const text = textInput.value.trim();
    if (text) {
      handleInput(text);
      textInput.value = "";
    }
  });

  textInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const text = textInput.value.trim();
      if (text) {
        handleInput(text);
        textInput.value = "";
      }
    }
  });

  // Space bar to toggle voice (only when input not focused)
  document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && document.activeElement !== textInput) {
      e.preventDefault();
      if (VoiceSystem.listening) {
        VoiceSystem.stopListening();
      } else {
        VoiceSystem.startListening();
      }
    }
  });

  /* ---- Boot Sequence ---- */
  function bootSequence() {
    const messages = [
      { delay: 500, text: "Initializing core systems..." },
      { delay: 1200, text: "Loading neural pathways..." },
      { delay: 1800, text: "Calibrating voice interface..." },
      { delay: 2400, text: "All systems operational. Welcome." },
    ];

    messages.forEach(({ delay, text }) => {
      setTimeout(() => {
        addLog("system", text);
        if (text.includes("Welcome")) {
          VoiceSystem.speak("All systems online. Welcome. I am Jarvis, at your service.");
        }
      }, delay);
    });
  }

  bootSequence();
})();
