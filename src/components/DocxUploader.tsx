import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, BookOpen, Briefcase, MessageSquare, Edit3, ArrowRight } from 'lucide-react';
import { createSampleDocx } from '../docx/docxHandler';

interface DocxUploaderProps {
  onFileSelected: (file: File) => void;
  onSampleSelected: (sampleType: 'academic' | 'business' | 'casual') => void;
  onRawTextSubmitted: (text: string, title: string) => void;
  isLoading?: boolean;
}

export const DocxUploader: React.FC<DocxUploaderProps> = ({
  onFileSelected,
  onSampleSelected,
  onRawTextSubmitted,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [customText, setCustomText] = useState(
    'The experimental research was conducted by our team to analyze algorithm efficiency. Because legacy infrastructure had severe latency constraints, a revised framework was developed by the engineers. The data is significant and results show that processing speed is good.'
  );
  const [customTitle, setCustomTitle] = useState('My Linguistic Paraphrase Document');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.docx')) {
        onFileSelected(file);
      } else {
        alert('Please upload a Microsoft Word (.docx) document.');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.endsWith('.docx')) {
        onFileSelected(file);
      } else {
        alert('Please upload a Microsoft Word (.docx) document.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Tab switch: Upload DOCX vs Paste Text */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
          <button
            id="tab-upload-docx"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center ${
              activeTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            Upload Word Document (.docx)
          </button>
          <button
            id="tab-paste-text"
            onClick={() => setActiveTab('text')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center ${
              activeTab === 'text' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            Direct Text Input
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div className="space-y-6">
          {/* Main Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer bg-white ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">
              Drag and drop your Word (.docx) document here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Original font styles, tables, headings, and paragraph margins will be preserved 100%
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition-colors">
                Browse Files
              </span>
            </div>
          </div>

          {/* Quick Preloaded Sample Documents */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Or load a pre-configured sample document to test:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Academic Sample */}
              <button
                id="btn-sample-academic"
                onClick={() => onSampleSelected('academic')}
                disabled={isLoading}
                className="p-3.5 text-left rounded-lg border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40 transition-all text-xs group cursor-pointer shadow-xs"
              >
                <div className="flex items-center text-purple-700 font-semibold mb-1">
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  Academic Paper Abstract
                </div>
                <p className="text-slate-500 line-clamp-2 text-[11px]">
                  Quantum computing study with passive voice, nominalized clauses, and research hypotheses.
                </p>
                <div className="mt-2 text-purple-600 font-medium flex items-center text-[11px] group-hover:translate-x-0.5 transition-transform">
                  Load Academic DOCX <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </button>

              {/* Business Sample */}
              <button
                id="btn-sample-business"
                onClick={() => onSampleSelected('business')}
                disabled={isLoading}
                className="p-3.5 text-left rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 transition-all text-xs group cursor-pointer shadow-xs"
              >
                <div className="flex items-center text-blue-700 font-semibold mb-1">
                  <Briefcase className="w-4 h-4 mr-1.5" />
                  Executive Proposal
                </div>
                <p className="text-slate-500 line-clamp-2 text-[11px]">
                  Operational modernization brief featuring passive audits, cost inquiries, and team milestones.
                </p>
                <div className="mt-2 text-blue-600 font-medium flex items-center text-[11px] group-hover:translate-x-0.5 transition-transform">
                  Load Business DOCX <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </button>

              {/* Casual Sample */}
              <button
                id="btn-sample-casual"
                onClick={() => onSampleSelected('casual')}
                disabled={isLoading}
                className="p-3.5 text-left rounded-lg border border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/40 transition-all text-xs group cursor-pointer shadow-xs"
              >
                <div className="flex items-center text-amber-700 font-semibold mb-1">
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  Casual Team Sync
                </div>
                <p className="text-slate-500 line-clamp-2 text-[11px]">
                  Informal release notes with coordinate sentences, straightforward vocabulary, and team updates.
                </p>
                <div className="mt-2 text-amber-600 font-medium flex items-center text-[11px] group-hover:translate-x-0.5 transition-transform">
                  Load Casual DOCX <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Direct Text Input Mode */
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
              placeholder="e.g. Research Methodology Review"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Text (Multiple paragraphs supported)
            </label>
            <textarea
              rows={6}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden leading-relaxed font-sans text-slate-800"
              placeholder="Enter text to paraphrase with grammatical transformations..."
            />
          </div>

          <div className="flex justify-end">
            <button
              id="btn-process-text"
              onClick={() => onRawTextSubmitted(customText, customTitle)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Process & Generate DOCX
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
