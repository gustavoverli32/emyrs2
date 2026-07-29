# findings.md — Banco de Pesquisas e Descobertas (V.L.A.E.G.)

## 🔍 Descobertas do Projeto Emrys

### 1. Raspagem da Sparo via Firecrawl MCP
- **URL**: `https://www.sparo.com.br/`
- **Mapeamento**:
  - Arquitetura de 8 seções (Hero, Como Funciona, Processo Estratégico em 6 Passos, Porque Escolher, Cases Antes vs Depois, Avaliações, Contato, FAQ).
  - Padrão de Headings em 2 linhas (1ª linha Sans Bold caixa alta, 2ª linha Serif Italic acentuada).

### 2. Stack Técnica & Animações
- **Framework de Animação**: GSAP 3.12.5 + ScrollTrigger CDN.
- **Interações**:
  - `Hero`: timeline com revelação em cascata.
  - `Cards`: efeito hover `translateY(-6px)` com acendimento de bordas e glow.
  - `Botões`: efeito magnético com física fluida no mousemove.
  - `Body`: textura de ruído SVG inline em 0.04 de opacidade.

### 3. Segurança & LGPD
- Consentimento de cookies persistido em `localStorage`.
- Proteção contra spam via campo Honeypot `hp_check` e trava de envio < 3 segundos.
- CSP configurada para liberar fontes do Fontshare, Google Fonts e scripts do CDN.
