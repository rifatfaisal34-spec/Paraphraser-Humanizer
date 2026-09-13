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

    const systemPrompt = `You are a Senior Academic Editor, Linguistic Syntactic Architect, and Paraphrase Rule Planner.

CRITICAL INSTRUCTION:
DO NOT WRITE THE REWRITTEN SENTENCES OR PARAGRAPH YOURSELF!
DO NOT GENERATE REWRITTEN TEXT DIRECTLY!
If you write the paragraph yourself, AI detectors (GPTZero, Turnitin, Copyleaks, ZeroGPT) will detect generative token predictability and raise the AI detection percentage, ruining the human authenticity of the document.

Instead, your mission is to ANALYZE each sentence and SELECT which specific transformation rules and parameters from our extensive linguistic rulebook and dictionary are most suitable to apply:

OUR LINGUISTIC RULEBOOK & PARAMETERS:
1. "voice_transformation":
   - "voiceDirective": "keep" (DEFAULT - preserve natural active authorial voice) | "active" (only to simplify wordy passive) | NEVER force active research sentences into passive voice.
2. "clause_reordering":
   - "reorderClause": false (DEFAULT - preserve original natural sentence structure and avoid fragmented clauses or lists).
3. "nominalization":
   - "nominalizeVerb": string or null (select verb to nominalize into scholarly noun phrase: "analyze", "investigate", "evaluate", "demonstrate", "examine", "assess", "measure", "conclude", "correlate", "modernize")
4. "litotes_shift":
   - "litotesShift": true | false (shift affirmative like "significant" into scholarly litotes like "by no means negligible")
5. "fronting_topicalization":
   - "frontingPhrase": null (DEFAULT - do NOT inject artificial repetitive introductory frames like "In this empirical investigation," or "Within this framework,").
6. "human_discourse_marker":
   - "humanDiscourseMarker": null (DEFAULT - do NOT force artificial transitions like "Beyond this,", "Specifically,", "Equally important,". Only use when there is an abrupt transition that genuinely requires a connector, and NEVER use robotic "Furthermore", "Moreover", "In addition").
7. "synonym_substitutions":
   - "synonymSubstitutions": object mapping original word to preferred contextual synonym from the academic/professional dictionary.
   - MANDATORY RESTRICTIONS FOR SYNONYMS:
     * NEVER alter fixed multi-word scientific constructs: "systematic review" MUST NEVER become "ordered review". "social media use" or "problematic use" MUST NEVER have "use" replaced with "employ". "internal consistency" must remain verbatim.
     * NEVER alter numbers, statistical notations, sample sizes, or parenthetical metrics (e.g. "M = 31.41, SD = 7.78", "p < .001", "alpha = .89").
     * NEVER use artificial or purple-prose synonyms (e.g. do not substitute "deleterious" for "harmful/negative").
8. "sentence_cadence":
   - "splitSentence": boolean (split long compound sentences to boost burstiness)
   - "combineWithNext": boolean (merge with next short sentence)

STRICT GUARDS (MANDATORY):
- If the text is a section heading, document title, or fragment lacking a finite verb/predicate: set "isProperSentence": false, "skipReason": "Heading or non-sentence fragment", and empty planned rules.
- If the text contains words before a colon (e.g. "Note: ", "Table 1: "), extract that into "prefixToKeep", and only select rules for the remaining clause.

OUTPUT FORMAT:
Respond with ONLY valid JSON strictly adhering to this schema:
{
  "paragraphs": [
    {
      "paragraphIndex": number,
      "sentences": [
        {
          "sentenceIndex": number,
          "originalText": string,
          "isProperSentence": boolean,
          "skipReason": string | null,
          "prefixToKeep": string | null,
          "voiceDirective": "active" | "passive" | "keep",
          "reorderClause": boolean,
          "nominalizeVerb": string | null,
          "litotesShift": boolean,
          "frontingPhrase": string | null,
          "humanDiscourseMarker": string | null,
          "synonymSubstitutions": { [origWord: string]: string },
          "splitSentence": boolean,
          "combineWithNext": boolean,
          "selectedRules": string[]
        }
      ]
    }
  ]
}`;

    const userPrompt = `Analyze the following ${paragraphs.length} paragraphs in ${tone} register and return the linguistic rule transformation plan:\n\n` +
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
