import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Lazy/Safe Gemini AI instance
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Proxy route to fetch web pages for live CRO injection preview
app.get("/api/proxy", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send("URL parameter is required");
  }

  let validUrl: URL;
  try {
    validUrl = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
  } catch (err) {
    return res.status(400).send("Invalid URL format");
  }

  try {
    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,nl;q=0.8",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401 || response.status === 503) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>403 Forbidden - Bot Protection Detected</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8fafc; color: #0f172a; padding: 24px; }
    .card { background: #ffffff; padding: 36px 32px; border-radius: 18px; border: 1px solid #e2e8f0; max-width: 520px; text-align: center; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.08); }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; margin-bottom: 16px; border: 1px solid #fde68a; }
    .icon { font-size: 42px; line-height: 1; margin-bottom: 12px; }
    h2 { font-size: 20px; font-weight: 900; margin-bottom: 8px; letter-spacing: -0.3px; color: #0f172a; }
    p { font-size: 13.5px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
    .btn { background: #000000; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 13.5px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border: none; transition: transform 0.15s ease, background 0.15s ease; width: 100%; }
    .btn:hover { background: #1e293b; transform: translateY(-1px); }
    .steps-box { background: #f1f5f9; border-radius: 12px; padding: 14px; margin-top: 20px; text-align: left; font-size: 12px; color: #334155; line-height: 1.5; border: 1px solid #e2e8f0; }
    .steps-box ol { margin-left: 18px; margin-top: 6px; }
    .steps-box li { margin-bottom: 4px; }
    kbd { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 1px 5px; font-family: monospace; font-size: 11px; font-weight: 700; color: #0f172a; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🔒 Bot Protection Detected (HTTP ${response.status})</div>
    <div class="icon">🛡️</div>
    <h2>${validUrl.hostname} Blocked Automated Proxy</h2>
    <p>
      This site is protected by enterprise bot management (Akamai/Cloudflare/PerimeterX) which blocks cloud container IP requests.
    </p>
    <button class="btn" onclick="window.parent.postMessage({ type: 'CRO_OPEN_HTML_CAPTURE', payload: { url: '${validUrl.href}' } }, '*')">
      <span>📸 Quick HTML Capture (Bypass Block)</span>
    </button>
    <div class="steps-box">
      <strong>Fastest 3-step workaround:</strong>
      <ol>
        <li>Open this URL directly in your browser.</li>
        <li>Press <kbd>Ctrl+U</kbd> (<kbd>Cmd+Option+U</kbd> on Mac) to View Source.</li>
        <li>Copy all HTML and paste it in the <strong>HTML Capture</strong> modal.</li>
      </ol>
    </div>
  </div>
</body>
</html>`);
      }
      return res.status(response.status).send(`Failed to fetch target URL: ${response.statusText}`);
    }

    let html = await response.text();
    const baseUrl = `${validUrl.protocol}//${validUrl.host}`;
    const pageUrl = validUrl.href;

    // Remove security headers that prevent iframe loading & script execution
    res.removeHeader("X-Frame-Options");
    res.removeHeader("Content-Security-Policy");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Strip out existing CSP meta tags, existing base tags, and existing referrer meta tags that block CDN images
    html = html.replace(/<meta\b[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, "");
    html = html.replace(/<meta\b[^>]*name=["']?referrer["']?[^>]*>/gi, "");
    html = html.replace(/<base\b[^>]*>/gi, "");

    // Inject base tag and no-referrer meta so CDN images load without hotlink 403 blocks
    const metaTags = `\n  <base href="${pageUrl}">\n  <meta name="referrer" content="no-referrer">\n`;
    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${metaTags}`);
    } else if (html.includes("<head ")) {
      html = html.replace(/<head([^>]*)>/i, `<head$1>${metaTags}`);
    } else {
      html = `${metaTags}\n${html}`;
    }

    // Inject CRO Bridge Helper Script with auto-image hydrator
    const bridgeScript = `
<script id="cro-studio-bridge">
(function() {
  window.__CRO_STUDIO_ACTIVE__ = true;

  // Auto image hydrator for lazy-loaded e-commerce images (e.g. WE Fashion, SFCC, Demandware, Shopify)
  function hydrateImages() {
    try {
      var images = document.querySelectorAll('img, picture source, video, source');
      for (var i = 0; i < images.length; i++) {
        var el = images[i];
        var realSrc = el.getAttribute('data-src') || el.getAttribute('data-original') || el.getAttribute('data-lazy') || el.getAttribute('data-lazy-src') || el.getAttribute('data-url') || el.getAttribute('data-zoom-image');
        if (realSrc) {
          var currentSrc = el.getAttribute('src');
          if (!currentSrc || currentSrc.startsWith('data:') || currentSrc.includes('placeholder')) {
            el.setAttribute('src', realSrc);
          }
        }
        var realSrcset = el.getAttribute('data-srcset');
        if (realSrcset) {
          var currentSrcset = el.getAttribute('srcset');
          if (!currentSrcset || currentSrcset.startsWith('data:')) {
            el.setAttribute('srcset', realSrcset);
          }
        }
        if (el.tagName === 'IMG') {
          el.setAttribute('loading', 'eager');
          if (window.getComputedStyle(el).opacity === '0') {
            el.style.opacity = '1';
          }
          if (window.getComputedStyle(el).visibility === 'hidden') {
            el.style.visibility = 'visible';
          }
        }
      }
    } catch(e) {}
  }

  hydrateImages();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateImages);
  }
  window.addEventListener('load', hydrateImages);
  setInterval(hydrateImages, 800);

  // Listen for messages from parent CRO Studio
  window.addEventListener('message', function(event) {
    if (!event.data || typeof event.data !== 'object') return;
    var type = event.data.type;
    var payload = event.data.payload;

    if (type === 'CRO_UPDATE_INJECTION') {
      applyInjection(payload.css, payload.js, payload.html, payload.placement, payload.selector);
    } else if (type === 'CRO_TOGGLE_INSPECTOR') {
      toggleInspector(payload.enabled);
    } else if (type === 'CRO_DISMISS_COOKIES') {
      dismissCookieBanners();
    }
  });

  function dismissCookieBanners() {
    try {
      // 1. Try to click standard accept buttons
      var acceptButtons = document.querySelectorAll(
        '#onetrust-accept-btn-handler, #accept-recommended-btn-handler, #CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll, .cookie-consent__agree, [data-testid="uc-accept-all-button"], button[id*="cookie-accept"], button[class*="cookie-accept"], button[id*="accept-all"], [aria-label*="Accept All"], [aria-label*="Accepteren"]'
      );
      for (var i = 0; i < acceptButtons.length; i++) {
        acceptButtons[i].click();
      }

      // 2. Hide stubborn modals / overlays
      var bannerContainers = document.querySelectorAll(
        '#onetrust-consent-sdk, #CybotCookiebotDialog, #usercentrics-root, .cookie-banner, .cookie-modal, [id*="cookie-modal"], [class*="cookie-modal"], [id*="cookie-banner"]'
      );
      for (var j = 0; j < bannerContainers.length; j++) {
        bannerContainers[j].style.display = 'none';
      }
      document.body.style.overflow = 'auto';
    } catch (e) {}
  }

  function applyInjection(css, js, html, placement, selector) {
    // 1. Apply or update CSS
    var styleTag = document.getElementById('cro-injected-style');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'cro-injected-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = css || '';

    // 2. Apply or update HTML
    var htmlContainer = document.getElementById('cro-injected-html-container');
    if (htmlContainer) {
      htmlContainer.remove();
    }
    if (html && html.trim().length > 0) {
      htmlContainer = document.createElement('div');
      htmlContainer.id = 'cro-injected-html-container';
      htmlContainer.innerHTML = html;

      if (selector) {
        var targetEl = document.querySelector(selector);
        if (targetEl) {
          if (placement === 'before') {
            targetEl.parentNode.insertBefore(htmlContainer, targetEl);
          } else if (placement === 'after') {
            targetEl.parentNode.insertBefore(htmlContainer, targetEl.nextSibling);
          } else if (placement === 'prepend') {
            targetEl.insertBefore(htmlContainer, targetEl.firstChild);
          } else {
            targetEl.appendChild(htmlContainer);
          }
        } else {
          document.body.appendChild(htmlContainer);
        }
      } else {
        if (placement === 'body_start') {
          document.body.insertBefore(htmlContainer, document.body.firstChild);
        } else {
          document.body.appendChild(htmlContainer);
        }
      }
    }

    // 3. Execute JS safely with log capture
    if (js && js.trim().length > 0) {
      try {
        var fn = new Function('croContext', js);
        fn({
          url: window.location.href,
          timestamp: Date.now(),
          targetSelector: selector
        });
        window.parent.postMessage({ type: 'CRO_LOG', payload: { level: 'info', message: 'Variant JS executed successfully' } }, '*');
      } catch (err) {
        window.parent.postMessage({ type: 'CRO_LOG', payload: { level: 'error', message: err.toString() } }, '*');
      }
    }
  }

  // Inspector logic
  var inspectorEnabled = false;
  var highlightOverlay = null;

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
        if (classes.length > 0) {
          selector += '.' + classes.slice(0, 2).join('.');
        }
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
    inspectorEnabled = enable;
    if (inspectorEnabled) {
      document.body.style.cursor = 'crosshair';
      if (!highlightOverlay) {
        highlightOverlay = document.createElement('div');
        highlightOverlay.id = 'cro-inspector-highlight';
        highlightOverlay.style.position = 'absolute';
        highlightOverlay.style.pointerEvents = 'none';
        highlightOverlay.style.background = 'rgba(59, 130, 246, 0.2)';
        highlightOverlay.style.border = '2px dashed #3b82f6';
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
      payload: {
        selector: selector,
        tagName: tagName,
        text: textContent
      }
    }, '*');
  }, true);

  // Notify parent readiness
  window.parent.postMessage({ type: 'CRO_FRAME_READY', payload: { title: document.title } }, '*');
})();
</script>
`;

    if (html.includes("</body>")) {
      html = html.replace("</body>", `${bridgeScript}\n</body>`);
    } else {
      html += bridgeScript;
    }

    res.send(html);
  } catch (err: any) {
    console.error("Proxy fetch error:", err);
    res.status(500).send(`Error fetching page: ${err?.message || "Unknown error"}`);
  }
});

// AI CRO Suggestion Endpoint using Gemini
app.post("/api/ai/cro-suggest", async (req, res) => {
  const { goal, pageDescription, targetSelector, currentVariant, clientIndustry } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured. Please add it in the Secrets panel.",
      });
    }

    const prompt = `
You are an expert Conversion Rate Optimization (CRO) analyst and front-end developer for A/B testing (Optimizely, VWO, Convert.com, AB Tasty).
The CRO Analyst wants to generate a high-converting variant idea and production-ready code (CSS, JS, and HTML).

Client Industry: ${clientIndustry || "E-commerce & SaaS"}
CRO Goal / Primary Metric: ${goal || "Increase conversions and click-through rate"}
Target Page Context: ${pageDescription || "Product detail page / Landing page"}
Target CSS Selector (optional): ${targetSelector || "CTA Button / Value prop section"}

Current Variant details (if any):
${JSON.stringify(currentVariant || {}, null, 2)}

Generate a response in valid JSON with the following structure:
{
  "hypothesis": "Clear If... Then... Because... hypothesis",
  "psychologicalTrigger": "e.g. Scarcity, Social Proof, Loss Aversion, Friction Reduction",
  "variantTitle": "Short descriptive variant name",
  "explanation": "2-3 sentences explaining why this change improves conversion rate",
  "cssCode": "Clean, scoped CSS with high specificity to override existing styles without breaking layout",
  "jsCode": "Clean, robust vanilla JavaScript that safely waits for elements (DOM ready or selector wait) and manipulates the page",
  "htmlCode": "Any new HTML markup needed (e.g. badge, timer, sticky bar, modal, trust seals)",
  "suggestedPlacement": "body_start | body_end | after | before | prepend | append",
  "metricsToTrack": ["Primary metric", "Secondary guardrail metric"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    res.json(result);
  } catch (error: any) {
    console.error("AI CRO Suggestion Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate CRO suggestion" });
  }
});

// AI Snippet Generator Endpoint
app.post("/api/ai/generate-snippet", async (req, res) => {
  const { title, prompt: userPrompt, category } = req.body;

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const prompt = `
You are a senior CRO engineer creating a reusable, cross-browser A/B testing code snippet.
User requested snippet:
Title: ${title}
Details: ${userPrompt}
Category: ${category || "General CRO"}

Generate a JSON object with:
{
  "title": "Clean concise snippet title",
  "description": "Clear explanation of what this snippet does and when to use it in CRO",
  "category": "urgency | social_proof | friction_reduction | layout | sticky_elements | cta_value_prop | form_opt | custom",
  "tags": ["array", "of", "relevant", "tags"],
  "cssCode": "Polished, isolated CSS styles",
  "jsCode": "Robust, self-contained JavaScript snippet with DOM observer / safe execution",
  "htmlCode": "Clean HTML template structure needed for this component"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    res.json(result);
  } catch (error: any) {
    console.error("AI Snippet Generator Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate snippet" });
  }
});

// Vite middleware & Production Fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
