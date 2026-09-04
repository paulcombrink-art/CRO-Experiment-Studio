import React, { useState } from 'react';
import {
  Code,
  FileCode,
  FileSpreadsheet,
  Settings,
  Terminal,
  Plus,
  Trash2,
  Copy,
  Crosshair,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Wand2,
} from 'lucide-react';
import { useCro } from '../context/CroContext';
import { CodeTab, InjectionPlacement, InsertPosition } from '../types';

interface CodeEditorPanelProps {
  onOpenSnippetLibrary: () => void;
  onOpenAiAssistant: () => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  onOpenSnippetLibrary,
  onOpenAiAssistant,
}) => {
  const {
    currentExperiment,
    currentVariant,
    activeVariantId,
    activeCodeTab,
    selectedSelector,
    executionLogs,
    isInspectorActive,
    setActiveVariantId,
    setActiveCodeTab,
    addVariant,
    updateVariant,
    deleteVariant,
    setIsInspectorActive,
    triggerLiveReload,
    clearExecutionLogs,
  } = useCro();

  const [copiedSuccess, setCopiedSuccess] = useState(false);

  if (!currentExperiment) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-gray-400 bg-white">
        <p className="text-sm">Select or create an experiment to start coding variants.</p>
      </div>
    );
  }

  const isControl = currentVariant?.isControl ?? false;

  const handleAddVariant = () => {
    const varCount = currentExperiment.variants?.length || 0;
    const char = String.fromCharCode(65 + Math.max(0, varCount - 1)); // B, C, D...
    addVariant(currentExperiment.id, {
      name: `Variant ${char}: Custom Modification`,
      isControl: false,
      description: 'New CRO hypothesis variant.',
      cssCode: `/* Custom CSS for Variant ${char} */\n`,
      jsCode: `// Custom JS for Variant ${char}\nconsole.log('[CRO] Variant ${char} initialized');\n`,
      htmlCode: `<!-- Custom HTML markup -->\n`,
      placement: 'body_end',
      insertPosition: 'append',
    });
  };

  const handleCopyCode = () => {
    if (!currentVariant) return;
    let text = '';
    if (activeCodeTab === 'css') text = currentVariant.cssCode;
    else if (activeCodeTab === 'js') text = currentVariant.jsCode;
    else if (activeCodeTab === 'html') text = currentVariant.htmlCode;

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  // Helper macro inserts
  const insertCodeMacro = (type: string) => {
    if (!currentVariant || isControl) return;

    if (type === 'wait_for_el') {
      const macro = `\n// Robust DOM Element Waiter\nfunction waitForElement(selector, callback, maxTimeout = 5000) {\n  const el = document.querySelector(selector);\n  if (el) return callback(el);\n  const observer = new MutationObserver(() => {\n    const target = document.querySelector(selector);\n    if (target) {\n      observer.disconnect();\n      callback(target);\n    }\n  });\n  observer.observe(document.body, { childList: true, subtree: true });\n  setTimeout(() => observer.disconnect(), maxTimeout);\n}\n\nwaitForElement('${selectedSelector || '.target-element'}', (el) => {\n  console.log('[CRO] Target element mounted:', el);\n});\n`;
      updateVariant(currentExperiment.id, currentVariant.id, {
        jsCode: currentVariant.jsCode + macro,
      });
      setActiveCodeTab('js');
    } else if (type === 'track_click') {
      const macro = `\n// Track Conversion Click Goal\nconst goalBtn = document.querySelector('${selectedSelector || '.cta-button'}');\nif (goalBtn) {\n  goalBtn.addEventListener('click', () => {\n    console.log('[CRO_GOAL] Primary CTA conversion triggered');\n  });\n}\n`;
      updateVariant(currentExperiment.id, currentVariant.id, {
        jsCode: currentVariant.jsCode + macro,
      });
      setActiveCodeTab('js');
    } else if (type === 'smooth_scroll') {
      const macro = `\n// Smooth Scroll to Element\nfunction scrollToSection(selector) {\n  const el = document.querySelector(selector);\n  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });\n}\n`;
      updateVariant(currentExperiment.id, currentVariant.id, {
        jsCode: currentVariant.jsCode + macro,
      });
      setActiveCodeTab('js');
    } else if (type === 'scoped_css') {
      const target = selectedSelector || '.target-container';
      const macro = `\n/* Scoped style override for ${target} */\n${target} {\n  background-color: #f8fafc !important;\n  border-radius: 12px !important;\n  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;\n}\n`;
      updateVariant(currentExperiment.id, currentVariant.id, {
        cssCode: currentVariant.cssCode + macro,
      });
      setActiveCodeTab('css');
    }
    triggerLiveReload();
  };

  return (
    <div className="flex-1 flex flex-col bg-white border-r border-[#E5E7EB] select-none overflow-hidden h-full text-[#1F2937]">
      {/* Top Variant Pill Selector */}
      <div className="h-11 bg-[#F9FAFB] border-b border-[#E5E7EB] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[calc(100%-90px)] py-1 scrollbar-none">
          {(currentExperiment.variants || []).map((v) => {
            const isActive = v.id === activeVariantId;
            return (
              <div
                key={v.id}
                onClick={() => setActiveVariantId(v.id)}
                className={`group px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                  isActive
                    ? v.isControl
                      ? 'bg-gray-800 text-white shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-[#E5E7EB]'
                }`}
              >
                <span>{v.name}</span>
                {v.isControl && (
                  <span className="text-[10px] bg-gray-700 px-1.5 py-0.2 rounded text-gray-300">
                    Orig
                  </span>
                )}
                {!v.isControl && (currentExperiment.variants?.length || 0) > 2 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete variant "${v.name}"?`)) {
                        deleteVariant(currentExperiment.id, v.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-200 p-0.5 transition-opacity"
                    title="Delete Variant"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          <button
            id="add-variant-btn"
            onClick={handleAddVariant}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white hover:bg-gray-50 text-blue-600 border border-dashed border-gray-300 flex items-center gap-1 shrink-0 transition-colors shadow-xs"
          >
            <Plus className="w-3 h-3" />
            <span>Add Variant</span>
          </button>
        </div>

        {/* Live status / Run badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerLiveReload}
            className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            title="Force re-inject code into preview"
          >
            <Play className="w-3 h-3 text-blue-600 fill-blue-600" />
            <span>Inject</span>
          </button>
        </div>
      </div>

      {/* Code Type Tabs */}
      <div className="h-10 bg-white border-b border-[#E5E7EB] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <button
            id="tab-css-btn"
            onClick={() => setActiveCodeTab('css')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeCodeTab === 'css'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-blue-600" />
            <span>CSS Style</span>
            {currentVariant?.cssCode && currentVariant.cssCode.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            )}
          </button>

          <button
            id="tab-js-btn"
            onClick={() => setActiveCodeTab('js')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeCodeTab === 'js'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-600" />
            <span>JavaScript (DOM)</span>
            {currentVariant?.jsCode && currentVariant.jsCode.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            id="tab-html-btn"
            onClick={() => setActiveCodeTab('html')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeCodeTab === 'html'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>HTML Markup</span>
            {currentVariant?.htmlCode && currentVariant.htmlCode.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            id="tab-settings-btn"
            onClick={() => setActiveCodeTab('settings')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeCodeTab === 'settings'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-gray-500" />
            <span>Placement</span>
          </button>

          <button
            id="tab-console-btn"
            onClick={() => setActiveCodeTab('console')}
            className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeCodeTab === 'console'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-gray-500" />
            <span>Logs</span>
            {executionLogs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-gray-100 text-[10px] text-gray-600 font-bold">
                {executionLogs.length}
              </span>
            )}
          </button>
        </div>

        {/* Quick Toolbar: Copy / Snippets library */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSnippetLibrary}
            className="px-2 py-1 rounded-md text-[11px] font-semibold bg-[#F3F4F6] hover:bg-gray-200 text-gray-700 flex items-center gap-1 border border-[#E5E7EB] transition-colors"
            title="Browse & insert pre-built CRO snippets"
          >
            <Wand2 className="w-3 h-3 text-blue-600" />
            <span>Snippets</span>
          </button>
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-xs transition-colors"
            title="Copy Active Tab Code"
          >
            {copiedSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Target Selector Banner (if selected) */}
      {selectedSelector && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2 truncate">
            <Crosshair className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[10px] font-bold text-amber-700 uppercase">Target Element:</span>
            <code className="bg-amber-100 px-2 py-0.5 rounded text-[11px] font-mono text-amber-900 truncate">
              {selectedSelector}
            </code>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => insertCodeMacro('scoped_css')}
              className="px-2 py-0.5 bg-amber-200/80 hover:bg-amber-300 rounded text-[10px] font-semibold text-amber-900 transition-colors"
            >
              + CSS Override
            </button>
            <button
              onClick={() => insertCodeMacro('wait_for_el')}
              className="px-2 py-0.5 bg-amber-200/80 hover:bg-amber-300 rounded text-[10px] font-semibold text-amber-900 transition-colors"
            >
              + JS Hook
            </button>
          </div>
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#1E1E1E] relative text-gray-200">
        {isControl ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400 bg-white">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 mb-1">Control Variant (Baseline)</h4>
            <p className="text-xs max-w-sm text-gray-500 mb-4 leading-relaxed font-sans">
              The Control variant renders the original webpage without any injected modifications, acting as the benchmark for statistical comparison.
            </p>
            <button
              onClick={handleAddVariant}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Variant B from Control</span>
            </button>
          </div>
        ) : activeCodeTab === 'css' ? (
          <div className="flex-1 flex flex-col h-full bg-[#1E1E1E]">
            <div className="px-3 py-1.5 bg-[#181818] border-b border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
              <span className="font-mono text-[10px]">CSS Rules (Injected dynamically into &lt;style&gt; block)</span>
              <span className="text-gray-500 font-mono text-[10px]">
                {currentVariant?.cssCode?.split('\n').length || 0} lines
              </span>
            </div>
            <textarea
              id="cro-css-editor"
              value={currentVariant?.cssCode || ''}
              onChange={(e) => {
                if (currentVariant) {
                  updateVariant(currentExperiment.id, currentVariant.id, {
                    cssCode: e.target.value,
                  });
                }
              }}
              placeholder="/* Write custom CSS styles to modify button colors, layout, banners, fonts... */&#10;.add-to-cart-btn {&#10;  background: #2563eb !important;&#10;  font-size: 16px !important;&#10;}"
              className="flex-1 w-full p-3.5 bg-[#1E1E1E] text-gray-200 font-mono text-[11px] leading-relaxed focus:outline-none resize-none selection:bg-blue-600/40"
              spellCheck={false}
            />
          </div>
        ) : activeCodeTab === 'js' ? (
          <div className="flex-1 flex flex-col h-full bg-[#1E1E1E]">
            <div className="px-3 py-1.5 bg-[#181818] border-b border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
              <span className="font-mono text-[10px]">Vanilla JavaScript (DOM manipulation & click event tracking)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => insertCodeMacro('wait_for_el')}
                  className="text-blue-400 hover:underline text-[10px] font-medium"
                >
                  + waitForElement()
                </button>
                <button
                  onClick={() => insertCodeMacro('track_click')}
                  className="text-blue-400 hover:underline text-[10px] font-medium"
                >
                  + trackClick()
                </button>
              </div>
            </div>
            <textarea
              id="cro-js-editor"
              value={currentVariant?.jsCode || ''}
              onChange={(e) => {
                if (currentVariant) {
                  updateVariant(currentExperiment.id, currentVariant.id, {
                    jsCode: e.target.value,
                  });
                }
              }}
              placeholder="// Write JavaScript to manipulate DOM, relocate elements, attach click handlers...&#10;(function() {&#10;  console.log('[CRO] Variant executing');&#10;})();"
              className="flex-1 w-full p-3.5 bg-[#1E1E1E] text-green-400 font-mono text-[11px] leading-relaxed focus:outline-none resize-none selection:bg-green-600/40"
              spellCheck={false}
            />
          </div>
        ) : activeCodeTab === 'html' ? (
          <div className="flex-1 flex flex-col h-full bg-[#1E1E1E]">
            <div className="px-3 py-1.5 bg-[#181818] border-b border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
              <span className="font-mono text-[10px]">Custom HTML Elements & Components to Inject</span>
              <span className="text-gray-500 font-mono text-[10px]">
                {currentVariant?.htmlCode?.split('\n').length || 0} lines
              </span>
            </div>
            <textarea
              id="cro-html-editor"
              value={currentVariant?.htmlCode || ''}
              onChange={(e) => {
                if (currentVariant) {
                  updateVariant(currentExperiment.id, currentVariant.id, {
                    htmlCode: e.target.value,
                  });
                }
              }}
              placeholder="<!-- Write HTML markup for sticky bars, discount pills, trust seals, modals... -->&#10;<div class='cro-urgency-banner'>&#10;  ⚡ <strong>Limited Time Offer:</strong> Free Express Shipping!&#10;</div>"
              className="flex-1 w-full p-3.5 bg-[#1E1E1E] text-emerald-300 font-mono text-[11px] leading-relaxed focus:outline-none resize-none selection:bg-emerald-600/40"
              spellCheck={false}
            />
          </div>
        ) : activeCodeTab === 'settings' ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-white text-gray-800">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Variant Name
              </label>
              <input
                type="text"
                value={currentVariant?.name || ''}
                onChange={(e) => {
                  if (currentVariant) {
                    updateVariant(currentExperiment.id, currentVariant.id, {
                      name: e.target.value,
                    });
                  }
                }}
                className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                HTML Injection Placement
              </label>
              <select
                value={currentVariant?.placement || 'body_end'}
                onChange={(e) => {
                  if (currentVariant) {
                    updateVariant(currentExperiment.id, currentVariant.id, {
                      placement: e.target.value as InjectionPlacement,
                    });
                  }
                }}
                className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 font-medium"
              >
                <option value="body_end">Append to End of &lt;body&gt; (Default for Modals & Sticky Bars)</option>
                <option value="body_start">Prepend to Start of &lt;body&gt; (Ideal for Top Announcement Bars)</option>
                <option value="custom_selector">Attach Relative to Specific Target Selector</option>
              </select>
            </div>

            {currentVariant?.placement === 'custom_selector' && (
              <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                    Target CSS Selector
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentVariant?.targetSelector || ''}
                      onChange={(e) => {
                        if (currentVariant) {
                          updateVariant(currentExperiment.id, currentVariant.id, {
                            targetSelector: e.target.value,
                          });
                        }
                      }}
                      placeholder="e.g. .add-to-cart-btn, #pricing-card"
                      className="flex-1 p-2 bg-white border border-[#E5E7EB] rounded-md text-gray-800 font-mono text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => setIsInspectorActive(true)}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-semibold flex items-center gap-1"
                      title="Inspect element on page"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Pick</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                    Insert Position Relative to Element
                  </label>
                  <select
                    value={currentVariant?.insertPosition || 'after'}
                    onChange={(e) => {
                      if (currentVariant) {
                        updateVariant(currentExperiment.id, currentVariant.id, {
                          insertPosition: e.target.value as InsertPosition,
                        });
                      }
                    }}
                    className="w-full p-2 bg-white border border-[#E5E7EB] rounded-md text-gray-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="after">Insert Immediately After Target Element</option>
                    <option value="before">Insert Immediately Before Target Element</option>
                    <option value="prepend">Prepend Inside Element (As first child)</option>
                    <option value="append">Append Inside Element (As last child)</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Variant Hypothesis Description
              </label>
              <textarea
                value={currentVariant?.description || ''}
                onChange={(e) => {
                  if (currentVariant) {
                    updateVariant(currentExperiment.id, currentVariant.id, {
                      description: e.target.value,
                    });
                  }
                }}
                rows={3}
                className="w-full p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-gray-800 focus:outline-none focus:bg-white focus:border-blue-500 resize-none font-sans"
                placeholder="What specific psychological trigger is this variant testing?"
              />
            </div>
          </div>
        ) : (
          /* Execution & Console Logs Tab */
          <div className="flex-1 flex flex-col h-full bg-[#1E1E1E]">
            <div className="px-3 py-2 bg-[#181818] border-b border-gray-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-300">Live Execution Diagnostics</span>
              <button
                onClick={clearExecutionLogs}
                className="text-gray-400 hover:text-white text-[11px] transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-1.5">
              {executionLogs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No execution logs yet. Modifications will log results here.
                </div>
              ) : (
                executionLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2 rounded border flex items-start gap-2 ${
                      log.level === 'error'
                        ? 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                        : log.level === 'warn'
                        ? 'bg-amber-950/40 border-amber-800/40 text-amber-300'
                        : log.level === 'success'
                        ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                        : 'bg-gray-900 border-gray-800 text-gray-300'
                    }`}
                  >
                    <span className="text-[9px] text-gray-500 shrink-0">{log.timestamp}</span>
                    <span className="break-all">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Macro Bar */}
      {!isControl && activeCodeTab !== 'console' && activeCodeTab !== 'settings' && (
        <div className="h-8 bg-[#F9FAFB] border-t border-[#E5E7EB] px-3 flex items-center justify-between text-[11px] text-gray-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#9CA3AF] font-bold text-[10px] uppercase">Macros:</span>
            <button
              onClick={() => insertCodeMacro('scoped_css')}
              className="hover:text-blue-600 transition-colors"
            >
              + Override Box
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => insertCodeMacro('wait_for_el')}
              className="hover:text-blue-600 transition-colors"
            >
              + Wait For Selector
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => insertCodeMacro('track_click')}
              className="hover:text-blue-600 transition-colors"
            >
              + Track CTA Click
            </button>
          </div>
          <button
            onClick={onOpenAiAssistant}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Ask Gemini AI</span>
          </button>
        </div>
      )}
    </div>
  );
};
