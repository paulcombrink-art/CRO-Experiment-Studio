export interface DemoPage {
  id: string;
  name: string;
  industry: string;
  description: string;
  urlKey: string;
  rawHtml: string;
}

export const DEMO_PAGES: DemoPage[] = [
  {
    id: 'demo-ecommerce',
    name: 'Apex Runner Pro (E-Commerce PDP)',
    industry: 'E-commerce DTC',
    description: 'High-traffic sneaker product detail page with size selectors, buy box, gallery, and customer reviews.',
    urlKey: 'demo://ecommerce-pdp',
    rawHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Stealth Runner Pro 2.0 - Performance Shoes</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; background: #ffffff; line-height: 1.5; }
    .top-bar { background: #0f172a; color: #ffffff; text-align: center; padding: 8px 16px; font-size: 13px; font-weight: 600; }
    .navbar { display: flex; align-items: center; justify-content: space-between; padding: 18px 32px; border-bottom: 1px solid #f1f5f9; }
    .brand { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
    .nav-links { display: flex; gap: 24px; font-size: 14px; font-weight: 600; color: #64748b; }
    .cart-btn { background: #f1f5f9; border: none; padding: 8px 16px; border-radius: 999px; font-weight: 700; cursor: pointer; }
    
    .pdp-container { max-width: 1180px; margin: 40px auto; padding: 0 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
    @media (max-width: 768px) { .pdp-container { grid-template-columns: 1fr; gap: 24px; } }

    .gallery-box { background: #f8fafc; border-radius: 20px; overflow: hidden; padding: 40px; text-align: center; border: 1px solid #e2e8f0; position: relative; }
    .gallery-img { max-width: 100%; height: auto; object-fit: contain; filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15)); }
    .thumbnails { display: flex; gap: 12px; margin-top: 16px; justify-content: center; }
    .thumb { width: 64px; height: 64px; border-radius: 10px; background: #e2e8f0; border: 2px solid transparent; cursor: pointer; }
    .thumb.active { border-color: #0f172a; }

    .product-meta { display: flex; flex-direction: column; gap: 16px; }
    .badge { align-self: flex-start; background: #e0f2fe; color: #0284c7; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; }
    .product-title { font-size: 32px; font-weight: 900; color: #0f172a; line-height: 1.2; }
    .reviews-row { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #64748b; }
    .stars { color: #f59e0b; }
    
    .price-row { display: flex; align-items: baseline; gap: 12px; }
    .current-price { font-size: 28px; font-weight: 900; color: #0f172a; }
    .original-price { font-size: 18px; color: #94a3b8; text-decoration: line-through; }
    .discount-tag { background: #dcfce7; color: #16a34a; font-size: 12px; font-weight: 800; padding: 4px 8px; border-radius: 6px; }

    .description { color: #475569; font-size: 15px; }

    .options-section { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
    .option-title { font-size: 14px; font-weight: 700; color: #334155; }
    .size-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
    .size-btn { padding: 12px 0; border: 1px solid #cbd5e1; background: #ffffff; border-radius: 8px; font-weight: 700; cursor: pointer; text-align: center; }
    .size-btn:hover { border-color: #0f172a; }
    .size-btn.selected { background: #0f172a; color: #ffffff; border-color: #0f172a; }

    .buy-box { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
    .add-to-cart-btn { background: #0f172a; color: #ffffff; border: none; padding: 18px; font-size: 16px; font-weight: 800; border-radius: 12px; cursor: pointer; transition: all 0.2s ease; width: 100%; }
    .add-to-cart-btn:hover { background: #1e293b; transform: translateY(-1px); }
    .buy-now-btn { background: #f1f5f9; color: #0f172a; border: 1px solid #e2e8f0; padding: 16px; font-size: 15px; font-weight: 700; border-radius: 12px; cursor: pointer; }

    .features-list { margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .feature-item { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; color: #334155; }

    .reviews-section { max-width: 1180px; margin: 60px auto; padding: 0 24px; border-top: 1px solid #e2e8f0; padding-top: 48px; }
    .reviews-heading { font-size: 24px; font-weight: 800; margin-bottom: 24px; }
    .review-card { background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 16px; border: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="top-bar">🚚 Free Shipping on Orders Over $75 • 30-Day Hassle-Free Returns</div>
  <nav class="navbar">
    <div class="brand">APEX SPEED</div>
    <div class="nav-links">
      <span>Men</span>
      <span>Women</span>
      <span>Running</span>
      <span>Sale</span>
    </div>
    <button class="cart-btn">Cart (0)</button>
  </nav>

  <main class="pdp-container">
    <div class="gallery-box">
      <div style="font-size: 90px; line-height: 1;">👟</div>
      <div style="font-weight: 800; color: #64748b; margin-top: 12px;">Stealth Jet Black Edition</div>
    </div>

    <div class="product-meta">
      <span class="badge">Trending Runner</span>
      <h1 class="product-title">Apex Stealth Runner Pro 2.0</h1>
      <div class="reviews-row">
        <span class="stars">★★★★★</span>
        <strong>4.9</strong>
        <span>(328 Verified Customer Reviews)</span>
      </div>

      <div class="price-row">
        <span class="current-price">$139.00</span>
        <span class="original-price">$179.00</span>
        <span class="discount-tag">Save $40</span>
      </div>

      <p class="description">
        Engineered with ultra-responsive carbon propulsion plate and breathable hyper-mesh. Optimized for marathon pacing, everyday training, and responsive energy return.
      </p>

      <div class="options-section">
        <div class="option-title">Select US Size:</div>
        <div class="size-grid">
          <button class="size-btn">8.0</button>
          <button class="size-btn">8.5</button>
          <button class="size-btn selected">9.0</button>
          <button class="size-btn">9.5</button>
          <button class="size-btn">10.0</button>
          <button class="size-btn">10.5</button>
          <button class="size-btn">11.0</button>
          <button class="size-btn">11.5</button>
          <button class="size-btn">12.0</button>
          <button class="size-btn">13.0</button>
        </div>
      </div>

      <div class="buy-box">
        <button class="add-to-cart-btn" id="add-to-cart">Add to Cart • $139.00</button>
        <button class="buy-now-btn">Instant Buy with ShopPay</button>
      </div>

      <div class="features-list">
        <div class="feature-item">⚡ 215g Ultralight Carbon Plate</div>
        <div class="feature-item">🛡️ 1000km Durability Guarantee</div>
        <div class="feature-item">📦 Ships Next Business Day</div>
        <div class="feature-item">🔄 Free Size Exchange Policy</div>
      </div>
    </div>
  </main>

  <section class="reviews-section" id="reviews-section">
    <h2 class="reviews-heading">Customer Feedback (328)</h2>
    <div class="review-card">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <strong>Marcus T. — Marathon Runner</strong>
        <span style="color:#f59e0b;">★★★★★</span>
      </div>
      <p style="color:#475569; font-size:14px;">"Best running shoe I've bought in 5 years. Shaved 4 minutes off my half marathon time. Incredible cushion without feeling spongy."</p>
    </div>
  </section>
</body>
</html>`
  },
  {
    id: 'demo-saas-pricing',
    name: 'CloudMetrics SaaS (Pricing & Features)',
    industry: 'B2B SaaS',
    description: 'High-converting SaaS pricing page with tier comparison, annual discount toggle, and feature checklists.',
    urlKey: 'demo://saas-pricing',
    rawHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CloudMetrics - Simple, Transparent Pricing</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; background: #f8fafc; line-height: 1.5; padding-bottom: 80px; }
    .header { text-align: center; padding: 60px 24px 32px 24px; max-width: 800px; margin: 0 auto; }
    .eyebrow { color: #2563eb; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
    .title { font-size: 40px; font-weight: 900; margin: 12px 0; letter-spacing: -1px; }
    .subtitle { color: #64748b; font-size: 18px; }
    
    .billing-toggle { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 32px 0 48px 0; font-weight: 700; font-size: 14px; }
    .toggle-pill { background: #e2e8f0; border-radius: 999px; padding: 4px; display: flex; cursor: pointer; }
    .toggle-option { padding: 6px 16px; border-radius: 999px; }
    .toggle-option.active { background: #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); color: #0f172a; }
    .save-badge { background: #dcfce7; color: #16a34a; font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 800; }

    .pricing-grid { max-width: 1140px; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
    @media (max-width: 860px) { .pricing-grid { grid-template-columns: 1fr; } }

    .pricing-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 36px 30px; display: flex; flex-direction: column; position: relative; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04); }
    .pricing-card.featured { border-color: #2563eb; border-width: 2px; box-shadow: 0 20px 25px -5px rgba(37,99,235,0.1); transform: scale(1.03); }
    .featured-ribbon { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #2563eb; color: #ffffff; font-size: 12px; font-weight: 800; padding: 4px 14px; border-radius: 999px; }

    .tier-name { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
    .tier-desc { color: #64748b; font-size: 14px; min-height: 42px; }
    .tier-price { font-size: 42px; font-weight: 900; margin: 20px 0; color: #0f172a; }
    .tier-price span { font-size: 16px; font-weight: 600; color: #64748b; }

    .cta-btn { display: block; text-align: center; padding: 14px; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; text-decoration: none; border: none; margin-bottom: 28px; }
    .cta-primary { background: #2563eb; color: #ffffff; box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
    .cta-secondary { background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; }

    .feature-list { list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 14px; color: #334155; }
    .feature-list li { display: flex; align-items: center; gap: 10px; }
    .check { color: #16a34a; font-weight: 800; }
  </style>
</head>
<body>
  <div class="header">
    <div class="eyebrow">Enterprise-Grade Performance</div>
    <h1 class="title">Predictable Pricing for High-Growth Teams</h1>
    <p class="subtitle">Deploy in minutes, scale to millions of events with real-time anomaly alerts.</p>
    
    <div class="billing-toggle">
      <span>Monthly</span>
      <div class="toggle-pill">
        <span class="toggle-option">Monthly</span>
        <span class="toggle-option active">Annual</span>
      </div>
      <span>Annual <span class="save-badge">Save 25%</span></span>
    </div>
  </div>

  <div class="pricing-grid">
    <div class="pricing-card" id="tier-starter">
      <div class="tier-name">Starter</div>
      <div class="tier-desc">Essential event tracking for early stage apps and indie founders.</div>
      <div class="tier-price">$29 <span>/ month</span></div>
      <button class="cta-btn cta-secondary">Start 14-Day Trial</button>
      <ul class="feature-list">
        <li><span class="check">✓</span> Up to 50,000 monthly events</li>
        <li><span class="check">✓</span> 3 Team Members</li>
        <li><span class="check">✓</span> 30-Day Data Retention</li>
        <li><span class="check">✓</span> Standard Slack Webhooks</li>
      </ul>
    </div>

    <div class="pricing-card featured" id="tier-pro">
      <div class="featured-ribbon">MOST POPULAR</div>
      <div class="tier-name">Growth Pro</div>
      <div class="tier-desc">Full funnel insights and custom dashboards for scaling companies.</div>
      <div class="tier-price">$79 <span>/ month</span></div>
      <button class="cta-btn cta-primary" id="cta-pro-trial">Start Free 14-Day Pro Trial</button>
      <ul class="feature-list">
        <li><span class="check">✓</span> Up to 500,000 monthly events</li>
        <li><span class="check">✓</span> Unlimited Team Members</li>
        <li><span class="check">✓</span> 1-Year Data Retention</li>
        <li><span class="check">✓</span> AI Anomaly & Churn Detection</li>
        <li><span class="check">✓</span> Priority Support (1-Hour SLA)</li>
      </ul>
    </div>

    <div class="pricing-card" id="tier-enterprise">
      <div class="tier-name">Enterprise</div>
      <div class="tier-desc">Dedicated infrastructure, HIPAA & SOC2 compliance, custom SLA.</div>
      <div class="tier-price">$299 <span>/ month</span></div>
      <button class="cta-btn cta-secondary">Contact Sales</button>
      <ul class="feature-list">
        <li><span class="check">✓</span> Unlimited Monthly Events</li>
        <li><span class="check">✓</span> Dedicated Cluster & VPC Peering</li>
        <li><span class="check">✓</span> Custom SAML / SSO Integration</li>
        <li><span class="check">✓</span> Dedicated Account Manager</li>
      </ul>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'demo-leadgen',
    name: 'Havenly Luxury Resorts (Consultation Form)',
    industry: 'Hospitality & Luxury',
    description: 'High-value lead generation and VIP booking request form with date pickers and guest counts.',
    urlKey: 'demo://leadgen-booking',
    rawHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Havenly Luxury Retreats - Request VIP Itinerary</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; line-height: 1.5; padding: 40px 20px; }
    .form-wrapper { max-width: 640px; margin: 0 auto; background: #1e293b; border-radius: 24px; padding: 40px; border: 1px solid #334155; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .badge { background: #3b82f6; color: #ffffff; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px; }
    .title { font-size: 28px; font-weight: 800; margin: 14px 0 8px 0; }
    .subtitle { color: #94a3b8; font-size: 15px; margin-bottom: 32px; }
    
    .form-group { margin-bottom: 20px; }
    .label { display: block; font-size: 13.5px; font-weight: 700; margin-bottom: 8px; color: #cbd5e1; }
    .input { width: 100%; padding: 14px 16px; border-radius: 10px; border: 1px solid #475569; background: #0f172a; color: #ffffff; font-size: 15px; }
    .input:focus { border-color: #3b82f6; outline: none; }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 540px) { .grid-2 { grid-template-columns: 1fr; } }

    .submit-btn { width: 100%; background: #3b82f6; color: #ffffff; border: none; padding: 16px; border-radius: 12px; font-size: 16px; font-weight: 800; cursor: pointer; margin-top: 12px; transition: background 0.2s ease; }
    .submit-btn:hover { background: #2563eb; }
    .disclaimer { font-size: 12px; color: #64748b; text-align: center; margin-top: 14px; }
  </style>
</head>
<body>
  <div class="form-wrapper">
    <span class="badge">VIP Concierge Service</span>
    <h1 class="title">Request Your Bespoke Private Villa Itinerary</h1>
    <p class="subtitle">Our luxury travel curator will assemble custom villa options, private aviation quotes, and culinary experiences in under 2 hours.</p>

    <form id="lead-form">
      <div class="grid-2">
        <div class="form-group">
          <label class="label">First Name</label>
          <input class="input" placeholder="Eleanor" required>
        </div>
        <div class="form-group">
          <label class="label">Last Name</label>
          <input class="input" placeholder="Vance" required>
        </div>
      </div>

      <div class="form-group">
        <label class="label">Work Email / Primary Contact</label>
        <input class="input" type="email" placeholder="eleanor@vance-holdings.com" required>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="label">Desired Destination</label>
          <select class="input" style="background:#0f172a; color:#fff;">
            <option>Amalfi Coast, Italy</option>
            <option>St. Barts, French West Indies</option>
            <option>Aspen & Vail Chalets, USA</option>
            <option>Kyoto Private Ryokan, Japan</option>
          </select>
        </div>
        <div class="form-group">
          <label class="label">Estimated Party Size</label>
          <select class="input" style="background:#0f172a; color:#fff;">
            <option>2 Guests (Couple Retreat)</option>
            <option>4-6 Guests (Family)</option>
            <option>8+ Guests (Private Villa Buyout)</option>
          </select>
        </div>
      </div>

      <button type="submit" class="submit-btn" id="submit-lead-btn">Request VIP Itinerary & Quotes →</button>
      <div class="disclaimer">🔒 100% Confidential • Zero spam guarantee • Dedicated 24/7 Concierge</div>
    </form>
  </div>
</body>
</html>`
  }
];
