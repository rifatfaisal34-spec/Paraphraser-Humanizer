import React, { useState, useEffect } from 'react';
import { LocalLlmConfig } from '../types';
import { testLocalLlmConnection, LocalLlmStatus } from '../nlp/localLlmClient';
import {
  X,
  Server,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Terminal,
  Zap,
} from 'lucide-react';

interface LocalLlmModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LocalLlmConfig;
  onChange: (updated: LocalLlmConfig) => void;
}

export function LocalLlmModal({ isOpen, onClose, config, onChange }: LocalLlmModalProps) {
  const [localConfig, setLocalConfig] = useState<LocalLlmConfig>(config);
  const [testStatus, setTestStatus] = useState<LocalLlmStatus | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  if (!isOpen) return null;

  const handleTestPing = async () => {
    setIsTesting(true);
    setTestStatus(null);
    try {
      const res = await testLocalLlmConnection(
        localConfig.endpoint,
        localConfig.provider,
        localConfig.useServerProxy
      );
      setTestStatus(res);
      if (res.online && res.models.length > 0 && !res.models.includes(localConfig.modelName)) {
        // If current model isn't in list, auto-select first available or gemma if present
        const gemmaModel = res.models.find((m) => m.toLowerCase().includes('gemma'));
        if (gemmaModel) {
          setLocalConfig((prev) => ({ ...prev, modelName: gemmaModel }));
        } else if (res.models[0]) {
          setLocalConfig((prev) => ({ ...prev, modelName: res.models[0] }));
        }
      }
    } catch (err: any) {
      setTestStatus({
        online: false,
        models: [],
        error: err.message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onChange(localConfig);
    onClose();
  };

  return (
    <div
      id="modal-local-llm"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Local LLM Setup</h3>
              <p className="text-xs text-slate-400">Connect on-device models via Ollama or OpenAI-compatible servers</p>
            </div>
          </div>
          <button
            id="btn-close-local-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto">
          {/* Provider Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Server Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-provider-ollama"
                onClick={() =>
                  setLocalConfig((prev) => ({
                    ...prev,
                    provider: 'ollama',
                    endpoint: prev.endpoint.includes('1234') ? 'http://localhost:11434' : prev.endpoint,
                  }))
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  localConfig.provider === 'ollama'
                    ? 'border-amber-500/80 bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/50'
                    : 'border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-sm flex items-center justify-between">
                  <span>Ollama</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Port 11434</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">Default for Gemma, Llama 3, Mistral</div>
              </button>

              <button
                type="button"
                id="btn-provider-openai"
                onClick={() =>
                  setLocalConfig((prev) => ({
                    ...prev,
                    provider: 'openai_compatible',
                    endpoint: prev.endpoint.includes('11434') ? 'http://localhost:1234' : prev.endpoint,
                  }))
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  localConfig.provider === 'openai_compatible'
                    ? 'border-amber-500/80 bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/50'
                    : 'border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-sm flex items-center justify-between">
                  <span>LM Studio / vLLM</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Port 1234 / 8000</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">OpenAI API compatible endpoints</div>
              </button>
            </div>
          </div>

          {/* Endpoint URL Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Endpoint URL
            </label>
            <div className="flex rounded-xl overflow-hidden border border-slate-700 bg-slate-800/80 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
              <span className="inline-flex items-center px-3 text-slate-400 bg-slate-800 text-xs border-r border-slate-700">
                <Server className="w-3.5 h-3.5 mr-1" /> URL
              </span>
              <input
                id="input-local-endpoint"
                type="text"
                value={localConfig.endpoint}
                onChange={(e) => setLocalConfig({ ...localConfig, endpoint: e.target.value })}
                placeholder="http://localhost:11434"
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {localConfig.provider === 'ollama'
                ? 'Local server address (e.g. http://localhost:11434 or your HTTPS tunnel URL)'
                : 'Local server address (e.g. http://localhost:1234 or your HTTPS tunnel URL)'}
            </p>
          </div>

          {/* Model Name Input + Discovered Models */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Model Name
              </label>
              {testStatus?.models && testStatus.models.length > 0 && (
                <span className="text-[11px] text-emerald-400 font-medium">
                  {testStatus.models.length} model{testStatus.models.length === 1 ? '' : 's'} available
                </span>
              )}
            </div>

            {/* Quick Model Presets */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-[11px] text-slate-400 mr-1">Popular:</span>
              {[
                { tag: 'gemma4', label: 'gemma4' },
                { tag: 'gemma2', label: 'gemma2' },
                { tag: 'llama3.2', label: 'llama3.2' },
                { tag: 'mistral', label: 'mistral' },
              ].map(({ tag, label }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setLocalConfig({ ...localConfig, modelName: tag })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                    localConfig.modelName === tag
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {testStatus?.models && testStatus.models.length > 0 ? (
              <div className="space-y-1.5">
                <select
                  id="select-local-model"
                  value={localConfig.modelName}
                  onChange={(e) => setLocalConfig({ ...localConfig, modelName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                >
                  {testStatus.models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="__custom__">+ Enter custom model name...</option>
                </select>
                {localConfig.modelName === '__custom__' && (
                  <input
                    type="text"
                    onChange={(e) => setLocalConfig({ ...localConfig, modelName: e.target.value })}
                    placeholder="e.g. gemma4"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:border-amber-500"
                  />
                )}
              </div>
            ) : (
              <input
                id="input-local-model"
                type="text"
                value={localConfig.modelName}
                onChange={(e) => setLocalConfig({ ...localConfig, modelName: e.target.value })}
                placeholder="gemma4"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            )}
            <p className="text-[11px] text-slate-400 mt-1">
              Active model: <code className="text-amber-300 font-semibold">{localConfig.modelName}</code>
            </p>
          </div>

          {/* Proxy switch & Test Ping */}
          <div className="pt-2 border-t border-slate-800 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200">Backend Proxy Routing</span>
                <span className="text-[11px] text-slate-400">
                  Routes requests through app server (bypasses browser CORS & mixed-content restrictions)
                </span>
              </div>
              <input
                type="checkbox"
                id="check-server-proxy"
                checked={localConfig.useServerProxy}
                onChange={(e) => setLocalConfig({ ...localConfig, useServerProxy: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-800 border-slate-700"
              />
            </div>

            {/* Test Connection Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                id="btn-test-local-ping"
                onClick={handleTestPing}
                disabled={isTesting}
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isTesting ? 'animate-spin text-amber-400' : ''}`} />
                {isTesting ? 'Testing Connection...' : 'Test Connection'}
              </button>

              {testStatus && (
                <div className="text-xs flex items-center">
                  {testStatus.online ? (
                    <span className="text-emerald-400 flex items-center font-medium">
                      <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
                      Connected ({testStatus.latencyMs}ms)
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center font-medium" title={testStatus.error}>
                      <AlertCircle className="w-4 h-4 mr-1 text-rose-400" />
                      Cannot Connect
                    </span>
                  )}
                </div>
              )}
            </div>

            {testStatus && !testStatus.online && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 text-xs space-y-2.5">
                <div className="flex items-center space-x-2 text-rose-300 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Connection Failed</span>
                </div>
                {testStatus.error && (
                  <p className="text-[11px] text-slate-300 font-mono bg-slate-900 p-2 rounded border border-slate-800">
                    {testStatus.error}
                  </p>
                )}

                <div className="pt-1 space-y-2">
                  <span className="text-[11px] font-semibold text-slate-200 block">
                    Troubleshooting Steps:
                  </span>
                  <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-amber-300 block mb-1">Option 1: Allow Cross-Origin (Ollama on Windows/Mac/Linux)</strong>
                      <p className="mb-1.5 text-slate-300">
                        Quit Ollama from your system tray/taskbar, then run in terminal to enable origins:
                      </p>
                      <pre className="text-[10px] text-amber-300 bg-slate-950 p-1.5 rounded font-mono select-all overflow-x-auto">
OLLAMA_ORIGINS="*" ollama serve
                      </pre>
                      <span className="text-slate-500 text-[10px] block mt-1">
                        On Windows PowerShell: <code className="text-amber-300">[System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'User')</code>
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-emerald-300 block mb-1">Option 2: HTTPS Tunnel (Recommended for cloud preview)</strong>
                      <p className="mb-1 text-slate-300">
                        Because this web app runs over secure HTTPS, expose port 11434 with a free tunnel:
                      </p>
                      <pre className="text-[10px] text-emerald-300 bg-slate-950 p-1.5 rounded font-mono select-all overflow-x-auto">
npx localtunnel --port 11434
                      </pre>
                      <p className="mt-1 text-slate-400 text-[10px]">
                        Paste the generated <code className="text-emerald-300">https://...</code> URL into the Endpoint URL field above.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-900/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="btn-save-local-config"
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
          >
            <Zap className="w-3.5 h-3.5 mr-1" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
