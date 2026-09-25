# Instruções permanentes — Xexéu das Artes

Preferência expressa pelo responsável do projeto: toda atualização deste projeto deve ser enviada ao repositório público minguinh/artes e publicada no site https://xexeu-das-artes.domingosfonseca.workers.dev antes da entrega. O usuário valida o resultado online, sem depender de arquivos em localhost.

Ao concluir qualquer alteração:
1. Faça as verificações adequadas, crie o commit e envie para a branch main do GitHub.
2. Acompanhe o build automático do Worker xexeu-das-artes no Cloudflare até o resultado final. Se falhar, corrija e repita o ciclo.
3. Confira no endereço publicado a funcionalidade alterada. Entregue o link online, o commit e o resultado da verificação.
4. Se a alteração incluir banco, versionar a migração em supabase/migrations, aplicá-la ao projeto Supabase artesxx e verificar o estado real do banco.
5. Nunca envie credenciais, dados privados ou artefatos de build ao GitHub. Segredos ficam no ambiente do Worker.

Não apresente uma mudança local como concluída enquanto GitHub e publicação estiverem dessincronizados. Se um serviço externo impedir a publicação, explique o impedimento e o estado exato de cada ambiente.
