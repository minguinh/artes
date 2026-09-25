import Link from 'next/link';
import { Heart, Leaf, UsersRound } from 'lucide-react';
import { ArtisanCard } from '@/components/catalog';
import ProductCarousel from '@/components/product-carousel';
import { publicArtisans, publicProducts } from '@/lib/catalog';
import { photoUrl } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [artisans, products] = await Promise.all([publicArtisans(), publicProducts()]);
  const featured = artisans.find(artisan => artisan.featured_month === new Date().toISOString().slice(0, 7) + '-01');
  const groups = artisans
    .map(artisan => ({ artisan, products: products.filter(product => product.artisan_id === artisan.id) }))
    .filter(group => group.products.length > 0);

  return <>
    <div className="home-scene">
      <div className="home-frame">
        <div className="home-main">
          <section className="showcase-hero" aria-labelledby="hero-title">
            <div className="showcase-intro">
              <span className="eyebrow">Artesanato de Xexéu · Pernambuco</span>
              <h1 id="hero-title">Da nossa terra <em>para o seu olhar.</em></h1>
              <p>Conheça as artesãs, suas histórias e as peças que nascem do trabalho feito à mão em Xexéu.</p>
              <div className="showcase-actions">
                <Link className="button" href="/produtos">Conhecer as peças ↗</Link>
                <Link className="showcase-text-link" href="/cadastro">Sou artesã: participar grátis</Link>
              </div>
              <div className="showcase-values">
                <span><Leaf size={23} strokeWidth={1.6} /> Feito à mão</span>
                <span><UsersRound size={23} strokeWidth={1.6} /> Autoria das artesãs</span>
                <span><Heart size={23} strokeWidth={1.6} /> Mais cultura para Xexéu</span>
              </div>
            </div>
            <div className="showcase-mascot">
              <div className="showcase-yarn" aria-hidden="true" />
              <img src="/images/mascote-vovo-tricotando.png" alt="Mascote ilustrada: vovó simpática tricotando uma peça rosa" />
              <span>Uma mascote para receber você com carinho</span>
            </div>
            <div className="featured-card">
              <div className="featured-card-title"><span aria-hidden="true">❧</span> Artesã do mês</div>
              <div className="featured-card-image">{featured?.photo_path ? <img src={photoUrl(featured.photo_path)!} alt={featured.name} /> : <span aria-hidden="true">✿</span>}</div>
              <h2>{featured ? featured.name : 'Uma história em breve'}</h2>
              <p>{featured ? featured.story : 'Assim que a equipe escolher a artesã do mês, você poderá conhecer sua trajetória e suas criações aqui.'}</p>
              <Link className="featured-card-link" href={featured ? '/artesas/' + featured.slug : '/artesas'}>{featured ? 'Conhecer sua história' : 'Conhecer as artesãs'} ↗</Link>
            </div>
          </section>

          <div className="home-content">
            <div className="home-intro-line"><span>Peças com história</span><p>Feitas por mãos de Xexéu, apresentadas por quem cria.</p></div>
            {groups.length ? groups.map(group => <section className="home-products" key={group.artisan.id}>
              <div className="section-head"><div><span className="eyebrow">Criações de {group.artisan.name}</span><h2>Peças de {group.artisan.name}</h2></div><Link className="text-link" href={'/artesas/' + group.artisan.slug}>Conhecer a artesã ↗</Link></div>
              <ProductCarousel products={group.products} label={'Peças de ' + group.artisan.name} />
            </section>) : <section className="home-products home-products-empty">
              <div className="section-head"><div><span className="eyebrow">Peças com autoria</span><h2>Criações das artesãs</h2></div><Link className="text-link" href="/produtos">Explorar catálogo ↗</Link></div>
              <div className="showcase-empty"><span aria-hidden="true">✿</span><div><strong>As primeiras peças estão a caminho.</strong><p>Quando as artesãs e seus produtos forem aprovados, você verá aqui os catálogos organizados por criadora.</p></div></div>
            </section>}
            <section className="home-categories" aria-label="Categorias de artesanato"><span className="eyebrow">Explore por técnica</span><div>{['Cerâmica', 'Bordado', 'Tecelagem', 'Madeira', 'Acessórios'].map(category => <Link href={'/produtos?categoria=' + encodeURIComponent(category)} key={category}>{category}</Link>)}</div></section>
            {artisans.length > 0 && <section className="home-artisans"><div className="section-head"><div><span className="eyebrow">Quem faz a arte acontecer</span><h2>Conheça nossas artesãs</h2></div><Link className="text-link" href="/artesas">Ver todas ↗</Link></div><div className="artisan-grid">{artisans.slice(0, 3).map(artisan => <ArtisanCard artisan={artisan} key={artisan.id} />)}</div></section>}
          </div>
        </div>
      </div>
    </div>
    <section className="story-band" id="historia"><div><span className="eyebrow">Para quem faz</span><h2>Seu trabalho merece ser visto.</h2><p>É artesã de Xexéu? Crie seu perfil e apresente suas peças. A participação é gratuita por enquanto.</p></div><Link className="button button-outline" href="/cadastro">Criar meu perfil grátis ↗</Link></section>
  </>;
}
