import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Code2,
  FileCheck,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useCro } from '../context/CroContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportPlatform = 'optimizely' | 'vwo' | 'gtm' | 'vanilla_js' | 'convert';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { currentExperiment, currentVariant, currentClient } = useCro();
  const [platform, setPlatform] = useState<ExportPlatform>('optimizely');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const css = currentVariant?.cssCode || '';
  const js = currentVariant?.jsCode || '';
  const html = currentVariant?.htmlCode || '';
  const placement = currentVariant?.placement || 'body_end';
  const targetSelector = currentVariant?.targetSelector || '';
  const insertPosition = currentVariant?.insertPosition || 'after';

  const generateExportCode = (): string => {
    switch (platform) {
      case 'optimizely':
        return `/* ========================================================
 * Optimizely Web - Custom Code
 * Experiment: ${currentExperiment?.name || 'Experiment'}
 * Variant: ${currentVariant?.name || 'Variant'}
 * Client: ${currentClient?.name || 'Client'}
 * ======================================================== */

// 1. Inject Styles
(function() {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.id = 'optimizely-cro-style-${currentVariant?.id || 'var'}';
  style.innerHTML = ${JSON.stringify(css)};
  document.head.appendChild(style);
})();

// 2. Inject HTML & Execute JS
(function() {
  function applyVariant() {
    ${
      html
        ? `// Injected HTML markup
    var htmlContent = ${JSON.stringify(html)};
    var tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlContent;
    var node = tempContainer.firstElementChild || tempContainer;

    ${
      placement === 'custom_selector' && targetSelector
        ? `var target = document.querySelector(${JSON.stringify(targetSelector)});
    if (target) {
      ${
        insertPosition === 'before'
          ? `target.parentNode.insertBefore(node, target);`
          : insertPosition === 'prepend'
          ? `target.insertBefore(node, target.firstChild);`
          : insertPosition === 'append'
          ? `target.appendChild(node);`
          : `target.parentNode.insertBefore(node, target.nextSibling);`
      }
    }`
        : placement === 'body_start'
        ? `document.body.insertBefore(node, document.body.firstChild);`
        : `document.body.appendChild(node);`
    }`
        : ''
    }

    ${js ? `// Custom Variant JS\n    ${js}` : ''}
  }

  // Poller / DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyVariant);
  } else {
    applyVariant();
  }
})();`;

      case 'vwo':
        return `/* ========================================================
 * VWO (Visual Website Optimizer) - Custom JS/CSS Code
 * Experiment: ${currentExperiment?.name}
 * Variant: ${currentVariant?.name}
 * ======================================================== */

vwo_$(document).ready(function() {
  // Inject CSS
  vwo_$('head').append('<style id="vwo-cro-style">' + ${JSON.stringify(css)} + '</style>');

  ${
    html
      ? `// Inject HTML
  ${
    placement === 'custom_selector' && targetSelector
      ? `vwo_$('${targetSelector}').${
          insertPosition === 'before'
            ? 'before'
            : insertPosition === 'prepend'
            ? 'prepend'
            : insertPosition === 'append'
            ? 'append'
            : 'after'
        }(${JSON.stringify(html)});`
      : `vwo_$('body').append(${JSON.stringify(html)});`
  }`
      : ''
  }

  // Variant JS
  ${js}
});`;

      case 'gtm':
        return `<!-- ========================================================
     Google Tag Manager (GTM) - Custom HTML Tag
     Trigger: Page View / DOM Ready
     Experiment: ${currentExperiment?.name}
     Variant: ${currentVariant?.name}
     ======================================================== -->
<style id="gtm-cro-style">
${css}
</style>

