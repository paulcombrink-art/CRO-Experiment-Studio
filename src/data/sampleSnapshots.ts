import { PageSnapshot } from '../types';

export const INITIAL_SNAPSHOTS: PageSnapshot[] = [
  {
    id: 'snap-nikon-coolpix',
    name: 'Nikon Coolpix P1100 (Captured PDP)',
    originalUrl: 'https://www.nikon.co.uk/en_GB/product/cameras/compact/coolpix-p1100-VQA170EA',
    description: 'Captured HTML snapshot of Nikon UK flagship superzoom compact camera product page.',
    createdAt: '2025-02-28',
    html: `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nikon COOLPIX P1100 | Compact Digital Camera | Nikon UK</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; background: #ffffff; line-height: 1.5; }
    
    /* Header & Navigation */
    .nikon-top-header { background: #000000; color: #ffffff; padding: 6px 32px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 500; }
    .nikon-top-links { display: flex; gap: 20px; }
    .nikon-top-links a { color: #9ca3af; text-decoration: none; }
    .nikon-top-links a:hover { color: #ffffff; }

    .nikon-nav { background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
    .nikon-logo-badge { display: flex; align-items: center; gap: 12px; }
    .nikon-yellow-bar { width: 34px; height: 34px; background: #FFE600; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; color: #000; letter-spacing: -1px; }
    .nikon-brand-text { font-size: 22px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #000000; }
    
    .nikon-nav-menu { display: flex; gap: 28px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .nikon-nav-menu a { text-decoration: none; color: #1f2937; }
    .nikon-nav-menu a:hover { color: #000000; }
    .nikon-nav-right { display: flex; items-center; gap: 16px; font-size: 13px; font-weight: 600; }
    .nikon-store-btn { background: #000000; color: #ffffff; padding: 8px 18px; border-radius: 4px; text-decoration: none; font-weight: 700; }

    /* Breadcrumbs */
    .nikon-breadcrumbs { padding: 14px 32px; font-size: 12px; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #f3f4f6; }
    .nikon-breadcrumbs span { margin: 0 6px; }
    .nikon-breadcrumbs a { color: #4b5563; text-decoration: none; }

    /* PDP Grid */
    .pdp-main { max-width: 1280px; margin: 32px auto; padding: 0 32px; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 54px; }
    @media (max-width: 900px) { .pdp-main { grid-template-columns: 1fr; gap: 32px; } }

    /* Gallery */
    .gallery-column { display: flex; flex-direction: column; gap: 20px; }
    .main-image-wrap { background: #f4f5f7; border-radius: 12px; padding: 48px 24px; display: flex; align-items: center; justify-content: center; min-height: 440px; position: relative; border: 1px solid #e5e7eb; }
    .nikon-badge-pill { position: absolute; top: 16px; left: 16px; background: #000000; color: #FFE600; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px; }
    .camera-graphic { font-size: 110px; line-height: 1; filter: drop-shadow(0 25px 35px rgba(0,0,0,0.18)); }
    
    .thumbnails-row { display: flex; gap: 12px; }
    .thumb-item { width: 80px; height: 80px; background: #f4f5f7; border-radius: 8px; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 28px; cursor: pointer; }
    .thumb-item.active { border-color: #000000; }

    /* Product Info / Buy Box */
    .info-column { display: flex; flex-direction: column; gap: 20px; }
    .product-category-eyebrow { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; }
    .product-title { font-size: 34px; font-weight: 900; letter-spacing: -0.5px; line-height: 1.15; color: #000000; }
    .product-subtitle { font-size: 16px; color: #4b5563; font-weight: 500; }

    .rating-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #374151; }
    .stars-wrap { color: #f59e0b; font-size: 16px; letter-spacing: 2px; }
    .review-count { color: #6b7280; text-decoration: underline; cursor: pointer; }

    .price-box { background: #fafafa; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; display: flex; flex-direction: column; gap: 8px; }
    .price-amount { font-size: 32px; font-weight: 900; color: #000000; }
    .vat-included { font-size: 12px; color: #6b7280; }
    .stock-status { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #059669; margin-top: 4px; }
    .stock-dot { width: 8px; height: 8px; border-radius: 50%; background: #059669; }

    .key-features-box { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
    .feature-point { display: flex; align-items: flex-start; gap: 8px; font-size: 14px; color: #374151; }
    .feature-bullet { color: #000000; font-weight: 900; }

    /* CTA Area */
    .cta-container { display: flex; flex-direction: column; gap: 12px; margin-top: 10px; }
    .btn-primary-atc { background: #FFE600; color: #000000; border: none; padding: 18px 28px; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 6px; cursor: pointer; width: 100%; transition: background 0.15s ease; }
    .btn-primary-atc:hover { background: #ebd300; }
    .btn-secondary-dealer { background: #ffffff; color: #000000; border: 2px solid #000000; padding: 14px 28px; font-size: 14px; font-weight: 700; text-transform: uppercase; border-radius: 6px; cursor: pointer; text-align: center; }

    /* Guarantee bar */
    .guarantees-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12.5px; color: #4b5563; }
    .guarantee-item { display: flex; items-center; gap: 8px; }

    /* Specs Tab Bar */
    .specs-section { max-width: 1280px; margin: 48px auto; padding: 0 32px; }
    .specs-header { font-size: 22px; font-weight: 800; margin-bottom: 16px; border-bottom: 2px solid #000000; padding-bottom: 8px; }
    .specs-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .specs-table td { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
    .specs-table td:first-child { font-weight: 700; width: 28%; background: #f9fafb; }
  </style>
</head>
<body>
  <!-- Nikon Top Bar -->
  <header class="nikon-top-header">
    <div>Official Nikon UK Store • Free Express Delivery on orders over £50</div>
    <div class="nikon-top-links">
      <a href="#">Support</a>
      <a href="#">My Nikon Account</a>
      <a href="#">Store Locator</a>
    </div>
  </header>

  <!-- Navbar -->
  <nav class="nikon-nav">
    <div class="nikon-logo-badge">
      <div class="nikon-yellow-bar">N</div>
      <div class="nikon-brand-text">Nikon</div>
    </div>
    <div class="nikon-nav-menu">
      <a href="#">Cameras</a>
      <a href="#">Lenses (NIKKOR)</a>
      <a href="#">Sport Optics</a>
      <a href="#">Accessories</a>
      <a href="#">Nikon School</a>
    </div>
    <div class="nikon-nav-right">
      <a href="#" class="nikon-store-btn">Buy Online</a>
    </div>
  </nav>

  <!-- Breadcrumbs -->
  <div class="nikon-breadcrumbs">
    <a href="#">Home</a><span>›</span>
    <a href="#">Cameras</a><span>›</span>
    <a href="#">Compact Cameras</a><span>›</span>
    <strong>COOLPIX P1100</strong>
  </div>

  <!-- Main PDP Container -->
  <main class="pdp-main">
    <!-- Product Gallery -->
    <div class="gallery-column">
      <div class="main-image-wrap">
        <span class="nikon-badge-pill">Ultra Telephoto 125× Zoom</span>
        <div class="camera-graphic">📷</div>
      </div>
      <div class="thumbnails-row">
        <div class="thumb-item active">📷</div>
        <div class="thumb-item">🔍</div>
        <div class="thumb-item">📐</div>
        <div class="thumb-item">🎒</div>
      </div>
    </div>

    <!-- Product Meta & Purchase Box -->
    <div class="info-column">
      <div>
        <div class="product-category-eyebrow">Compact Bridge Camera</div>
        <h1 class="product-title" id="product-title-heading">Nikon COOLPIX P1100</h1>
        <p class="product-subtitle">Super-telephoto 125× optical zoom, 4K UHD video, and dual detect optical VR.</p>
      </div>

      <div class="rating-row">
        <div class="stars-wrap">★★★★★</div>
        <strong>4.8 / 5.0</strong>
        <span class="review-count">(142 Customer Reviews)</span>
      </div>

      <div class="price-box" id="nikon-price-box">
        <div class="price-amount" id="product-price-display">£949.00</div>
        <div class="vat-included">Includes UK VAT • Official 2-Year Nikon Warranty</div>
        <div class="stock-status">
          <span class="stock-dot"></span>
          <span>In Stock — Dispatched within 24 Hours</span>
        </div>
      </div>

      <div class="key-features-box">
        <div class="feature-point">
          <span class="feature-bullet">✓</span>
          <span><strong>24–3000mm Equivalent Zoom:</strong> Capture wildlife, birds, and lunar details easily.</span>
        </div>
        <div class="feature-point">
          <span class="feature-bullet">✓</span>
          <span><strong>4K UHD Video at 30p:</strong> Stereo audio and clean HDMI output for creators.</span>
        </div>
        <div class="feature-point">
          <span class="feature-bullet">✓</span>
          <span><strong>RAW (NRW) Image Support:</strong> Full post-processing flexibility.</span>
        </div>
      </div>

      <!-- Action / Buy CTAs -->
      <div class="cta-container" id="nikon-cta-container">
        <button class="btn-primary-atc" id="nikon-add-to-cart-btn" onclick="alert('Added Nikon COOLPIX P1100 to Cart!')">
          Add to Basket — £949.00
        </button>
        <button class="btn-secondary-dealer" id="nikon-find-dealer-btn">
          Find a Local Authorised Dealer
        </button>
      </div>

      <div class="guarantees-grid">
        <div class="guarantee-item">🚚 <strong>Free DPD Delivery</strong> on all camera bodies</div>
        <div class="guarantee-item">🛡️ <strong>2-Year Warranty</strong> directly with Nikon UK</div>
        <div class="guarantee-item">🔄 <strong>14-Day Returns</strong> hassle-free policy</div>
        <div class="guarantee-item">💳 <strong>0% Finance</strong> available via Klarna/PayPal</div>
      </div>
    </div>
  </main>

  <!-- Technical Specs -->
  <section class="specs-section">
    <h2 class="specs-header">Technical Specifications</h2>
    <table class="specs-table">
      <tbody>
        <tr><td>Sensor Type</td><td>1/2.3-in. type CMOS, approx. 16.0 million pixels</td></tr>
        <tr><td>Lens Focal Length</td><td>4.3 to 539 mm (angle of view equivalent to 24 to 3000 mm lens in 35mm format)</td></tr>
        <tr><td>Aperture Range</td><td>f/2.8 to f/8</td></tr>
        <tr><td>Optical Zoom</td><td>125× (Dynamic Fine Zoom up to 250×)</td></tr>
        <tr><td>Vibration Reduction</td><td>Lens-shift VR (stills), Lens shift and electronic VR (movies)</td></tr>
        <tr><td>Monitor</td><td>8.1 cm (3.2-in.) vari-angle TFT LCD, 921k-dot</td></tr>
      </tbody>
    </table>
  </section>
</body>
</html>`
  }
];
