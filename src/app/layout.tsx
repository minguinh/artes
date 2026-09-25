import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag, UserRound } from 'lucide-react';
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
        <Link href="/artesas">As artesãs</Link>
        <Link href="/produtos">Peças</Link>
        <Link href="/#historia">Nossa essência</Link>
      </nav>
      <div className="header-actions">
        <Link href="/painel" aria-label="Minha conta"><UserRound size={20}/></Link>
        <Link href="/carrinho" aria-label="Carrinho"><ShoppingBag size={20}/></Link>
        <Link href="/cadastro" className="button button-small">Sou artesã</Link>
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