<script>
(function() {
  function runVariant() {
    ${
      html
        ? `var html = ${JSON.stringify(html)};
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    var el = wrapper.firstElementChild || wrapper;
    ${
      placement === 'custom_selector' && targetSelector
        ? `var t = document.querySelector(${JSON.stringify(targetSelector)});
    if (t) t.insertAdjacentElement('${
      insertPosition === 'before'
        ? 'beforebegin'
        : insertPosition === 'after'
        ? 'afterend'
        : insertPosition === 'prepend'
        ? 'afterbegin'
        : 'beforeend'
    }', el);`
        : `document.body.appendChild(el);`
    }`
        : ''
    }

    ${js}
  }

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    runVariant();
  } else {
    document.addEventListener('DOMContentLoaded', runVariant);
  }
})();
</script>`;

      case 'convert':
        return `/* ========================================================
 * Convert.com - Custom Variation Code
 * Experiment: ${currentExperiment?.name}
 * Variant: ${currentVariant?.name}
 * ======================================================== */

_conv_q = _conv_q || [];
_conv_q.push(['runVariation', function() {
  // CSS
  var style = document.createElement('style');
  style.innerHTML = ${JSON.stringify(css)};
  document.head.appendChild(style);

  // JS & DOM
  ${js}
}]);`;

      case 'vanilla_js':
      default:
        return `/* ========================================================
 * Standalone Production CRO Payload (Vanilla JS)
 * Experiment: ${currentExperiment?.name}
 * Variant: ${currentVariant?.name}
 * Client: ${currentClient?.name}
 * Generated via CRO Experiment Studio
 * ======================================================== */

(function() {
  'use strict';

  // 1. Injected CSS
  var styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.innerHTML = ${JSON.stringify(css)};
  document.head.appendChild(styleEl);

  // 2. DOM Injection & Scripts
  function init() {
    ${
      html
        ? `var markup = ${JSON.stringify(html)};
    var container = document.createElement('div');
    container.innerHTML = markup;
    var injectedNode = container.firstElementChild || container;

    ${
      placement === 'custom_selector' && targetSelector
        ? `var anchor = document.querySelector(${JSON.stringify(targetSelector)});
    if (anchor) {
      anchor.insertAdjacentElement('${
        insertPosition === 'before'
          ? 'beforebegin'
          : insertPosition === 'after'
          ? 'afterend'
          : insertPosition === 'prepend'
          ? 'afterbegin'
          : 'beforeend'
      }', injectedNode);
    } else {
      document.body.appendChild(injectedNode);
    }`
        : `document.body.appendChild(injectedNode);`
    }`
        : ''
    }

    ${js}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`;
    }
  };

  const exportCode = generateExportCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exportCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentExperiment?.name || 'experiment')
      .toLowerCase()
      .replace(/\s+/g, '-')}-${platform}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E5E7EB] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden text-[#1F2937] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="h-14 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Download className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-gray-900">Export Production Variant Code</h2>
              <p className="text-[11px] text-gray-500">
                Ready-to-deploy code packages for Optimizely, VWO, GTM, and AB Tasty.
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
          {/* Platform Tabs */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Target Testing Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'optimizely', label: 'Optimizely Web' },
                { id: 'vwo', label: 'VWO' },
                { id: 'gtm', label: 'Google Tag Manager' },
                { id: 'convert', label: 'Convert / AB Tasty' },
                { id: 'vanilla_js', label: 'Vanilla JS (Universal)' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id as ExportPlatform)}
                  className={`p-2.5 rounded-md text-xs font-semibold border transition-all text-center ${
                    platform === p.id
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <div className="h-10 bg-[#F9FAFB] border-b border-[#E5E7EB] px-4 flex items-center justify-between text-xs">
              <span className="font-mono text-gray-600 text-xs">
                {currentVariant?.name || 'Variant'} ({platform}.js)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-[#E5E7EB] rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Download File</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Payload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="p-4 text-xs font-mono text-green-400 bg-[#1E1E1E] overflow-x-auto max-h-72 leading-relaxed">
              {exportCode}
            </pre>
          </div>

          {/* Pre-launch QA Checklist */}
          <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Pre-Launch CRO QA Checklist</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Anti-flicker snippet enabled in head</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Verified across 375px mobile viewport</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Selector robustness (ID/classes verified)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>GA4 / Analytics goal events hooked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
