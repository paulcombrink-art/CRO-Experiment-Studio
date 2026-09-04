import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Code2,
  Globe,
  FileCode2,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Copy,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useCro } from '../context/CroContext';
import { INITIAL_SNAPSHOTS } from '../data/sampleSnapshots';

interface HtmlCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

export const HtmlCaptureModal: React.FC<HtmlCaptureModalProps> = ({
  isOpen,
  onClose,
  initialUrl,
}) => {
  const {
    targetUrl,
    setTargetUrl,
    addSnapshot,
    selectedClientId,
    currentExperiment,
    updateExperiment,
    triggerLiveReload,
    addExecutionLog,
  } = useCro();

  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [snapshotName, setSnapshotName] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [copiedShortcut, setCopiedShortcut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const defaultUrl =
        initialUrl || (targetUrl && !targetUrl.startsWith('demo://') && !targetUrl.startsWith('snapshot://') ? targetUrl : '');
      setPageUrl(defaultUrl || 'https://www.nikon.co.uk/en_GB/product/cameras/compact/coolpix-p1100-VQA170EA');

      if (defaultUrl.includes('nikon.co.uk') || !snapshotName) {
        setSnapshotName('Nikon Coolpix P1100 Captured PDP');
      }
    }
  }, [isOpen, initialUrl, targetUrl]);

  if (!isOpen) return null;

  const htmlLength = htmlContent.trim().length;
  const lineCount = htmlContent ? htmlContent.split('\n').length : 0;
  const hasHtmlTag = /<html/i.test(htmlContent);
  const hasBodyTag = /<body/i.test(htmlContent);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setHtmlContent(content);
        if (!snapshotName) {
          setSnapshotName(file.name.replace(/\.(html|htm)$/i, ''));
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSampleNikon = () => {
    const sample = INITIAL_SNAPSHOTS.find((s) => s.id === 'snap-nikon-coolpix') || INITIAL_SNAPSHOTS[0];
    if (sample) {
      setHtmlContent(sample.html);
      setSnapshotName(sample.name);
      setPageUrl(sample.originalUrl);
      addExecutionLog('info', 'Loaded Nikon Coolpix P1100 sample HTML snapshot');
    }
  };

  const handleSaveAndPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!htmlContent.trim()) {
      alert('Please paste or upload HTML source code first.');
      return;
    }

    const finalUrl = pageUrl.trim() || 'https://www.nikon.co.uk/en_GB/product/cameras/compact/coolpix-p1100-VQA170EA';
    const finalName = snapshotName.trim() || 'Captured Page Snapshot';

    const newSnapshotId = addSnapshot({
      name: finalName,
      originalUrl: finalUrl,
      html: htmlContent,
      clientId: selectedClientId,
      description: `Captured from ${finalUrl}`,
    });

    const snapshotUrl = `snapshot://${newSnapshotId}`;
    setTargetUrl(snapshotUrl);

    if (currentExperiment) {
      updateExperiment(currentExperiment.id, {
        targetUrl: snapshotUrl,
      });
    }

    triggerLiveReload();
    addExecutionLog('success', `Live preview loaded for snapshot: ${finalName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Quick Page HTML Capture</h2>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200 uppercase tracking-wide">
                  Bypasses 403 Bot Blocks
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Capture the HTML source from any website behind Cloudflare/Akamai to experiment instantly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSaveAndPreview} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 3-Step Quick Guide Banner */}
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>How to capture HTML in 3 quick steps:</span>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleNikon}
                className="text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-100 border border-blue-300 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                title="Load preloaded Nikon product page HTML immediately"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Load Sample Nikon PDP HTML</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs text-blue-950">
              <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
                <div className="font-bold text-blue-800 text-[11px] uppercase tracking-wider mb-0.5">Step 1</div>
                <div>Open the live page (e.g. Nikon UK) in your regular browser tab.</div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
                <div className="font-bold text-blue-800 text-[11px] uppercase tracking-wider mb-0.5">Step 2</div>
                <div>
                  Press <kbd className="px-1.5 py-0.5 bg-blue-100 font-mono text-[11px] rounded font-bold border border-blue-300">Ctrl + U</kbd> (Mac: <kbd className="px-1.5 py-0.5 bg-blue-100 font-mono text-[11px] rounded font-bold border border-blue-300">Cmd + Option + U</kbd>) to view source.
                </div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-blue-100">
                <div className="font-bold text-blue-800 text-[11px] uppercase tracking-wider mb-0.5">Step 3</div>
                <div>
                  Select all (<kbd className="px-1 py-0.2 bg-blue-100 font-mono text-[10px] rounded font-bold">Ctrl+A</kbd>), copy, and paste the HTML below.
                </div>
              </div>
            </div>
          </div>

          {/* Target Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Original Page URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={pageUrl}
                  onChange={(e) => setPageUrl(e.target.value)}
                  placeholder="https://www.nikon.co.uk/en_GB/product/cameras/..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono text-gray-900 focus:bg-white focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Used to resolve relative images, live styles, and CDN fonts automatically.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Snapshot Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="e.g. Nikon Coolpix P1100 PDP"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                A friendly label to identify this snapshot in your project.
              </p>
            </div>
          </div>

          {/* Input Method Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'paste' ? 'bg-white text-black shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Paste HTML Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'upload' ? 'bg-white text-black shadow-xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .html File</span>
                </button>
              </div>

              {htmlLength > 0 && (
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="font-mono">{lineCount.toLocaleString()} lines</span>
                  <span>•</span>
                  <span className="font-mono">{(htmlLength / 1024).toFixed(1)} KB</span>
                  {hasHtmlTag && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Valid HTML
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setHtmlContent('')}
                    className="text-red-600 hover:underline font-semibold ml-1"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Tab: Paste Textarea */}
            {activeTab === 'paste' ? (
              <div className="relative">
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head>...&#10;  <body>... Paste full HTML page source here"
                  rows={10}
                  className="w-full p-3 font-mono text-xs text-gray-900 bg-gray-900 text-gray-100 rounded-xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-black leading-relaxed"
                  spellCheck={false}
                />
                {!htmlContent && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400 bg-gray-900/40 rounded-xl">
                    <FileCode2 className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="text-xs font-semibold text-gray-300">
                      Click inside and press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded font-mono text-[11px] text-white">Ctrl + V</kbd> to paste page source
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Tab: Upload File */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                  dragOver
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100/60'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-gray-800 mb-1">
                  Drag and drop an .html or .htm file here
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  Saved directly from your browser via &quot;Save Page As&quot; (Ctrl + S)
                </div>
                <label className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".html,.htm"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Info className="w-4 h-4 text-gray-400" />
            <span>Saved snapshots are stored locally and accessible anytime from the URL picker.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndPreview}
              disabled={!htmlContent.trim()}
              className="px-5 py-2 bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Import & Preview Immediately</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
