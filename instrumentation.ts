/**
 * Warm the local Ollama model on server start so the first student question
 * does not pay the model-loading cost. Skipped on Vercel (no OLLAMA_BASE_URL).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const base = process.env.OLLAMA_BASE_URL?.replace(/\/$/, "");
  if (!base) return;
  const model = process.env.OLLAMA_MODEL || "gemma3:4b";

  void fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      keep_alive: "30m",
      messages: [{ role: "user", content: "Reply with OK." }],
      options: { temperature: 0, num_predict: 2 },
    }),
  }).catch(() => {
    // Ollama is optional; the chat falls through to the next provider.
  });
}
