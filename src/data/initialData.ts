import { Client, Experiment } from '../types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-apex',
    name: 'Apex Speed Athletics',
    slug: 'apex-athletics',
    industry: 'ecommerce',
    websiteUrl: 'demo://ecommerce-pdp',
    brandColor: '#2563eb',
    notes: 'DTC performance runner brand focusing on mobile PDP checkout rate and Average Order Value (AOV).',
    createdAt: '2025-01-10',
    experimentCount: 2,
  },
  {
    id: 'client-cloudmetrics',
    name: 'CloudMetrics SaaS',
    slug: 'cloudmetrics',
    industry: 'saas',
    websiteUrl: 'demo://saas-pricing',
    brandColor: '#7c3aed',
    notes: 'B2B developer analytics tool testing annual tier conversions and free trial activation.',
    createdAt: '2025-01-20',
    experimentCount: 1,
  },
  {
    id: 'client-havenly',
    name: 'Havenly Luxury Retreats',
    slug: 'havenly-retreats',
    industry: 'travel_hospitality',
    websiteUrl: 'demo://leadgen-booking',
    brandColor: '#059669',
    notes: 'Luxury travel concierge testing form friction reduction and social proof badges.',
    createdAt: '2025-02-01',
    experimentCount: 1,
  },
];

export const INITIAL_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-apex-sticky-atc',
    clientId: 'client-apex',
    name: 'PDP Sticky Add-To-Cart & Stock Scarcity Test',
    hypothesis: 'If we inject a sticky bottom checkout bar with a low-stock scarcity pill on mobile & desktop, then cart add rate will increase by 14% because it removes scroll friction on long PDPs.',
    status: 'active',
    targetUrl: 'demo://ecommerce-pdp',
    primaryMetric: 'Add to Cart Rate (+14% target)',
    secondaryMetrics: ['Bounce Rate', 'Scroll Depth to Buy Box'],
    activeVariantId: 'var-apex-v1',
    createdAt: '2025-01-15',
    updatedAt: '2025-02-20',
    tags: ['sticky-bar', 'urgency', 'pdp', 'mobile-cro'],
    variants: [
      {
        id: 'var-apex-control',
        name: 'Control (Original)',
        isControl: true,
        description: 'Standard product page without sticky bar or injected urgency elements.',
        cssCode: `/* Control: No modifications */`,
        jsCode: `// Control variant\nconsole.log('[CRO] Control Variant Active');`,
        htmlCode: ``,
        placement: 'body_end',
        insertPosition: 'append',
      },
      {
        id: 'var-apex-v1',
        name: 'Variant A: Sticky ATC Bar + Free Shipping Meter',
        isControl: false,
        description: 'Floating bottom sticky action bar with instant buy trigger and dynamic free shipping progress meter.',
        placement: 'body_end',
        insertPosition: 'append',
        cssCode: `/* Variant A: Sticky ATC + Scarcity Pill */
#cro-sticky-atc-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.14);
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99999;
  border-top: 1px solid #e2e8f0;
  animation: croSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes croSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.cro-sticky-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cro-sticky-title {
  font-weight: 800;
  font-size: 15px;
  color: #0f172a;
}

.cro-sticky-price {
  font-size: 17px;
  font-weight: 900;
  color: #16a34a;
}

.cro-sticky-cta {
  background: #0f172a;
  color: #ffffff;
  font-weight: 800;
  font-size: 14px;
  padding: 12px 28px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
  transition: all 0.2s ease;
}

.cro-sticky-cta:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.cro-scarcity-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
}`,
        htmlCode: `<div id="cro-sticky-atc-bar">
  <div class="cro-sticky-info">
    <div>
      <div class="cro-sticky-title">Apex Stealth Runner Pro 2.0</div>
      <div class="cro-sticky-price">$139.00 <span class="cro-scarcity-badge">🔥 Only 3 pairs left</span></div>
    </div>
  </div>
  <button class="cro-sticky-cta" id="cro-sticky-btn-action">
    ⚡ Fast Add to Cart • Free Delivery
  </button>
</div>`,
        jsCode: `// CRO Injected Variant Script
(function() {
  const stickyBtn = document.getElementById('cro-sticky-btn-action');
  const originalAtc = document.querySelector('#add-to-cart, .add-to-cart-btn');

  if (stickyBtn && originalAtc) {
    stickyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      originalAtc.click();
      stickyBtn.innerText = '✓ In Cart! Proceeding...';
      stickyBtn.style.background = '#16a34a';
    });
  }
  console.log('[CRO] Variant A loaded successfully.');
})();`,
      },
      {
        id: 'var-apex-v2',
        name: 'Variant B: Urgency Countdown Banner + Trust Seals',
        isControl: false,
        description: 'Top banner flashing 20% off with live 15-minute countdown and security seals under the primary CTA.',
        placement: 'body_start',
        insertPosition: 'prepend',
        cssCode: `/* Variant B: Flash Sale Bar */
#cro-top-flash-bar {
  background: linear-gradient(90deg, #dc2626, #b91c1c);
  color: #ffffff;
  padding: 10px 20px;
  text-align: center;
  font-weight: 700;
  font-size: 13.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.cro-timer-box {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  font-weight: 800;
}`,
        htmlCode: `<div id="cro-top-flash-bar">
  <span>⚡ <strong>EXCLUSIVE FLASH SALE:</strong> Get extra 15% off with code <strong>FAST15</strong>. Expires in:</span>
  <span class="cro-timer-box" id="cro-flash-clock">14:59</span>
</div>`,
        jsCode: `(function() {
  let seconds = 899;
  const clock = document.getElementById('cro-flash-clock');
  if (!clock) return;
  setInterval(function() {
    if (seconds <= 0) return;
    seconds--;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    clock.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }, 1000);
})();`,
      }
    ],
  },
  {
    id: 'exp-cloudmetrics-pricing',
    clientId: 'client-cloudmetrics',
    name: 'Growth Pro Tier Visual Anchor & Social Proof',
    hypothesis: 'If we visually highlight the Growth Pro tier with an ROI badge and customer logos, then Pro trial starts will increase by 20%.',
    status: 'draft',
    targetUrl: 'demo://saas-pricing',
    primaryMetric: 'Pro Trial Signups (+20%)',
    activeVariantId: 'var-cm-v1',
    createdAt: '2025-01-22',
    updatedAt: '2025-02-18',
    variants: [
      {
        id: 'var-cm-control',
        name: 'Control',
        isControl: true,
        description: 'Standard 3-column pricing table.',
        cssCode: ``,
        jsCode: `console.log('[CRO] CloudMetrics Control');`,
        htmlCode: ``,
        placement: 'body_end',
        insertPosition: 'append',
      },
      {
        id: 'var-cm-v1',
        name: 'Variant A: High-Contrast Pro Card & Guarantee Pill',
        isControl: false,
        description: 'Amplified visual hierarchy for Growth Pro with glow effect and zero-risk guarantee badge.',
        placement: 'body_end',
        insertPosition: 'append',
        cssCode: `#tier-pro {
  border: 2px solid #7c3aed !important;
  box-shadow: 0 20px 35px -5px rgba(124, 58, 237, 0.25) !important;
  transform: scale(1.05) !important;
}

#cta-pro-trial {
  background: #7c3aed !important;
  font-size: 16px !important;
  padding: 16px !important;
}`,
        htmlCode: ``,
        jsCode: `(function() {
  const proCard = document.getElementById('tier-pro');
  if (proCard) {
    const badge = document.createElement('div');
    badge.style.cssText = 'background: #fdf4ff; border: 1px solid #f5d0fe; color: #7c3aed; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-top: 12px; text-align: center;';
    badge.innerHTML = '✨ <strong>Includes 30-Day Money Back Guarantee</strong>';
    proCard.appendChild(badge);
  }
})();`,
      }
    ],
  },
  {
    id: 'exp-havenly-leadgen',
    clientId: 'client-havenly',
    name: 'VIP Concierge 2-Step Form Conversion Test',
    hypothesis: 'If we add trust badges and guaranteed response time directly into the form header, consultation request rate will improve by 18%.',
    status: 'ready_for_prod',
    targetUrl: 'demo://leadgen-booking',
    primaryMetric: 'Form Submission Rate (+18%)',
    activeVariantId: 'var-hav-v1',
    createdAt: '2025-02-05',
    updatedAt: '2025-02-22',
    variants: [
      {
        id: 'var-hav-control',
        name: 'Control',
        isControl: true,
        description: 'Original lead generation form.',
        cssCode: ``,
        jsCode: ``,
        htmlCode: ``,
        placement: 'body_end',
        insertPosition: 'append',
      },
      {
        id: 'var-hav-v1',
        name: 'Variant A: High-Trust Seals & Fast Response Guarantee',
        isControl: false,
        description: 'Injects concierge response guarantee and verified reviews to reduce inquiry anxiety.',
        placement: 'body_end',
        insertPosition: 'append',
        cssCode: `.cro-concierge-pill {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13.5px;
  color: #93c5fd;
}`,
        htmlCode: ``,
        jsCode: `(function() {
  const form = document.getElementById('lead-form');
  if (form) {
    const trustBox = document.createElement('div');
    trustBox.className = 'cro-concierge-pill';
    trustBox.innerHTML = '<span>⚡ <strong>Average Response Time: 14 Minutes</strong> • Dedicated Private Flight & Villa Advisor Assigned</span>';
    form.insertBefore(trustBox, form.firstChild);
  }
})();`,
      }
    ]
  }
];
