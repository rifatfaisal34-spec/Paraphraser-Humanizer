import React, { useState } from 'react';
import {
  ParaphraseConfig,
  ToneStyle,
} from '../types';
import {
  Sliders,
  Shield,
  RefreshCw,
  Zap,
  Sparkles,
  Cpu,
  Settings2,
  Terminal,
} from 'lucide-react';
import { LocalLlmModal } from './LocalLlmModal';

interface ControlBarProps {
  config: ParaphraseConfig;
  onChangeConfig: (newConfig: ParaphraseConfig) => void;
  onApplyParaphrase: () => void;
  isProcessing?: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  config,
  onChangeConfig,
  onApplyParaphrase,
  isProcessing,
}) => {
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);

  const update = <K extends keyof ParaphraseConfig>(key: K, value: ParaphraseConfig[K]) => {
    onChangeConfig({ ...config, [key]: value });
  };

  return (
    <div className="bg-slate-900 text-slate-100 py-3 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Primary Controls: Engine Mode, Tone Style, Technical Protection */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Engine Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400" />
              Engine:
            </span>
            <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
              <button
                id="btn-engine-ai"
                onClick={() => update('engine', 'ai')}
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  config.engine === 'ai'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title="Neural Abstractive Rewriting powered by Gemini"
              >
                <Sparkles className="w-3 h-3 mr-1 text-purple-200" />
                Cloud AI
              </button>

              <div className="inline-flex items-center">
                <button
                  id="btn-engine-local"
                  onClick={() => update('engine', 'local_llm')}
                  className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-l-md transition-all ${
                    config.engine === 'local_llm'
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title="Run with local Gemma, Llama, or custom Ollama / LM Studio models"
                >
                  <Terminal className="w-3 h-3 mr-1 text-amber-900" />
                  Local LLM
                </button>
                <button
                  id="btn-config-local-llm"
                  onClick={() => setIsLocalModalOpen(true)}
                  className={`px-1.5 py-1 text-xs rounded-r-md transition-all border-l border-slate-700 ${
                    config.engine === 'local_llm'
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title="Configure Local LLM Endpoint & Model"
                >
                  <Settings2 className="w-3 h-3" />
                </button>
              </div>

              <button
                id="btn-engine-rules"
                onClick={() => update('engine', 'rule_based')}
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  config.engine === 'rule_based'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title="Deterministic Linguistic Transformations (POS-aware & offline)"
              >
                <Cpu className="w-3 h-3 mr-1 text-slate-300" />
                Linguistic Rules
              </button>
            </div>

            {config.engine === 'local_llm' && (
              <button
                type="button"
                onClick={() => setIsLocalModalOpen(true)}
                className="hidden xl:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] hover:bg-amber-500/25 transition-colors cursor-pointer"
                title="Click to edit local LLM settings"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>{config.localLlm?.modelName || 'gemma4'}</span>
              </button>
            )}
          </div>

          {/* Tone Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center">
              <Sliders className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              Tone:
            </span>
            <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
              {(['professional', 'academic', 'casual'] as ToneStyle[]).map((t) => {
                const isActive = config.tone === t;
                return (
                  <button
                    key={t}
                    id={`btn-tone-${t}`}
                    onClick={() => update('tone', t)}
                    className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safeguard Domain Terms & Citations */}
          <label className="inline-flex items-center cursor-pointer select-none space-x-1.5 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg hover:bg-emerald-950/60 transition-colors" title="Guarantees scientific terms like sample, dataset, correlated, and citations are preserved">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input
              id="cb-protect-tech"
              type="checkbox"
              checked={config.preserveTechnicalTerms}
              onChange={(e) => update('preserveTechnicalTerms', e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-medium">Domain Invariants</span>
          </label>

          {/* High Burstiness Toggle */}
          <label className="inline-flex items-center cursor-pointer select-none space-x-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1.5 rounded-lg hover:bg-amber-950/60 transition-colors" title="Enforces high burstiness by alternating punchy short sentences with complex compound structures">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <input
              id="cb-burstiness"
              type="checkbox"
              checked={config.enforceBurstiness ?? true}
              onChange={(e) => update('enforceBurstiness', e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-medium">High Burstiness</span>
          </label>

          {/* Purge AI Vocabulary */}
          <label className="inline-flex items-center cursor-pointer select-none space-x-1.5 text-xs text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2.5 py-1.5 rounded-lg hover:bg-purple-950/60 transition-colors" title="Strips overused AI buzzwords (furthermore, pivotal, delve, crucial, testament)">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <input
              id="cb-strip-cliches"
              type="checkbox"
              checked={config.stripAiVocabulary ?? true}
              onChange={(e) => update('stripAiVocabulary', e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 text-purple-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-medium">Purge AI Clichés</span>
          </label>
        </div>

        {/* Primary Action Button */}
        <button
          id="btn-run-paraphraser"
          onClick={onApplyParaphrase}
          disabled={isProcessing}
          className="inline-flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-1.5 text-amber-300" />
              Apply
            </>
          )}
        </button>
      </div>

      {/* Local LLM Settings Modal */}
      <LocalLlmModal
        isOpen={isLocalModalOpen}
        onClose={() => setIsLocalModalOpen(false)}
        config={config.localLlm}
        onChange={(newLocalLlmConfig) => {
          onChangeConfig({
            ...config,
            engine: 'local_llm',
            localLlm: newLocalLlmConfig,
          });
        }}
      />
    </div>
  );
};
