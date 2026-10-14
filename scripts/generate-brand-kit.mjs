import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const out = path.resolve('public/brand-kit');
const mascot = 'mascote-para-banners.png';
const colors = { plum: '#51263d', pink: '#c84f83', blush: '#fff0f5', cream: '#fffbf7', rose: '#eaa0bf', darkRose: '#8d315b' };
const type = "'Trebuchet MS','Arial Rounded MT Bold',Arial,sans-serif";
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const svg = (w, h, body, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">${extra}${body}</svg>`;
const stitch = (x1, y1, x2, y2, color = colors.rose) => `<path d="M${x1} ${y1}H${x2}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 12"/>`;
const logo = (x, y, scale = 1, light = false) => `<g transform="translate(${x} ${y}) scale(${scale})">
  <circle cx="67" cy="71" r="43" fill="${light ? '#ffd8e7' : colors.pink}" stroke="${light ? '#f8a9c9' : colors.darkRose}" stroke-width="5"/>
  <g fill="none" stroke="${light ? '#fff5f8' : '#ffe4ee'}" stroke-width="5" stroke-linecap="round"><path d="M32 61c24-21 55-19 76 2M27 78c26-16 59-12 81 5M42 37c9 19 30 31 61 34M38 99c18-11 40-10 57 0M78 31c-17 22-23 47-14 82M97 43C77 66 76 85 84 108"/></g>
  <path d="M105 96c16 3 25 15 18 29" fill="none" stroke="${light ? '#ffd8e7' : colors.pink}" stroke-width="6" stroke-linecap="round"/>
  <text x="127" y="93" font-family="'Baloo 2','Arial Rounded MT Bold',${type}" font-size="72" font-weight="700" letter-spacing="-2" fill="${light ? '#fff5f8' : '#54233f'}" stroke="${light ? '#a85078' : '#e6a3c0'}" stroke-width="2" paint-order="stroke">Xexéu das Artes</text>
  <text x="127" y="93" font-family="'Baloo 2','Arial Rounded MT Bold',${type}" font-size="72" font-weight="700" letter-spacing="-2" fill="none" stroke="${light ? '#efb6cf' : '#d887aa'}" stroke-width="1" stroke-dasharray="1 15" stroke-linecap="round" opacity=".6">Xexéu das Artes</text>
</g>`;
const flower = (x, y, s = 1, color = colors.pink) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${color}" opacity=".55"><circle cx="0" cy="-10" r="7"/><circle cx="9" cy="-3" r="7"/><circle cx="6" cy="8" r="7"/><circle cx="-6" cy="8" r="7"/><circle cx="-9" cy="-3" r="7"/><circle r="5" fill="${colors.cream}"/></g>`;

await fs.mkdir(out, { recursive: true });
const original = await fs.readFile(path.join(out, mascot));
const mascotData = `data:image/png;base64,${original.toString('base64')}`;
async function save(name, source, png = false, width) {
  await fs.writeFile(path.join(out, `${name}.svg`), source);
  if (png) await sharp(Buffer.from(source.replaceAll(mascot, mascotData)), { density: 300 }).resize({ width, withoutEnlargement: false }).png().toFile(path.join(out, `${name}.png`));
}

await save('logo-principal', svg(620, 140, logo(0, 0)), true, 1240);
await save('logo-clara', svg(620, 140, logo(0, 0, 1, true)), true, 1240);

const tagFront = svg(600, 900, `
  <rect width="600" height="900" rx="45" fill="${colors.cream}"/>
  <rect x="20" y="20" width="560" height="860" rx="32" fill="none" stroke="${colors.rose}" stroke-width="4" stroke-dasharray="4 13"/>
  <circle cx="300" cy="54" r="14" fill="#fff" stroke="${colors.pink}" stroke-width="3"/>
  ${logo(54, 95, .70)}
  ${stitch(65, 260, 535)}
  <text x="65" y="325" font-family="${type}" font-size="26" font-weight="700" letter-spacing="4" fill="${colors.pink}">FEITO À MÃO EM XEXÉU</text>
  <text x="65" y="410" font-family="${type}" font-size="28" fill="${colors.plum}">Peça</text>
  <path d="M65 462H535" stroke="${colors.rose}" stroke-width="3"/>
  <text x="65" y="536" font-family="${type}" font-size="28" fill="${colors.plum}">Artesã</text>
  <path d="M65 588H535" stroke="${colors.rose}" stroke-width="3"/>
  <text x="65" y="677" font-family="${type}" font-size="28" fill="${colors.plum}">Preço</text>
  <text x="65" y="770" font-family="${type}" font-size="66" font-weight="700" fill="${colors.plum}">R$ ______</text>
  ${flower(516, 807, 1.4)}
`);
await save('etiqueta-preco-frente', tagFront, true, 600);

const tagBack = svg(600, 900, `
  <rect width="600" height="900" rx="45" fill="${colors.blush}"/>
  <rect x="20" y="20" width="560" height="860" rx="32" fill="none" stroke="${colors.rose}" stroke-width="4" stroke-dasharray="4 13"/>
  <circle cx="300" cy="54" r="14" fill="#fff" stroke="${colors.pink}" stroke-width="3"/>
  ${flower(300, 253, 3)}
  <text x="300" y="385" text-anchor="middle" font-family="${type}" font-size="52" font-weight="700" fill="${colors.plum}">Esta peça tem</text>
  <text x="300" y="450" text-anchor="middle" font-family="${type}" font-size="52" font-weight="700" fill="${colors.plum}">uma história.</text>
  <text x="300" y="545" text-anchor="middle" font-family="${type}" font-size="28" fill="${colors.plum}">Conheça quem a criou em</text>
  <text x="300" y="605" text-anchor="middle" font-family="${type}" font-size="27" font-weight="700" fill="${colors.darkRose}">xexeu-das-artes</text>
  <text x="300" y="642" text-anchor="middle" font-family="${type}" font-size="21" font-weight="700" fill="${colors.darkRose}">.domingosfonseca.workers.dev</text>
  ${stitch(68, 720, 532)}
  <text x="300" y="780" text-anchor="middle" font-family="${type}" font-size="24" letter-spacing="3" fill="${colors.pink}">XEXÉU · PERNAMBUCO</text>
`);
await save('etiqueta-preco-verso', tagBack, true, 600);

const card = svg(1050, 600, `
  <rect width="1050" height="600" rx="20" fill="${colors.cream}"/>
  <rect x="22" y="22" width="1006" height="556" rx="12" fill="none" stroke="${colors.rose}" stroke-width="3" stroke-dasharray="3 14"/>
  ${logo(185, 65, 1.08)}
  <text x="525" y="300" text-anchor="middle" font-family="${type}" font-size="58" font-weight="700" fill="${colors.plum}">Obrigada por valorizar</text>
  <text x="525" y="370" text-anchor="middle" font-family="${type}" font-size="58" font-weight="700" fill="${colors.plum}">o feito à mão.</text>
  <text x="525" y="458" text-anchor="middle" font-family="${type}" font-size="28" fill="${colors.darkRose}">Arte feita por mãos xexeuenses.</text>
  ${flower(90, 495, 1.4)}${flower(960, 495, 1.4)}
`);
await save('cartao-agradecimento', card, true, 1050);

const sticker = svg(600, 600, `
  <circle cx="300" cy="300" r="293" fill="${colors.pink}"/>
  <circle cx="300" cy="300" r="267" fill="none" stroke="#fff5f8" stroke-width="4" stroke-dasharray="3 14"/>
  <circle cx="300" cy="235" r="76" fill="#ffd8e7" stroke="${colors.darkRose}" stroke-width="5"/>
  <path d="M245 230c38-27 79-22 113 7M240 261c45-18 92-13 119 16M294 163c-34 55-29 105-3 146" fill="none" stroke="white" stroke-width="7" stroke-linecap="round"/>
  <text x="300" y="386" text-anchor="middle" font-family="${type}" font-size="52" font-weight="700" fill="white">Feito com afeto</text>
  <text x="300" y="436" text-anchor="middle" font-family="${type}" font-size="29" fill="white">em Xexéu · PE</text>
`);
await save('adesivo-redondo', sticker, true, 600);

const banner = svg(1920, 640, `
  <rect width="1920" height="640" fill="${colors.blush}"/>
  <path d="M0 0H1220Q1070 300 1220 640H0Z" fill="${colors.cream}"/>
  <circle cx="1635" cy="310" r="370" fill="#e9a2c1"/>
  <defs><clipPath id="m"><circle cx="1635" cy="310" r="345"/></clipPath></defs>
  <image x="1310" y="-70" width="650" height="975" href="${mascot}" xlink:href="${mascot}" clip-path="url(#m)" preserveAspectRatio="xMidYMin slice"/>
  ${logo(70, 42, .87)}
  <text x="80" y="265" font-family="${type}" font-size="76" font-weight="700" fill="${colors.plum}">Arte feita por</text>
  <text x="80" y="350" font-family="${type}" font-size="76" font-weight="700" fill="${colors.plum}">mãos xexeuenses.</text>
  <text x="83" y="428" font-family="${type}" font-size="30" fill="${colors.darkRose}">Histórias, artesãs e peças de Xexéu, Pernambuco.</text>
  <rect x="80" y="470" width="340" height="74" rx="37" fill="${colors.pink}"/>
  <text x="250" y="518" text-anchor="middle" font-family="${type}" font-size="28" font-weight="700" fill="white">Conheça as artesãs</text>
  ${flower(1090, 526, 2.5)}
`);
await save('banner-horizontal', banner, true, 1920);

const post = svg(1080, 1080, `
  <rect width="1080" height="1080" fill="${colors.blush}"/>
  <rect x="32" y="32" width="1016" height="1016" rx="55" fill="${colors.cream}"/>
  ${logo(105, 54, 1.38)}
  <defs><clipPath id="p"><circle cx="740" cy="650" r="285"/></clipPath></defs>
  <circle cx="740" cy="650" r="302" fill="#e9a2c1"/>
  <image x="455" y="285" width="570" height="855" href="${mascot}" xlink:href="${mascot}" clip-path="url(#p)" preserveAspectRatio="xMidYMin slice"/>
  <text x="95" y="455" font-family="${type}" font-size="61" font-weight="700" fill="${colors.plum}">Arte feita</text>
  <text x="95" y="525" font-family="${type}" font-size="61" font-weight="700" fill="${colors.plum}">por mãos</text>
  <text x="95" y="595" font-family="${type}" font-size="61" font-weight="700" fill="${colors.plum}">xexeuenses.</text>
  <text x="97" y="675" font-family="${type}" font-size="26" fill="${colors.darkRose}">Conheça as histórias</text>
  <text x="97" y="713" font-family="${type}" font-size="26" fill="${colors.darkRose}">por trás de cada peça.</text>
  <rect x="85" y="906" width="910" height="88" rx="44" fill="${colors.pink}"/>
  <text x="540" y="962" text-anchor="middle" font-family="${type}" font-size="29" font-weight="700" fill="white">Xexéu das Artes · Pernambuco</text>
  ${flower(120, 816, 2)}
`);
await save('post-quadrado', post, true, 1080);

const story = svg(1080, 1920, `
  <rect width="1080" height="1920" fill="${colors.blush}"/>
  <rect x="32" y="32" width="1016" height="1856" rx="54" fill="${colors.cream}"/>
  ${logo(104, 100, 1.38)}
  <text x="90" y="480" font-family="${type}" font-size="79" font-weight="700" fill="${colors.plum}">Arte feita por</text>
  <text x="90" y="575" font-family="${type}" font-size="79" font-weight="700" fill="${colors.plum}">mãos xexeuenses.</text>
  <text x="93" y="650" font-family="${type}" font-size="29" fill="${colors.darkRose}">Histórias e peças feitas com afeto.</text>
  <defs><clipPath id="s"><circle cx="540" cy="1150" r="422"/></clipPath></defs>
  <circle cx="540" cy="1150" r="442" fill="#e9a2c1"/>
  <image x="115" y="615" width="850" height="1275" href="${mascot}" xlink:href="${mascot}" clip-path="url(#s)" preserveAspectRatio="xMidYMin slice"/>
  <rect x="118" y="1692" width="844" height="104" rx="52" fill="${colors.pink}"/>
  <text x="540" y="1760" text-anchor="middle" font-family="${type}" font-size="38" font-weight="700" fill="white">Conheça as artesãs</text>
`);
await save('story-vertical', story, true, 1080);

console.log(`Arquivos criados em ${out}`);
