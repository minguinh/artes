# Kit de identidade visual — Xexéu das Artes

Arquivos para divulgação e embalagem. A personagem é uma ilustração original e não representa uma artesã real.

## Paleta

| Uso | Cor |
| --- | --- |
| Rosa principal | `#C84F83` |
| Ameixa para textos | `#51263D` |
| Rosa claro | `#FFF0F5` |
| Creme | `#FFFBF7` |
| Rosa de apoio | `#EAA0BF` |

Use o texto ameixa sobre fundo creme ou rosa claro para manter a leitura. Reserve o rosa principal para botões, ornamentos e títulos curtos.

## Arquivos

- `logo-principal.svg` e `.png`: logomarca do cartaz escolhido pelo responsável, com novelo rosa, fio em coração e letras serifadas em ameixa. O SVG foi vetorizado em caminhos independentes da imagem raster.
- `assinatura-com-bandeira.svg` e `.png`: logomarca original acompanhada da bandeira de Xexéu em uma composição separada.
- `etiqueta-preco-frente.svg` e `.png`: etiqueta de 60 × 90 mm; preencha peça, artesã e preço antes de imprimir.
- `etiqueta-preco-verso.svg` e `.png`: verso da etiqueta, também 60 × 90 mm.
- `cartao-agradecimento.svg` e `.png`: cartão de 105 × 60 mm.
- `adesivo-redondo.svg` e `.png`: adesivo redondo de 60 mm de diâmetro.
- `banner-horizontal.svg` e `.png`: banner digital de 1920 × 640 px.
- `post-quadrado.svg` e `.png`: arte para feed de 1080 × 1080 px.
- `story-vertical.svg` e `.png`: banner vertical para stories de 1080 × 1920 px.
- `mascote-para-banners.png`: ilustração usada nos banners. Os SVGs dos banners fazem referência a esse arquivo na mesma pasta; mantenha-os juntos ou use os PNGs prontos.
- `bandeira-xexeu.png`: bandeira municipal apresentada nas peças do kit. Fonte: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bandeira_de_Xex%C3%A9u.png), arquivo atribuído à Prefeitura Municipal de Xexéu e disponibilizado sob [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Mantida sem redesenho.

Os PNGs são prontos para uso. Os SVGs permitem edição de texto, tamanho e cor em um editor vetorial. Para impressão profissional, peça à gráfica uma prova de cor e converta as fontes em curvas depois de personalizar os dados. A etiqueta tem um furo indicado no topo; confirme com a gráfica a margem de corte e o tipo de papel. Mantenha as imagens da mascote e da bandeira na mesma pasta dos SVGs que as utilizam.

Não preencha com valores ilustrativos apresentados em referências antigas. O preço deve corresponder à peça da artesã responsável.

Para refazer a vetorização a partir da arte original, execute `python scripts/vectorize-logo.py` (requer Pillow e vtracer). Depois, para regenerar os SVGs e PNGs do kit, execute `node scripts/generate-brand-kit.mjs`.
