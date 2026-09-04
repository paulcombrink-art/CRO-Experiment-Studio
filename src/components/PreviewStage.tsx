import React, { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  RotateCw,
  Crosshair,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Tablet,
  Smartphone,
  Info,
  Camera,
  Trash2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useCro } from '../context/CroContext';
import { DEMO_PAGES } from '../data/demoPages';

export const PreviewStage: React.FC = () => {
  const {
    targetUrl,
    setTargetUrl,
    currentExperiment,
    currentVariant,
    device,
    setDevice,
    viewMode,
    setViewMode,
    isInspectorActive,
    selectedSelector,
    setSelectedSelector,
    setIsInspectorActive,
    addExecutionLog,
    isLiveReloading,
    triggerLiveReload,
    updateVariant,
    snapshots,
    openHtmlCaptureWithUrl,
    getSnapshot,
    deleteSnapshot,
  } = useCro();

  const [inputUrl, setInputUrl] = useState(targetUrl);
  const [zoom, setZoom] = useState(100);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const variantIframeRef = useRef<HTMLIFrameElement | null>(null);
  const controlIframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sync inputUrl when targetUrl changes from outside
  useEffect(() => {
    setInputUrl(targetUrl);
  }, [targetUrl]);

  const isDemoUrl = targetUrl.startsWith('demo://');
  const isSnapshotUrl = targetUrl.startsWith('snapshot://');
  const activeDemo = DEMO_PAGES.find((d) => d.urlKey === targetUrl);
  const activeSnapshot = getSnapshot(targetUrl);

  // Calculate device dimensions
  const getDeviceStyle = () => {
    switch (device) {
      case 'mobile':
        return { width: '393px', height: '852px', borderRadius: '36px' };
      case 'tablet':
        return { width: '768px', height: '1024px', borderRadius: '24px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%', borderRadius: '0px' };
    }
  };

  const sampleUrls = [
    { label: 'WE Fashion (Apparel)', url: 'https://www.wefashion.com/nl_NL/heren/kleding/' },
    { label: 'Nike Store', url: 'https://www.nike.com' },
    { label: 'DEPT Work', url: 'https://www.deptagency.com/en-nl/' },
    { label: 'Demo: Sneaker Store PDP', url: 'demo://ecommerce-pdp' },
    { label: 'Demo: Cloud SaaS Pricing', url: 'demo://saas-pricing' },
    { label: 'Demo: Luxury Hotel Booking', url: 'demo://travel-booking' },
  ];

  const presets = [
    { label: 'Desktop (1920×1080)', type: 'desktop' as const, width: '100%', height: '100%' },
    { label: 'MacBook Pro (1440×900)', type: 'desktop' as const, width: '100%', height: '100%' },
    { label: 'iPad Pro (1024×1366)', type: 'tablet' as const, width: '768px', height: '1024px' },
    { label: 'iPhone 15 Pro (393×852)', type: 'mobile' as const, width: '393px', height: '852px' },
    { label: 'iPhone 15 / 14 / 13 (390×844)', type: 'mobile' as const, width: '393px', height: '852px' },
    { label: 'Samsung Galaxy (360×800)', type: 'mobile' as const, width: '393px', height: '852px' },
    { label: '4K Ultra HD (3840×2160)', type: 'desktop' as const, width: '100%', height: '100%' },
  ];

  // Generate rendered HTML content for Demo pages and Captured Snapshots
  const generateRenderedHtml = (isControlOnly = false) => {
    let raw = '';
    let baseUrl = '';

    if (isSnapshotUrl && activeSnapshot) {
      raw = activeSnapshot.html;
      baseUrl = activeSnapshot.originalUrl;
    } else if (isDemoUrl) {
      raw = activeDemo?.rawHtml || DEMO_PAGES?.[0]?.rawHtml || '';
    } else {
      raw = activeDemo?.rawHtml || DEMO_PAGES?.[0]?.rawHtml || '';
    }

    // If snapshot has a baseUrl, inject base tag and no-referrer meta
    if (baseUrl) {
      const metaTags = `\n  <base href="${baseUrl}">\n  <meta name="referrer" content="no-referrer">\n`;
      if (raw.includes('<head>')) {
        raw = raw.replace('<head>', `<head>${metaTags}`);
      } else if (raw.includes('<head ')) {
        raw = raw.replace(/<head([^>]*)>/i, `<head$1>${metaTags}`);
      } else {
        raw = `${metaTags}\n${raw}`;
      }
    }

    if (isControlOnly || !currentVariant || currentVariant.isControl) {
      return injectBridgeScript(raw, false);
    }

    let modified = raw;
    const { cssCode, jsCode, htmlCode, placement, targetSelector, insertPosition } = currentVariant;

    // Inject CSS
    if (cssCode && cssCode.trim().length > 0) {
      const styleBlock = `<style id="cro-injected-style">\n${cssCode}\n</style>`;
      if (modified.includes('</head>')) {
        modified = modified.replace('</head>', `${styleBlock}\n</head>`);
      } else {
        modified = `${styleBlock}\n${modified}`;
      }
    }

    // Inject HTML Markup
    if (htmlCode && htmlCode.trim().length > 0) {
      const containerHtml = `<div id="cro-injected-html-container">\n${htmlCode}\n</div>`;
      if (placement === 'body_start') {
        modified = modified.replace(/<body([^>]*)>/i, `<body$1>\n${containerHtml}`);
      } else if (placement === 'custom_selector' && targetSelector) {
        modified = modified.replace('</body>', `${containerHtml}\n</body>`);
      } else {
        modified = modified.replace('</body>', `${containerHtml}\n</body>`);
      }
    }

    // Inject JS
    if (jsCode && jsCode.trim().length > 0) {
      const jsBlock = `
<script id="cro-injected-js">
try {
  ${jsCode}
} catch(err) {
  console.error('[CRO Injected Error]', err);
  window.parent.postMessage({ type: 'CRO_LOG', payload: { level: 'error', message: err.toString() } }, '*');
}
</script>`;
      modified = modified.replace('</body>', `${jsBlock}\n</body>`);
    }

    return injectBridgeScript(modified, isInspectorActive);
  };

  function injectBridgeScript(html: string, inspectorOn: boolean) {
    const bridge = `
<script id="cro-studio-bridge">
(function() {
  window.__CRO_STUDIO_ACTIVE__ = true;
  var inspectorEnabled = ${inspectorOn ? 'true' : 'false'};
  var highlightOverlay = null;

  window.addEventListener('message', function(event) {
    if (!event.data || typeof event.data !== 'object') return;
    if (event.data.type === 'CRO_TOGGLE_INSPECTOR') {
      inspectorEnabled = event.data.payload.enabled;
      toggleInspector(inspectorEnabled);
    } else if (event.data.type === 'CRO_DISMISS_COOKIES') {
      try {
        var buttons = document.querySelectorAll(
          '#onetrust-accept-btn-handler, #accept-recommended-btn-handler, #CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll, .cookie-consent__agree, [data-testid="uc-accept-all-button"], button[id*="cookie-accept"], button[class*="cookie-accept"], button[id*="accept-all"], [aria-label*="Accept All"], [aria-label*="Accepteren"]'
        );
        for (var i = 0; i < buttons.length; i++) buttons[i].click();
        var banners = document.querySelectorAll(
          '#onetrust-consent-sdk, #CybotCookiebotDialog, #usercentrics-root, .cookie-banner, .cookie-modal, [id*="cookie-modal"], [class*="cookie-modal"], [id*="cookie-banner"]'
        );
        for (var j = 0; j < banners.length; j++) banners[j].style.display = 'none';
        document.body.style.overflow = 'auto';
      } catch(e) {}
    }
  });

  function getUniqueSelector(el) {
    if (!el || el === document.body || el === document.documentElement) return 'body';
    if (el.id) return '#' + el.id;
    var path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body) {
      var selector = el.nodeName.toLowerCase();
      if (el.className && typeof el.className === 'string') {
        var classes = el.className.trim().split(/\\s+/).filter(function(c) {
          return c && !c.startsWith('cro-') && !c.includes(':');
        });
        if (classes.length > 0) selector += '.' + classes.slice(0, 2).join('.');
      }
      var sibling = el;
      var nth = 1;
      while (sibling = sibling.previousElementSibling) {
        if (sibling.nodeName.toLowerCase() === el.nodeName.toLowerCase()) nth++;
      }
      if (nth > 1) selector += ':nth-of-type(' + nth + ')';
      path.unshift(selector);
      el = el.parentElement;
    }
    return path.join(' > ');
  }

  function toggleInspector(enable) {
    if (enable) {
      document.body.style.cursor = 'crosshair';
      if (!highlightOverlay) {
        highlightOverlay = document.createElement('div');
        highlightOverlay.id = 'cro-inspector-highlight';
        highlightOverlay.style.position = 'absolute';
        highlightOverlay.style.pointerEvents = 'none';
        highlightOverlay.style.background = 'rgba(245, 158, 11, 0.25)';
        highlightOverlay.style.border = '2px dashed #f59e0b';
        highlightOverlay.style.zIndex = '9999999';
        highlightOverlay.style.transition = 'all 0.05s ease';
        document.body.appendChild(highlightOverlay);
      }
    } else {
      document.body.style.cursor = '';
      if (highlightOverlay) {
        highlightOverlay.remove();
        highlightOverlay = null;
      }
    }
  }

  document.addEventListener('mouseover', function(e) {
    if (!inspectorEnabled || !highlightOverlay) return;
    var target = e.target;
    if (target.id === 'cro-inspector-highlight' || target.closest('#cro-injected-html-container')) return;
    var rect = target.getBoundingClientRect();
    highlightOverlay.style.top = (rect.top + window.scrollY) + 'px';
    highlightOverlay.style.left = (rect.left + window.scrollX) + 'px';
    highlightOverlay.style.width = rect.width + 'px';
    highlightOverlay.style.height = rect.height + 'px';
  }, true);

  document.addEventListener('click', function(e) {
    if (!inspectorEnabled) return;
    e.preventDefault();
    e.stopPropagation();
    var selector = getUniqueSelector(e.target);
    var tagName = e.target.tagName.toLowerCase();
    var textContent = (e.target.innerText || '').slice(0, 40).trim();
    window.parent.postMessage({
      type: 'CRO_ELEMENT_SELECTED',
      payload: { selector: selector, tagName: tagName, text: textContent }
    }, '*');
  }, true);

  if (inspectorEnabled) toggleInspector(true);
})();
</script>
`;
    if (html.includes('</body>')) {
      return html.replace('</body>', `${bridge}\n</body>`);
    }
    return html + bridge;
  }

  // Handle postMessages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'CRO_ELEMENT_SELECTED') {
        const { selector, tagName, text } = event.data.payload;
        setSelectedSelector(selector);
        setIsInspectorActive(false);
        addExecutionLog('info', `Targeted element: <${tagName}> ${selector} ("${text}")`);

        // If in custom selector placement, auto update
        if (currentExperiment && currentVariant && currentVariant.placement === 'custom_selector') {
          updateVariant(currentExperiment.id, currentVariant.id, {
            targetSelector: selector,
          });
        }
      } else if (event.data.type === 'CRO_LOG') {
        const { level, message } = event.data.payload;
        addExecutionLog(level, message);
      } else if (event.data.type === 'CRO_OPEN_HTML_CAPTURE') {
        const { url } = event.data.payload || {};
        openHtmlCaptureWithUrl(url);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setSelectedSelector, setIsInspectorActive, addExecutionLog, currentExperiment, currentVariant, updateVariant, openHtmlCaptureWithUrl]);

  // Send injection updates via postMessage when not re-rendering entire page
  useEffect(() => {
    if (variantIframeRef.current && variantIframeRef.current.contentWindow) {
      variantIframeRef.current.contentWindow.postMessage(
        {
          type: 'CRO_UPDATE_INJECTION',
          payload: {
            css: currentVariant?.cssCode || '',
            js: currentVariant?.jsCode || '',
            html: currentVariant?.htmlCode || '',
            placement: currentVariant?.placement || 'body_end',
            selector: currentVariant?.targetSelector,
          },
        },
        '*'
      );
    }
  }, [currentVariant, isLiveReloading]);

  // Toggle inspector in iframe
  useEffect(() => {
    if (variantIframeRef.current && variantIframeRef.current.contentWindow) {
      variantIframeRef.current.contentWindow.postMessage(
        {
          type: 'CRO_TOGGLE_INSPECTOR',
          payload: { enabled: isInspectorActive },
        },
        '*'
      );
    }
  }, [isInspectorActive]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim().length > 0) {
      setTargetUrl(inputUrl.trim());
      triggerLiveReload();
    }
  };

  const getProxyUrl = (rawUrl: string) => {
    if (rawUrl.startsWith('demo://') || rawUrl.startsWith('snapshot://')) return '';
    return `/api/proxy?url=${encodeURIComponent(rawUrl)}`;
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden select-none relative ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-full'
      }`}
    >
      {/* Top Address & URL Control Bar */}
      <div className="bg-white border-b border-[#E5E7EB] px-3.5 py-2 flex flex-col gap-2 shrink-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* URL Input Form */}
          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-2 max-w-3xl">
            <div className="relative flex-1 flex items-center">
              <Globe className="w-3.5 h-3.5 absolute left-3 text-gray-400" />
              <input
                id="preview-url-input"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter target URL (e.g. https://www.wefashion.com/...) or snapshot://..."
                className="w-full pl-8 pr-20 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs text-gray-900 font-mono placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1 bg-black hover:bg-gray-800 text-white rounded-md text-[11px] font-semibold transition-colors"
              >
                Load Site
              </button>
            </div>

            {/* Quick HTML Capture Action */}
            <button
              type="button"
              onClick={() => openHtmlCaptureWithUrl(inputUrl)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              title="Capture & paste HTML source to bypass 403 bot blocks"
            >
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Capture HTML</span>
            </button>

            {/* Quick Demo & Snapshot Selector */}
            <div className="relative">
              <button
                id="demo-picker-btn"
                type="button"
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="px-3 py-1.5 bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>
                  {isSnapshotUrl
                    ? activeSnapshot?.name || 'Captured Snapshot'
                    : isDemoUrl
                    ? activeDemo?.name.split('(')[0]
                    : 'Target Presets'}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 w-84 bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-2 z-50 max-h-96 overflow-y-auto">
                  {/* Captured Snapshots */}
                  {snapshots.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                          <Camera className="w-3 h-3 text-blue-600" />
                          <span>Captured Snapshots</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDemoDropdownOpen(false);
                            openHtmlCaptureWithUrl(inputUrl);
                          }}
                          className="text-[10px] text-blue-600 hover:underline font-semibold"
                        >
                          + New
                        </button>
                      </div>
                      <div className="space-y-1 my-1">
                        {snapshots.map((snap) => {
                          const isCurrent = targetUrl === `snapshot://${snap.id}`;
                          return (
                            <div
                              key={snap.id}
                              className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors group ${
                                isCurrent
                                  ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                                  : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  const url = `snapshot://${snap.id}`;
                                  setTargetUrl(url);
                                  setInputUrl(url);
                                  setDemoDropdownOpen(false);
                                  triggerLiveReload();
                                }}
                                className="flex-1 text-left min-w-0 pr-2"
                              >
                                <div className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
                                  <span>{snap.name}</span>
                                </div>
                                <div className="text-[10px] text-gray-500 line-clamp-1 font-mono">
                                  {snap.originalUrl}
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSnapshot(snap.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all"
                                title="Delete snapshot"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="px-2 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Quick Load Targets & Demos
                  </div>
                  <div className="space-y-1 my-1">
                    {sampleUrls.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTargetUrl(sample.url);
                          setInputUrl(sample.url);
                          setDemoDropdownOpen(false);
                          triggerLiveReload();
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                          targetUrl === sample.url
                            ? 'bg-gray-100 text-black font-semibold border border-gray-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{sample.label}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1 font-mono">
                          {sample.url}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Right Tools: Zoom, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="hidden sm:flex items-center bg-[#F9FAFB] rounded-lg p-0.5 border border-[#E5E7EB] text-xs">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 text-gray-500 hover:text-black rounded"
                title="Zoom out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="px-1 text-[10px] font-mono text-gray-700">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-1 text-gray-500 hover:text-black rounded"
                title="Zoom in"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            {/* Fullscreen toggle */}
            <button
              id="toggle-fullscreen-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 bg-[#F9FAFB] hover:bg-gray-100 text-gray-600 border border-[#E5E7EB] rounded-lg text-xs transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Viewport Presets Bar (Screenshot Studio Style) */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap mr-1">
              PRESETS:
            </span>
            {presets.map((p, idx) => {
              const isSelected =
                (p.type === 'mobile' && device === 'mobile' && p.label.includes('393')) ||
                (p.type === 'tablet' && device === 'tablet') ||
                (p.type === 'desktop' && device === 'desktop' && p.label.includes('Desktop'));

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDevice(p.type);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-black text-white shadow-2xs font-semibold'
                      : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700 border border-transparent'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Active Snapshot Indicator Badge */}
          {isSnapshotUrl && activeSnapshot && (
            <div className="hidden lg:flex items-center gap-1.5 bg-blue-50 text-blue-800 text-[11px] px-2.5 py-0.5 rounded-full border border-blue-200 shrink-0">
              <Camera className="w-3 h-3 text-blue-600" />
              <span className="font-semibold">Snapshot Mode:</span>
              <span className="truncate max-w-[140px]">{activeSnapshot.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-auto bg-[#F3F4F6] p-4 flex items-center justify-center relative">
        {/* Single View */}
        {viewMode === 'single' && (
          <div
            className="transition-all duration-300 flex items-center justify-center shadow-lg relative"
            style={{
              ...getDeviceStyle(),
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Device frame border if mobile/tablet */}
            {device !== 'desktop' && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-3 py-0.5 rounded-full text-[10px] font-semibold text-gray-600 border border-[#E5E7EB] shadow-xs flex items-center gap-1">
                {device === 'mobile' ? <Smartphone className="w-3 h-3 text-black" /> : <Tablet className="w-3 h-3 text-black" />}
                <span className="uppercase font-mono">{device === 'mobile' ? 'Mobile (393×852)' : 'Tablet (768×1024)'}</span>
              </div>
            )}

            <div className="w-full h-full bg-white rounded-inherit overflow-hidden relative border border-[#E5E7EB]">
              {isDemoUrl || isSnapshotUrl ? (
                <iframe
                  ref={variantIframeRef}
                  id="cro-preview-iframe-single"
                  title="CRO Variant Preview"
                  srcDoc={generateRenderedHtml(false)}
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              ) : (
                <iframe
                  ref={variantIframeRef}
                  id="cro-preview-iframe-single"
                  title="CRO Variant Preview"
                  src={getProxyUrl(targetUrl)}
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              )}
            </div>
          </div>
        )}

        {/* Split Side-by-Side View (Control vs Variant) - Respects Selected Device */}
        {viewMode === 'split_side_by_side' && (
          <div
            className={`transition-all duration-300 flex items-center justify-center ${
              device === 'desktop'
                ? 'w-full h-full grid grid-cols-2 gap-4 max-w-7xl mx-auto'
                : 'gap-6 overflow-auto p-2'
            }`}
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Left: Control Original */}
            <div
              className={`flex flex-col bg-white border border-[#E5E7EB] overflow-hidden shadow-md transition-all ${
                device === 'mobile'
                  ? 'w-[393px] h-[852px] rounded-[36px] ring-1 ring-gray-300 shrink-0 relative'
                  : device === 'tablet'
                  ? 'w-[540px] h-[780px] rounded-2xl ring-1 ring-gray-300 shrink-0 relative'
                  : 'h-full rounded-xl'
              }`}
            >
              {/* Frame Label */}
              <div className="h-9 bg-[#F9FAFB] px-3.5 flex items-center justify-between border-b border-[#E5E7EB] text-xs shrink-0 select-none">
                <span className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  <span>Control (Baseline)</span>
                </span>
                <span className="text-[10px] text-gray-500 font-mono px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200">
                  {device === 'mobile' ? '393px Mobile' : device === 'tablet' ? '768px Tablet' : 'Original'}
                </span>
              </div>
              <div className="flex-1 bg-white relative overflow-hidden">
                {isDemoUrl || isSnapshotUrl ? (
                  <iframe
                    ref={controlIframeRef}
                    id="cro-control-iframe"
                    title="Control Baseline"
                    srcDoc={generateRenderedHtml(true)}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                ) : (
                  <iframe
                    ref={controlIframeRef}
                    id="cro-control-iframe"
                    title="Control Baseline"
                    src={getProxyUrl(targetUrl)}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                )}
              </div>
            </div>

            {/* Right: Active Variant */}
            <div
              className={`flex flex-col bg-white border border-gray-300 overflow-hidden shadow-md transition-all ${
                device === 'mobile'
                  ? 'w-[393px] h-[852px] rounded-[36px] ring-2 ring-black shrink-0 relative'
                  : device === 'tablet'
                  ? 'w-[540px] h-[780px] rounded-2xl ring-2 ring-black shrink-0 relative'
                  : 'h-full rounded-xl ring-1 ring-gray-300'
              }`}
            >
              {/* Frame Label */}
              <div className="h-9 bg-gray-900 text-white px-3.5 flex items-center justify-between border-b border-gray-800 text-xs shrink-0 select-none">
                <span className="font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{currentVariant?.name || 'Active Variant'}</span>
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono font-semibold text-white">
                  {device === 'mobile' ? '393px Injected' : 'Injected'}
                </span>
              </div>
              <div className="flex-1 bg-white relative overflow-hidden">
                {isDemoUrl || isSnapshotUrl ? (
                  <iframe
                    ref={variantIframeRef}
                    id="cro-variant-iframe"
                    title="Injected Variant"
                    srcDoc={generateRenderedHtml(false)}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                ) : (
                  <iframe
                    ref={variantIframeRef}
                    id="cro-variant-iframe"
                    title="Injected Variant"
                    src={getProxyUrl(targetUrl)}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
