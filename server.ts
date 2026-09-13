import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Track models that have exhausted quota (429 RESOURCE_EXHAUSTED)
const quotaExhaustedModels = new Map<string, number>();

// Abstractive Paraphrasing API powered by Gemini models
app.post('/api/paraphrase', async (req, res) => {
  try {
    const { paragraphs, config } = req.body;
    if (!paragraphs || !Array.isArray(paragraphs)) {
      return res.status(400).json({ error: 'Paragraphs array is required' });
    }

    const ai = getGenAI();
    const tone = config?.tone || 'academic';

    const systemPrompt = `You are an elite text humanizer and abstractive paraphrasing engine specialized in defeating AI detectors (GPTZero, Turnitin, Copyleaks, ZeroGPT).
Your primary objective is to humanize AI-generated text using a fusion of deep linguistic principles, high burstiness, and abstractive rewriting.

KEY STRATEGIES TO AVOID AI FLAGGING (MANDATORY):
1. VARY SENTENCE ARCHITECTURE (HIGH BURSTINESS):
   - AI models generate sentences with uniform length (12-16 words) and predictable rhythms.
   - You MUST actively combine short, punchy sentences (4-9 words) with longer, complex multi-clause sentences (20-35+ words).
   - Create dynamic cadence and rhythmic contrast throughout each paragraph. Avoid repetitive sentence lengths!

2. USE ABSTRACTIVE REWRITING OVER SYNONYM SWAPPING:
   - Do NOT replace words line-by-line or perform mechanical token substitution!
   - Process the entire paragraph holistically, extract its core semantic meaning and factual assertions, and synthesize a completely new sentence structure from scratch with natural, organic phrasing.

3. PRESERVE DOMAIN & METHODOLOGICAL TERMINOLOGY:
   - AI detectors flag unnatural phrasing caused by over-synonymized academic and research text.
   - Scientific, statistical, and methodological terms MUST remain unchanged to keep the domain context natural:
     * Preserve exact terms: "sample", "dataset", "correlated", "university students", "college students", "participants", "methodology", "regression", "independent variable", "dependent variable".
     * NEVER swap "sample" to "specimen", or "university students" to "tertiary learners", or "correlated" to "interlinked"!
     * Preserve 100% of statistical notations: (M = ..., SD = ..., p < .05, r = ..., percentages, sample sizes, and citations like (Smith et al., 2020)).

4. STRICTLY AVOID "AI VOCABULARY" OVERUSE:
   - Generative models lean heavily toward specific transitional words and flowery vocabulary that instantly trigger AI flags.
   - YOU ARE STRICTLY PROHIBITED FROM USING THE FOLLOWING AI CLICHÉS:
     "delve", "delve into", "pivotal", "crucial", "testament", "testament to", "fostering", "foster", "furthermore", "moreover", "rich tapestry", "tapestry", "vibrant", "beacon", "paramount", "multifaceted", "underscored", "underscore", "navigating", "ever-evolving landscape", "dynamic landscape", "harness", "harnessing", "meticulously", "intricate interplay", "interplay", "resonate", "catalyst", "embark", "shed light on", "in conclusion", "it is important to note that", "seamlessly".
   - Enforce a simpler, direct, clear human lexicon.

5. PART-OF-SPEECH PRECISION:
   - Never substitute the noun "use" with the verb "utilize"! (e.g. keep "social media use was...", never "social media utilize").

6. PUNCTUATION & SPACING:
   - Always place a single space after every terminal period, question mark, or exclamation point.

7. TONE SPECIFICATION:
   - Selected Tone: "${tone.toUpperCase()}".
   - Academic: objective, clear, precise, naturally scholarly without flowery AI jargon.
   - Professional: direct, crisp, articulate, active.
   - Casual: engaging, conversational, friendly.

OUTPUT FORMAT:
Respond with ONLY valid JSON strictly adhering to this schema:
{
  "paragraphs": [
    {
      "paragraphIndex": number,
      "paraphrasedText": string,
      "sentences": [
        {
          "originalText": string,
          "paraphrasedText": string,
          "appliedVoice": "active" | "passive" | "neutral",
          "appliedStructure": "simple" | "compound" | "complex",
          "rulesExplanation": [string]
        }
      ]
    }
  ]
}`;

    const userPrompt = `Paraphrase the following ${paragraphs.length} paragraphs in ${tone} register according to the instructions:

${JSON.stringify(
  paragraphs.map((p, idx) => ({
    paragraphIndex: idx,
    isHeading: Boolean(p.isHeading),
    text: p.text,
  })),
  null,
  2
)}`;

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const defaultModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

    // Filter out models that recently exceeded quota (429)
    const now = Date.now();
    const activeModels = defaultModels.filter((modelName) => {
      const exhaustedAt = quotaExhaustedModels.get(modelName);
      if (!exhaustedAt) return true;
      if (now - exhaustedAt > 15 * 60 * 1000) {
        quotaExhaustedModels.delete(modelName);
        return true;
      }
      return false;
    });

    const modelsToTry = activeModels.length > 0 ? activeModels : defaultModels;
    let responseText = '';
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [
              { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] },
            ],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          });
          if (response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const isQuotaExhausted =
            err.status === 429 ||
            (typeof err.message === 'string' &&
              (err.message.includes('429') ||
                err.message.includes('quota') ||
                err.message.includes('RESOURCE_EXHAUSTED')));

          if (isQuotaExhausted) {
            quotaExhaustedModels.set(modelName, Date.now());
            console.warn(`Model ${modelName} quota exceeded (429), switching to alternative model.`);
            break; // Skip further retries on quota limit
          }

          const isCapacityIssue =
            err.status === 503 ||
            (typeof err.message === 'string' &&
              (err.message.includes('503') ||
                err.message.includes('high demand') ||
                err.message.includes('UNAVAILABLE')));

          if (attempt === 1 && isCapacityIssue) {
            console.warn(`Model ${modelName} encountered 503 demand spike, retrying with brief backoff...`);
            await sleep(750);
            continue;
          } else {
            console.warn(`Model ${modelName} attempt ${attempt} notice:`, err.message);
            break;
          }
        }
      }
      if (responseText) break;
    }

    if (!responseText) {
      throw lastError || new Error('All AI models temporarily at capacity');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      parsedResult = JSON.parse(cleanJson);
    }

    return res.json(parsedResult);
  } catch (err: any) {
    const is503 =
      err.status === 503 ||
      (typeof err.message === 'string' &&
        (err.message.includes('503') || err.message.includes('high demand') || err.message.includes('UNAVAILABLE')));
    console.warn('Gemini Paraphrase Capacity/Error:', err.message || err);
    return res.status(is503 ? 503 : 500).json({
      error: is503
        ? 'Gemini Cloud AI is temporarily experiencing peak demand. Rule-based linguistic fallback will be used.'
        : err.message || 'Failed to paraphrase with AI engine',
      fallbackRequired: true,
    });
  }
});

