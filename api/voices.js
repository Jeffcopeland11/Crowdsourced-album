export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ElevenLabs API key not configured" });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": apiKey }
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: "ElevenLabs API error", details: errText });
    }

    const data = await response.json();

    // Return a simplified list of voices
    const voices = (data.voices || []).map(function (v) {
      return {
        voice_id: v.voice_id,
        name: v.name,
        category: v.category || "premade",
        labels: v.labels || {},
        preview_url: v.preview_url || null
      };
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ voices: voices });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch voices", details: err.message });
  }
}
