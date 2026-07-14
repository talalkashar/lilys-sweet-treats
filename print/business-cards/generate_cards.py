#!/usr/bin/env python3
"""Generate print-ready Lily's Sweet Treats business cards (300 DPI + bleed)."""

from __future__ import annotations

from pathlib import Path

import img2pdf
import qrcode
from PIL import Image, ImageDraw, ImageFont
from qrcode.constants import ERROR_CORRECT_H

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent

# QR should open checkout (best for cards / stickers / packaging).
# Live domain on Vercel (with "va") — works today for orders.
URL = "https://www.lilyssweettreatsva.com/order"
PHONE = "(571) 788-6168"
EMAIL = "sweettreats0077@gmail.com"
HANDLE = "@lilys_sweet_treats_va"
ADDR1 = "14658 Gap Way · PO Box #237"
ADDR2 = "Haymarket, VA 20169"
TAGLINE = "Homemade treats, made with love"
SITE_HOST = "www.lilyssweettreatsva.com"

DPI = 300
BLEED = int(0.125 * DPI)
TRIM_W, TRIM_H = int(3.5 * DPI), int(2 * DPI)
W, H = TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED
SAFE = BLEED + int(0.125 * DPI)

CREAM = (255, 250, 248)
CREAM_DEEP = (247, 235, 230)
COCOA = (44, 34, 40)
COCOA_SOFT = (92, 79, 86)
ROSE = (232, 74, 136)
ROSE_DEEP = (201, 54, 112)
LAVENDER = (201, 180, 232)
BLUSH = (245, 198, 214)
WHITE = (255, 255, 255)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        (
            "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
            if bold
            else "/System/Library/Fonts/Supplemental/Georgia.ttf"
        ),
        (
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
            if bold
            else "/System/Library/Fonts/Supplemental/Arial.ttf"
        ),
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def font_sans(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        (
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
            if bold
            else "/System/Library/Fonts/Supplemental/Arial.ttf"
        ),
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def make_qr(path: Path, size_px: int = 420) -> Image.Image:
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=10, border=2)
    qr.add_data(URL)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#2c2228", back_color="#ffffff").convert("RGBA")
    img = img.resize((size_px, size_px), Image.Resampling.NEAREST)
    img.save(path)
    return img


def build_front() -> Image.Image:
    front = Image.new("RGB", (W, H), CREAM)
    draw = ImageDraw.Draw(front)

    for i in range(H):
        t = i / H
        r = int(255 * (1 - t) + 252 * t)
        g = int(250 * (1 - t) + 236 * t)
        b = int(248 * (1 - t) + 245 * t)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    blob = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blob)
    bd.ellipse([W - 280, -80, W + 40, 260], fill=(*BLUSH, 90))
    bd.ellipse([-60, H - 220, 220, H + 40], fill=(*LAVENDER, 80))
    front = Image.alpha_composite(front.convert("RGBA"), blob).convert("RGB")
    draw = ImageDraw.Draw(front)

    margin_frame = BLEED + 18
    draw.rounded_rectangle(
        [margin_frame, margin_frame, W - margin_frame, H - margin_frame],
        radius=18,
        outline=ROSE,
        width=2,
    )

    logo = Image.open(ROOT / "public" / "brand" / "logo-mark.png").convert("RGBA")
    logo_h = 250
    logo_w = int(logo.width * (logo_h / logo.height))
    logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    lx = SAFE + 10
    ly = (H - logo_h) // 2
    front.paste(logo, (lx, ly), logo)

    tx = lx + logo_w + 28
    ty = ly + 28
    f_name = font(34, bold=True)
    f_tag = font_sans(18)
    f_sub = font_sans(16)

    draw.text((tx, ty), "Lily's Sweet Treats", font=f_name, fill=COCOA)
    draw.text((tx, ty + 42), "& More", font=f_name, fill=ROSE_DEEP)
    draw.text((tx, ty + 95), TAGLINE, font=f_tag, fill=COCOA_SOFT)
    draw.line([(tx, ty + 130), (tx + 320, ty + 130)], fill=BLUSH, width=2)
    draw.text((tx, ty + 148), "Porch pickup · Haymarket, VA", font=f_sub, fill=COCOA_SOFT)
    draw.text((tx, ty + 175), "Order online for pickup", font=f_sub, fill=ROSE_DEEP)
    return front