// Proxy for testing connection to Local LLM (Ollama / LM Studio / vLLM / llama.cpp)
app.post('/api/local-llm/ping', async (req, res) => {
  try {
    const { endpoint, provider } = req.body;
    const cleanEndpoint = (endpoint || 'http://127.0.0.1:11434').trim().replace(/\/+$/, '');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    let models: string[] = [];
    if (provider === 'openai_compatible') {
      const url = cleanEndpoint.endsWith('/v1') ? `${cleanEndpoint}/models` : `${cleanEndpoint}/v1/models`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${cleanEndpoint}`);
      }
      const data: any = await response.json();
      if (Array.isArray(data.data)) {
        models = data.data.map((m: any) => m.id || m.name || '');
      }
    } else {
      // Default: Ollama
      const url = `${cleanEndpoint}/api/tags`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from ${cleanEndpoint}`);
      }
      const data: any = await response.json();
      if (Array.isArray(data.models)) {
        models = data.models.map((m: any) => m.name || m.model || '');
      }
    }

    return res.json({
      online: true,
      models,
      endpoint: cleanEndpoint,
    });
  } catch (err: any) {
    return res.json({
      online: false,
      models: [],
      error: err.name === 'AbortError' ? 'Connection timed out' : err.message || 'Failed to reach local LLM',
    });
  }
});

// Proxy for paraphrasing using Local LLM (bypasses browser CORS restriction)
app.post('/api/local-llm/paraphrase', async (req, res) => {
  try {
    const { endpoint, provider, modelName, temperature, systemPrompt, userPrompt } = req.body;
    const cleanEndpoint = (endpoint || 'http://127.0.0.1:11434').trim().replace(/\/+$/, '');
    const model = modelName || 'gemma2';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60s for local inference

    let rawResponse = '';

    if (provider === 'openai_compatible') {
      const url = cleanEndpoint.endsWith('/v1') ? `${cleanEndpoint}/chat/completions` : `${cleanEndpoint}/v1/chat/completions`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: typeof temperature === 'number' ? temperature : 0.3,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        const errTxt = await response.text();
        throw new Error(`HTTP ${response.status}: ${errTxt}`);
      }
      const data: any = await response.json();
      rawResponse = data.choices?.[0]?.message?.content || '';
    } else {
      // Ollama
      const url = `${cleanEndpoint}/api/chat`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          format: 'json',
          stream: false,
          options: {
            temperature: typeof temperature === 'number' ? temperature : 0.3,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) {
        const errTxt = await response.text();
        throw new Error(`HTTP ${response.status}: ${errTxt}`);
      }
      const data: any = await response.json();
      rawResponse = data.message?.content || '';
    }

    return res.json({ rawResponse });
  } catch (err: any) {
    console.error('Local LLM Paraphrase Error:', err);
    return res.status(500).json({
      error: err.name === 'AbortError' ? 'Local LLM inference timed out (exceeded 60s)' : err.message || 'Failed to paraphrase with local LLM',
    });
  }
});

// Vite Middleware for Dev, Static Files for Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
