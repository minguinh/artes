"""Vetorização da marca presente na arte original do Xexéu das Artes.

Requer Pillow e vtracer: python -m pip install pillow vtracer
Fonte: public/social/xexeu-das-artes-feed-em-breve.png
"""

from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image
import vtracer


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/social/xexeu-das-artes-feed-em-breve.png"
OUT_PNG = ROOT / "public/images/logo-xexeu-das-artes.png"
OUT_SVG = ROOT / "public/images/logo-xexeu-das-artes.svg"
RAW_YARN_SVG = ROOT / "public/images/logo-xexeu-yarn-trace.svg"
RAW_TEXT_SVG = ROOT / "public/images/logo-xexeu-text-trace.svg"
YARN_PNG = ROOT / "public/images/logo-xexeu-yarn-trace.png"
TEXT_PNG = ROOT / "public/images/logo-xexeu-text-trace.png"

# Recorte apenas da assinatura no topo da arte: novelo, fio em coração e nome.
BOX = (137, 109, 994, 253)
photo = Image.open(SOURCE).convert("RGB")
crop = photo.crop(BOX)
rgba = Image.new("RGBA", crop.size)

for y in range(crop.height):
    for x in range(crop.width):
        r, g, b = crop.getpixel((x, y))
        source_x = x + BOX[0]
        if source_x < 341:
            # O novelo rosa é mais saturado que o fundo creme do cartaz.
            difference = r - g
            alpha = max(0, min(255, round((difference - 53) * 255 / 36)))
            if difference < 57:
                alpha = 0
        else:
            # A palavra em ameixa é escura e separa-se do fundo claro.
            alpha = max(0, min(255, round((207 - g) * 255 / 75)))
            if g > 202:
                alpha = 0
        rgba.putpixel((x, y), (r, g, b, alpha))

nonempty = rgba.getchannel("A").getbbox()
if not nonempty:
    raise RuntimeError("A marca não foi encontrada no recorte")
rgba = rgba.crop(nonempty)
rgba.save(OUT_PNG)

yarn = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
text = Image.new("L", rgba.size, 255)
for y in range(rgba.height):
    for x in range(rgba.width):
        r, g, b, a = rgba.getpixel((x, y))
        source_x = BOX[0] + nonempty[0] + x
        if source_x < 350 and r > 125 and r - g > 53:
            yarn.putpixel((x, y), (r, g, b, a))
        if source_x >= 330 and r < 175 and g < 130 and a > 70:
            text.putpixel((x, y), 0)
yarn.save(YARN_PNG)
text.save(TEXT_PNG)

vtracer.convert_image_to_svg_py(
    image_path=str(YARN_PNG),
    out_path=str(RAW_YARN_SVG),
    colormode="color",
    hierarchical="stacked",
    mode="spline",
    filter_speckle=1,
    color_precision=8,
    layer_difference=6,
    corner_threshold=60,
    length_threshold=2,
    max_iterations=10,
    splice_threshold=45,
    path_precision=3,
)
vtracer.convert_image_to_svg_py(
    image_path=str(TEXT_PNG),
    out_path=str(RAW_TEXT_SVG),
    colormode="binary",
    mode="spline",
    filter_speckle=3,
    corner_threshold=60,
    length_threshold=4,
    max_iterations=10,
    splice_threshold=45,
    path_precision=3,
)

yarn_trace = ET.parse(RAW_YARN_SVG).getroot()
text_trace = ET.parse(RAW_TEXT_SVG).getroot()
yarn_paths = "".join(ET.tostring(child, encoding="unicode") for child in yarn_trace)
text_paths = "".join(ET.tostring(child, encoding="unicode") for child in text_trace)
text_paths = text_paths.replace('fill="#000000"', 'fill="#4d0d2b"')
width, height = rgba.size
scale = min(680 / width, 125 / height)
left = (700 - width * scale) / 2
top = (140 - height * scale) / 2
master = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 140" role="img" aria-labelledby="title">
  <title id="title">Xexéu das Artes — marca original com novelo e coração</title>
  <g transform="translate({left:.4f} {top:.4f}) scale({scale:.6f})">{yarn_paths}{text_paths}</g>
</svg>'''
OUT_SVG.write_text(master, encoding="utf-8")
for temporary in (RAW_YARN_SVG, RAW_TEXT_SVG, YARN_PNG, TEXT_PNG):
    temporary.unlink()
print(f"Marca vetorizada: {width} × {height}px, {OUT_SVG.stat().st_size} bytes SVG")
