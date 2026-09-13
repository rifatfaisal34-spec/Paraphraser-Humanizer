import React from 'react';
import { FileText, Download, Upload, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';

interface HeaderProps {
  fileName?: string;
  fileSize?: number;
  hasDocument: boolean;
  onDownload: () => void;
  onNewDocument: () => void;
  isDownloading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  fileName,
  fileSize,
  hasDocument,
  onDownload,
  onNewDocument,
  isDownloading,
}) => {
  const formattedSize = fileSize ? (fileSize > 1024 * 1024 ? `${(fileSize / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(fileSize / 1024)} KB`) : '';

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                Linguistics DOCX Paraphraser
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Deterministic Rule-Based NLP
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Syntax restructuring & tone adaptation while preserving exact Word XML formatting
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {hasDocument ? (
            <>
              {fileName && (
                <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-slate-100 rounded-md border border-slate-200 text-xs text-slate-700">
                  <span className="font-medium truncate max-w-44">{fileName}</span>
                  {formattedSize && <span className="text-slate-400">({formattedSize})</span>}
                </div>
              )}

              <button
                id="btn-new-document"
                onClick={onNewDocument}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors"
                title="Upload or load another document"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                Change File
              </button>

              <button
                id="btn-download-docx"
                onClick={onDownload}
                disabled={isDownloading}
                className="inline-flex items-center px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-md shadow-xs transition-colors"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Packaging DOCX...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download DOCX
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
              <span>No document loaded</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
