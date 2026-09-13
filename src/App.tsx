/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  DocumentMetrics,
  ParaphraseConfig,
  ParagraphData,
  SentenceData,
  DEFAULT_CONFIG,
  ParaphraseProgress,
} from './types';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { MetricsBar } from './components/MetricsBar';
import { ParaphraseProgressBar } from './components/ParaphraseProgressBar';
import { DocxUploader } from './components/DocxUploader';
import { DocumentPreview } from './components/DocumentPreview';
import {
  parseDocx,
  exportParaphrasedDocx,
  createSampleDocx,
  ExtractedParagraph,
} from './docx/docxHandler';
import { paraphraseDocument, createInitialDocumentState } from './nlp/paraphraserEngine';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [zipInstance, setZipInstance] = useState<JSZip | null>(null);
  const [fileName, setFileName] = useState<string>('Academic_Research_Abstract.docx');
  const [fileSize, setFileSize] = useState<number>(18420);
  const [extractedParagraphs, setExtractedParagraphs] = useState<ExtractedParagraph[]>([]);
  const [paragraphs, setParagraphs] = useState<ParagraphData[]>([]);
  const [metrics, setMetrics] = useState<DocumentMetrics | null>(null);
  const [config, setConfig] = useState<ParaphraseConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<ParaphraseProgress | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [hasDocument, setHasDocument] = useState<boolean>(false);

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initial load: preload sample document so the user immediately sees a working app
  useEffect(() => {
    loadSampleDoc('academic');
  }, []);

  const showNotice = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setNotification({ type, message });
  };

  // Load a pre-made DOCX sample
  const loadSampleDoc = async (sampleType: 'academic' | 'business' | 'casual') => {
    setIsLoading(true);
    try {
      const sample = await createSampleDocx(sampleType);
      setZipInstance(sample.zipInstance);
      setFileName(sample.fileName);
      setFileSize(sample.blob.size);
      setExtractedParagraphs(sample.paragraphs);

      const initialConfig: ParaphraseConfig = {
        ...DEFAULT_CONFIG,
        tone: sampleType === 'academic' ? 'academic' : sampleType === 'casual' ? 'casual' : 'professional',
        voice: 'auto',
      };
      setConfig(initialConfig);

      // Initialize document preview with raw text and wait for user to click Apply
      const { paragraphs: initialParas, metrics: initialMetrics } = createInitialDocumentState(sample.paragraphs);
      setParagraphs(initialParas);
      setMetrics(initialMetrics);
      setHasDocument(true);
      showNotice('info', `Loaded ${sample.fileName} (${sample.paragraphs.length} paragraphs). Click "Apply" to paraphrase.`);
    } catch (err: any) {
      showNotice('error', `Failed to load sample: ${err.message}`);
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  // Handle uploaded DOCX file
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const parsed = await parseDocx(file, file.name);
      setZipInstance(parsed.zipInstance);
      setFileName(file.name);
      setFileSize(file.size);
      setExtractedParagraphs(parsed.paragraphs);

      // Initialize preview with raw text and wait for user to click Apply
      const { paragraphs: initialParas, metrics: initialMetrics } = createInitialDocumentState(parsed.paragraphs);
      setParagraphs(initialParas);
      setMetrics(initialMetrics);
      setHasDocument(true);
      showNotice('info', `Loaded ${file.name} with original styles. Click "Apply" to paraphrase.`);
    } catch (err: any) {
      showNotice('error', err.message || 'Failed to read DOCX document.');
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  // Handle direct text submission
  const handleRawTextSubmit = async (text: string, title: string) => {
    setIsLoading(true);
    try {
      const paras = text
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      // Create a fresh docx zip containing this text
      const zip = new JSZip();
      const safeTitle = title.trim() || 'Paraphrased Document';

      zip.file(
        '[Content_Types].xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`
      );
      zip.file(
        '_rels/.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`
      );

      const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${safeTitle}</w:t></w:r></w:p>
    ${paras.map((p) => `<w:p><w:r><w:t>${p}</w:t></w:r></w:p>`).join('')}
  </w:body>
</w:document>`;
      zip.file('word/document.xml', documentXml);

      const extracted: ExtractedParagraph[] = [
        { text: safeTitle, isHeading: true, headingLevel: 1, xmlNodeIndex: 0 },
        ...paras.map((p, idx) => ({ text: p, xmlNodeIndex: idx + 1 })),
      ];

      setZipInstance(zip);
      setFileName(`${safeTitle.replace(/\s+/g, '_')}.docx`);
      setFileSize(1024 * 12);
      setExtractedParagraphs(extracted);

      // Initialize preview with raw text and wait for user to click Apply
      const { paragraphs: initialParas, metrics: initialMetrics } = createInitialDocumentState(extracted);
      setParagraphs(initialParas);
      setMetrics(initialMetrics);
      setHasDocument(true);
      showNotice('info', 'Document loaded. Configure settings and click "Apply" to paraphrase.');
    } catch (err: any) {
      showNotice('error', err.message || 'Failed to process text.');
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  // Re-run paraphrasing on all paragraphs
  const handleApplyParaphrase = async () => {
    if (extractedParagraphs.length === 0) return;
    setIsLoading(true);
    try {
      const { paragraphs: newParas, metrics: newMetrics } = await paraphraseDocument(
        extractedParagraphs,
        config,
        (prog, currentParas) => {
          setProgress(prog);
          setParagraphs(currentParas);
        }
      );
      setParagraphs(newParas);
      setMetrics(newMetrics);
      if (newMetrics.fallbackNotice) {
        showNotice('warning', newMetrics.fallbackNotice);
      } else {
        showNotice(
          'success',
          newMetrics.usedEngine === 'ai'
            ? 'Completed Neural Sequence-to-Sequence abstractive rewrite.'
            : newMetrics.usedEngine === 'local_llm'
            ? `Completed rewrite using Local ${config.localLlm?.modelName || 'Gemma'} model.`
            : `Applied ${config.tone} linguistic transformations.`
        );
      }
    } catch (err: any) {
      const isLocal = config.engine === 'local_llm';
      const msg = isLocal
        ? `Local LLM Error: ${err.message}. Ensure your local runner (Ollama / LM Studio) is running.`
        : `Paraphrase notice: ${err.message}`;
      showNotice('error', msg);
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  // Update a single sentence modified via SentenceInspector or word replacement
  const handleUpdateSentence = (updatedSentence: SentenceData) => {
    setParagraphs((prev) => {
      return prev.map((p) => {
        if (p.id !== `p-${updatedSentence.paragraphIndex}`) return p;
        const updatedSentences = p.sentences.map((s) => (s.id === updatedSentence.id ? updatedSentence : s));
        const updatedParaText = updatedSentences.map((s) => s.paraphrasedText).join(' ');
        return {
          ...p,
          paraphrasedText: updatedParaText,
          sentences: updatedSentences,
        };
      });
    });

    // Recalculate metrics dynamically
    if (metrics) {
      setMetrics((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          techniqueStats: {
            ...prev.techniqueStats,
            voiceConversions:
              updatedSentence.appliedVoice !== updatedSentence.detectedVoice
                ? prev.techniqueStats.voiceConversions + 1
                : prev.techniqueStats.voiceConversions,
          },
        };
      });
    }
  };

  // Handle sentence split
  const handleSplitSentence = (sentenceId: string, newSentences: string[]) => {
    setParagraphs((prev) => {
      return prev.map((p) => {
        const foundIdx = p.sentences.findIndex((s) => s.id === sentenceId);
        if (foundIdx === -1) return p;

        const targetSentence = p.sentences[foundIdx];
        const splitTimestamp = Date.now();
        const newSentenceDataList: SentenceData[] = newSentences.map((sText, subIdx) => ({
          id: `sent-split-${splitTimestamp}-${subIdx}-${Math.random().toString(36).slice(2, 7)}`,
          originalText: subIdx === 0 ? targetSentence.originalText : '',
          paraphrasedText: sText,
          detectedVoice: targetSentence.detectedVoice,
          appliedVoice: targetSentence.appliedVoice,
          detectedStructure: 'simple',
          appliedStructure: 'simple',
          techniques: [...targetSentence.techniques, 'sentence_split'],
          wordChanges: [],
          rulesExplanation: ['Sentence divided cleanly into independent coordinate statement.'],
          isManuallyEdited: true,
          paragraphIndex: targetSentence.paragraphIndex,
          sentenceIndex: targetSentence.sentenceIndex + subIdx,
        }));

        const updatedSentences = [
          ...p.sentences.slice(0, foundIdx),
          ...newSentenceDataList,
          ...p.sentences.slice(foundIdx + 1),
        ].map((s, idx) => ({ ...s, sentenceIndex: idx }));

        return {
          ...p,
          paraphrasedText: updatedSentences.map((s) => s.paraphrasedText).join(' '),
          sentences: updatedSentences,
        };
      });
    });
    showNotice('info', 'Split dense sentence into two cohesive statements.');
  };

  // Export and download DOCX
  const handleDownloadDocx = async () => {
    if (!zipInstance || paragraphs.length === 0) {
      showNotice('error', 'No document available to download.');
      return;
    }

    setIsDownloading(true);
    try {
      const outputName = fileName.replace(/\.docx$/i, '') + `_paraphrased_${config.tone}.docx`;
      const { blob, fileName: dlName } = await exportParaphrasedDocx(zipInstance, paragraphs, outputName);

      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = dlName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotice('success', `Downloaded ${dlName} with exact original styles preserved.`);
    } catch (err: any) {
      showNotice('error', `Download failed: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-lg shadow-lg border text-xs font-medium animate-in fade-in slide-in-from-bottom-2 ${
            notification.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : notification.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : notification.type === 'warning'
              ? 'bg-amber-950 text-amber-200 border-amber-700/80 shadow-amber-950/40'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle
              className={`w-4 h-4 shrink-0 ${
                notification.type === 'warning' ? 'text-amber-400' : 'text-rose-400'
              }`}
            />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <Header
        fileName={fileName}
        fileSize={fileSize}
        hasDocument={hasDocument}
        onDownload={handleDownloadDocx}
        onNewDocument={() => setHasDocument(false)}
        isDownloading={isDownloading}
      />

      {/* Control Bar */}
      <ControlBar
        config={config}
        onChangeConfig={(newConfig) => {
          setConfig(newConfig);
        }}
        onApplyParaphrase={handleApplyParaphrase}
        isProcessing={isLoading}
      />

      {/* Real-time Progress Bar for big documents */}
      <ParaphraseProgressBar
        progress={progress}
        engine={config.engine}
        modelName={config.localLlm?.modelName}
      />

      {/* Real-time Metrics */}
      {metrics && <MetricsBar metrics={metrics} targetTone={config.tone} />}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {!hasDocument ? (
          <DocxUploader
            onFileSelected={handleFileUpload}
            onSampleSelected={loadSampleDoc}
            onRawTextSubmitted={handleRawTextSubmit}
            isLoading={isLoading}
          />
        ) : (
          <DocumentPreview
            paragraphs={paragraphs}
            tone={config.tone}
            onUpdateSentence={handleUpdateSentence}
            onSplitSentence={handleSplitSentence}
            onDownloadDocx={handleDownloadDocx}
            fileName={fileName}
            isProcessing={isLoading}
            processingIndex={progress?.currentParagraphIndex ?? null}
          />
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Linguistics DOCX Paraphraser • OpenXML Preservation Engine</span>
          <span className="text-slate-400">
            Rules: Passive/Active voice • Clause Inversion • Word Class Derivations • Litotes Polarity • Synonym Registers
          </span>
        </div>
      </footer>
    </div>
  );
}
