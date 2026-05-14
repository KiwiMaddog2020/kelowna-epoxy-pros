# Polish - Whole Site Round 2

*Generated 2026-05-14 by Codex via the Polish protocol (`plugins/endenza/skills/polish/`).*

## 1. Subject + bar

- **Subject:** Kelowna Epoxy Pros whole-site visual cleanup
- **Project:** Kelowna Epoxy Pros website
- **Bar:** Professional family-business marketing site for a Kelowna epoxy flooring company
- **Methodology:** two-axis rating, craft and fit, focused on the visual busy-ness and square image-crop concerns raised after the first live polish

## 2. Per-theme tables

### Visual Design

| # | Category | Craft | Fit | Gap | Notes with evidence |
| --- | --- | ---: | ---: | ---: | --- |
| 1 | Hero background restraint | 9.0 | 9.1 | 1.0 | `styles.css:221-252` uses a controlled graphite gradient, reduced hero media scale, and layered overlays instead of a full-bleed noisy texture. |
| 2 | Logo placement | 9.1 | 9.2 | 0.9 | `index.html:75-76` now uses `assets/logo-transparent.png`; `styles.css:263-275` gives the mark an intentional plate instead of relying on a square source background. |
| 3 | Service image consistency | 9.0 | 9.1 | 1.0 | `index.html:123-160` uses dedicated swatch assets for garage, shop, and patio cards; `styles.css:480-490` locks the card crop ratio. |
| 4 | Finish selector imagery | 8.9 | 9.0 | 1.1 | `script.js:24-36` switches Light Stone and Commercial Gray to swatch assets, matching the finish-option task better than partial room scenes. |

### Brand

| # | Category | Craft | Fit | Gap | Notes with evidence |
| --- | --- | ---: | ---: | ---: | --- |
| 5 | Contractor mark clarity | 9.0 | 9.2 | 1.0 | `assets/logo-transparent.png` is a cleaned 860 x 547 transparent working mark, replacing the square 900 x 600 dark-background logo in hero and footer. |
| 6 | Family-business tone | 8.8 | 9.0 | 1.2 | The existing hero and intro copy remains direct and local at `index.html:78-91`; no new unsupported claims were added. |
| 7 | Visual confidence | 8.9 | 9.1 | 1.1 | Service cards now read as finish samples at `index.html:125-160`, which supports the sales conversation before real project photos exist. |

### UX

| # | Category | Craft | Fit | Gap | Notes with evidence |
| --- | --- | ---: | ---: | ---: | --- |
| 8 | Mobile first impression | 8.9 | 9.0 | 1.1 | Mobile verification at 390 x 900 loaded the transparent logo, swatches, and quote form with zero failed requests. |
| 9 | Scan speed | 8.8 | 8.9 | 1.2 | The service grid at `index.html:123-163` now presents four aligned swatches before text, reducing visual interruption between cards. |
| 10 | Interaction continuity | 8.8 | 8.8 | 1.2 | Existing finish tab behavior is preserved; the changed image paths are centralized in `script.js:24-36`. |

### Performance

| # | Category | Craft | Fit | Gap | Notes with evidence |
| --- | --- | ---: | ---: | ---: | --- |
| 11 | Image delivery | 8.8 | 8.8 | 1.2 | Swatches include WebP variants and are referenced through `<source type="image/webp">` at `index.html:125-160`. |
| 12 | Asset weight discipline | 8.4 | 8.6 | 1.6 | `assets/logo-transparent.png` is 404K, matching the previous logo size; future SVG or vector export from Jeff would still be better. |
| 13 | Broken asset risk | 9.3 | 9.2 | 0.8 | Desktop and mobile Playwright checks reported zero broken images, zero failed requests, and zero console warnings. |

### Documentation

| # | Category | Craft | Fit | Gap | Notes with evidence |
| --- | --- | ---: | ---: | ---: | --- |
| 14 | Asset ledger | 8.8 | 8.8 | 1.2 | `README.md:25-28` documents the transparent logo and swatch asset direction. |
| 15 | Placeholder ledger | 8.7 | 8.8 | 1.3 | `docs/content-ledger.md:29-30` records generated swatches and the cleaned transparent website logo as temporary assets. |

