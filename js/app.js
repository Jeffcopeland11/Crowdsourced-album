// === Deliverance Toolkit App ===

(function () {
  "use strict";

  // ─── Prayer Template Library ───
  // Each phase is a function that receives user context and returns HTML lines.

  function nameOrDefault(name) {
    return name && name.trim() ? name.trim() : "child of God";
  }

  function listOrDefault(csv, fallback) {
    if (!csv || !csv.trim()) return [fallback];
    return csv.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function afflictionList(checked, otherCsv) {
    var list = checked.slice();
    if (otherCsv && otherCsv.trim()) {
      otherCsv.split(",").forEach(function (s) {
        var t = s.trim();
        if (t) list.push(t);
      });
    }
    if (list.length === 0) {
      list = ["Fear", "Anger", "Shame", "Guilt", "Deception", "Confusion"];
    }
    return list;
  }

  // ─── Phase Generators ───

  function phaseRecognition(ctx) {
    var lines = [];
    lines.push(line("I, " + ctx.name + ", speak in the name of Jesus Christ, Yeshua Ben Yosef, Son of the Living God:", "command"));
    lines.push(line("I recognize and confess:"));
    if (ctx.situation) {
      lines.push(line("I acknowledge that I was involved in: " + ctx.situation, "indent"));
    }
    if (ctx.places.length && ctx.places[0] !== "an event or practice") {
      ctx.places.forEach(function (p) {
        lines.push(line("I was present at or participated in: " + p, "bullet"));
      });
    }
    if (ctx.people.length && ctx.people[0] !== "those involved") {
      lines.push(line("I became entangled with: " + ctx.people.join(", "), "indent"));
    }
    lines.push(line("I opened doorways in my spirit, soul, and body without adequate Christ protection.", "indent"));
    lines.push(line("This was a mistake. I take full responsibility. I REPENT.", "declaration"));
    lines.push(line("I did not fully understand the spiritual consequences of my involvement."));
    lines.push(line("But now I KNOW. And now I am exercising the authority of Christ to be set FREE.", "command"));
    return wrapPhase("Phase 1: Recognition & Confession", lines);
  }

  function phaseCordCutting(ctx) {
    var lines = [];
    lines.push(line("In the name of Jesus Christ, by the Blood of the Lamb, I SEVER ALL CORDS:", "command"));
    ctx.people.forEach(function (p) {
      lines.push(line("To " + p.toUpperCase() + ":", "command"));
      lines.push(line("All energetic cords formed through contact or involvement - CUT NOW", "bullet"));
      lines.push(line("All soul ties from any shared experience or bond - CUT NOW", "bullet"));
      lines.push(line("All entity transmission lines operating through this connection - CUT NOW", "bullet"));
      lines.push(line("All demonic networks built into my field through this person - DESTROYED NOW", "bullet"));
    });
    if (ctx.places.length && ctx.places[0] !== "an event or practice") {
      ctx.places.forEach(function (p) {
        lines.push(line("To " + p.toUpperCase() + ":", "command"));
        lines.push(line("All cords to this place and every spirit associated with it - CUT NOW", "bullet"));
        lines.push(line("All contracts made at this location - REVOKED NOW", "bullet"));
      });
    }
    lines.push(line("To ALL unnamed participants, facilitators, and associated persons:", "command"));
    lines.push(line("Every single cord - CUT NOW", "bullet"));
    lines.push(line("Every entity they carried - SEVERED FROM ME NOW", "bullet"));
    lines.push(line("Every network formed in any shared field - DESTROYED NOW", "bullet"));
    lines.push(line(""));
    lines.push(line("I am SEPARATE from all of these people and places. I am SOVEREIGN. All cords are CUT.", "declaration"));
    return wrapPhase("Phase 2: Severing All Cords", lines);
  }

  function phaseEntityExpulsion(ctx) {
    var lines = [];
    lines.push(line("In the name of Jesus Christ, I EXPEL every demon, unclean spirit, and oppressive entity:", "command"));
    lines.push(line("LEGION - I name you. I see you. You may be MANY, but Christ is STRONGER.", "declaration"));
    lines.push(line("By the Blood of Jesus Christ, I CAST OUT:", "command"));
    ctx.afflictions.forEach(function (a) {
      lines.push(line("Spirit of " + a.toUpperCase() + " - from every source, every doorway, every root - OUT NOW", "bullet"));
    });
    lines.push(line("Every UNNAMED demon that entered through any open door - OUT NOW", "bullet"));
    lines.push(line(""));
    lines.push(line("By the Blood of Jesus Christ, you are ALL EXPELLED.", "declaration"));
    lines.push(line("LEAVE MY BODY. LEAVE MY FIELD. GO TO THE ABYSS. YOU ARE BOUND.", "declaration"));
    lines.push(line("You CANNOT return. You have NO AUTHORITY over me. I belong to CHRIST.", "declaration"));
    return wrapPhase("Phase 3: Entity Expulsion", lines);
  }

  function phaseNetworkDestruction(ctx) {
    var lines = [];
    lines.push(line("In the name of Jesus Christ, I DESTROY:", "command"));
    lines.push(line("ALL demonic communication networks, relay points, and transmission lines:", "command"));
    ctx.people.forEach(function (p) {
      lines.push(line("Networks connecting me to " + p + " - DESTROYED", "bullet"));
    });
    ctx.afflictions.forEach(function (a) {
      lines.push(line("Networks transmitting " + a.toLowerCase() + " - DESTROYED", "bullet"));
    });
    lines.push(line("ALL relay points between me and any connected persons - OBLITERATED", "bullet"));
    lines.push(line("ALL transmission lines carrying demonic frequencies - SEVERED", "bullet"));
    lines.push(line("ALL entity highways using my field as access - BLOCKED FOREVER", "bullet"));
    lines.push(line("ALL energetic infrastructure built during compromised states - DISMANTLED COMPLETELY", "bullet"));
    lines.push(line(""));
    lines.push(line("The networks are GONE. The infrastructure is DESTROYED. I am SOVEREIGN.", "declaration"));
    return wrapPhase("Phase 4: Network Destruction", lines);
  }

  function phaseBackdoorClosing(ctx) {
    var lines = [];
    lines.push(line("In the name of Jesus Christ, I CLOSE ALL BACKDOORS:", "command"));
    var areas = [
      ["crown", "entity access points in my mind"],
      ["third eye", "false visions, psychic intrusion, deception"],
      ["throat", "speaking lies, confusion, silencing of truth"],
      ["heart", "absorbing others' pain, sin, and unclean energy"],
      ["solar plexus", "enmeshment, codependency, power theft"],
      ["sacral center", "sexual sin transmission, impurity"],
      ["root", "survival fear, instability, grounding disruption"],
      ["dream/astral body", "night attacks, astral interference"],
      ["mental body", "confusion, deception, intrusive thoughts"],
      ["emotional body", "foreign emotions, mood manipulation"],
      ["physical body", "illness, fatigue, bodily oppression"]
    ];
    areas.forEach(function (a) {
      lines.push(line("Backdoors in my " + a[0] + " (" + a[1] + ") - CLOSED and SEALED", "bullet"));
    });
    lines.push(line("Every portal opened during any compromised experience - CLOSED NOW", "bullet"));
    lines.push(line("Every vulnerability exploited by demons - SEALED NOW", "bullet"));
    lines.push(line(""));
    lines.push(line("I seal ALL backdoors with the Blood of Jesus Christ.", "command"));
    lines.push(line("ALL backdoors are PERMANENTLY CLOSED. Nothing enters without my conscious permission in Christ.", "declaration"));
    return wrapPhase("Phase 5: Backdoor & Portal Closing", lines);
  }

  function phaseHebrewSeal(ctx) {
    var lines = [];
    lines.push(line("I invoke the sacred Hebrew Seal of Protection - SAGAR:", "command"));
    lines.push(line("Samekh (\u05E1) - Support - I am supported by the Living God", "bullet"));
    lines.push(line("Ayin (\u05E2) - Eye - God's eye watches over me, sees all threats, protects me", "bullet"));
    lines.push(line("Gimel (\u05D2) - Blessing - I am blessed and sustained on my journey", "bullet"));
    lines.push(line("Resh (\u05E8) - Head - My mind is covered, my consciousness is sealed", "bullet"));
    lines.push(line(""));
    lines.push(line("By the SAGAR seal, I am:", "command"));
    lines.push(line("SURROUNDED by divine protection", "bullet"));
    lines.push(line("OBSERVED by God's watchful eye", "bullet"));
    lines.push(line("BLESSED with provision and strength", "bullet"));
    lines.push(line("COVERED in mind, body, and spirit", "bullet"));
    lines.push(line(""));
    lines.push(line("I seal my entire field with the Hebrew letters of SAGAR: \u05E1 \u05E2 \u05D2 \u05E8", "command"));
    lines.push(line("This seal is written over my crown, my heart, my center, and my feet."));
    lines.push(line("No demon can break this seal. No entity can penetrate this protection.", "declaration"));
    lines.push(line("I am SAGAR-sealed. I am GOD-PROTECTED. I am SOVEREIGN.", "declaration"));
    return wrapPhase("Phase 6: Hebrew SAGAR Seal of Protection", lines);
  }

  function phase12DShielding(ctx) {
    var lines = [];
    lines.push(line("I call upon the Kryst-Krystallah Consciousness, the Guardian Host, and the Cosmic Christos:", "command"));
    lines.push(line("I activate my 12D Shield NOW:", "declaration"));
    lines.push(line("12th Dimension - Avatar Christos Consciousness - ACTIVATED", "bullet"));
    lines.push(line(""));
    lines.push(line("The shield is:", "command"));
    lines.push(line("Platinum-Silver in color", "bullet"));
    lines.push(line("Diamond-hard in structure", "bullet"));
    lines.push(line("Impermeable to all entities, all frequencies, all attacks", "bullet"));
    lines.push(line("Anchored in Source/God/Cosmic Mother-Father", "bullet"));
    lines.push(line("Aligned with the Emerald Order Christos Mission", "bullet"));
    lines.push(line(""));
    lines.push(line("This shield surrounds me completely - above, below, front, back, left, right, inside, outside.", "command"));
    lines.push(line("This shield is PERMANENT. It does not fade. It does not weaken."));
    lines.push(line("Only frequencies of Christos Consciousness, God Sovereign Free, and pure unconditional love can enter.", "command"));
    lines.push(line("ALL else is REJECTED. ALL else is REPELLED. ALL else is RETURNED TO SENDER.", "declaration"));
    lines.push(line("I am 12D-shielded. I am Kryst-protected. I am IMPERMEABLE.", "declaration"));
    return wrapPhase("Phase 7: 12D Krystal Star Shielding", lines);
  }

  function phaseBloodCovering(ctx) {
    var lines = [];
    lines.push(line("In the name of Jesus Christ, I cover myself COMPLETELY with the Blood of the Lamb:", "command"));
    lines.push(line("I apply the Blood of Jesus Christ to:", "command"));
    var bodyParts = [
      "My crown", "My third eye", "My throat", "My heart",
      "My solar plexus", "My sacral center", "My root",
      "My hands", "My feet", "My spine",
      "My entire auric field", "My dream body",
      "My mental body", "My emotional body", "My physical body"
    ];
    bodyParts.forEach(function (part) {
      lines.push(line(part + " - COVERED", "bullet"));
    });
    lines.push(line(""));
    lines.push(line("The Blood of Christ is my FINAL SEAL.", "declaration"));
    lines.push(line("No demon can pass through the Blood. No entity can penetrate the Blood."));
    lines.push(line("The Blood washes me CLEAN. The Blood makes me WHOLE. The Blood keeps me SAFE."));
    lines.push(line("I am BLOOD-COVERED. I am CHRIST-PROTECTED.", "declaration"));
    return wrapPhase("Phase 8: Blood of Christ Covering", lines);
  }

  function phaseSovereignty(ctx) {
    var lines = [];
    lines.push(line("I declare in the name of Jesus Christ:", "command"));
    lines.push(line("I am " + ctx.name.toUpperCase() + ".", "declaration"));
    if (ctx.identity) {
      lines.push(line("I am " + ctx.identity + ".", "command"));
    }
    lines.push(line("I am God Sovereign Free (GSF).", "declaration"));
    lines.push(line("I am SOVEREIGN over my body, mind, emotions, and spirit.", "declaration"));
    lines.push(line(""));
    lines.push(line("I do NOT belong to:", "command"));
    ctx.people.forEach(function (p) {
      if (p !== "those involved") {
        lines.push(line(p + " or any associated entity", "bullet"));
      }
    });
    lines.push(line("Any unclean spirit, false light, or demonic network", "bullet"));
    lines.push(line("Any collective entity or legion", "bullet"));
    lines.push(line(""));
    lines.push(line("I ONLY belong to:", "command"));
    lines.push(line("Jesus Christ, Yeshua, the Cosmic Christos", "bullet"));
    lines.push(line("The Living God, Source, Cosmic Mother-Father", "bullet"));
    lines.push(line("My own sovereign self", "bullet"));
    lines.push(line(""));
    lines.push(line("I am FREE. I am WHOLE. I am SOVEREIGN.", "declaration"));
    return wrapPhase("Phase 9: Declaration of Sovereignty", lines);
  }

  function phaseContractRenunciation(ctx) {
    var lines = [];
    lines.push(line("In the name of Jesus Christ, I RENOUNCE and REVOKE:", "command"));
    lines.push(line("ALL agreements made during any compromised experience:", "command"));
    lines.push(line("Spoken agreements - REVOKED", "bullet"));
    lines.push(line("Unspoken agreements - REVOKED", "bullet"));
    lines.push(line("Conscious agreements - REVOKED", "bullet"));
    lines.push(line("Unconscious agreements - REVOKED", "bullet"));
    lines.push(line("Soul contracts signed in altered states - REVOKED", "bullet"));
    lines.push(line(""));
    lines.push(line("I specifically renounce:", "command"));
    lines.push(line("Any agreement to open my spiritual centers to unclean spirits", "bullet"));
    lines.push(line("Any agreement to receive 'activations' from false light beings", "bullet"));
    lines.push(line("Any agreement to be part of a group field without Christ protection", "bullet"));
    lines.push(line("Any agreement to trust a process or practice that bypassed Christ", "bullet"));
    lines.push(line("Any agreement to allow any person or entity unauthorized access to my field", "bullet"));
    lines.push(line(""));
    lines.push(line("ALL contracts with demons - CANCELLED", "declaration"));
    lines.push(line("ALL contracts with unclean spirits - CANCELLED", "declaration"));
    lines.push(line("ALL contracts with false light entities - CANCELLED", "declaration"));
    lines.push(line(""));
    lines.push(line("These agreements are NULL and VOID. They have NO power. They are FINISHED.", "declaration"));
    lines.push(line("I am FREE from all contracts. I am RELEASED from all agreements.", "declaration"));
    lines.push(line("The only covenant I honor is my covenant with CHRIST.", "command"));
    return wrapPhase("Phase 10: Contract & Agreement Renunciation", lines);
  }

  function phaseSoulRetrieval(ctx) {
    var lines = [];
    lines.push(line("In the name of Jesus Christ, I call back ALL parts of myself that were:", "command"));
    lines.push(line("Lost during any compromised spiritual experience", "bullet"));
    lines.push(line("Stolen by any person, entity, or group", "bullet"));
    lines.push(line("Fragmented by trauma, fear, or deception", "bullet"));
    lines.push(line("Attached to other participants or facilitators", "bullet"));
    lines.push(line("Trapped in altered states of consciousness", "bullet"));
    lines.push(line(""));
    lines.push(line("I call my soul fragments HOME NOW:", "declaration"));
    lines.push(line("Come back to me, all that is MINE.", "command"));
    lines.push(line("Come back clean, whole, and restored."));
    lines.push(line("Come back covered by the Blood of Christ."));
    lines.push(line("Come back sealed in divine protection."));
    lines.push(line(""));
    lines.push(line("I receive my fragments NOW. I am WHOLE. I am COMPLETE. I am INTEGRATED.", "declaration"));
    lines.push(line("No part of me remains entangled with any person, place, or experience.", "declaration"));
    lines.push(line("I am FULLY here. I am FULLY me. I am FULLY sovereign.", "declaration"));
    return wrapPhase("Phase 11: Soul Fragment Retrieval", lines);
  }

  function phaseClosingSeal(ctx) {
    var lines = [];
    lines.push(line("I thank You, Jesus Christ, Yeshua, Cosmic Christos, for:", "command"));
    lines.push(line("Expelling every unclean spirit from my body and field", "bullet"));
    lines.push(line("Severing all ungodly cords and soul ties", "bullet"));
    lines.push(line("Destroying all demonic networks and communication systems", "bullet"));
    lines.push(line("Closing all backdoors and portals", "bullet"));
    lines.push(line("Covering me with Your Blood", "bullet"));
    lines.push(line("Restoring my sovereignty and wholeness", "bullet"));
    if (ctx.goals.length && ctx.goals[0] !== "freedom and restoration") {
      lines.push(line("Granting me: " + ctx.goals.join(", "), "bullet"));
    }
    lines.push(line(""));
    lines.push(line("I am FREE. I am CLEAN. I am PROTECTED.", "declaration"));
    lines.push(line("This deliverance is COMPLETE. This clearing is PERMANENT.", "declaration"));
    lines.push(line(""));
    lines.push(line("I seal this work in the name of:", "command"));
    lines.push(line("JESUS CHRIST, YESHUA BEN YOSEF, the Son of the Living God", "bullet"));
    lines.push(line("The Living God, Source, Cosmic Mother-Father", "bullet"));
    lines.push(line("God Sovereign Free (GSF)", "bullet"));
    lines.push(line(""));
    lines.push(line("It is FINISHED. It is DONE. It is SEALED.", "declaration"));
    lines.push(line("Amen. Amen. Amen.", "declaration"));
    lines.push(line("GSF GSF GSF.", "declaration"));
    return wrapPhase("Phase 12: Gratitude & Closing Seal", lines);
  }

  // ─── Helper: build a single prayer line ───
  function line(text, cls) {
    if (!text) return '<div class="prayer-line separator"></div>';
    var className = "prayer-line";
    if (cls) className += " " + cls;
    return '<div class="' + className + '">' + escapeHtml(text) + "</div>";
  }

  function wrapPhase(title, lines) {
    return '<div class="phase"><div class="phase-title">' + escapeHtml(title) + "</div>" + lines.join("\n") + "</div>";
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ─── Phase Registry ───
  var PHASE_MAP = {
    "recognition": phaseRecognition,
    "cord-cutting": phaseCordCutting,
    "entity-expulsion": phaseEntityExpulsion,
    "network-destruction": phaseNetworkDestruction,
    "backdoor-closing": phaseBackdoorClosing,
    "hebrew-seal": phaseHebrewSeal,
    "12d-shielding": phase12DShielding,
    "blood-covering": phaseBloodCovering,
    "sovereignty": phaseSovereignty,
    "contract-renunciation": phaseContractRenunciation,
    "soul-retrieval": phaseSoulRetrieval,
    "closing-seal": phaseClosingSeal
  };

  // ─── Standard Prayer Presets ───
  var STANDARD_PRESETS = {
    "general-deliverance": {
      title: "General Deliverance Prayer",
      phases: ["recognition", "entity-expulsion", "backdoor-closing", "blood-covering", "sovereignty", "closing-seal"]
    },
    "cord-cutting": {
      title: "Cord Cutting & Relationship Severance",
      phases: ["recognition", "cord-cutting", "network-destruction", "blood-covering", "closing-seal"]
    },
    "entity-expulsion": {
      title: "Entity / Spirit Expulsion",
      phases: ["recognition", "entity-expulsion", "network-destruction", "blood-covering", "closing-seal"]
    },
    "portal-closing": {
      title: "Portal & Backdoor Closing",
      phases: ["recognition", "backdoor-closing", "blood-covering", "closing-seal"]
    },
    "protective-shielding": {
      title: "Protective Shielding & Covering",
      phases: ["hebrew-seal", "12d-shielding", "blood-covering", "sovereignty", "closing-seal"]
    },
    "soul-retrieval": {
      title: "Soul Fragment Retrieval",
      phases: ["recognition", "soul-retrieval", "blood-covering", "sovereignty", "closing-seal"]
    },
    "contract-renunciation": {
      title: "Contract & Agreement Renunciation",
      phases: ["recognition", "contract-renunciation", "blood-covering", "sovereignty", "closing-seal"]
    },
    "sovereignty-declaration": {
      title: "Declaration of Sovereignty",
      phases: ["sovereignty", "blood-covering", "closing-seal"]
    },
    "full-deliverance": {
      title: "Full Comprehensive Deliverance",
      phases: [
        "recognition", "cord-cutting", "entity-expulsion", "network-destruction",
        "backdoor-closing", "hebrew-seal", "12d-shielding", "blood-covering",
        "sovereignty", "contract-renunciation", "soul-retrieval", "closing-seal"
      ]
    }
  };

  // ─── Build Context Object ───
  function buildContext(opts) {
    return {
      name: nameOrDefault(opts.name),
      people: listOrDefault(opts.people, "those involved"),
      places: listOrDefault(opts.places, "an event or practice"),
      afflictions: afflictionList(opts.afflictionsChecked || [], opts.afflictionsOther),
      goals: listOrDefault(opts.goals, "freedom and restoration"),
      situation: (opts.situation || "").trim(),
      identity: (opts.identity || "").trim()
    };
  }

  // ─── Generate Full Prayer HTML ───
  function generatePrayer(phases, ctx) {
    var html = "";
    var phaseNum = 1;
    phases.forEach(function (phaseKey) {
      var fn = PHASE_MAP[phaseKey];
      if (fn) {
        html += fn(ctx);
        phaseNum++;
      }
    });
    return html;
  }

  // ─── Build Confirmation List ───
  function buildConfirmationList(ctx) {
    var items = [
      '"In the name of Jesus Christ, are all unclean spirits expelled from ' + ctx.name + '?"',
      '"In the name of Jesus Christ, are all ungodly cords severed?"',
      '"In the name of Jesus Christ, are all demonic networks destroyed?"',
      '"In the name of Jesus Christ, are all backdoors closed and sealed?"',
      '"In the name of Jesus Christ, is ' + ctx.name + ' covered by the Blood of Christ?"',
      '"In the name of Jesus Christ, is ' + ctx.name + ' sovereign, whole, and free?"'
    ];
    return items.map(function (item) {
      return "<li>" + escapeHtml(item) + "</li>";
    }).join("\n");
  }

  // ─── Build Daily Maintenance Prayer ───
  function buildDailyPrayer(ctx) {
    var prayer = '"In the name of Jesus Christ: All expelled entities stay OUT. All cords stay CUT. All networks stay DESTROYED. All backdoors stay SEALED. I am covered by the Blood of Christ. I am sovereign. I am ' + ctx.name + '. GSF."';
    return escapeHtml(prayer);
  }

  // ─── Display Prayer ───
  function displayPrayer(title, prayerHtml, ctx) {
    document.getElementById("prayer-title").textContent = title;
    document.getElementById("prayer-text").innerHTML = prayerHtml;
    document.getElementById("confirmation-list").innerHTML = buildConfirmationList(ctx);
    document.getElementById("daily-maintenance-prayer").innerHTML = buildDailyPrayer(ctx);

    // Hide all tab content, show prayer output
    document.querySelectorAll(".tab-content").forEach(function (el) {
      el.classList.remove("active");
    });
    var prayerOutput = document.getElementById("prayer-output");
    prayerOutput.hidden = false;
    prayerOutput.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ─── Tab Navigation ───
  function initTabs() {
    var tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-tab");
        tabBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        document.querySelectorAll(".tab-content").forEach(function (el) {
          el.classList.remove("active");
        });
        document.getElementById(targetId).classList.add("active");
        document.getElementById("prayer-output").hidden = true;
      });
    });
  }

  // ─── Collapsible Sections ───
  function initCollapsibles() {
    document.querySelectorAll(".collapsible-toggle").forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        var content = toggle.nextElementSibling;
        content.hidden = expanded;
      });
    });
  }

  // ─── Standard Prayer Generation ───
  function initStandardPrayer() {
    document.getElementById("generate-standard-btn").addEventListener("click", function () {
      var select = document.getElementById("standard-prayer-select");
      var presetKey = select.value;
      if (!presetKey) {
        alert("Please select a prayer type.");
        return;
      }
      var preset = STANDARD_PRESETS[presetKey];
      var ctx = buildContext({
        name: document.getElementById("std-user-name").value,
        people: document.getElementById("std-people").value,
        places: document.getElementById("std-places").value,
        afflictionsChecked: [],
        afflictionsOther: document.getElementById("std-afflictions").value,
        goals: document.getElementById("std-goals").value,
        situation: "",
        identity: ""
      });
      var html = generatePrayer(preset.phases, ctx);
      displayPrayer(preset.title, html, ctx);
    });
  }

  // ─── Custom Prayer Generation ───
  function initCustomPrayer() {
    document.getElementById("generate-custom-btn").addEventListener("click", function () {
      var name = document.getElementById("custom-user-name").value;
      if (!name || !name.trim()) {
        alert("Please enter your name.");
        return;
      }

      // Gather checked afflictions
      var checkedAfflictions = [];
      document.querySelectorAll("#affliction-checkboxes input[type=checkbox]:checked").forEach(function (cb) {
        checkedAfflictions.push(cb.value);
      });

      // Gather checked phases
      var checkedPhases = [];
      document.querySelectorAll("#phase-checkboxes input[type=checkbox]:checked").forEach(function (cb) {
        checkedPhases.push(cb.value);
      });

      if (checkedPhases.length === 0) {
        alert("Please select at least one phase to include.");
        return;
      }

      var ctx = buildContext({
        name: name,
        people: document.getElementById("custom-people").value,
        places: document.getElementById("custom-places").value,
        afflictionsChecked: checkedAfflictions,
        afflictionsOther: document.getElementById("custom-afflictions-other").value,
        goals: document.getElementById("custom-goals").value,
        situation: document.getElementById("custom-situation").value,
        identity: ""
      });

      var html = generatePrayer(checkedPhases, ctx);
      displayPrayer("Custom Deliverance Prayer", html, ctx);
    });
  }

  // ─── Guided Flow ───
  function initGuidedFlow() {
    var currentStep = 1;

    function showStep(step) {
      currentStep = step;
      document.querySelectorAll(".guided-step").forEach(function (el) {
        el.classList.remove("active");
      });
      var target = document.querySelector('.guided-step[data-step="' + step + '"]');
      if (target) target.classList.add("active");

      // Update step indicators
      document.querySelectorAll(".step-dot").forEach(function (dot) {
        var dotStep = parseInt(dot.getAttribute("data-step"), 10);
        dot.classList.remove("active", "completed");
        if (dotStep === step) {
          dot.classList.add("active");
        } else if (dotStep < step) {
          dot.classList.add("completed");
        }
      });

      // Build review on step 6
      if (step === 6) {
        buildReview();
      }
    }

    // Next/prev buttons
    document.querySelectorAll(".guided-next").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = parseInt(btn.getAttribute("data-next"), 10);
        showStep(next);
      });
    });

    document.querySelectorAll(".guided-prev").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var prev = parseInt(btn.getAttribute("data-prev"), 10);
        showStep(prev);
      });
    });

    function buildReview() {
      var reasons = [];
      document.querySelectorAll('input[name="reason"]:checked').forEach(function (cb) {
        reasons.push(cb.parentElement.textContent.trim());
      });

      var name = document.getElementById("guided-name").value || "Not provided";
      var identity = document.getElementById("guided-identity").value || "Not provided";
      var situation = document.getElementById("guided-situation").value || "Not provided";
      var people = document.getElementById("guided-people").value || "None specified";
      var places = document.getElementById("guided-places").value || "None specified";

      var afflictions = [];
      document.querySelectorAll("#guided-afflictions input[type=checkbox]:checked").forEach(function (cb) {
        afflictions.push(cb.value);
      });
      var otherAfflictions = document.getElementById("guided-afflictions-other").value;
      if (otherAfflictions) {
        otherAfflictions.split(",").forEach(function (s) {
          var t = s.trim();
          if (t) afflictions.push(t);
        });
      }

      var protections = [];
      document.querySelectorAll('input[name="protection"]:checked').forEach(function (cb) {
        protections.push(cb.parentElement.textContent.trim());
      });

      var goals = document.getElementById("guided-goals").value || "Freedom and restoration";

      var html = "<dl>";
      html += "<dt>Reasons for seeking deliverance:</dt><dd>" + (reasons.length ? escapeHtml(reasons.join("; ")) : "None selected") + "</dd>";
      html += "<dt>Name:</dt><dd>" + escapeHtml(name) + "</dd>";
      html += "<dt>Spiritual identity:</dt><dd>" + escapeHtml(identity) + "</dd>";
      html += "<dt>Situation:</dt><dd>" + escapeHtml(situation) + "</dd>";
      html += "<dt>People involved:</dt><dd>" + escapeHtml(people) + "</dd>";
      html += "<dt>Places/events:</dt><dd>" + escapeHtml(places) + "</dd>";
      html += "<dt>Spirits/afflictions:</dt><dd>" + (afflictions.length ? escapeHtml(afflictions.join(", ")) : "Default set") + "</dd>";
      html += "<dt>Protection layers:</dt><dd>" + (protections.length ? escapeHtml(protections.join(", ")) : "Blood of Christ Covering") + "</dd>";
      html += "<dt>Goals:</dt><dd>" + escapeHtml(goals) + "</dd>";
      html += "</dl>";

      document.getElementById("guided-review").innerHTML = html;
    }

    // Generate guided prayer
    document.getElementById("generate-guided-btn").addEventListener("click", function () {
      var name = document.getElementById("guided-name").value;
      var identity = document.getElementById("guided-identity").value;
      var situation = document.getElementById("guided-situation").value;
      var people = document.getElementById("guided-people").value;
      var places = document.getElementById("guided-places").value;
      var goals = document.getElementById("guided-goals").value;

      var checkedAfflictions = [];
      document.querySelectorAll("#guided-afflictions input[type=checkbox]:checked").forEach(function (cb) {
        checkedAfflictions.push(cb.value);
      });
      var otherAfflictions = document.getElementById("guided-afflictions-other").value;

      var ctx = buildContext({
        name: name,
        people: people,
        places: places,
        afflictionsChecked: checkedAfflictions,
        afflictionsOther: otherAfflictions,
        goals: goals,
        situation: situation,
        identity: identity
      });

      // Determine phases based on selections
      var phases = [];
      var reasons = [];
      document.querySelectorAll('input[name="reason"]:checked').forEach(function (cb) {
        reasons.push(cb.value);
      });

      // Always start with recognition
      phases.push("recognition");

      // Map reasons to phases
      if (reasons.indexOf("ceremony") >= 0 || reasons.indexOf("relationship") >= 0) {
        phases.push("cord-cutting");
      }
      if (reasons.indexOf("entities") >= 0 || reasons.indexOf("emotions") >= 0 || reasons.indexOf("ceremony") >= 0 || reasons.indexOf("general") >= 0) {
        phases.push("entity-expulsion");
      }
      if (reasons.indexOf("ceremony") >= 0 || reasons.indexOf("entities") >= 0) {
        phases.push("network-destruction");
      }
      if (reasons.indexOf("ceremony") >= 0 || reasons.indexOf("entities") >= 0 || reasons.indexOf("protection") >= 0) {
        phases.push("backdoor-closing");
      }
      if (reasons.indexOf("contracts") >= 0) {
        phases.push("contract-renunciation");
      }
      if (reasons.indexOf("wholeness") >= 0) {
        phases.push("soul-retrieval");
      }

      // Add selected protection layers
      var protections = [];
      document.querySelectorAll('input[name="protection"]:checked').forEach(function (cb) {
        protections.push(cb.value);
      });
      protections.forEach(function (p) {
        if (phases.indexOf(p) < 0) {
          phases.push(p);
        }
      });

      // Always ensure blood covering and sovereignty are present if not already
      if (phases.indexOf("blood-covering") < 0) {
        phases.push("blood-covering");
      }
      if (phases.indexOf("sovereignty") < 0 && (reasons.indexOf("general") >= 0 || reasons.indexOf("protection") >= 0)) {
        phases.push("sovereignty");
      }

      // Always end with closing seal
      phases.push("closing-seal");

      // Remove duplicates while preserving order
      var seen = {};
      phases = phases.filter(function (p) {
        if (seen[p]) return false;
        seen[p] = true;
        return true;
      });

      var html = generatePrayer(phases, ctx);
      displayPrayer("Your Personalized Deliverance Prayer", html, ctx);
    });
  }

  // ─── Copy & Print ───
  function initPrayerActions() {
    document.getElementById("copy-prayer-btn").addEventListener("click", function () {
      var prayerText = document.getElementById("prayer-text").innerText;
      var postPrayerText = document.getElementById("post-prayer-section").innerText;
      var fullText = prayerText + "\n\n" + postPrayerText;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText).then(function () {
          var btn = document.getElementById("copy-prayer-btn");
          var orig = btn.textContent;
          btn.textContent = "Copied!";
          setTimeout(function () { btn.textContent = orig; }, 2000);
        });
      } else {
        // Fallback
        var textarea = document.createElement("textarea");
        textarea.value = fullText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        var btn = document.getElementById("copy-prayer-btn");
        var orig = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = orig; }, 2000);
      }
    });

    document.getElementById("print-prayer-btn").addEventListener("click", function () {
      window.print();
    });

    document.getElementById("new-prayer-btn").addEventListener("click", function () {
      document.getElementById("prayer-output").hidden = true;
      // Re-activate the first tab
      document.querySelectorAll(".tab-btn").forEach(function (b) { b.classList.remove("active"); });
      document.querySelector('.tab-btn[data-tab="quick-prayer"]').classList.add("active");
      document.querySelectorAll(".tab-content").forEach(function (el) { el.classList.remove("active"); });
      document.getElementById("quick-prayer").classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ─── Initialize App ───
  function init() {
    initTabs();
    initCollapsibles();
    initStandardPrayer();
    initCustomPrayer();
    initGuidedFlow();
    initPrayerActions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
