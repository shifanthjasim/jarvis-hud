/**
 * Voice System — Web Speech API (recognition + synthesis)
 * 100% free, no API keys needed. Works in Chrome.
 */
const VoiceSystem = (function () {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let synth = window.speechSynthesis;
  let isListening = false;
  let onResult = null;
  let onStateChange = null;
  let preferredVoice = null;

  function init(callbacks) {
    onResult = callbacks.onResult || function () {};
    onStateChange = callbacks.onStateChange || function () {};

    // Setup recognition
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        isListening = false;
        onStateChange("processing");
        onResult(transcript);
      };

      recognition.onerror = function (event) {
        console.warn("Speech recognition error:", event.error);
        isListening = false;
        onStateChange("idle");
      };

      recognition.onend = function () {
        isListening = false;
        onStateChange("idle");
      };
    }

    // Find a good female voice for S.H.I.F.A.
    function loadVoices() {
      const voices = synth.getVoices();
      if (voices.length === 0) return;

      // Priority: Google UK English Female > any UK Female > any English Female > default
      const priorities = [
        (v) => v.name.includes("Google UK English Female"),
        (v) => v.name.includes("Google US English") && v.name.toLowerCase().includes("female"),
        (v) => v.name.includes("Samantha") && v.lang.startsWith("en"),
        (v) => v.name.includes("Karen") && v.lang.startsWith("en"),
        (v) => v.name.includes("Fiona") && v.lang.startsWith("en"),
        (v) => v.lang === "en-GB" && v.name.toLowerCase().includes("female"),
        (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"),
        (v) => v.lang === "en-GB",
        (v) => v.lang.startsWith("en"),
      ];

      for (const test of priorities) {
        const match = voices.find(test);
        if (match) {
          preferredVoice = match;
          break;
        }
      }

      if (!preferredVoice && voices.length > 0) {
        preferredVoice = voices.find(v => v.lang.startsWith("en")) || voices[0];
      }
    }

    synth.onvoiceschanged = loadVoices;
    loadVoices();
  }

  function startListening() {
    if (!recognition) {
      console.warn("Speech recognition not supported in this browser.");
      return false;
    }
    if (isListening) return false;

    // Cancel any ongoing speech
    synth.cancel();

    try {
      recognition.start();
      isListening = true;
      onStateChange("listening");
      return true;
    } catch (e) {
      console.warn("Could not start recognition:", e);
      return false;
    }
  }

  function stopListening() {
    if (recognition && isListening) {
      recognition.stop();
      isListening = false;
      onStateChange("idle");
    }
  }

  function speak(text, callback) {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    onStateChange("speaking");

    utterance.onend = function () {
      onStateChange("idle");
      if (callback) callback();
    };

    utterance.onerror = function () {
      onStateChange("idle");
      if (callback) callback();
    };

    synth.speak(utterance);
  }

  function isSupported() {
    return !!SpeechRecognition;
  }

  return {
    init,
    startListening,
    stopListening,
    speak,
    isSupported,
    get listening() { return isListening; },
  };
})();