### Launch Readiness

| # | Category | Craft | Fit | Gap | Notes with evidence |
| --- | --- | ---: | ---: | ---: | --- |
| 16 | Public honesty | 9.0 | 9.2 | 0.8 | The pass only changed presentation assets and did not add warranty, insurance, or testimonial claims. |
| 17 | GitHub Pages safety | 9.1 | 9.0 | 0.9 | All new assets are static PNG/WebP files referenced with relative paths, keeping the no-build Pages setup intact. |
| 18 | Remaining real-photo gap | 7.8 | 8.4 | 2.2 | Generated swatches are cleaner, but real Jeff project photos remain the highest-trust upgrade before final launch. |

## 3. Aggregate scores

```text
                          CRAFT      FIT       Delta
─────────────────────────────────────────────────────────
Visual design (4 cats)     9.0       9.1       +0.3 / +0.2
Brand (3 cats)             8.9       9.1       +0.2 / +0.1
UX (3 cats)                8.8       8.9       +0.1 / +0.1
Performance (3 cats)       8.8       8.9       +0.0 / +0.1
Documentation (2 cats)     8.8       8.8       +0.1 / +0.1
Launch readiness (3 cats)  8.6       8.9       +0.1 / +0.1
─────────────────────────────────────────────────────────
WEIGHTED AVERAGE           8.8       9.0
```

Round 2 baseline before execution: craft 8.6, fit 8.8.  
Round 2 after execution: craft 8.8, fit 9.0.

## 4. Top 10 highest-leverage gaps

| # | Gap | Categories affected | Estimated cost | Round target |
| --- | --- | --- | --- | --- |
| 1 | Real project photography | Trust, brand, conversion | Medium, needs Jeff | Deferred |
| 2 | Vector logo master | Brand, performance, print-readiness | Low if Jeff has file | User gate |
| 3 | Connected quote routing | Conversion, operations | Low to medium | Next launch round |
| 4 | Confirmed phone and email | Trust, conversion | Low, needs Jeff | Next content round |
| 5 | Warranty and insurance wording | Trust, legal safety | Medium, needs confirmation | User gate |
| 6 | Real testimonials | Trust, local proof | Medium, needs customers | Deferred |
| 7 | Google Business Profile link | Local SEO, conversion | Low after profile exists | Deferred |
| 8 | Privacy policy for form | Compliance, trust | Low after routing choice | Launch round |
| 9 | Custom domain | Brand, shareability | Low after domain decision | Deferred |
| 10 | Care guide PDF | Post-sale quality | Medium | Deferred |

## 5. Sequenced plan to 10/10

- **Round 1 - Visual cleanup, x1 slot:** Create transparent logo asset, replace square logo usage, create cropped swatch assets, update image paths, verify responsive render. Completed in this pass.
- **Round 2 - Launch content, x2 slots:** Slot A - replace phone, email, and service-area placeholders. Slot B - connect the form destination and add privacy language once routing is known.
- **Round 3 - Proof assets, x2 slots after Jeff provides photos:** Slot A - replace generated swatches with real project photos. Slot B - add one or two approved project stories with before and after context.
- **Deferred:** vector logo master, testimonials, warranty language, Google profile, and custom domain all require human or business inputs.

## 6. Cost estimate

- Round 1 completed: about 8K tokens, under 30 minutes wall time, low human review time.
- To reach 9.2+: about 10K to 20K tokens after Jeff provides final contact and routing details.
- To reach 9.6+: depends on real photos, testimonials, final warranty language, and logo master availability.

## 7. Open questions for human judgment

1. Can Jeff provide a vector logo, transparent PNG, or layered logo master?
2. Which phone number and email should appear publicly?
3. Should the quote form send to email, a form service, or a CRM?
4. Which real project photos can be used with permission?

## 8. Honesty checklist

- [x] Every CRAFT grade cites a specific piece of evidence.
- [x] Every FIT grade is tied to the professional local epoxy-business objective.
- [x] Zero banned vague-audit phrases.
- [x] At least one weakness per theme is below 10/10.
- [x] Calibrated against this project's stated bar.
- [x] No flattery without evidence.
- [x] Plan includes low-cost wins and deferred hard categories.
