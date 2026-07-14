# Lily’s Sweet Treats — Business Card Print Specs

Send this folder (or the PDF + this sheet) to your card manufacturer.

## Finished size
| | |
|---|---|
| **Trim size** | **3.5 in × 2.0 in** (standard US business card) |
| **Bleed** | **0.125 in** on all sides |
| **Full artboard** | **3.75 in × 2.25 in** |
| **Safe zone** | Keep text/logo **≥ 0.125 in** inside the trim edge |
| **Corners** | Standard rounded or square — your choice (art works either way) |
| **Sides** | **Double-sided** (Front + Back) |

## Files to print
| File | Use |
|---|---|
| `Lily-Sweet-Treats-Business-Card-PRINT.pdf` | **Preferred** — multi-page print PDF (page 1 = front, page 2 = back) |
| `business-card-front.png` | Front art with bleed, **300 DPI** |
| `business-card-back.png` | Back art with bleed, **300 DPI** |
| `qr-website.png` | Standalone QR (if printer rebuilds layout) |

Preview-only (do **not** send as final print unless asked):
- `business-card-front-preview.png` / `business-card-back-preview.png` (trim only, no bleed)
- `business-card-proof.png` (both sides on one sheet for client review)

## Color
- Artwork is **RGB** (exported from brand web colors).
- Ask the printer to convert to **CMYK** for press if they print offset/digital CMYK.
- Soft cream front + deep cocoa back; rose accents.

### Brand color reference (approx.)
| Name | Hex | Notes |
|---|---|---|
| Cream | `#FFFAF8` | Front background |
| Cocoa | `#2C2228` | Back background / body text |
| Rose | `#E84A88` | Accents, “& More”, SCAN line |
| Blush | `#F5C6D6` | Soft decorative wash |
| Lavender | `#C9B4E8` | Soft decorative wash |

## QR code
- **Destination URL:** `https://www.lilyssweettreatsva.com/order`
- Opens the **order / preorder checkout** page on the live Vercel domain.
- High error-correction QR so it still scans if print is slightly soft.
- Do **not** stretch or recolor the QR; keep black modules on white.
- Quiet zone (white margin around QR) is already included — do not crop tight.

> Website content updates (menu, photos, prices) still work with this QR — no reprint needed.  
> Note: `lilyssweettreats.com` (no “va”) is separate and was on Clover/BentoBox; only use it after DNS is fixed to Vercel.

## Content on the card

### Front
- Logo mark  
- **Lily’s Sweet Treats & More**  
- Tagline: Homemade treats, made with love  
- Porch pickup · Haymarket, VA  
- Order online for pickup  

### Back
- QR → website (Scan to order)  
- Website URL  
- Phone: (571) 788-6168  
- Email: sweettreats0077@gmail.com  
- Instagram: @lilys_sweet_treats_va  
- Pickup: 14658 Gap Way · PO Box #237, Haymarket, VA 20169  

## Suggested production notes for the printer
- **Stock:** 14–16 pt (or 350–400 gsm) matte or soft-touch  
- **Finish:** Matte or soft-touch preferred (gloss can glare on QR)  
- **Coating:** If UV/spot gloss is used, keep QR area matte for reliable scanning  
- **Orientation:** Landscape 3.5 × 2  
- **Quantity:** Client to confirm (typical starter: 100–500)  

## How to regenerate (optional)
From the bakery-site project root:

```bash
python3 print/business-cards/generate_cards.py
```

Requires: `pip3 install "qrcode[pil]" pillow img2pdf`

## Contact for art changes
Update copy, colors, or URL in the generate script, re-run, and re-export the PDF before ordering a full run. Always order a small proof first.
