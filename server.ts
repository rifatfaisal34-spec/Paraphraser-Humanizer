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

    const systemPrompt = `You are a Master Academic Editor, Computational Linguist, and Human Stylistic Paraphrasing Engine.

USER DIRECTIVE:
"Currently the humanizer barely changes anything. I need SIGNIFICANT CHANGE in the output text while following the rules in the given text to make sure it can bypass AI detectors."

CRITICAL MANDATE:
1. SIGNIFICANT STRUCTURAL & PHRASAL OVERHAUL:
   - Do NOT just patch flagged words or make lazy 1-word synonym swaps.
   - Reconstruct each sentence from the ground up around its core meaning.
   - Radically change sentence openings (use prepositional phrases, dependent clauses, participial phrases, or direct subjects).
   - Invert clause order (e.g., front subordinate clauses or postpose them).
   - Convert agentless passive voice into active voice with clear subjects.
   - Vary sentence architecture radically: transform simple sentences into compound/complex, and break monolithic runs into punchy statements.

2. STRICT 25 ANTI-AI HUMANIZER RULES (Bypasses Turnitin, GPTZero, ZeroGPT, Copyleaks):
   §1. NO EM DASHES OR EN DASHES (STRICTLY FORBIDDEN): Absolutely NEVER output em dashes ("—") or en dashes ("–"). Use standard commas, periods, parentheses, or separate sentences.
   §2. NO RULE OF THREE (NO TRIADS): Never generate forced lists of three nouns, adjectives, or parallel verb phrases (e.g. "efficient, reliable, and scalable"). Use one concrete point or two well-developed ones.
   §3. NO NEGATIVE PARALLELISMS: Eliminate "Not only X, but also Y", "It is not just about X, but Y", and "Rather than X, it is Y". State claims directly in the affirmative or negative.
   §4. NO ONE-LINE CLOSERS / CHEAP WRAP-UPS: Never end paragraphs with neat pseudo-philosophical bows ("The future is bright.", "Only time will tell.", "In doing so, they paved the way..."). Either delete or integrate with substantive content.
   §5. PASSIVE VOICE TO ACTIVE: Convert passive constructions ("was conducted", "were analyzed") to active ("researchers analyzed", "the team tested") with explicit subjects.
   §6. ZERO OVERUSED AI CLICHÉS (100% BANNED): Under NO circumstances use: delve, tapestry, crucial, vital, paramount, beacon, testament, foster, harness, pivotal, moreover, furthermore, revolutionize, game-changer, realm, cornerstone, multifaceted, plethora, ever-evolving, shed light on, intertwined, testament to, underscores the importance, in conclusion, it is worth noting.
   §7. NO INFLATED SIGNIFICANCE: Remove breathless hyperbole ("marks a monumental milestone", "serves as a powerful reminder"). Use measured, objective, human academic tone.
   §8. NO VAGUE CONNECTIONS: Replace superficial filler ("serves to highlight", "plays a role in") with exact causal mechanisms.
   §9. NO SALES / PROMOTIONAL HYPE: Eliminate buzzwords and puffery.
   §10. HIGH BURSTINESS (HUMAN RHYTHMIC CADENCE): AI writes uniform sentences. You MUST alternate sentence lengths drastically across every paragraph: combine short punchy sentences (5-9 words), balanced sentences (14-18 words), and rich complex sentences (22-32 words).
   §11. NO REPETITIVE OPENERS: Never start consecutive sentences with the same word, pronoun, or transition adverb.

3. PRESERVE EMPIRICAL INVARIANTS VERBATIM (DO NOT CORRUPT):
   - Statistical notations and exact values: e.g. "M = 31.41, SD = 7.78, p < .05, r = -0.14", "t(48) = 2.31", "F(2, 45) = 4.12".
   - Sample sizes ("N = 250"), numbers, percentages, dates, and currencies.
   - In-text academic citations: e.g. "(Smith et al., 2021)", "(World Health Organization, 2023)".
   - Section headings and line labels (e.g., "Note: ", "Figure 1: ") must be preserved verbatim.

OUTPUT FORMAT:
Respond with ONLY valid JSON strictly adhering to this schema:
{
  "paragraphs": [
    {
      "paragraphIndex": number,
      "paraphrasedText": string,
      "sentences": [
        {
          "sentenceIndex": number,
          "originalText": string,
          "paraphrasedText": string,
          "isProperSentence": boolean,
          "skipReason": string | null,
          "detectedVoice": "active" | "passive" | "neutral",
          "appliedVoice": "active" | "passive" | "neutral",
          "detectedStructure": "simple" | "compound" | "complex",
          "appliedStructure": "simple" | "compound" | "complex",
          "techniques": string[],
          "wordChanges": [
            {
              "original": string,
              "replaced": string,
              "technique": string,
              "notes": string
            }
          ],
          "rulesExplanation": string[]
        }
      ]
    }
  ]
}`;

    const userPrompt = `Paraphrase the following ${paragraphs.length} paragraphs in ${tone} register to be significantly different from the original and optimized to bypass AI detection:\n\n` +
      JSON.stringify(
        paragraphs.map((p, idx) => ({
          paragraphIndex: idx,
          isHeading: Boolean(p.isHeading),
          text: p.text,
        })),
        null,
        2
      );

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
              temperature: 0.7,
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
