# Estuda — reconstrução do Quizlet Clone

Aplicação web responsiva para conjuntos de estudo, cartões, pastas, favoritos e sessões de estudo.

## Estrutura
- `index.html`: interface responsiva.
- `app.js`: autenticação Supabase, CRUD e modos de estudo.
- `supabase/schema.sql`: tabelas e políticas RLS.

## Configuração
1. Crie um projeto Supabase separado para este aplicativo (recomendado).
2. No SQL Editor do Supabase, execute todo o conteúdo de `supabase/schema.sql`.
3. Copie a Project URL e a chave **publishable** (ou anon pública) do Supabase.
4. Abra `app.js` e substitua `COLE_AQUI_A_URL_DO_SUPABASE` e `COLE_AQUI_A_CHAVE_PUBLISHABLE`.
5. Em Authentication > URL Configuration, configure a URL do site publicado e a URL de redirecionamento local se for testar localmente.
6. Publique a pasta `app` como site estático. Para Vercel, selecione esta pasta como Root Directory. GitHub Pages também pode hospedar a interface estática.

Nunca coloque a chave `service_role` no navegador.

## Recursos implementados
- Cadastro e login por e-mail/senha.
- Dados sincronizados pelo Supabase entre dispositivos.
- Criar/editar conjuntos.
- Criar cartões e editar/excluir.
- Pastas.
- Favoritar cartões.
- Modo de virar cartões e teste de múltipla escolha.
- Busca e layout adaptável.

## Nota
O aplicativo precisa de um projeto Supabase configurado antes do primeiro login. O arquivo SQL ativa Row Level Security e restringe os dados ao usuário autenticado.
