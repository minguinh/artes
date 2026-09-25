import Link from 'next/link';
import { ArtisanCard, ProductCard } from '@/components/catalog';
import { publicArtisans, publicProducts } from '@/lib/catalog';
import { photoUrl } from '@/lib/types';
import ProductCarousel from '@/components/product-carousel';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [artisans, products] = await Promise.all([publicArtisans(), publicProducts()]);
  const featured = artisans.find(a => a.featured_month === new Date().toISOString().slice(0, 7) + '-01');
  const groups = artisans
    .map(artisan => ({ artisan, products: products.filter(p => p.artisan_id === artisan.id) }))
    .filter(group => group.products.length);

  return <>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Feito à mão em Xexéu, Pernambuco</span>
        <h1>Cada peça tem uma história. <em>Aqui ela encontra você.</em></h1>
        <p>Conheça as artesãs de Xexéu e descubra o carinho presente em cada criação. Se você produz artesanato na cidade, pode mostrar seu trabalho gratuitamente nesta fase.</p>
        <div className="hero-actions">
          <Link className="button" href="/artesas">Conhecer as artesãs ↗</Link>
          <Link className="button button-outline" href="/cadastro">Criar perfil grátis</Link>
        </div>
        <p className="hero-note">Cadastro e divulgação gratuitos por enquanto. Compras online em preparação.</p>
      </div>
      <div className="hero-visual">
        <div className="hero-yarn hero-yarn-one" aria-hidden="true" />
        <div className="hero-yarn hero-yarn-two" aria-hidden="true" />
        <img className="hero-mascot" src="/images/mascote-vovo-tricotando.png" alt="Mascote ilustrada: uma vovó sorridente tricotando uma peça rosa" />
        <div className="hero-badge"><small>BOAS-VINDAS DA NOSSA MASCOTE</small>Uma rede de histórias feita à mão.</div>
        <span className="hero-side">Xexéu · Pernambuco</span>
      </div>
    </section>

    <div className="trust-row">
      <div><strong>Feito por mãos de Xexéu</strong><span>Conheça quem cria cada peça</span></div>
      <div><strong>Histórias junto com as peças</strong><span>O trabalho tem nome, técnica e trajetória</span></div>
      <div><strong>Espaço gratuito nesta fase</strong><span>Artesãs podem divulgar seu trabalho sem custo</span></div>
    </div>

    <section className="section">
      <div className="section-head"><div><span className="eyebrow">Feitas com cuidado</span><h2>Peças para conhecer</h2></div><Link className="text-link" href="/produtos">Ver todas as peças ↗</Link></div>
      {products.length ? <div className="cards">{products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty">As primeiras peças aparecerão aqui após a aprovação pela equipe.</div>}
    </section>

    <section className="category-strip"><h2>Encontre o artesanato que combina com você.</h2><div className="category-links">{['Cerâmica', 'Bordado', 'Tecelagem', 'Madeira', 'Acessórios'].map(category => <Link href={'/produtos?categoria=' + encodeURIComponent(category)} key={category}>{category}</Link>)}</div></section>

    <section className="feature">
      <div className="feature-art">{featured?.photo_path ? <img src={photoUrl(featured.photo_path)!} alt={featured.name} /> : <span aria-hidden="true">✿</span>}</div>
      <div className="feature-copy"><span className="eyebrow">Artesã do mês</span><h2>{featured ? featured.name : 'Em breve, uma história para conhecer de perto'}</h2><p>{featured ? featured.story : 'A cada mês, vamos destacar uma artesã de Xexéu, sua trajetória e o trabalho que ela faz com as próprias mãos.'}</p><Link className="button button-outline" href={featured ? '/artesas/' + featured.slug : '/artesas'}>{featured ? 'Conhecer sua história' : 'Conhecer as artesãs'} ↗</Link></div>
    </section>

    {groups.map(group => <section className="section" key={group.artisan.id}><div className="section-head"><div><span className="eyebrow">Feito por {group.artisan.name}</span><h2>Criações de {group.artisan.name}</h2></div><Link className="text-link" href={'/artesas/' + group.artisan.slug}>Ver catálogo ↗</Link></div><ProductCarousel products={group.products} label={'Criações de ' + group.artisan.name} /></section>)}

    <section className="section"><div className="section-head"><div><span className="eyebrow">As mãos por trás da arte</span><h2>Conheça nossas artesãs</h2></div><Link className="text-link" href="/artesas">Ver todas ↗</Link></div>{artisans.length ? <div className="artisan-grid">{artisans.slice(0, 3).map(artisan => <ArtisanCard artisan={artisan} key={artisan.id} />)}</div> : <div className="empty">As artesãs aprovadas aparecerão aqui em breve.</div>}</section>

    <section className="story-band" id="historia"><div><span className="eyebrow">Para quem faz</span><h2>Seu trabalho merece ser visto.</h2><p>É artesã de Xexéu? Crie seu perfil e apresente suas peças. A participação é gratuita por enquanto.</p></div><Link className="button button-outline" href="/cadastro">Criar meu perfil grátis ↗</Link></section>
  </>;
}
