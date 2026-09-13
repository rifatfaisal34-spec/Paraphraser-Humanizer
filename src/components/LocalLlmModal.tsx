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
              <h3 className="text-base font-semibold text-white">Local LLM Configuration</h3>
              <p className="text-xs text-slate-400">Connect Google Gemma, Llama, or custom local runners</p>
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
              Inference Framework
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
                <div className="text-xs text-slate-400 mt-1">Recommended for Gemma 2, Mistral, Llama 3</div>
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
                <div className="text-xs text-slate-400 mt-1">OpenAI-compatible local HTTP servers</div>
              </button>
            </div>
          </div>

          {/* Endpoint URL Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Endpoint Address
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
                ? 'Standard Ollama server endpoint (default: http://localhost:11434 or http://127.0.0.1:11434)'
                : 'OpenAI-compatible server endpoint (e.g. http://localhost:1234/v1)'}
            </p>
          </div>

          {/* Model Name Input + Discovered Models */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Model Name / Tag
              </label>
              {testStatus?.models && testStatus.models.length > 0 && (
                <span className="text-[11px] text-emerald-400 font-medium">
                  {testStatus.models.length} local models detected
                </span>
              )}
            </div>

            {/* Quick Model Presets */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className="text-[11px] text-slate-400 mr-1">Quick Select:</span>
              {[
                { tag: 'gemma4', label: 'gemma4', badge: 'On Device' },
                { tag: 'gemma2', label: 'gemma2', badge: null },
                { tag: 'gemma:7b', label: 'gemma:7b', badge: null },
                { tag: 'gemma:2b', label: 'gemma:2b', badge: null },
              ].map(({ tag, label, badge }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setLocalConfig({ ...localConfig, modelName: tag })}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium border transition-all ${
                    localConfig.modelName === tag
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-1 ring-amber-500/40'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {label}
                  {badge && (
                    <span className="ml-1 text-[9px] bg-amber-500/30 text-amber-300 px-1 py-0.2 rounded font-semibold">
                      {badge}
                    </span>
                  )}
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
                      {m} {m === 'gemma4' ? '(Target Model)' : ''}
                    </option>
                  ))}
                  <option value="gemma4">gemma4 (Configured on Device)</option>
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
              Configured for <code className="text-amber-300 font-semibold">{localConfig.modelName}</code> on your device.
            </p>
          </div>

          {/* Proxy switch & Test Ping */}
          <div className="pt-2 border-t border-slate-800 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200">Server Proxy Routing</span>
                <span className="text-[11px] text-slate-400">
                  Enable if using a tunnel URL or local server proxy
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
                {isTesting ? 'Pinging Local Endpoint...' : 'Test Connection'}
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
                      Unreachable
                    </span>
                  )}
                </div>
              )}
            </div>

            {testStatus && !testStatus.online && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
                <div className="flex items-center space-x-1.5 font-semibold text-amber-300">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Why localhost:11434 works in a browser tab but is blocked here:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Opening <code className="text-amber-300">http://localhost:11434</code> in its own tab works because both are plain HTTP. But because this app runs over <code className="text-emerald-400">HTTPS</code> in the cloud, your browser blocks cross-origin connections to local machine ports for security.
                </p>
                <div className="bg-slate-950/90 p-2.5 rounded border border-amber-500/20 space-y-1.5">
                  <span className="text-[11px] font-semibold text-amber-300 block">
                    Fastest Fix (Instant 1-Line HTTPS Tunnel):
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Open PowerShell on your PC and run:
                  </p>
                  <pre className="text-[11px] text-amber-300 bg-slate-900 p-1.5 rounded font-mono select-all overflow-x-auto">
npx localtunnel --port 11434
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    Paste the provided <code className="text-amber-300">https://...</code> link into the <strong>Endpoint Address</strong> above and click <strong>Test Connection</strong>!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Guide & Solutions for Windows */}
          <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 text-xs space-y-3">
            <div className="flex items-center text-amber-300 font-semibold text-xs tracking-wide">
              <Terminal className="w-4 h-4 mr-1.5 text-amber-400" /> Windows & Local Connection Guide
            </div>

            {/* Reason 1: Windows Tray App */}
            <div className="space-y-1 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-200 font-semibold text-[11px] block">
                1. Set Windows System Environment Variable & Restart Ollama
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                On Windows, Ollama runs in the background system tray. A temporary terminal command doesn't change the tray app.
              </p>
              <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-1 mt-1 font-sans">
                <li>
                  Right-click the <strong className="text-amber-200">Ollama llama icon</strong> in your Windows Taskbar Tray (bottom right) and click <strong className="text-rose-300">Quit Ollama</strong>.
                </li>
                <li>
                  In PowerShell, set it permanently:
                  <pre className="mt-1 text-[11px] text-amber-300 bg-slate-950 p-2 rounded border border-slate-800 font-mono overflow-x-auto select-all">
[System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'User')
                  </pre>
                </li>
                <li>Re-open Ollama from your Start menu and run <code className="text-amber-300">ollama run gemma4</code>.</li>
              </ol>
            </div>

            {/* Reason 2: Browser Insecure Content or Tunnel */}
            <div className="space-y-1 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-200 font-semibold text-[11px] block">
                2. Browser HTTPS vs HTTP (Mixed Content)
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Because this web app runs over <code className="text-emerald-400">https://</code>, Chrome/Edge blocks requests to insecure <code className="text-amber-300">http://localhost</code>. Choose either:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1.5">
                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  <strong className="text-slate-200 block mb-0.5">Option A: Allow Insecure in Chrome</strong>
                  Click the <strong className="text-amber-300">Tune/Padlock icon</strong> left of the URL bar ➔ <em>Site settings</em> ➔ change <strong>Insecure content</strong> to <strong>Allow</strong> ➔ refresh the page.
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  <strong className="text-slate-200 block mb-0.5">Option B: 1-Line Free HTTPS Tunnel</strong>
                  Run in PowerShell:
                  <pre className="text-[10px] text-amber-300 bg-slate-900 px-1.5 py-0.5 mt-0.5 rounded font-mono select-all">
npx localtunnel --port 11434
                  </pre>
                  Copy the <code className="text-amber-300">https://...</code> URL into Endpoint above!
                </div>
              </div>
            </div>
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
            Apply Local LLM
          </button>
        </div>
      </div>
    </div>
  );
}
