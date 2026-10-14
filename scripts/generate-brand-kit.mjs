import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const out = path.resolve('public/brand-kit');
const mascot = 'mascote-para-banners.png';
const colors = { plum: '#51263d', pink: '#c84f83', blush: '#fff0f5', cream: '#fffbf7', rose: '#eaa0bf', darkRose: '#8d315b' };
const type = "'Trebuchet MS','Arial Rounded MT Bold',Arial,sans-serif";
const svg = (w, h, body, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">${extra}${body}</svg>`;
const stitch = (x1, y1, x2, y2, color = colors.rose) => `<path d="M${x1} ${y1}H${x2}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 12"/>`;
const canonicalLogo = await fs.readFile('public/images/logo-xexeu-das-artes.svg', 'utf8');
const logoInner = canonicalLogo.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const logo = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">${logoInner}</g>`;
const flag = 'bandeira-xexeu.png';
const flagBadge = (x, y, w, h) => `<g><rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="8" fill="white" stroke="${colors.rose}" stroke-width="2"/><image x="${x}" y="${y}" width="${w}" height="${h}" href="${flag}" xlink:href="${flag}" preserveAspectRatio="xMidYMid meet"/></g>`;
const flower = (x, y, s = 1, color = colors.pink) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${color}" opacity=".55"><circle cx="0" cy="-10" r="7"/><circle cx="9" cy="-3" r="7"/><circle cx="6" cy="8" r="7"/><circle cx="-6" cy="8" r="7"/><circle cx="-9" cy="-3" r="7"/><circle r="5" fill="${colors.cream}"/></g>`;

await fs.mkdir(out, { recursive: true });
const original = await fs.readFile(path.join(out, mascot));
const mascotData = `data:image/png;base64,${original.toString('base64')}`;
const flagData = `data:image/png;base64,${(await fs.readFile(path.join(out, flag))).toString('base64')}`;
async function save(name, source, png = false, width) {
  await fs.writeFile(path.join(out, `${name}.svg`), source);
  if (png) await sharp(Buffer.from(source.replaceAll(mascot, mascotData).replaceAll(flag, flagData)), { density: 300 }).resize({ width, withoutEnlargement: false }).png().toFile(path.join(out, `${name}.png`));
}

await save('logo-principal', canonicalLogo.replace('viewBox="0 0 620 140"', 'viewBox="0 0 700 140"'), true, 1400);
await save('assinatura-com-bandeira', svg(900, 180, `<rect width="900" height="180" rx="24" fill="${colors.cream}"/>${logo(25, 19, .95)}${flagBadge(735, 37, 120, 85)}`), true, 1800);

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
  ${flagBadge(422, 788, 112, 79)}
`);
await save('etiqueta-preco-frente', tagFront, true, 600);

const tagBack = svg(600, 900, `
  <rect width="600" height="900" rx="45" fill="${colors.blush}"/>
  <rect x="20" y="20" width="560" height="860" rx="32" fill="none" stroke="${colors.rose}" stroke-width="4" stroke-dasharray="4 13"/>
  <circle cx="300" cy="54" r="14" fill="#fff" stroke="${colors.pink}" stroke-width="3"/>
  ${flagBadge(228, 196, 144, 102)}
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
  ${flagBadge(64, 460, 120, 85)}${flower(960, 495, 1.4)}
`);
await save('cartao-agradecimento', card, true, 1050);

const sticker = svg(600, 600, `
  <circle cx="300" cy="300" r="293" fill="${colors.pink}"/>
  <circle cx="300" cy="300" r="267" fill="none" stroke="#fff5f8" stroke-width="4" stroke-dasharray="3 14"/>
  <circle cx="300" cy="235" r="78" fill="${colors.cream}" stroke="${colors.darkRose}" stroke-width="4"/>
  ${flagBadge(247, 195, 106, 75)}
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
  ${flagBadge(1060, 61, 145, 103)}
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
  ${flagBadge(86, 769, 120, 85)}
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
  ${flagBadge(840, 313, 120, 85)}
`);
await save('story-vertical', story, true, 1080);

console.log(`Arquivos criados em ${out}`);
