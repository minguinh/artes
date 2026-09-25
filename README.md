# Xexéu das Artes

Aplicação responsiva em Next.js, Supabase e Mercado Pago para divulgar e vender artesanato das artesãs de Xexéu. O catálogo começa vazio: nenhum nome, retrato ou preço de referência é tratado como dado real.

## Páginas

| Página | Função |
| --- | --- |
| `/` | Artesã do mês, categorias e peças agrupadas por artesã |
| `/artesas`, `/artesas/[slug]` | Perfis aprovados e catálogo individual |
| `/produtos`, `/produtos/[slug]` | Busca, categorias e detalhes da peça |
| `/carrinho` | Endereço, cotação e pagamentos separados |
| `/cadastro`, `/entrar` | Conta Supabase Auth |
| `/painel` | Cadastro e vendas da artesã ou moderação da administração |
| `/pedidos/[id]` | Acompanhamento do comprador |
| `/minhas-compras`, `/contato` | Histórico de compras e consulta à equipe |
| `/admin/contatos` | Consultas recebidas pela administração |

## Banco de dados

| Tabela | Conteúdo |
| --- | --- |
| `profiles` | Papel administrativo, definido pela equipe |
| `artisans` | Perfil, aprovação, CEP de postagem e mês de destaque |
| `products`, `product_images` | Peças, preço em centavos, estoque, embalagem, aprovação e fotos |
| `seller_connections`, `oauth_states` | Vínculo OAuth com Mercado Pago, tokens cifrados e estados temporários |
| `orders`, `order_items` | Um pedido por artesã, endereço privado, frete e valores históricos |
| `support_requests` | Consultas de clientes quando precisam da equipe |

As tabelas expostas têm RLS. As rotas do servidor verificam a identidade e a propriedade antes de usar a service role. Fotos ficam em bucket privado e só são servidas após aprovação ou verificação de propriedade/administração.

## Fluxo de compra

1. O comprador adiciona peças de uma ou mais artesãs ao carrinho.
2. Informa e confirma o endereço. O servidor valida o CEP e a cidade. Endereço em Xexéu/PE recebe entrega pela artesã a R$ 0. Para outras cidades, o servidor consulta preço e prazo dos Correios para uma remessa por artesã.
3. A tela mostra os itens, o subtotal, as modalidades e o total de **cada artesã**. Uma cotação inválida impede gerar pagamentos e oferece contato com a equipe.
4. Após confirmação, o servidor relê preço, estoque, dimensões e frete, reserva o estoque em transação e cria um pedido por artesã. Gera uma preferência Checkout Pro usando o token OAuth da respectiva vendedora.
5. O comprador recebe um link de pagamento para cada artesã. Pix e cartões aparecem conforme disponibilidade da conta conectada e do Checkout Pro. Nenhum dado de cartão passa pelo aplicativo.
6. O webhook autenticado consulta o pagamento na API do Mercado Pago e confere pedido, valor e conta recebedora. Só então o pedido muda para `paid`. O retorno do navegador nunca marca pagamento.

## Preparar as contas

### Supabase

1. Crie um projeto e execute [`supabase/migrations/20260924120000_initial.sql`](supabase/migrations/20260924120000_initial.sql) no SQL Editor. Para projetos com Data API restrita, conceda `SELECT` às roles `anon` e `authenticated` nas tabelas públicas conforme a configuração do projeto; as políticas RLS continuam obrigatórias. A service role permanece apenas no servidor.
2. Em Auth, habilite e-mail/senha e ajuste Site URL e Redirect URLs para o domínio HTTPS e o ambiente local. Para produção, mantenha a confirmação de e-mail ativa.
3. Copie Project URL, publishable key e service role key para as variáveis abaixo. O bucket privado `catalog` é criado pela migração.
4. Depois de criar sua conta, atribua papel de administrador **somente via SQL Editor**, substituindo o e-mail real: `insert into public.profiles(id,role) select id,'admin' from auth.users where email='ADMIN@EXEMPLO.COM' on conflict(id) do update set role='admin';` Nunca ofereça esse campo no navegador.

### Mercado Pago