def build_back() -> Image.Image:
    back = Image.new("RGB", (W, H), COCOA)
    draw = ImageDraw.Draw(back)

    for i in range(H):
        t = i / H
        r = int(44 * (1 - t) + 55 * t)
        g = int(34 * (1 - t) + 40 * t)
        b = int(40 * (1 - t) + 48 * t)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    draw.rectangle([0, 0, W, BLEED + 8], fill=ROSE)

    panel_pad = SAFE
    qr_size = 300
    panel_x0 = panel_pad
    panel_y0 = (H - (qr_size + 70)) // 2
    panel_x1 = panel_x0 + qr_size + 40
    panel_y1 = panel_y0 + qr_size + 70
    draw.rounded_rectangle(
        [panel_x0, panel_y0, panel_x1, panel_y1],
        radius=16,
        fill=WHITE,
    )

    qr_img = make_qr(OUT / "qr-website.png", size_px=qr_size)
    qx = panel_x0 + 20
    qy = panel_y0 + 16
    back.paste(qr_img.convert("RGB"), (qx, qy))

    f_scan = font_sans(14, bold=True)
    scan = "SCAN TO ORDER"
    bbox = draw.textbbox((0, 0), scan, font=f_scan)
    sw = bbox[2] - bbox[0]
    draw.text(
        (panel_x0 + (panel_x1 - panel_x0 - sw) // 2, qy + qr_size + 10),
        scan,
        font=f_scan,
        fill=ROSE_DEEP,
    )

    cx = panel_x1 + 36
    cy = panel_y0 + 10
    f_h = font(28, bold=True)
    f_s = font_sans(15)

    draw.text((cx, cy), "Visit us online", font=f_h, fill=WHITE)
    draw.text((cx, cy + 42), SITE_HOST, font=f_s, fill=BLUSH)
    draw.line([(cx, cy + 78), (cx + 280, cy + 78)], fill=(120, 100, 110), width=1)

    rows = [
        ("Phone", PHONE),
        ("Email", EMAIL),
        ("Instagram", HANDLE),
        ("Pickup", ADDR1),
        ("", ADDR2),
    ]
    ry = cy + 98
    for label, val in rows:
        if label:
            draw.text((cx, ry), label, font=font_sans(12, bold=True), fill=BLUSH)
            draw.text((cx + 95, ry), val, font=f_s, fill=WHITE)
            ry += 32
        else:
            draw.text((cx + 95, ry - 8), val, font=f_s, fill=CREAM_DEEP)
            ry += 24
    return back


def crop_trim(im: Image.Image) -> Image.Image:
    return im.crop((BLEED, BLEED, W - BLEED, H - BLEED))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    front = build_front()
    back = build_back()

    front.save(OUT / "business-card-front.png", "PNG", dpi=(DPI, DPI))
    back.save(OUT / "business-card-back.png", "PNG", dpi=(DPI, DPI))
    crop_trim(front).save(OUT / "business-card-front-preview.png", "PNG", dpi=(DPI, DPI))
    crop_trim(back).save(OUT / "business-card-back-preview.png", "PNG", dpi=(DPI, DPI))

    gap = 40
    proof = Image.new("RGB", (TRIM_W * 2 + gap + 80, TRIM_H + 120), (245, 240, 242))
    pd = ImageDraw.Draw(proof)
    pd.text(
        (40, 24),
        "Lily's Sweet Treats — Business Card Proof (100% scale at 300 DPI)",
        font=font_sans(20, bold=True),
        fill=COCOA,
    )
    proof.paste(crop_trim(front), (40, 70))
    proof.paste(crop_trim(back), (40 + TRIM_W + gap, 70))
    proof.save(OUT / "business-card-proof.png", "PNG", dpi=(DPI, DPI))

    pdf_path = OUT / "Lily-Sweet-Treats-Business-Card-PRINT.pdf"
    pdf_path.write_bytes(
        img2pdf.convert(
            [
                str(OUT / "business-card-front.png"),
                str(OUT / "business-card-back.png"),
            ],
            dpi=300,
            layout_fun=img2pdf.get_fixed_dpi_layout_fun((300, 300)),
        )
    )
    print(f"Wrote cards + QR + PDF → {OUT}")
    print(f"QR points to: {URL}")


if __name__ == "__main__":
    main()
