# Etapa 6 — Painel Administrativo

## Objetivo
Substituir o painel administrativo atual (apenas contatos e upload de imagens) por um painel completo de gerenciamento do portfólio, preservando login existente e restringindo a assinatura EFCSYS ao Admin Master.

## Escopo
- Estrutura de navegação do admin (Dashboard, Projetos, Categorias, Tecnologias, Mídia, Configurações).
- CRUD de categorias e tecnologias.
- Listagem completa de projetos com filtros, ações rápidas, duplicar, arquivar, publicar/destacar.
- Formulário completo de projeto: identidade, descrições, SEO, visibilidade, funcionalidades.
- Gerenciamento de mídia por projeto com tipos (card, hero, gallery_desktop, gallery_mobile, og), preview, substituição, exclusão e reordenação drag-and-drop.
- Configurações: contatos, indicadores institucionais e assinatura EFCSYS (Admin Master apenas).
- Validação de typecheck, build, rotas, responsividade e console.

## Não incluído
- Não alterar identidade visual, rotas públicas, SEO ou PWA já existentes.
- Não migrar screenshots estáticos para o banco automaticamente.
- Não implementar envio real de e-mail do formulário de contato (Etapa 8 ou demanda separada).

## Etapas internas
1. Reestruturar `/admin` com abas/sidebar e componentes base (tabela, formulário, modal).
2. CRUD de categorias com slug e ordenação.
3. CRUD de tecnologias com ícone Lucide, categoria e ativo/inativo.
4. Listagem de projetos com filtros e ações rápidas.
5. Formulário de projeto com todos os campos e funcionalidades.
6. Mídia: upload, preview, exclusão e drag-and-drop de ordenação.
7. Configurações: contatos, métricas e assinatura EFCSYS restrita ao Admin Master.
8. Validação final.

## Arquivos esperados
- `src/routes/_authenticated/admin.tsx` (reescrito como layout de abas).
- `src/components/admin/*.tsx` (tabelas, formulários, modais, upload, drag-drop).
- `src/lib/admin/*.ts` (helpers de slug, ordenação, queries).
- Ajustes em `src/lib/media.ts` para suportar reordenação e tipos de mídia.
