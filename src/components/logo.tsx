type LogoProps = { className?: string; light?: boolean };

export default function Logo({ className = '', light = false }: LogoProps) {
  const yarn = light ? '#ffd8e7' : '#c84f83';
  const shadow = light ? '#f8a9c9' : '#8d315b';
  const stitch = light ? '#fff5f8' : '#ffe4ee';

  return (
    <svg className={className} viewBox="0 0 620 140" role="img" aria-label="Xexéu das Artes, marca em fios de crochê" xmlns="http://www.w3.org/2000/svg">
      <title>Xexéu das Artes</title>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="67" cy="71" r="43" fill={yarn} stroke={shadow} strokeWidth="5" />
        <path d="M32 61c24-21 55-19 76 2M27 78c26-16 59-12 81 5M42 37c9 19 30 31 61 34M38 99c18-11 40-10 57 0M78 31c-17 22-23 47-14 82M97 43C77 66 76 85 84 108" stroke={stitch} strokeWidth="5" />
        <path d="M105 96c16 3 25 15 18 29" stroke={yarn} strokeWidth="6" />
        <path d="M121 125c-4 3-7 3-11 0" stroke={shadow} strokeWidth="3" />
      </g>
      <g fontFamily="'Baloo 2','Arial Rounded MT Bold',sans-serif" fontSize="72" fontWeight="700" letterSpacing="-2">
        <text x="127" y="93" fill={yarn} stroke={shadow} strokeWidth="4" paintOrder="stroke">Xexéu das Artes</text>
        <text x="127" y="93" fill="none" stroke={stitch} strokeWidth="3" strokeDasharray="1 10" strokeLinecap="round">Xexéu das Artes</text>
      </g>
    </svg>
  );
}
