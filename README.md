# Emrys — Site Institucional (Redesign Visual Completo)

Site estático institucional (HTML + CSS + JS vanilla puro, sem build step/dependências) para a **Emrys**, plataforma de Inteligência Artificial para gestão de pequenas e médias empresas.

---

## 🎨 Sistema de Design & Tokens (`css/styles.css`)

- **Superfície Principal**: `#000000` (preto absoluto) com cartões em vidro `rgba(255,255,255,.05)` + `backdrop-filter: blur(12px)`.
- **Acento Laranja**: `#FFA260` (quente) e glow `#FF6A00`.
- **Glow Azul Frio**: `#398FFF` (aplicado em sombras e radial gradients).
- **Tipografia Signature**:
  - Títulos em 2 linhas: `Satoshi` (branca, peso 500) + `Instrument Serif` (itálica laranja, peso 400).
  - Corpo & rótulos: `Satoshi` (400 / 500 / 700).
  - Preloaded via Fontshare e Google Fonts.
- **Raios**: `8px` (`--r-sm`), `12px` (`--r-md`), `16px` (`--r-lg`), `30px` (`--r-xl`), `99px` (`--r-pill`).

---

## 📁 Estrutura de Arquivos

```
index.html                    Home (Hero, Métricas, Agentes IA, Marquee, Timeline, Comparativo, FAQ)
plataforma.html               Módulos e implantação personalizada
solucoes.html                 Soluções por desafio empresarial
segmentos.html                Segmentos atendidos (Clínicas, Oficinas, Restaurantes, Lojas, etc.)
sobre.html                    História, Missão, Visão e Valores
contato.html                  Formulário de diagnóstico com validação e atalhos
politica-de-privacidade.html  Política de privacidade e LGPD
css/styles.css                ÚNICO arquivo de estilos (Tokens em :root, componentes, animações, responsivo)
js/main.js                    Comportamentos vanilla (Scroll reveal stagger, timeline fill, count-up, FAQ accordion, carousel)
_headers                      Cabeçalhos de segurança HTTP para hospedagem (Cloudflare Pages / Netlify)
assets/                       Diretório de mídias e assets estáticos
```

---

## 🔒 Segurança, LGPD & Limitação do GitHub Pages

> [!NOTE]
> **Cabeçalhos de Segurança HTTP:**
> O GitHub Pages **não suporta customização de cabeçalhos HTTP** (`Strict-Transport-Security`, `X-Frame-Options`, `Permissions-Policy`, `Content-Security-Policy`).
> 
> - **Situação Atual**: Implementado fallback via `<meta http-equiv="Content-Security-Policy">` e `<meta name="referrer">` no `<head>` de cada página HTML.
> - **Recomendação de Migração**: Para ativação completa dos cabeçalhos de segurança de nível de servidor, recomenda-se publicar via **Cloudflare Pages** ou **Netlify** (ambos gratuitos), utilizando o arquivo `_headers` já incluso no repositório.

---

## ⚙️ Configuração (`js/main.js`)

No topo de `js/main.js` encontra-se o objeto central de configuração `EMRYS_CONFIG`:

```js
const EMRYS_CONFIG = {
  companyName: "Emrys",
  whatsappNumber: "5522XXXXXXXXX", // Digitar número completo com DDD
  contactEmail: "contato@emrys.ai",
  instagramUrl: "",
  linkedinUrl: "",
  formEndpoint: "",     // URL do Formspree, Web3Forms ou similar
  analyticsId: "",
  webhookUrl: "",        // n8n / Make / Zapier — recebe o lead e distribui
  calendarUrl: "",       // Cal.com ou Google Calendar
  analyticsProvider: "", // "ga4" | "plausible" | ""
};
```

### Comportamento do Formulário sem Backend Configurado:
Caso `formEndpoint` não esteja preenchido, o formulário exibirá uma mensagem transparente com atalhos diretos para WhatsApp e E-mail, evitando falso envio de sucesso.

---

## 🚀 Como Executar Localmente

Não há etapas de build ou instalação de pacotes npm. Basta abrir o arquivo `index.html` em qualquer navegador moderno.
