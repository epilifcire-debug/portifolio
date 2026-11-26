# DESIGN.md --- EFC Tecnologia / EFCSYS

> **Status:** Fonte oficial de verdade visual e de UI/UX do portfólio
> EFC Tecnologia.\
> **Escopo:** `efcsys.com`, páginas institucionais, listagem de
> projetos, cases e painel do portfólio.\
> **Princípio:** novos componentes devem reutilizar este sistema. Não
> criar um design system paralelo.

## 1. Visão e posicionamento

O portfólio deve comunicar **Tecnologia Premium + Engenharia Digital +
Sistemas Personalizados**. A EFC não deve parecer uma biblioteca de
templates: projetos, interfaces e soluções reais são protagonistas.

**Personalidade:** tecnológica, sofisticada, precisa, moderna, dinâmica
e confiável.\
**Evitar:** aparência gamer, neon/glow excessivo, roxo como identidade,
glassmorphism exagerado, animações sem propósito, excesso de cards e
layouts SaaS genéricos.

## 2. Marca oficial

A logomarca oficial **EFC Tecnologia** fornecida pelo proprietário é um
asset soberano. - Não redesenhar, recriar em HTML/CSS, trocar tipografia
ou gerar por IA. - Não distorcer nem alterar proporção/cores. - Manter
área de respiro e usar `object-fit: contain`. - Texto institucional pode
dizer "EFC Tecnologia", mas não substitui a arte oficial.

### Assinatura EFCSYS

A arte horizontal oficial **by: EFCSYS / Soluções que conectam o seu
futuro / direitos reservados** deve ser usada preferencialmente no
rodapé. - Não recriar, cortar ou deformar. - Adaptar apenas
tamanho/posição. - Alteração da assinatura: somente Admin Master
definido no projeto.

## 3. Paleta e tokens

A interface institucional deriva da logo: preto, grafite, dourado, prata
e branco.

``` css
:root {
  --efc-bg: #050505;
  --efc-bg-deep: #000000;
  --efc-bg-soft: #0A0A0A;
  --efc-surface: #0D0D0D;
  --efc-surface-raised: #121212;

  --efc-gold: #D6A928;
  --efc-gold-bright: #F2C94C;
  --efc-gold-soft: #B88A18;
  --efc-gold-muted: #806315;

  --efc-silver: #C8CDD2;
  --efc-silver-bright: #F0F2F4;
  --efc-silver-muted: #858B91;

  --efc-text: #F5F5F5;
  --efc-text-secondary: #B8B8B8;
  --efc-text-muted: #7D7D7D;

  --efc-border: rgba(214,169,40,.22);
  --efc-border-hover: rgba(242,201,76,.62);
  --efc-border-neutral: rgba(255,255,255,.10);

  --efc-glow-gold: rgba(214,169,40,.22);
  --efc-glow-gold-strong: rgba(242,201,76,.34);

  --efc-success: #48B879;
  --efc-warning: #E5A93D;
  --efc-danger: #D85C5C;
  --efc-info: #6EA8D9;
}
```

Gradiente institucional, com moderação:

``` css
linear-gradient(135deg,#806315 0%,#D6A928 48%,#F2C94C 100%)
```

## 4. Tipografia

Usar sans-serif moderna, legível e compatível com o projeto existente.

``` css
--font-display: clamp(2.75rem,5vw,5.5rem);
--font-h1: clamp(2.25rem,4vw,4.25rem);
--font-h2: clamp(1.75rem,3vw,3rem);
--font-h3: clamp(1.15rem,1.6vw,1.5rem);
--font-body-lg: 1.125rem;
--font-body: 1rem;
--font-small: .875rem;
--font-label: .75rem;
```

Títulos 600--700; body 400--500. Dourado é realce, não cor para
parágrafos longos.

## 5. Spacing, grid e radius

``` css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 96px;
--space-10: 128px;
--container-max: 1440px;
--container-wide: 1600px;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 18px;
--radius-xl: 24px;
--radius-pill: 999px;
```

Grid: desktop 12 colunas, tablet 8, mobile 4. Não preencher espaços sem
necessidade.

## 6. Bordas, sombras e glow

Cards: borda fina dourada translúcida e sombra escura. Hover pode
intensificar borda e glow, mas glow deve indicar hierarquia/interação,
nunca dominar toda a tela.

## 7. Background --- circuitos e energia

