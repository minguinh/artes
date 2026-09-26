# Ativar pagamentos e frete — Xexéu das Artes

Estado atual: a vitrine está publicada, mas `NEXT_PUBLIC_COMMERCE_ENABLED=false`. Nenhum pagamento deve ser iniciado até a homologação completa. As credenciais abaixo pertencem aos provedores e devem ser inseridas como segredos do Worker, nunca no GitHub, no painel das artesãs ou em mensagens.

## 1. Criar a aplicação Mercado Pago

1. Entre na sua conta em [Mercado Pago Developers](https://www.mercadopago.com.br/developers/pt) e abra **Suas integrações > Criar aplicação**.
2. Nome: **Xexéu das Artes**. Solução: **Pagamentos online**. Produto: **Checkout Pro**. Modelo: **Marketplace / Split de Pagamentos 1:1**.
3. Configure a URL de redirecionamento OAuth exatamente como `https://xexeu-das-artes.domingosfonseca.workers.dev/api/mercadopago/callback`.
4. Em **Webhooks**, use `https://xexeu-das-artes.domingosfonseca.workers.dev/api/mercadopago/webhook`, selecione notificações de **pagamento** e obtenha a assinatura secreta. Configure também a URL de testes conforme o painel.
5. Crie contas de teste de integrador/vendedor e comprador. Cada artesã precisará de conta própria apta a receber e autorizar a conexão por OAuth; não deve entregar senha ou token ao projeto.
6. Anote apenas onde localizar o **Client ID** e o **Client Secret** de teste e produção. Insira os valores diretamente nos segredos do Cloudflare quando chegarmos à configuração; não os envie por chat.

A aplicação usa uma preferência Checkout Pro por artesã. A plataforma não cobra comissão sobre as peças nesta fase. As tarifas de processamento do Mercado Pago ainda se aplicam conforme a conta e o meio de pagamento. Pix e cartões disponíveis são determinados pelo provedor e pela conta conectada. O modelo 1:N não é a proposta desta versão.

## 2. Contratar os Correios

1. Defina a entidade titular do **contrato único do projeto** e contrate os serviços de encomendas dos Correios. A contratação online pelo Correios Fácil informa exigência de e-CNPJ; consulte a via de contratação e as condições comerciais aplicáveis ao seu caso. O contrato precisa permitir o modelo operacional de postagem das artesãs a partir dos respectivos CEPs, com faturamento ao titular; confirme isso com o atendimento comercial antes de usar o sistema.
2. Solicite habilitação das APIs **Token, Preço, Prazo e Busca CEP** no contrato e no cartão de postagem. A documentação atual identifica as APIs Preço e Prazo como restritas a contratos.
3. No **Meu Correios/CWS**, crie o acesso às APIs ou uma chave subdelegada, conforme o tipo de autorização permitido. Guarde usuário/código de acesso, número do contrato, DR, cartão de postagem e códigos dos serviços efetivamente contratados. Comece pelo ambiente de homologação.
4. Verifique no CWS qual versão da API CEP está liberada (`/cep/v1/enderecos` ou a versão mais nova documentada). O sistema tem `CORREIOS_CEP_PATH` para selecionar o caminho sem alterar o código.

**Ponto financeiro a homologar:** o projeto pagará a fatura de postagem, enquanto cada pagamento da compra é feito à artesã. Antes de ativar vendas, devemos definir e testar o repasse do valor do frete ao projeto (por exemplo, via `marketplace_fee` limitada ao frete, se o Mercado Pago aprovar esse uso) e conferir tarifas, estornos e conciliação. O frete não pode ficar creditado à artesã enquanto o projeto paga integralmente a postagem sem um processo de acerto.

## 3. Configurar o Worker

No Cloudflare, abra **Workers & Pages > xexeu-das-artes > Settings > Variables and Secrets**. Use o tipo **Secret** para `MERCADO_PAGO_CLIENT_ID`, `MERCADO_PAGO_CLIENT_SECRET`, `MERCADO_PAGO_WEBHOOK_SECRET`, `TOKEN_ENCRYPTION_KEY`, `CORREIOS_USER`, `CORREIOS_API_PASSWORD`, `CORREIOS_POSTING_CARD`, `CORREIOS_CONTRACT` e `CORREIOS_DR`. Gere `TOKEN_ENCRYPTION_KEY` como 32 bytes aleatórios em hexadecimal e mantenha cópia segura; perder essa chave impede ler tokens OAuth já gravados.

Configure `CORREIOS_API_BASE`, `CORREIOS_CEP_PATH` e `CORREIOS_SERVICES` de acordo com o ambiente e serviços liberados. As variáveis `NEXT_PUBLIC_` são públicas e pertencem ao build; nenhuma chave secreta deve receber esse prefixo. A conexão OAuth das artesãs pode ser preparada após configurar seus segredos, enquanto `NEXT_PUBLIC_COMMERCE_ENABLED` permanece `false`.

## 4. Homologar antes de abrir vendas

- Testar OAuth com uma conta de artesã aprovada e confirmar que o painel mostra a conexão, sem expor tokens.
- Testar webhook assinado e conferir o pagamento na API, incluindo valor e conta recebedora. O retorno do navegador não confirma pagamento.
- Testar CEP de Xexéu com entrega gratuita e CEP de outra cidade com preço e prazo reais, inclusive uma compra com duas artesãs e duas remessas.
- Testar o destino do frete, as taxas do Mercado Pago, cancelamento/estorno e falha de cotação. Confirmar também se o contrato aceita os diferentes CEPs de origem.
- Só então ativar `NEXT_PUBLIC_COMMERCE_ENABLED=true` e repetir os testes no endereço publicado.

Fontes oficiais: [configuração Marketplace do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/split-payments/split-1-1/integration-configuration/create-configuration), [pré-requisitos e taxas](https://www.mercadopago.com.br/developers/pt/docs/split-payments/split-1-1/prerequisites), [Webhooks](https://www.mercadopago.com.br/developers/pt/docs/links-and-debts/additional-content/your-integrations/notifications/webhooks), [CWS dos Correios](https://www.correios.com.br/atendimento/developers/manuais/correioswebservice), [API Preço](https://www.correios.com.br/atendimento/developers/manuais/manual-api-preco-1), [API Prazo](https://www.correios.com.br/atendimento/developers/manuais/manual-api-prazo) e [Busca CEP](https://www.correios.com.br/atendimento/developers/manuais/manual-api-busca-cep).