import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Wand2,
  Check,
  Flame,
  ShieldCheck,
  Brain,
  Code,
  Plus,
  BookmarkPlus,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useCro } from '../context/CroContext';

interface GeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AiCroResult {
  hypothesis: string;
  psychologicalTrigger: string;
  variantTitle: string;
  explanation: string;
  cssCode: string;
  jsCode: string;
  htmlCode: string;
  suggestedPlacement: string;
  metricsToTrack: string[];
}

export const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentClient,
    currentExperiment,
    currentVariant,
    selectedSelector,
    updateVariant,
    addVariant,
    addSnippet,
    addExecutionLog,
    triggerLiveReload,
  } = useCro();

  const [goal, setGoal] = useState('Increase Add to Cart click-through rate and reduce hesitation');
  const [pageContext, setPageContext] = useState(
    'E-commerce sneaker product detail page with high mobile traffic and low scroll depth to buy box'
  );
  const [targetSelectorInput, setTargetSelectorInput] = useState(selectedSelector || '.add-to-cart-btn');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiCroResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setApplied(false);

    try {
      const response = await fetch('/api/ai/cro-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          pageDescription: pageContext,
          targetSelector: targetSelectorInput,
          clientIndustry: currentClient?.industry,
          currentVariant: currentVariant,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate CRO variant from Gemini AI');
      }

      const data: AiCroResult = await response.json();
      setResult(data);
      addExecutionLog('info', `Gemini AI generated variant idea: "${data.variantTitle}"`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToActiveVariant = () => {
    if (!result || !currentExperiment || !currentVariant) return;

    updateVariant(currentExperiment.id, currentVariant.id, {
      name: result.variantTitle || currentVariant.name,
      description: result.explanation,
      cssCode: result.cssCode || currentVariant.cssCode,
      jsCode: result.jsCode || currentVariant.jsCode,
      htmlCode: result.htmlCode || currentVariant.htmlCode,
      targetSelector: targetSelectorInput || currentVariant.targetSelector,
    });

    setApplied(true);
    addExecutionLog('success', `Applied Gemini AI variant to ${currentVariant.name}`);
    triggerLiveReload();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleCreateAsNewVariant = () => {
    if (!result || !currentExperiment) return;

    addVariant(currentExperiment.id, {
      name: result.variantTitle || 'AI Variant: Generated Test',
      isControl: false,
      description: result.explanation,
      cssCode: result.cssCode || '',
      jsCode: result.jsCode || '',
      htmlCode: result.htmlCode || '',
      placement: (result.suggestedPlacement as any) || 'body_end',
      insertPosition: 'append',
      targetSelector: targetSelectorInput,
    });

    addExecutionLog('success', `Created new variant from Gemini AI`);
    triggerLiveReload();
    onClose();
  };

  const handleSaveToSnippets = () => {
    if (!result) return;

    addSnippet({
      title: result.variantTitle || 'AI Generated CRO Snippet',
      description: result.explanation,
      category: 'custom',
      tags: ['ai-generated', result.psychologicalTrigger.toLowerCase()],
      cssCode: result.cssCode,
      jsCode: result.jsCode,
      htmlCode: result.htmlCode,
      targetSelectorHint: targetSelectorInput,
    });

    addExecutionLog('success', `Saved AI variant into Snippet Library`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden text-[#1F2937] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-14 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">Gemini CRO Experiment & Code Generator</h2>
              <p className="text-[11px] text-gray-500">
                AI-driven conversion hypotheses, psychological triggers, and production-ready variant code.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* Prompt Setup Form */}
          <form onSubmit={handleGenerate} className="bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB] space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Primary CRO Goal / Metric Target
                </label>
                <input
                  type="text"
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Increase CTA click-through rate, reduce bounce..."
                  className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                  Target Selector (Optional)
                </label>
                <input
                  type="text"
                  value={targetSelectorInput}
                  onChange={(e) => setTargetSelectorInput(e.target.value)}
                  placeholder="e.g. .add-to-cart-btn, #pricing-card"
                  className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-gray-800 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-1">
                Target Page Description & User Friction Context
              </label>
              <textarea
                rows={2}
                value={pageContext}
                onChange={(e) => setPageContext(e.target.value)}
                placeholder="Describe what users are experiencing, bounce rates, or page elements..."
                className="w-full p-2.5 bg-white border border-[#E5E7EB] rounded-md text-xs text-gray-800 focus:outline-none focus:border-blue-500 resize-none font-sans"
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-gray-500">
                Powered by Gemini • Generates CSS, JS DOM hooks, & HTML
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing & Synthesizing Code...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-white" />
                    <span>Generate CRO Variant</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Generated Result */}
          {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Hypothesis & Psychological Trigger Card */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-blue-800 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-blue-600" />
                    <span>{result.variantTitle}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase">
                    Trigger: {result.psychologicalTrigger}
                  </span>
                </div>

                <div className="text-xs text-gray-900 leading-relaxed font-semibold">
                  "{result.hypothesis}"
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{result.explanation}</p>

                {result.metricsToTrack && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-200">
                    <span className="text-[11px] font-bold text-gray-600">Track:</span>
                    {result.metricsToTrack.map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white border border-blue-200 text-[10px] text-blue-700 font-medium">
                        🎯 {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Code Previews */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                  <div className="text-[11px] font-bold text-blue-600 mb-1.5 flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    <span>Generated CSS</span>
                  </div>
                  <pre className="text-[10px] font-mono text-gray-200 bg-[#1E1E1E] p-2 rounded max-h-36 overflow-y-auto leading-tight">
                    {result.cssCode || '/* No CSS needed */'}
                  </pre>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                  <div className="text-[11px] font-bold text-emerald-600 mb-1.5 flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    <span>Generated HTML</span>
                  </div>
                  <pre className="text-[10px] font-mono text-emerald-300 bg-[#1E1E1E] p-2 rounded max-h-36 overflow-y-auto leading-tight">
                    {result.htmlCode || '<!-- No HTML needed -->'}
                  </pre>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#E5E7EB]">
                  <div className="text-[11px] font-bold text-amber-600 mb-1.5 flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    <span>Generated JS</span>
                  </div>
                  <pre className="text-[10px] font-mono text-green-400 bg-[#1E1E1E] p-2 rounded max-h-36 overflow-y-auto leading-tight">
                    {result.jsCode || '// No JS needed'}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={handleSaveToSnippets}
                  className="px-3.5 py-2 bg-[#F3F4F6] hover:bg-gray-200 text-gray-700 border border-[#E5E7EB] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Save to Snippet Library</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCreateAsNewVariant}
                    className="px-3.5 py-2 bg-[#F3F4F6] hover:bg-gray-200 text-gray-700 border border-[#E5E7EB] rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create as New Variant</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyToActiveVariant}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    {applied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied to {currentVariant?.name}!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Apply to Active Variant</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