Circuitos fazem parte da linguagem EFC: trilhas finas, nós, conexões e
pulsos luminosos. - baixa opacidade em repouso; - pulsos lentos; - sem
padrão repetitivo óbvio; - maior presença no Hero/CTA; - densidade
reduzida no mobile; - nunca prejudicar leitura.

## 8. Sistema de Interações e Movimento

### Micro

Botões, links, ícones, tags, toggles, focus e cards: **160--300ms**.

### Contextual

Filtros, galerias, troca de projetos, lightbox e navegação:
**240--500ms**.

### Ambiental

Circuitos, pulsos, marquee e parallax: lento, discreto e não bloqueante.

``` css
--ease-standard: cubic-bezier(.2,.8,.2,1);
--ease-emphasis: cubic-bezier(.16,1,.3,1);
```

Usar fade, slide, scale e stagger com propósito. Animações devem
priorizar `transform` e `opacity`.

## 9. Hover tipográfico e realce contextual

-   branco/prata → dourado no hover;
-   setas avançam 3--6px;
-   linha/pulso tecnológico pode substituir underline;
-   elementos relacionados podem reduzir levemente intensidade para
    realçar o alvo;
-   sem layout shift.

## 10. Responsividade por composição

**Mobile nunca é desktop reduzido.**

Desktop: Hero dividido, showcase amplo, grids até 3 colunas.\
Tablet: reorganizar Hero, grids 2 colunas e reduzir circuitos.\
Mobile: composição vertical, cards 1 coluna, screenshots grandes, menu
próprio, processo vertical e swipe quando útil.

Referência:

``` css
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

Quebrar conforme o conteúdo exigir.

## 11. Header

Desktop: logo oficial + Início, Projetos, Soluções, Sobre, Tecnologias,
Contato + CTA "Fale comigo".\
No scroll: sticky, menor, fundo mais sólido, blur controlado e borda
inferior discreta.\
Mobile: logo + menu próprio, touch target mínimo 44px e fechamento
acessível.

## 12. Hero

Mensagem principal: \> **Transformamos ideias em sistemas que resolvem
problemas reais.**

Combinar headline, descrição, CTA primário/secundário e showcase real.
Usar dourado somente em palavras estratégicas.

## 13. Showcase de projetos

Combinar notebook/desktop/smartphone conforme o projeto. - autoplay
lento; - navegação manual; - indicadores; - pausa após interação; -
fade + scale discreto + pequeno deslocamento; - screenshots reais assim
que cadastradas.

## 14. Cards de projeto

A imagem é dominante. Ordem: imagem → nome real → tipo da solução → tags
→ CTA/seta.

Hover desktop: aproximadamente `translateY(-4px)`, imagem scale
1.02--1.04, borda/glow leves e seta avançando.\
Mobile: não depender de hover; card inteiro clicável.

## 15. Imagens e mockups

Screenshots são conteúdo, não decoração. - nunca distorcer; - preservar
aspect ratio; - `contain` quando a interface inteira importa; - `cover`
só com corte intencional; - lazy loading fora da primeira viewport; -
thumbnails otimizadas; - WebP/AVIF quando suportado; - alt obrigatório.
Mockups de dispositivos são opcionais.

## 16. Página `/projetos`

Introdução + filtros + busca + grid + CTA. Filtros atualizam sem reload
e categorias vêm dos dados, não hardcoded.

## 17. Case `/projetos/[slug]`

Ordem: 1. Hero; 2. Sobre; 3. Desafio (opcional); 4. Solução (opcional);
5. Funcionalidades; 6. Galeria; 7. Resultados (opcional); 8.
Tecnologias; 9. Próximo projeto; 10. CTA.

Tecnologias só aparecem depois de o produto estar explicado.

## 18. Galeria e Lightbox

Galeria editorial alternando imagem/texto e composições desktop +
mobile.\
Lightbox: fechar, anterior/próximo, teclado, swipe mobile, indicador de
posição, foco acessível e scroll de fundo bloqueado.

## 19. Botões

Primário: dourado, alto contraste e hover controlado.\
Secundário: superfície escura com borda discreta.\
Estados obrigatórios: default, hover, active, focus-visible, disabled e
loading quando aplicável.

## 20. Tags e badges

Pequenas e auxiliares, com fundo escuro e borda fina. Status pode usar
cores semânticas. Não competir com título.

## 21. Soluções

Categorias-base: - Sistemas de Gestão; - Aplicativos e PWAs; -
Dashboards e Dados; - Automações e Bots; - Soluções para Eventos; -
Integrações.

Não obrigar todas a serem caixas idênticas se composição editorial for
melhor.

## 22. Processo de desenvolvimento

1.  Entendimento
2.  Planejamento
3.  Design
4.  Desenvolvimento
5.  Testes
6.  Entrega

Desktop: circuito horizontal progressivo. Mobile: vertical. Pulso
acompanha entrada das etapas no viewport.

## 23. Marquee

Exemplo:
`EFC TECNOLOGIA • SISTEMAS • APLICATIVOS • AUTOMAÇÕES • EVENTOS • DADOS • RESULTADOS •`

Loop lento, fluido, sem saltos e simplificado em reduced-motion.

## 24. Footer

Pode conter logo oficial, institucional, navegação, soluções, contato,
redes, CTA, circuitos e assinatura gráfica EFCSYS. A assinatura oficial
deve manter proporção e legibilidade.

## 25. Painel administrativo

Mais funcional que o site público, mantendo identidade. Priorizar
clareza, formulários legíveis, upload, drag and drop, previews e
feedback de sucesso/erro. Não sacrificar usabilidade por efeitos
decorativos.

## 26. Estados e feedback

Todo componente interativo deve prever loading, vazio, erro, sucesso e
disabled. Usar skeleton quando adequado e evitar reload total para
alterações locais.

## 27. Acessibilidade

Obrigatório: - contraste adequado; - `focus-visible`; - teclado; - HTML
semântico; - alt; - labels/aria quando necessário; - touch target ≥
44px; - não depender apenas de cor; - `prefers-reduced-motion`.

``` css
@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

