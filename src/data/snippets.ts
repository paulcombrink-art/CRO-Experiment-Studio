import { Snippet, SnippetCategory } from '../types';

export const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 'snip-sticky-atc',
    title: 'Sticky Mobile & Desktop Add-To-Cart Bar',
    description: 'Displays a floating sticky bottom bar when the main Add-to-Cart button scrolls out of viewport, reducing friction on long PDPs.',
    category: 'sticky_elements',
    tags: ['e-commerce', 'pdp', 'mobile-cro', 'add-to-cart', 'friction-reduction'],
    targetSelectorHint: 'form.cart, .add-to-cart-btn, #buy-box',
    isDefault: true,
    createdAt: '2025-01-15',
    cssCode: `/* CRO Injected Sticky ATC Bar */
#cro-sticky-atc-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.12);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99999;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border-top: 1px solid #e2e8f0;
}

#cro-sticky-atc-bar.cro-visible {
  transform: translateY(0);
}

.cro-sticky-product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cro-sticky-title {
  font-weight: 700;
  font-size: 15px;
  color: #0f172a;
}

.cro-sticky-price {
  font-size: 16px;
  font-weight: 800;
  color: #16a34a;
}

.cro-sticky-btn {
  background: #0f172a;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  transition: background 0.2s ease;
}

.cro-sticky-btn:hover {
  background: #2563eb;
}`,
    htmlCode: `<div id="cro-sticky-atc-bar">
  <div class="cro-sticky-product-info">
    <div>
      <div class="cro-sticky-title">Premium Runner Stealth Pro</div>
      <div class="cro-sticky-price">$139.00 <span style="text-decoration: line-through; color: #94a3b8; font-size: 13px;">$179.00</span></div>
    </div>
  </div>
  <button class="cro-sticky-btn" id="cro-sticky-trigger-btn">
    ⚡ Add to Cart • Fast Checkout
  </button>
</div>`,
    jsCode: `// CRO Script: Watch original ATC button and trigger sticky bar
(function initStickyATC() {
  const bar = document.getElementById('cro-sticky-atc-bar');
  const triggerBtn = document.getElementById('cro-sticky-trigger-btn');
  const originalBtn = document.querySelector('.add-to-cart-btn, #add-to-cart, button[type="submit"]');

  if (!bar) return;

  // Scroll listener using IntersectionObserver
  if (originalBtn) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          bar.classList.add('cro-visible');
        } else {
          bar.classList.remove('cro-visible');
        }
      });
    }, { threshold: 0.1 });
    observer.observe(originalBtn);
  } else {
    // Fallback: show after 400px scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        bar.classList.add('cro-visible');
      } else {
        bar.classList.remove('cro-visible');
      }
    });
  }

  // Click handler forwarding to original purchase logic
  if (triggerBtn && originalBtn) {
    triggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      originalBtn.click();
      triggerBtn.innerText = '✓ Added to Cart!';
      setTimeout(() => {
        triggerBtn.innerText = '⚡ Add to Cart • Fast Checkout';
      }, 2500);
    });
  }
})();`
  },
  {
    id: 'snip-urgency-timer',
    title: 'Flash Sale Urgency Countdown Timer Bar',
    description: 'Dynamic countdown timer creating urgency for flash sales or expiring discount codes with persistent time state in sessionStorage.',
    category: 'urgency',
    tags: ['urgency', 'timer', 'scarcity', 'banner', 'sales'],
    targetSelectorHint: 'header, .top-nav, body',
    isDefault: true,
    createdAt: '2025-01-18',
    cssCode: `/* CRO Flash Urgency Bar */
#cro-urgency-banner {
  background: linear-gradient(90deg, #dc2626 0%, #ea580c 100%);
  color: #ffffff;
  padding: 10px 16px;
  text-align: center;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 2px 10px rgba(220, 38, 38, 0.25);
  z-index: 10000;
}

.cro-timer-digit {
  background: rgba(0, 0, 0, 0.35);
  padding: 3px 8px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.cro-urgency-badge {
  background: #ffffff;
  color: #dc2626;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 9999px;
  text-transform: uppercase;
}`,
    htmlCode: `<div id="cro-urgency-banner">
  <span class="cro-urgency-badge">FLASH SALE</span>
  <span>🔥 Order in the next <span class="cro-timer-digit" id="cro-min">14</span>:<span class="cro-timer-digit" id="cro-sec">59</span> to get <strong>20% OFF</strong> with code <strong>FLASH20</strong></span>
</div>`,
    jsCode: `// Dynamic persistent timer
(function initCountdown() {
  const minEl = document.getElementById('cro-min');
  const secEl = document.getElementById('cro-sec');
  if (!minEl || !secEl) return;

  let timeLeft = sessionStorage.getItem('cro_sale_timer');
  if (!timeLeft) {
    timeLeft = 15 * 60; // 15 minutes in seconds
  } else {
    timeLeft = parseInt(timeLeft, 10);
  }

  function update() {
    if (timeLeft <= 0) {
      minEl.textContent = '00';
      secEl.textContent = '00';
      return;
    }
    timeLeft--;
    sessionStorage.setItem('cro_sale_timer', timeLeft.toString());
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    minEl.textContent = m < 10 ? '0' + m : m;
    secEl.textContent = s < 10 ? '0' + s : s;
  }

  setInterval(update, 1000);
})();`
  },
  {
    id: 'snip-free-shipping-progress',
    title: 'Free Shipping Tier Progress Bar',
    description: 'Dynamic visual progress bar encouraging cart size increase by showing remaining spend to unlock free delivery.',
    category: 'friction_reduction',
    tags: ['cart', 'aov', 'free-shipping', 'e-commerce', 'gamification'],
    targetSelectorHint: '.cart-drawer, .summary-box, #checkout-summary',
    isDefault: true,
    createdAt: '2025-02-01',
    cssCode: `/* CRO Free Shipping Progress Bar */
.cro-shipping-progress-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 18px;
  margin: 16px 0;
  font-family: inherit;
}

.cro-shipping-label {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.cro-progress-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.cro-progress-fill {
  height: 100%;
  width: 78%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 9999px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.cro-shipping-subtext {
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
}`,
    htmlCode: `<div class="cro-shipping-progress-card">
  <div class="cro-shipping-label">
    <span>🚚 You are <strong>$21.00</strong> away from <strong>FREE Express Shipping</strong>!</span>
    <span style="color: #059669; font-weight: 800;">78%</span>
  </div>
  <div class="cro-progress-track">
    <div class="cro-progress-fill"></div>
  </div>
  <div class="cro-shipping-subtext">Add one more accessory to qualify for next-day dispatch.</div>
</div>`,
    jsCode: `// CRO Script: Adjust progress dynamically based on cart total
(function initShippingBar() {
  console.log('[CRO] Free Shipping Bar initialized');
})();`
  },
  {
    id: 'snip-social-proof-pill',
    title: 'Live Social Proof "Viewing Now" Toast',
    description: 'Subtle notification pill indicating live user interest and recent purchases to leverage bandwagon effect and FOMO.',
    category: 'social_proof',
    tags: ['social-proof', 'fomo', 'real-time', 'pdp', 'luxury'],
    targetSelectorHint: 'body, .product-hero',
    isDefault: true,
    createdAt: '2025-02-05',
    cssCode: `/* CRO Social Proof Toast */
#cro-social-proof-toast {
  position: fixed;
  bottom: 24px;
  left: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  z-index: 99998;
  max-width: 340px;
  transform: translateY(120%);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

#cro-social-proof-toast.cro-active {
  transform: translateY(0);
  opacity: 1;
}

.cro-pulse-dot {
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  animation: cro-pulse 2s infinite;
}

@keyframes cro-pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.cro-sp-text {
  font-size: 13px;
  color: #334155;
  line-height: 1.4;
}`,
    htmlCode: `<div id="cro-social-proof-toast">
  <div class="cro-pulse-dot"></div>
  <div class="cro-sp-text">
    <strong style="color: #0f172a;">34 people</strong> are currently viewing this item. 12 purchased in the last 4 hours.
  </div>
</div>`,
    jsCode: `// Trigger toast after 3 seconds delay
(function showSocialProof() {
  const toast = document.getElementById('cro-social-proof-toast');
  if (!toast) return;

  setTimeout(() => {
    toast.classList.add('cro-active');
  }, 2200);

  // Rotate messages every 8 seconds
  const messages = [
    '<strong>Sarah from Austin</strong> just ordered 2 pairs 4 mins ago.',
    '<strong style="color:#0f172a;">34 people</strong> are currently viewing this item.',
    'Only <strong>3 items left</strong> in Size 10 in our central warehouse!'
  ];
  let idx = 0;
  setInterval(() => {
    toast.classList.remove('cro-active');
    setTimeout(() => {
      idx = (idx + 1) % messages.length;
      const textEl = toast.querySelector('.cro-sp-text');
      if (textEl) textEl.innerHTML = messages[idx];
      toast.classList.add('cro-active');
    }, 500);
  }, 7500);
})();`
  },
  {
    id: 'snip-trust-seals',
    title: 'Guaranteed Checkout Trust & Payment Badges',
    description: 'Clean, modern security seals, 30-day money-back guarantee, and SSL badge placed directly below the primary CTA to eliminate buyer anxiety.',
    category: 'friction_reduction',
    tags: ['trust', 'security', 'guarantee', 'checkout', 'social-proof'],
    targetSelectorHint: '.add-to-cart-container, .buy-now-wrapper, #order-summary',
    isDefault: true,
    createdAt: '2025-02-10',
    cssCode: `/* CRO Trust & Guarantee Badges */
.cro-trust-badges-wrapper {
  margin-top: 14px;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cro-trust-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
}

.cro-trust-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.cro-trust-item svg {
  color: #16a34a;
  flex-shrink: 0;
}`,
    htmlCode: `<div class="cro-trust-badges-wrapper">
  <div class="cro-trust-row">
    <div class="cro-trust-item">
      <span>🛡️ 30-Day Money-Back</span>
    </div>
    <div class="cro-trust-item">
      <span>🔒 256-Bit SSL Encrypted</span>
    </div>
    <div class="cro-trust-item">
      <span>⚡ Free Returns</span>
    </div>
  </div>
</div>`,
    jsCode: `// Inserted right below checkout / buy box
console.log('[CRO] Trust badges rendered');`
  },
  {
    id: 'snip-exit-intent',
    title: 'Smart Exit-Intent Discount & Lead Capture Modal',
    description: 'Triggers when cursor leaves viewport top boundary, offering an exclusive one-time 15% discount code before bounce.',
    category: 'cta_value_prop',
    tags: ['exit-intent', 'lead-gen', 'modal', 'discount', 'retention'],
    targetSelectorHint: 'body',
    isDefault: true,
    createdAt: '2025-02-12',
    cssCode: `/* CRO Exit Intent Modal */
#cro-exit-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

#cro-exit-modal-backdrop.cro-open {
  opacity: 1;
  pointer-events: auto;
}

.cro-exit-modal-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  max-width: 440px;
  width: 90%;
  text-align: center;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform: scale(0.95);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

#cro-exit-modal-backdrop.cro-open .cro-exit-modal-card {
  transform: scale(1);
}

.cro-exit-close {
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #94a3b8;
}

.cro-exit-btn {
  background: #2563eb;
  color: #ffffff;
  font-weight: 700;
  font-size: 15px;
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  margin-top: 16px;
}`,
    htmlCode: `<div id="cro-exit-modal-backdrop">
  <div class="cro-exit-modal-card">
    <button class="cro-exit-close" id="cro-exit-close-btn">&times;</button>
    <div style="font-size: 40px; margin-bottom: 8px;">🎁</div>
    <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">Wait! Take 15% Off Your Order</h3>
    <p style="color: #64748b; font-size: 14px; margin: 0 0 20px 0;">Use code <strong>SAVE15</strong> right now before your reservation expires.</p>
    <button class="cro-exit-btn" id="cro-claim-discount-btn">Apply 15% Off & Continue</button>
  </div>
</div>`,
    jsCode: `// Detect exit intent cursor movement
(function initExitIntent() {
  let shown = sessionStorage.getItem('cro_exit_shown');
  const backdrop = document.getElementById('cro-exit-modal-backdrop');
  const closeBtn = document.getElementById('cro-exit-close-btn');
  const claimBtn = document.getElementById('cro-claim-discount-btn');

  if (!backdrop || shown) return;

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 10 && !shown) {
      backdrop.classList.add('cro-open');
      shown = true;
      sessionStorage.setItem('cro_exit_shown', 'true');
    }
  });

  closeBtn?.addEventListener('click', () => backdrop.classList.remove('cro-open'));
  claimBtn?.addEventListener('click', () => {
    alert('Code SAVE15 applied to checkout!');
    backdrop.classList.remove('cro-open');
  });
})();`
  },
  {
    id: 'snip-accordion-faq',
    title: 'High-Converting Accordion FAQ Section',
    description: 'Clean expandable FAQ accordion addressing common objections (shipping times, return policy, sizing, guarantees) directly on the product or pricing page.',
    category: 'layout',
    tags: ['faq', 'accordion', 'objection-handling', 'friction-reduction'],
    targetSelectorHint: '.product-details, .pricing-grid, #reviews-section',
    isDefault: true,
    createdAt: '2025-02-15',
    cssCode: `/* CRO Accordion FAQ */
.cro-faq-container {
  margin: 28px 0;
  border-top: 1px solid #e2e8f0;
}

.cro-faq-item {
  border-bottom: 1px solid #e2e8f0;
}

.cro-faq-header {
  padding: 16px 0;
  font-weight: 700;
  font-size: 15px;
  color: #1e293b;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.cro-faq-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.cro-faq-body-inner {
  padding-bottom: 16px;
}

.cro-faq-item.cro-active .cro-faq-body {
  max-height: 200px;
}

.cro-faq-icon {
  transition: transform 0.2s ease;
}

.cro-faq-item.cro-active .cro-faq-icon {
  transform: rotate(180deg);
}`,
    htmlCode: `<div class="cro-faq-container">
  <div class="cro-faq-item">
    <div class="cro-faq-header">
      <span>📦 How fast is shipping & delivery?</span>
      <span class="cro-faq-icon">▼</span>
    </div>
    <div class="cro-faq-body">
      <div class="cro-faq-body-inner">
        All orders ship within 24 hours. Standard US delivery takes 2-3 business days. Free returns within 30 days!
      </div>
    </div>
  </div>
  <div class="cro-faq-item">
    <div class="cro-faq-header">
      <span>👟 How does the sizing fit?</span>
      <span class="cro-faq-icon">▼</span>
    </div>
    <div class="cro-faq-body">
      <div class="cro-faq-body-inner">
        Fits true to size! If you prefer a wider fit or are between sizes, we recommend sizing up half a size.
      </div>
    </div>
  </div>
</div>`,
    jsCode: `// Accordion click handler
(function initAccordion() {
  document.querySelectorAll('.cro-faq-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.cro-faq-item');
      item?.classList.toggle('cro-active');
    });
  });
})();`
  },
  {
    id: 'snip-low-stock',
    title: 'Low Stock Scarcity & Inventory Pill',
    description: 'Dynamic visual stock indicator showing limited remaining quantity to create urgency and discourage postponement.',
    category: 'urgency',
    tags: ['scarcity', 'inventory', 'stock', 'urgency', 'conversion-rate'],
    targetSelectorHint: '.price-container, .stock-status, .product-meta',
    isDefault: true,
    createdAt: '2025-02-18',
    cssCode: `/* CRO Low Stock Pill */
.cro-stock-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 700;
  margin: 10px 0;
}

.cro-stock-dot {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  display: inline-block;
  animation: cro-blink 1.5s infinite;
}

@keyframes cro-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}`,
    htmlCode: `<div class="cro-stock-pill">
  <span class="cro-stock-dot"></span>
  <span>⚠️ Almost Gone! Only <strong>4 units left</strong> in stock.</span>
</div>`,
    jsCode: `console.log('[CRO] Scarcity stock pill mounted');`
  }
];

export const CATEGORY_LABELS: Record<SnippetCategory, { label: string; icon: string }> = {
  all: { label: 'All Snippets', icon: 'Sparkles' },
  urgency: { label: 'Urgency & Scarcity', icon: 'Flame' },
  social_proof: { label: 'Social Proof & Trust', icon: 'ShieldCheck' },
  friction_reduction: { label: 'Friction Reduction', icon: 'Zap' },
  sticky_elements: { label: 'Sticky CTAs & Bars', icon: 'Pin' },
  cta_value_prop: { label: 'CTA & Value Props', icon: 'MousePointerClick' },
  form_opt: { label: 'Form Optimization', icon: 'FormInput' },
  layout: { label: 'Layout & Navigation', icon: 'LayoutTemplate' },
  custom: { label: 'Custom Snippets', icon: 'Code' },
};
