import Link from 'next/link';

export function CatalogUnavailable() {
  return <div className="catalog-unavailable" role="status">
    <strong>O catálogo está temporariamente indisponível.</strong>
    <p>Estamos restabelecendo o acesso às peças e às histórias das artesãs. Tente novamente mais tarde ou fale com a equipe.</p>
    <Link className="text-link" href="/contato">Falar com a equipe ↗</Link>
  </div>;
}