## 28. Performance

Priorizar CSS, IntersectionObserver, lazy loading, code splitting,
imagens responsivas e componentes reutilizáveis. Evitar bibliotecas
grandes para efeitos pequenos.

## 29. PWA

Quando ativo: - manifest válido; - ícones oficiais; - maskable quando
aplicável; - `theme_color` e `background_color` alinhados ao preto
EFC; - splash coerente; - service worker sem impedir atualização; - safe
areas iOS; - standalone validado. Não usar logo horizontal como ícone
pequeno.

## 30. SEO e compartilhamento

Cada case: title, meta description, canonical, OG title, OG description
e OG image. OG deve priorizar projeto + identidade EFC sem excesso de
texto.

## 31. Componentes-base

`Header`, `MobileMenu`, `Hero`, `ProjectShowcase`, `ProjectCard`,
`CategoryFilter`, `ProjectHero`, `ProjectFeatureCard`, `ProjectGallery`,
`Lightbox`, `TechnologyList`, `DevelopmentProcess`, `ProjectNext`,
`ProjectCTA`, `CircuitBackground`, `EnergyPulse`, `Marquee`, `Footer`.

Reutilizar variantes em vez de duplicar componentes.

## 32. Ordem de prioridade visual

1.  Conteúdo/projeto
2.  Hierarquia tipográfica
3.  Screenshot
4.  CTA
5.  Navegação
6.  Identidade EFC
7.  Movimento
8.  Decoração

Decoração nunca compete com o produto.

## 33. Autonomia visual

Ao criar página/componente: 1. verificar componente equivalente; 2.
consultar tokens; 3. responsividade; 4. estados; 5. movimento; 6.
acessibilidade; 7. implementar.

Necessidades novas devem ampliar este documento, não criar regra isolada
escondida.

## 34. Checklist

-   [ ] logo oficial correta;
-   [ ] preto/dourado/prata;
-   [ ] screenshots sem distorção;
-   [ ] desktop/tablet/mobile validados;
-   [ ] mobile não é desktop reduzido;
-   [ ] hover tem propósito;
-   [ ] teclado/focus funcionam;
-   [ ] reduced-motion funciona;
-   [ ] sem layout shift por animação;
-   [ ] circuitos não prejudicam leitura;
-   [ ] imagens otimizadas;
-   [ ] CTA claro;
-   [ ] nenhum dado fictício apresentado como real;
-   [ ] console sem erros relevantes;
-   [ ] nenhum design system paralelo.

## 35. Regra final

Este `DESIGN.md` é a **fonte de verdade** do portfólio EFC Tecnologia. O
mockup aprovado é referência de composição, mas não substitui este
documento nem autoriza reinterpretação da marca.

Em conflito: 1. preservar funcionalidade; 2. preservar acessibilidade;
3. seguir este `DESIGN.md`; 4. seguir assets oficiais; 5. usar mockup
apenas como referência.

**EFC Tecnologia / EFCSYS --- Soluções que conectam o seu futuro.**
