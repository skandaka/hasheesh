# Ha Sheesh Website Performance Optimization Guide

## ✅ Optimizations Already Applied

### 1. Font Loading Optimizations
- **Reduced font weights**: Removed unused weights (300, 700) - only loading 400, 500, 600
- **Added `font-display: swap`**: Prevents Flash of Invisible Text (FOIT)
- **System font fallbacks**: Added native font stacks for immediate text rendering
- **Preconnect hints**: DNS prefetch and preconnect for Google Fonts

### 2. JavaScript Optimizations
- **Deferred script loading**: All external JS libraries now use `defer` attribute
- **Debounced resize handler**: Prevents excessive layout recalculations
- **Optimized cursor tracking**: Uses `requestAnimationFrame` for 60fps cursor movement
- **Passive event listeners**: Improved scroll performance
- **Removed redundant scroll listener**: Scroll events can't be prevented anyway

### 3. Image Optimizations
- **Lazy loading**: Below-the-fold images use `loading="lazy"`
- **Async decoding**: Images use `decoding="async"` for non-blocking decode
- **Explicit dimensions**: Width/height attributes prevent layout shift
- **Preloaded critical images**: Hero images (logo, textlogo, pen) are preloaded

### 4. CSS Optimizations
- **`will-change` hints**: Added to animated orb elements
- **`contain` property**: Layout containment for orb animations
- **`prefers-reduced-motion`**: Respects user accessibility preferences
- **GPU-optimized transforms**: Uses transform3d for hardware acceleration

### 5. Resource Hints
- **DNS Prefetch**: fonts.googleapis.com, fonts.gstatic.com, CDNs
- **Preconnect**: Critical third-party origins
- **Preload**: Critical hero images with fetchpriority

---

## 🚀 Additional Optimizations for Production

### Image Conversion (HIGHLY RECOMMENDED)

Your images are currently **very large**. Here's the current state:

| Image | Current Size | Target |
|-------|-------------|--------|
| textlogo.png | 1.4 MB | ~150 KB (WebP) |
| blueberrycookies.png | 1.0 MB | ~100 KB (WebP) |
| pineappleexpress.png | 1.0 MB | ~100 KB (WebP) |
| strawberryruntz.png | 984 KB | ~100 KB (WebP) |
| image copy.png | 3.8 MB | DELETE or ~200 KB |
| logo.png | 327 KB | ~40 KB (WebP) |

**Convert to WebP using:**

```bash
# Install cwebp (macOS)
brew install webp

# Convert all PNGs to WebP with quality 80 (good balance)
for file in images/*.png; do
  cwebp -q 80 "$file" -o "${file%.png}.webp"
done

# For the large product images, resize first:
# 800px width is plenty for the dossier card
sips -Z 800 images/blueberrycookies.png images/strawberryruntz.png images/pineappleexpress.png
```

**Then update HTML to use picture elements:**
```html
<picture>
  <source srcset="images/blueberrycookies.webp" type="image/webp">
  <img src="images/blueberrycookies.png" alt="Product" loading="lazy">
</picture>
```

### DigitalOcean App Platform Caching Headers

Add to your `app.yaml` or App Spec:

```yaml
static_sites:
  - name: hasheesh
    routes:
      - path: /
    build_command: echo "Static site"
    output_dir: /
    
    # Cache headers
    cors:
      allow_origins:
        - regex: ".*"
    
    # Add these headers in your deployment config or via Cloudflare
```

**Recommended Cache-Control Headers:**

| File Type | Header |
|-----------|--------|
| HTML | `Cache-Control: no-cache, must-revalidate` |
| JS/CSS | `Cache-Control: public, max-age=31536000, immutable` |
| Images | `Cache-Control: public, max-age=31536000, immutable` |
| Fonts | `Cache-Control: public, max-age=31536000, immutable` |

### Cloudflare Setup (Easiest CDN Win)

1. Add your domain to Cloudflare (free tier works)
2. Enable these settings:
   - **Auto Minify**: HTML, CSS, JS
   - **Brotli Compression**: On
   - **Browser Cache TTL**: Respect Existing Headers
   - **Always Use HTTPS**: On
   - **HTTP/3**: On

3. Create Page Rules:
   ```
   *.js, *.css, *.woff2 → Cache Level: Cache Everything, Edge TTL: 1 month
   *.png, *.jpg, *.webp → Cache Level: Cache Everything, Edge TTL: 1 month  
   index.html → Cache Level: Cache Everything, Edge TTL: 2 minutes
   ```

---

## 📊 Performance Testing

### Before/After Metrics to Track

Run these tests at [PageSpeed Insights](https://pagespeed.web.dev/) or [WebPageTest](https://www.webpagetest.org/):

- **First Contentful Paint (FCP)**: Target < 1.8s
- **Largest Contentful Paint (LCP)**: Target < 2.5s
- **Total Blocking Time (TBT)**: Target < 200ms
- **Cumulative Layout Shift (CLS)**: Target < 0.1

### Chrome DevTools Checklist

1. **Network tab**: 
   - Total transferred should be < 3MB on first load
   - Check for any 404s or slow resources

2. **Performance tab**:
   - Record while scrolling
   - Look for long tasks (red bars) > 50ms
   - Check for layout thrashing

3. **Lighthouse**:
   - Run in Incognito mode
   - Target 90+ Performance score

---

## 🐛 Current Performance Bottlenecks

### 1. **Large Images** (BIGGEST ISSUE)
- Total image weight: ~9.3 MB
- Solution: WebP conversion + resizing = ~1.5 MB total

### 2. **External Script Loading**
- 5 external JS files (GSAP, Lenis, SplitType)
- Already deferred, but consider self-hosting for better caching

### 3. **Inline CSS** (~2400 lines)
- Consider extracting to external file for caching
- Or use critical CSS extraction for above-fold only

### 4. **Backdrop Filter Usage**
- Multiple `backdrop-filter: blur()` elements
- Can cause jank on lower-end devices
- Consider removing on mobile or using solid backgrounds

---

## Quick Wins Summary

1. ✅ **Done**: Deferred JS, font optimization, lazy loading
2. 🔴 **High Impact**: Convert images to WebP (saves ~8 MB!)
3. 🟡 **Medium Impact**: Add Cloudflare CDN  
4. 🟢 **Low Impact**: Extract CSS to external file

**Expected improvement after WebP conversion: 60-70% faster initial load**
