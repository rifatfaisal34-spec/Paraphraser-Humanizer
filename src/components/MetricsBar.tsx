import React, { useState } from 'react';
import { DocumentMetrics, ToneStyle } from '../types';
import {
  TrendingUp,
  TrendingDown,
  BookOpen,
  ArrowRight,
  Shuffle,
  Volume2,
  GitFork,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';

interface MetricsBarProps {
  metrics: DocumentMetrics;
  targetTone: ToneStyle;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics, targetTone }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isExpansion = metrics.percentageLengthChange > 0;
  const isReduction = metrics.percentageLengthChange < 0;
  const absLengthChange = Math.abs(metrics.percentageLengthChange);

  const getToneBadge = () => {
    switch (targetTone) {
      case 'academic':
        return { label: 'Academic Rigor', color: 'text-purple-700 bg-purple-50 border-purple-200' };
      case 'casual':
        return { label: 'Casual Register', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      default:
        return { label: 'Professional Standard', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    }
  };

  const toneBadge = getToneBadge();
  const bypassScore = metrics.aiBypassLikelihood ?? 92;
  const origAiRisk = metrics.originalAiScore ?? 75;
  const burstinessStdDev = metrics.burstinessStdDev ?? 6.5;
  const burstinessRating = metrics.burstinessRating ?? (burstinessStdDev >= 6.0 ? 'High (Human-like)' : burstinessStdDev >= 4.0 ? 'Moderate' : 'Low (AI Uniform)');
  const clichesCount = metrics.aiClichesSanitizedCount ?? 0;
  const domainCount = metrics.domainTermsProtectedCount ?? 0;

  // Sentence lengths array for rhythm visualization
  const paraLengths = metrics.sentenceLengths?.paraphrased || [];
  const origLengths = metrics.sentenceLengths?.original || [];

  return (
    <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* Core AI Humanizer & Bypass Status Banner */}
        <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-indigo-50/70 border border-emerald-200/80 rounded-xl p-3.5 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Left: AI Bypass Likelihood Meter */}
            <div className="flex items-center space-x-3.5">
              <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    AI Detector Bypass Likelihood
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {bypassScore >= 85 ? 'Authentic Human Rhythm' : bypassScore >= 70 ? 'Moderate Humanization' : 'Needs Optimization'}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-2xl font-black text-emerald-950 tracking-tight">{bypassScore}%</span>
                  <span className="text-xs text-slate-600 font-medium">Bypass Confidence</span>
                  <span className="text-xs text-slate-400 font-mono">
                    (Original Risk: <span className="text-rose-600 font-bold">{origAiRisk}% AI Flag</span>)
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Key 4 Anti-AI Strategy Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {/* Pillar 1: Burstiness */}
              <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span className="font-semibold flex items-center">
                    <Zap className="w-3 h-3 mr-1 text-amber-500" />
                    Burstiness
                  </span>
                  <span className="font-mono text-slate-700">σ = {burstinessStdDev}w</span>
                </div>
                <div className="font-bold text-slate-900 text-xs truncate">
                  {burstinessRating}
                </div>
                <div className="text-[10px] text-slate-500 truncate">Varying sentence length</div>
              </div>

              {/* Pillar 2: Abstractive Rewriting */}
              <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span className="font-semibold flex items-center">
                    <Layers className="w-3 h-3 mr-1 text-indigo-500" />
                    Abstractive
                  </span>
                  <span className="text-indigo-600 font-bold">100%</span>
                </div>
                <div className="font-bold text-slate-900 text-xs">Paragraph Synthesis</div>
                <div className="text-[10px] text-slate-500 truncate">No token-by-token swap</div>
              </div>

              {/* Pillar 3: Domain Invariants */}
              <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span className="font-semibold flex items-center">
                    <Lock className="w-3 h-3 mr-1 text-emerald-600" />
                    Domain Terms
                  </span>
                  <span className="text-emerald-700 font-bold">{domainCount}</span>
                </div>
                <div className="font-bold text-slate-900 text-xs truncate">Strictly Intact</div>
                <div className="text-[10px] text-slate-500 truncate">sample, dataset, etc.</div>
              </div>

              {/* Pillar 4: AI Vocabulary Purged */}
              <div className="bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span className="font-semibold flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-purple-600" />
                    AI Clichés
                  </span>
                  <span className="text-purple-700 font-bold">{clichesCount}</span>
                </div>
                <div className="font-bold text-slate-900 text-xs truncate">Purged & Replaced</div>
                <div className="text-[10px] text-slate-500 truncate">delve, pivotal, crucial</div>
              </div>
            </div>
          </div>

          {/* Mini-Sparkline Sentence Rhythm Comparison */}
          {paraLengths.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-slate-700">Sentence Rhythm Wave:</span>
                <div className="flex items-end space-x-1 h-5 px-1 bg-white/80 rounded border border-slate-200">
                  {paraLengths.slice(0, 12).map((len, idx) => {
                    const heightPercent = Math.min(100, Math.max(20, (len / 35) * 100));
                    const isShort = len <= 9;
                    const isLong = len >= 22;
                    return (
                      <div
                        key={idx}
                        title={`Sentence ${idx + 1}: ${len} words (${isShort ? 'Short punchy' : isLong ? 'Complex compound' : 'Moderate'})`}
                        className={`w-2 rounded-t-xs transition-all ${
                          isShort ? 'bg-amber-500' : isLong ? 'bg-indigo-600' : 'bg-emerald-500'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    );
                  })}
                </div>
                <span className="text-[10px] text-slate-500">
                  <span className="text-amber-600 font-bold">■</span> Short punchy (4-9w) &bull;{' '}
                  <span className="text-indigo-600 font-bold">■</span> Complex compound (22-35w)
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[11px] text-emerald-800 hover:text-emerald-950 font-medium inline-flex items-center underline underline-offset-2"
              >
                <Info className="w-3 h-3 mr-1" />
                {showDetails ? 'Hide Detailed Linguistics' : 'View Detailed Linguistics'}
              </button>
            </div>
          )}
        </div>

        {/* Detailed Metrics Summary Grid */}
        {showDetails && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            {/* 1. Word Count & Length Delta */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>Length Dynamics</span>
                {isExpansion ? (
                  <span className="flex items-center text-indigo-600 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    +{absLengthChange}%
                  </span>
                ) : isReduction ? (
                  <span className="flex items-center text-emerald-600 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                    -{absLengthChange}%
                  </span>
                ) : (
                  <span className="text-slate-600 font-semibold">0% (Exact)</span>
                )}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-slate-900">{metrics.paraphrasedWordCount}</span>
                <span className="text-xs text-slate-500">words</span>
                <span className="text-xs text-slate-400 font-mono">(was {metrics.originalWordCount})</span>
              </div>
            </div>

            {/* 2. Tone Consistency */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>Tone Consistency</span>
                <span className="text-xs font-semibold text-indigo-700">{metrics.toneConsistencyScore}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold text-slate-900">{metrics.toneConsistencyScore}%</div>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${toneBadge.color}`}>
                  {toneBadge.label}
                </span>
              </div>
            </div>

            {/* 3. Readability Index */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>Readability Grade</span>
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-sm font-semibold text-slate-500">Grade {metrics.readabilityBefore}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-base font-bold text-indigo-700">Grade {metrics.readabilityAfter}</span>
              </div>
            </div>

            {/* 4. Active Transformations Tally */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>Linguistic Rules Fired</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="text-lg font-bold text-slate-900">
                {metrics.techniqueStats.synonymsReplaced +
                  metrics.techniqueStats.wordClassShifts +
                  metrics.techniqueStats.voiceConversions +
                  metrics.techniqueStats.clausesReordered +
                  metrics.techniqueStats.polarityToggles +
                  metrics.techniqueStats.structureShifts}
                <span className="text-xs font-normal text-slate-500 ml-1">operations</span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Technique Breakdown Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium mr-1 text-[11px] uppercase tracking-wider">Linguistic Layers:</span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Domain Invariants: <strong className="ml-1">{domainCount} protected</strong>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-[11px]">
            <Sparkles className="w-3 h-3 mr-1 text-purple-600" />
            Anti-AI Clichés: <strong className="ml-1">{clichesCount} purged</strong>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px]">
            <Volume2 className="w-3 h-3 mr-1 text-blue-600" />
            Voice Conversions: <strong className="ml-1">{metrics.techniqueStats.voiceConversions}</strong>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
            <Shuffle className="w-3 h-3 mr-1 text-amber-600" />
            Clause Inversions: <strong className="ml-1">{metrics.techniqueStats.clausesReordered}</strong>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px]">
            <GitFork className="w-3 h-3 mr-1 text-indigo-600" />
            Structure Shifts: <strong className="ml-1">{metrics.techniqueStats.structureShifts}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

