# EXU — site institucional público

Este diretório hospeda a superfície institucional e o laboratório público de interação da Exu. **Não é o código da plataforma Exu.**

A escolha técnica é deliberadamente pequena: HTML, CSS e JavaScript browser-native, sem framework de aplicação. Para esta superfície, isso reduz dependências e custo operacional e permite iterar diretamente sobre linguagem, movimento e percurso comercial.

## O que vive aqui

- `index.html` — estrutura semântica da página;
- `styles.css` — direção visual e responsividade;
- `app.js` — física/interação do campo e percurso informacional;
- `bg.png` / `logo.png` — assets públicos;
- formulário público → Supabase Edge Function `site-contact`.

O formulário não possui chave secreta no browser. O endpoint valida, limita abuso e persiste leads numa tabela isolada do domínio do produto.

## Fronteira arquitetural

No site, movimento é comunicação. Na plataforma, movimento será sintaxe operacional e terá motor espacial, contratos de domínio, autorização, persistência e releitura canônica próprios.

Candidate lock: 2026-09-21.