1. Crie uma aplicação **Marketplace / Checkout Pro**. Configure o Redirect URI exato `https://SEU-DOMINIO/api/mercadopago/callback` e o webhook `https://SEU-DOMINIO/api/mercadopago/webhook` para eventos de pagamento.
2. Copie Client ID, Client Secret e a assinatura secreta do webhook para variáveis **exclusivas do servidor**. Crie `TOKEN_ENCRYPTION_KEY` com 32 bytes aleatórios em hexadecimal (`openssl rand -hex 32`). Guarde e faça backup seguro dessa chave: sem ela, tokens já conectados não podem ser decifrados.
3. Cada artesã aprovada autoriza a própria conta pelo botão “Conectar Mercado Pago”. A conta da vendedora precisa satisfazer os requisitos de identificação do provedor. A primeira versão usa **split 1:1 e uma preferência por artesã**, sem comissão da plataforma. O frete é incluído no valor da preferência da respectiva artesã; confirme o tratamento contábil e as tarifas contratadas antes da operação comercial.
   A documentação do provedor indica que a taxa do Mercado Pago é descontada do recebimento da vendedora e que o split 1:N depende de relacionamento comercial assessorado. Como não há comissão da plataforma nesta versão, `marketplace_fee` fica ausente.
4. Confira no painel da aplicação e com contas de teste quais meios aparecem. A oferta de débito depende da disponibilidade para a conta e modalidade de checkout. Nunca prometa um meio que o checkout não habilitar.

### Correios

1. Contrate o serviço e libere as APIs **Preço, Prazo, Busca CEP e Token**, com os códigos/serviços de postagem habilitados para o contrato e cartão de postagem. Solicite as credenciais do CWS e teste primeiro em homologação.
2. Configure usuário, senha de API, cartão de postagem, contrato, DR e códigos de serviços. `CORREIOS_API_BASE` troca produção por `https://apihom.correios.com.br` na homologação. Os manuais públicos mostram endpoints `/v1`; os índices também citam `/v3`, então confirme a versão habilitada no CWS do seu contrato antes de ir à produção.
3. O CEP de origem é cadastrado por cada artesã. Para múltiplos itens da mesma artesã, o MVP soma peso e alturas e usa a maior largura/comprimento; verifique a embalagem real e as restrições dimensionais do serviço antes de aprovar o produto.

## Variáveis e execução

Copie [`.env.example`](.env.example) para `.env.local` e preencha os valores. Variáveis `NEXT_PUBLIC_` são públicas; todas as outras ficam somente no servidor.

```bash
pnpm install
pnpm dev
pnpm build
```

Publique em hospedagem Next.js com Node.js e HTTPS, conecte o domínio e repita as variáveis no ambiente de produção. Atualize a URL do site no Supabase e no Mercado Pago. Este repositório não contém contas, chaves ou fotos reais.

## Limites desta entrega

- A migração e os fluxos externos precisam ser exercitados no projeto Supabase e nas contas de homologação reais. Sem essas credenciais, só é possível validar o build e a lógica local.
- O estoque é reservado ao criar o pedido. Se a preferência falhar, o pedido passa a `exception` e o estoque é devolvido. Pedidos aguardando pagamento precisam de rotina operacional de expiração/cancelamento antes de alto volume.
- A cotação agrupada é uma aproximação da embalagem; ajuste para volumes reais e regras de empacotamento antes de uso comercial amplo.
- Revisar webhooks de estorno, reembolso e disputa, reconciliação periódica de pagamentos, política de devolução e suporte antes de publicar vendas reais.

## Fontes oficiais consultadas

- [Mercado Pago: marketplace e split 1:1](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-preferences/how-tos/integrate-marketplace)
- [Mercado Pago: requisitos](https://www.mercadopago.com.br/developers/pt/docs/split-payments/split-1-1/prerequisites)
- [Mercado Pago: webhooks](https://www.mercadopago.com.br/developers/pt/docs/links-and-debts/additional-content/your-integrations/notifications/webhooks)
- [Correios: API Preço](https://www.correios.com.br/atendimento/developers/manuais/manual-api-preco-1), [Prazo](https://www.correios.com.br/atendimento/developers/manuais/manual-api-prazo), [Busca CEP](https://www.correios.com.br/atendimento/developers/manuais/manual-api-busca-cep)
- [Supabase: autenticação no servidor](https://supabase.com/docs/guides/auth/server-side)
