import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, ShoppingBag, UserRound } from 'lucide-react';
import Logo from '@/components/logo';
import './globals.css';

export const metadata: Metadata = {
  title: 'Xexéu das Artes | Artesanato feito em Xexéu',
  description: 'Conheça as artesãs e as peças feitas à mão em Xexéu, Pernambuco. Artesãs podem criar seu perfil e divulgar seu trabalho gratuitamente nesta fase.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>
    <div className="topline"><span className="topline-place">Artesanato feito em Xexéu, Pernambuco</span><span className="topline-separator">✿</span><span className="topline-free">Participação gratuita por enquanto</span></div>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Xexéu das Artes, página inicial"><Logo className="logo-header" /></Link>
      <nav aria-label="Navegação principal">
        <Link href="/">Início</Link>
        <Link href="/artesas">Artesãs</Link>
        <Link href="/produtos">Produtos</Link>
        <Link href="/#historia">Sobre</Link>
      </nav>
      <form action="/produtos" method="get" className="header-search" role="search">
        <input name="busca" type="search" placeholder="Buscar produtos, artesãs..." aria-label="Buscar produtos e artesãs" />
        <button type="submit" aria-label="Buscar"><Search size={19} strokeWidth={1.8}/></button>
      </form>
      <div className="header-actions">
        <Link href="/produtos" className="mobile-search" aria-label="Buscar produtos"><Search size={21}/></Link>
        <Link href="/carrinho" aria-label="Carrinho"><ShoppingBag size={21}/></Link>
        <Link href="/painel" aria-label="Minha conta"><UserRound size={21}/></Link>
      </div>
    </header>
    <main>{children}</main>
    <footer>
      <div className="footer-grid">
        <div><Logo className="logo-footer" light /><p>Um espaço para conhecer as mulheres, os saberes e as peças feitas à mão em Xexéu.</p></div>
        <div><h4>Descubra</h4><Link href="/artesas">Nossas artesãs</Link><Link href="/produtos">Todas as peças</Link></div>
        <div><h4>Participe</h4><Link href="/cadastro">Criar perfil gratuito</Link><Link href="/painel">Acessar painel</Link><Link href="/contato">Contato</Link></div>
        <div><h4>De Xexéu para você</h4><p>Pernambuco, Brasil</p><p>Divulgação gratuita nesta fase do projeto. Compras online em preparação.</p></div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Xexéu das Artes <span>Feito com carinho, em Pernambuco.</span></div>
    </footer>
  </body></html>;
}
