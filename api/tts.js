export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ElevenLabs API key not configured" });
  }

  var body = req.body || {};
  var text = body.text;
  var voiceId = body.voice_id;
  var stability = typeof body.stability === "number" ? body.stability : 0.5;
  var similarityBoost = typeof body.similarity_boost === "number" ? body.similarity_boost : 0.75;
  var modelId = body.model_id || "eleven_multilingual_v2";

  if (!text || !voiceId) {
    return res.status(400).json({ error: "Missing required fields: text, voice_id" });
  }

  // Chunk long text (ElevenLabs limit is ~5000 chars per request)
  var MAX_CHUNK = 4500;
  var chunks = chunkText(text, MAX_CHUNK);

  try {
    var audioBuffers = [];

    for (var i = 0; i < chunks.length; i++) {
      var response = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voiceId),
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg"
          },
          body: JSON.stringify({
            text: chunks[i],
            model_id: modelId,
            voice_settings: {
              stability: stability,
              similarity_boost: similarityBoost
            }
          })
        }
      );

      if (!response.ok) {
        var errText = await response.text();
        return res.status(response.status).json({
          error: "ElevenLabs TTS error on chunk " + (i + 1),
          details: errText
        });
      }

      var buffer = Buffer.from(await response.arrayBuffer());
      audioBuffers.push(buffer);
    }

    var combined = Buffer.concat(audioBuffers);
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "inline; filename=\"prayer-audio.mp3\"");
    return res.send(combined);
  } catch (err) {
    return res.status(500).json({ error: "TTS generation failed", details: err.message });
  }
}

/**
 * Split text into chunks at sentence boundaries, respecting max length.
 */
function chunkText(text, maxLen) {
  if (text.length <= maxLen) return [text];

  var chunks = [];
  var remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Find a good break point - end of sentence within limit
    var slice = remaining.substring(0, maxLen);
    var breakIdx = -1;

    // Try to break at sentence end
    var lastPeriod = slice.lastIndexOf(". ");
    var lastExcl = slice.lastIndexOf("! ");
    var lastQuestion = slice.lastIndexOf("? ");
    var lastNewline = slice.lastIndexOf("\n");
    breakIdx = Math.max(lastPeriod, lastExcl, lastQuestion, lastNewline);

    if (breakIdx < maxLen * 0.3) {
      // If no good sentence break, try comma or space
      var lastComma = slice.lastIndexOf(", ");
      var lastSpace = slice.lastIndexOf(" ");
      breakIdx = Math.max(lastComma, lastSpace);
    }

    if (breakIdx <= 0) {
      breakIdx = maxLen;
    } else {
      breakIdx += 1; // Include the punctuation
    }

    chunks.push(remaining.substring(0, breakIdx).trim());
    remaining = remaining.substring(breakIdx).trim();
  }

  return chunks.filter(function (c) { return c.length > 0; });
}
