type LogoProps = { className?: string; light?: boolean };

export default function Logo({ className = '', light = false }: LogoProps) {
  return (
    <img
      className={`${className}${light ? ' logo-on-dark' : ''}`}
      src="/images/logo-xexeu-das-artes.svg"
      alt="Xexéu das Artes"
      width="700"
      height="140"
    />
  );
}
