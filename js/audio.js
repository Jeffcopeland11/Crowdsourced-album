// === Audio Module: ElevenLabs TTS + Frequency Music Engine ===

(function () {
  "use strict";

  // ─── Frequency name map ───
  var FREQ_NAMES = {
    "174": "Foundation & Pain Relief",
    "285": "Healing & Cellular Repair",
    "396": "Liberation from Guilt & Fear",
    "417": "Cleansing Trauma & Change",
    "432": "Universal Harmony",
    "528": "Transformation & Miracles",
    "639": "Harmonizing Relationships",
    "741": "Spiritual Awakening & Intuition",
    "852": "Returning to Spiritual Order",
    "963": "Divine Consciousness & Oneness"
  };

  // ─── State ───
  var state = {
    voices: [],
    voicesLoaded: false,
    ttsAudio: null,         // HTMLAudioElement for TTS
    ttsBlob: null,          // Blob for download
    ttsSpeed: 1.0,
    ttsPlaying: false,

    freqContext: null,       // AudioContext
    freqOscillators: [],     // Active oscillator nodes
    freqGain: null,          // GainNode
    freqPlaying: false,
    freqSpeed: 1.0,          // Pitch multiplier
    freqBaseHz: 528,
    freqTexture: "warm",
    freqVolume: 0.4,

    activeSource: null       // "tts" | "freq" | null
  };

  // ─── Initialization ───
  function init() {
    initSettingsToggles();
    initSliderLabels();
    initCollapsibleAudioSettings();
    initVoicePreview();
    initTTSPlayer();
    initFreqPlayer();
    loadVoices();

    // Hook into the prayer display - expose a function globally
    window.DeliveranceAudio = {
      onPrayerGenerated: onPrayerGenerated
    };
  }

  // ─── Settings Toggles ───
  function initSettingsToggles() {
    var ttsCheckbox = document.getElementById("tts-enabled");
    var freqCheckbox = document.getElementById("freq-enabled");
    var ttsOptions = document.getElementById("tts-options");
    var freqOptions = document.getElementById("freq-options");

    if (ttsCheckbox) {
      ttsCheckbox.addEventListener("change", function () {
        ttsOptions.hidden = !ttsCheckbox.checked;
        if (ttsCheckbox.checked && !state.voicesLoaded) {
          loadVoices();
        }
      });
    }

    if (freqCheckbox) {
      freqCheckbox.addEventListener("change", function () {
        freqOptions.hidden = !freqCheckbox.checked;
      });
    }
  }

  // ─── Slider Labels ───
  function initSliderLabels() {
    bindSlider("voice-stability", "stability-value", function (v) { return parseFloat(v).toFixed(2); });
    bindSlider("voice-similarity", "similarity-value", function (v) { return parseFloat(v).toFixed(2); });
    bindSlider("freq-volume", "freq-volume-value", function (v) { return v + "%"; });
  }

  function bindSlider(sliderId, labelId, format) {
    var slider = document.getElementById(sliderId);
    var label = document.getElementById(labelId);
    if (slider && label) {
      slider.addEventListener("input", function () {
        label.textContent = format(slider.value);
      });
    }
  }

  // ─── Collapsible for audio settings ───
  function initCollapsibleAudioSettings() {
    var section = document.getElementById("audio-settings-section");
    if (!section) return;
    var toggle = section.querySelector(".collapsible-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        var content = toggle.nextElementSibling;
        content.hidden = expanded;
      });
    }
  }

  // ─── Load Voices from API ───
  function loadVoices() {
    var select = document.getElementById("voice-select");
    if (!select) return;

    select.innerHTML = '<option value="">-- Loading voices... --</option>';

    fetch("/api/voices")
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        state.voices = data.voices || [];
        state.voicesLoaded = true;

        select.innerHTML = '<option value="">-- Select a Voice --</option>';

        // Group by category
        var premade = [];
        var cloned = [];
        state.voices.forEach(function (v) {
          if (v.category === "cloned") {
            cloned.push(v);
          } else {
            premade.push(v);
          }
        });

        if (premade.length > 0) {
          var optgroup = document.createElement("optgroup");
          optgroup.label = "Pre-made Voices";
          premade.forEach(function (v) {
            var opt = document.createElement("option");
            opt.value = v.voice_id;
            var desc = v.name;
            if (v.labels && v.labels.accent) desc += " (" + v.labels.accent + ")";
            if (v.labels && v.labels.gender) desc += " - " + v.labels.gender;
            opt.textContent = desc;
            optgroup.appendChild(opt);
          });
          select.appendChild(optgroup);
        }

        if (cloned.length > 0) {
          var optgroup2 = document.createElement("optgroup");
          optgroup2.label = "Your Cloned Voices";
          cloned.forEach(function (v) {
            var opt = document.createElement("option");
            opt.value = v.voice_id;
            opt.textContent = v.name;
            optgroup2.appendChild(opt);
          });
          select.appendChild(optgroup2);
        }

        // Enable preview button
        var previewBtn = document.getElementById("voice-preview-btn");
        if (previewBtn) previewBtn.disabled = false;
      })
      .catch(function (err) {
        console.error("Failed to load voices:", err);
        select.innerHTML = '<option value="">-- Failed to load voices --</option>';
      });
  }

  // ─── Voice Preview ───
  function initVoicePreview() {
    var previewBtn = document.getElementById("voice-preview-btn");
    var previewAudio = document.getElementById("voice-preview-audio");
    if (!previewBtn || !previewAudio) return;

    previewBtn.addEventListener("click", function () {
      var voiceId = document.getElementById("voice-select").value;
      if (!voiceId) {
        alert("Please select a voice first.");
        return;
      }

      // Find voice and play preview URL
      var voice = state.voices.find(function (v) { return v.voice_id === voiceId; });
      if (voice && voice.preview_url) {
        stopAll();
        previewAudio.src = voice.preview_url;
        previewAudio.play();
        previewBtn.textContent = "Playing...";
        previewAudio.addEventListener("ended", function () {
          previewBtn.textContent = "Play Sample";
        }, { once: true });
      } else {
        alert("No preview available for this voice.");
      }
    });
  }

  // ─── TTS Player Controls ───
  function initTTSPlayer() {
    var playBtn = document.getElementById("tts-play-btn");
    var pauseBtn = document.getElementById("tts-pause-btn");
    var speedUpBtn = document.getElementById("tts-speed-up");
    var speedDownBtn = document.getElementById("tts-speed-down");
    var saveBtn = document.getElementById("tts-save-btn");
    var progressSlider = document.getElementById("tts-progress");

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        if (state.ttsAudio && state.ttsAudio.src) {
          stopFreq();
          state.ttsAudio.play();
          state.ttsPlaying = true;
          state.activeSource = "tts";
          playBtn.hidden = true;
          pauseBtn.hidden = false;
        }
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        if (state.ttsAudio) {
          state.ttsAudio.pause();
          state.ttsPlaying = false;
          playBtn.hidden = false;
          pauseBtn.hidden = true;
        }
      });
    }

    if (speedUpBtn) {
      speedUpBtn.addEventListener("click", function () {
        state.ttsSpeed = Math.min(state.ttsSpeed + 0.25, 3.0);
        if (state.ttsAudio) state.ttsAudio.playbackRate = state.ttsSpeed;
        updateTTSSpeedLabel();
      });
    }

    if (speedDownBtn) {
      speedDownBtn.addEventListener("click", function () {
        state.ttsSpeed = Math.max(state.ttsSpeed - 0.25, 0.25);
        if (state.ttsAudio) state.ttsAudio.playbackRate = state.ttsSpeed;
        updateTTSSpeedLabel();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        if (state.ttsBlob) {
          var url = URL.createObjectURL(state.ttsBlob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "deliverance-prayer-audio.mp3";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
    }

    if (progressSlider) {
      progressSlider.addEventListener("input", function () {
        if (state.ttsAudio && state.ttsAudio.duration) {
          state.ttsAudio.currentTime = (progressSlider.value / 100) * state.ttsAudio.duration;
        }
      });
    }
  }

  function updateTTSSpeedLabel() {
    var label = document.getElementById("tts-speed-label");
    if (label) label.textContent = state.ttsSpeed.toFixed(1) + "x";
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  // ─── Frequency Music Player Controls ───
  function initFreqPlayer() {
    var playBtn = document.getElementById("freq-play-btn");
    var pauseBtn = document.getElementById("freq-pause-btn");
    var speedUpBtn = document.getElementById("freq-speed-up");
    var speedDownBtn = document.getElementById("freq-speed-down");
    var volumeSlider = document.getElementById("freq-player-volume");

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        stopTTS();
        startFreq();
        state.freqPlaying = true;
        state.activeSource = "freq";
        playBtn.hidden = true;
        pauseBtn.hidden = false;
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        stopFreq();
        playBtn.hidden = false;
        pauseBtn.hidden = true;
      });
    }

    if (speedUpBtn) {
      speedUpBtn.addEventListener("click", function () {
        state.freqSpeed = Math.min(state.freqSpeed + 0.1, 2.0);
        updateFreqSpeedLabel();
        if (state.freqPlaying) {
          restartFreq();
        }
      });
    }

    if (speedDownBtn) {
      speedDownBtn.addEventListener("click", function () {
        state.freqSpeed = Math.max(state.freqSpeed - 0.1, 0.5);
        updateFreqSpeedLabel();
        if (state.freqPlaying) {
          restartFreq();
        }
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener("input", function () {
        state.freqVolume = parseInt(volumeSlider.value, 10) / 100;
        if (state.freqGain) {
          state.freqGain.gain.setValueAtTime(state.freqVolume, state.freqContext.currentTime);
        }
      });
    }
  }

  function updateFreqSpeedLabel() {
    var label = document.getElementById("freq-speed-label");
    if (label) label.textContent = state.freqSpeed.toFixed(1) + "x";
  }

  // ─── Frequency Music Engine (Web Audio API) ───
  function getFreqSettings() {
    var freqSelect = document.getElementById("frequency-select");
    var textureSelect = document.getElementById("freq-texture");
    var volumeSlider = document.getElementById("freq-player-volume") || document.getElementById("freq-volume");

    return {
      hz: freqSelect ? parseInt(freqSelect.value, 10) : 528,
      texture: textureSelect ? textureSelect.value : "warm",
      volume: volumeSlider ? parseInt(volumeSlider.value, 10) / 100 : 0.4
    };
  }

  function startFreq() {
    var settings = getFreqSettings();
    state.freqBaseHz = settings.hz;
    state.freqTexture = settings.texture;
    state.freqVolume = settings.volume;

    if (!state.freqContext) {
      state.freqContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Resume context if suspended (browser autoplay policy)
    if (state.freqContext.state === "suspended") {
      state.freqContext.resume();
    }

    // Create gain node
    state.freqGain = state.freqContext.createGain();
    state.freqGain.gain.setValueAtTime(0, state.freqContext.currentTime);
    state.freqGain.gain.linearRampToValueAtTime(state.freqVolume, state.freqContext.currentTime + 1.5);
    state.freqGain.connect(state.freqContext.destination);

    var hz = state.freqBaseHz * state.freqSpeed;
    state.freqOscillators = [];

    if (state.freqTexture === "pure") {
      // Single sine wave
      createOsc("sine", hz, 1.0);
    } else if (state.freqTexture === "warm") {
      // Layered: fundamental + soft harmonics + sub
      createOsc("sine", hz, 0.6);
      createOsc("sine", hz * 2, 0.15);          // octave harmonic
      createOsc("sine", hz * 1.5, 0.08);         // fifth harmonic
      createOsc("sine", hz * 0.5, 0.25);         // sub-octave
      createOsc("triangle", hz * 3, 0.04);       // gentle high harmonic
    } else if (state.freqTexture === "binaural") {
      // Binaural: slightly different freq in each ear
      createBinaural(hz, 6); // 6 Hz theta difference
    }

    // Update display
    var hzDisplay = document.getElementById("freq-display-hz");
    var nameDisplay = document.getElementById("freq-display-name");
    if (hzDisplay) hzDisplay.textContent = state.freqBaseHz + " Hz";
    if (nameDisplay) nameDisplay.textContent = FREQ_NAMES[String(state.freqBaseHz)] || "";
  }

  function createOsc(type, freq, gain) {
    var osc = state.freqContext.createOscillator();
    var oscGain = state.freqContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, state.freqContext.currentTime);
    oscGain.gain.setValueAtTime(gain, state.freqContext.currentTime);
    osc.connect(oscGain);
    oscGain.connect(state.freqGain);
    osc.start();
    state.freqOscillators.push({ osc: osc, gain: oscGain });
  }

  function createBinaural(baseHz, diffHz) {
    // Left channel: base frequency
    // Right channel: base + diff frequency
    var merger = state.freqContext.createChannelMerger(2);
    merger.connect(state.freqGain);

    var leftOsc = state.freqContext.createOscillator();
    var leftGain = state.freqContext.createGain();
    leftOsc.type = "sine";
    leftOsc.frequency.setValueAtTime(baseHz, state.freqContext.currentTime);
    leftGain.gain.setValueAtTime(0.7, state.freqContext.currentTime);
    leftOsc.connect(leftGain);
    leftGain.connect(merger, 0, 0);
    leftOsc.start();

    var rightOsc = state.freqContext.createOscillator();
    var rightGain = state.freqContext.createGain();
    rightOsc.type = "sine";
    rightOsc.frequency.setValueAtTime(baseHz + diffHz, state.freqContext.currentTime);
    rightGain.gain.setValueAtTime(0.7, state.freqContext.currentTime);
    rightOsc.connect(rightGain);
    rightGain.connect(merger, 0, 1);
    rightOsc.start();

    // Add a soft sub layer
    var subOsc = state.freqContext.createOscillator();
    var subGain = state.freqContext.createGain();
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(baseHz * 0.5, state.freqContext.currentTime);
    subGain.gain.setValueAtTime(0.15, state.freqContext.currentTime);
    subOsc.connect(subGain);
    subGain.connect(state.freqGain);
    subOsc.start();

    state.freqOscillators.push(
      { osc: leftOsc, gain: leftGain },
      { osc: rightOsc, gain: rightGain },
      { osc: subOsc, gain: subGain }
    );
  }

  function stopFreq() {
    state.freqPlaying = false;
    if (state.freqGain) {
      try {
        state.freqGain.gain.linearRampToValueAtTime(0, state.freqContext.currentTime + 0.5);
      } catch (e) { /* ignore */ }
    }
    setTimeout(function () {
      state.freqOscillators.forEach(function (item) {
        try { item.osc.stop(); } catch (e) { /* already stopped */ }
      });
      state.freqOscillators = [];
    }, 600);

    if (state.activeSource === "freq") state.activeSource = null;
  }

  function restartFreq() {
    var wasPlaying = state.freqPlaying;
    // Quick stop without fade
    state.freqOscillators.forEach(function (item) {
      try { item.osc.stop(); } catch (e) { /* already stopped */ }
    });
    state.freqOscillators = [];
    if (wasPlaying) {
      startFreq();
    }
  }

  // ─── TTS Audio Management ───
  function stopTTS() {
    if (state.ttsAudio) {
      state.ttsAudio.pause();
      state.ttsPlaying = false;
      var playBtn = document.getElementById("tts-play-btn");
      var pauseBtn = document.getElementById("tts-pause-btn");
      if (playBtn) playBtn.hidden = false;
      if (pauseBtn) pauseBtn.hidden = true;
    }
    if (state.activeSource === "tts") state.activeSource = null;
  }

  // ─── Stop All Audio ───
  function stopAll() {
    stopTTS();
    stopFreq();
    // Stop preview too
    var preview = document.getElementById("voice-preview-audio");
    if (preview) {
      preview.pause();
      preview.currentTime = 0;
    }
  }

  // ─── Generate TTS Audio ───
  function generateTTS(prayerText) {
    var voiceId = document.getElementById("voice-select").value;
    var model = document.getElementById("tts-model").value;
    var stability = parseFloat(document.getElementById("voice-stability").value);
    var similarity = parseFloat(document.getElementById("voice-similarity").value);

    if (!voiceId) {
      setTTSStatus("Please select a voice in Audio Settings.");
      return;
    }

    setTTSStatus("Generating voice narration... This may take a moment.");
    showTTSPlayer();

    // Disable play button during generation
    var playBtn = document.getElementById("tts-play-btn");
    if (playBtn) playBtn.disabled = true;

    fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: prayerText,
        voice_id: voiceId,
        model_id: model,
        stability: stability,
        similarity_boost: similarity
      })
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (err) {
            throw new Error(err.error || "TTS generation failed");
          });
        }
        return res.blob();
      })
      .then(function (blob) {
        state.ttsBlob = blob;
        var url = URL.createObjectURL(blob);

        // Create or reset audio element
        if (state.ttsAudio) {
          state.ttsAudio.pause();
          URL.revokeObjectURL(state.ttsAudio.src);
        }
        state.ttsAudio = new Audio(url);
        state.ttsAudio.playbackRate = state.ttsSpeed;

        // Set up progress tracking
        state.ttsAudio.addEventListener("loadedmetadata", function () {
          var durEl = document.getElementById("tts-duration");
          if (durEl) durEl.textContent = formatTime(state.ttsAudio.duration);
        });

        state.ttsAudio.addEventListener("timeupdate", function () {
          var progress = document.getElementById("tts-progress");
          var curEl = document.getElementById("tts-current-time");
          if (progress && state.ttsAudio.duration) {
            progress.value = (state.ttsAudio.currentTime / state.ttsAudio.duration) * 100;
          }
          if (curEl) curEl.textContent = formatTime(state.ttsAudio.currentTime);
        });

        state.ttsAudio.addEventListener("ended", function () {
          state.ttsPlaying = false;
          state.activeSource = null;
          var playBtnEl = document.getElementById("tts-play-btn");
          var pauseBtnEl = document.getElementById("tts-pause-btn");
          if (playBtnEl) playBtnEl.hidden = false;
          if (pauseBtnEl) pauseBtnEl.hidden = true;
        });

        if (playBtn) playBtn.disabled = false;
        setTTSStatus("Voice narration ready. Press play to listen.");
      })
      .catch(function (err) {
        console.error("TTS error:", err);
        setTTSStatus("Failed to generate audio: " + err.message);
        if (playBtn) playBtn.disabled = false;
      });
  }

  function setTTSStatus(msg) {
    var el = document.getElementById("tts-status");
    if (el) el.textContent = msg;
  }

  function showTTSPlayer() {
    var playerSection = document.getElementById("audio-player-section");
    var ttsPlayer = document.getElementById("tts-player");
    if (playerSection) playerSection.hidden = false;
    if (ttsPlayer) ttsPlayer.hidden = false;
  }

  function showFreqPlayer() {
    var playerSection = document.getElementById("audio-player-section");
    var freqPlayer = document.getElementById("freq-player");
    if (playerSection) playerSection.hidden = false;
    if (freqPlayer) freqPlayer.hidden = false;
  }

  // ─── Called When Prayer is Generated ───
  function onPrayerGenerated() {
    stopAll();

    var ttsEnabled = document.getElementById("tts-enabled");
    var freqEnabled = document.getElementById("freq-enabled");

    // Reset player UI
    var playerSection = document.getElementById("audio-player-section");
    var ttsPlayer = document.getElementById("tts-player");
    var freqPlayer = document.getElementById("freq-player");
    if (playerSection) playerSection.hidden = true;
    if (ttsPlayer) ttsPlayer.hidden = true;
    if (freqPlayer) freqPlayer.hidden = true;

    // Reset TTS UI
    var ttsPlayBtn = document.getElementById("tts-play-btn");
    var ttsPauseBtn = document.getElementById("tts-pause-btn");
    if (ttsPlayBtn) ttsPlayBtn.hidden = false;
    if (ttsPauseBtn) ttsPauseBtn.hidden = true;
    setTTSStatus("");

    // Reset freq UI
    var freqPlayBtn = document.getElementById("freq-play-btn");
    var freqPauseBtn = document.getElementById("freq-pause-btn");
    if (freqPlayBtn) freqPlayBtn.hidden = false;
    if (freqPauseBtn) freqPauseBtn.hidden = true;

    // Show TTS player and start generation if enabled
    if (ttsEnabled && ttsEnabled.checked) {
      var prayerText = document.getElementById("prayer-text").innerText;
      generateTTS(prayerText);
    }

    // Show freq player if enabled
    if (freqEnabled && freqEnabled.checked) {
      showFreqPlayer();
      // Update display with selected frequency
      var freqSelect = document.getElementById("frequency-select");
      var hz = freqSelect ? freqSelect.value : "528";
      var hzDisplay = document.getElementById("freq-display-hz");
      var nameDisplay = document.getElementById("freq-display-name");
      if (hzDisplay) hzDisplay.textContent = hz + " Hz";
      if (nameDisplay) nameDisplay.textContent = FREQ_NAMES[hz] || "";

      // Sync volume from settings
      var settingsVolume = document.getElementById("freq-volume");
      var playerVolume = document.getElementById("freq-player-volume");
      if (settingsVolume && playerVolume) {
        playerVolume.value = settingsVolume.value;
      }
    }

    // Show the audio section if either is enabled
    if ((ttsEnabled && ttsEnabled.checked) || (freqEnabled && freqEnabled.checked)) {
      if (playerSection) playerSection.hidden = false;
    }
  }

  // ─── Boot ───
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
