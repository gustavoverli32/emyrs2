# Emrys — site institucional

Site estático (HTML + CSS + JS puro, sem build step) para a Emrys, plataforma de Inteligência Artificial para gestão de pequenas e médias empresas.

## Estrutura

```
index.html                   Home
plataforma.html               Página da plataforma/módulos
solucoes.html                 Soluções por problema
segmentos.html                Segmentos atendidos
sobre.html                    Missão, visão, valores
contato.html                  Formulário de contato
politica-de-privacidade.html  Política de privacidade / LGPD
css/styles.css                Todo o estilo (tokens + componentes + seções + animações + responsivo)
js/main.js                    Navegação, scroll reveal, contadores, FAQ, abas, formulário
assets/                       Coloque aqui logo, ícones e imagens reais quando disponíveis
```

## Como executar

Abra `index.html` diretamente no navegador, ou publique a pasta inteira.

## Publicar no GitHub Pages

1. Suba todos os arquivos para a branch `main` do repositório.
2. Em Settings → Pages, selecione a branch `main` e a pasta raiz (`/`).
3. O site ficará disponível em `https://<usuario>.github.io/<repositorio>/`.

## Configuração (js/main.js)

No topo do arquivo há o objeto `EMRYS_CONFIG`:

```js
const EMRYS_CONFIG = {
  companyName: "Emrys",
  whatsappNumber: "",     // ex: "5522999999999" — sem isso os botões de WhatsApp ficam desativados
  contactEmail: "contato@emrys.ai",
  instagramUrl: "",
  linkedinUrl: "",
  formEndpoint: "",       // URL do Formspree, Web3Forms ou similar, para o formulário funcionar de verdade
  analyticsId: "",
};
```

- **WhatsApp**: preencha `whatsappNumber` com o número em formato internacional (só dígitos).
- **Formulário**: como GitHub Pages não tem backend, configure `formEndpoint` com um serviço como [Formspree](https://formspree.io) ou [Web3Forms](https://web3forms.com). Sem isso, o formulário valida os campos mas apenas simula o envio (mostra a mensagem de sucesso sem enviar a nenhum lugar).
- **Analytics**: adicione o script do seu provedor (GA4, Plausible etc.) em cada página, e preencha `analyticsId` se for usá-lo no seu próprio script.

## Trocar identidade visual

Todas as cores, fontes e espaçamentos ficam em `:root` no topo de `css/styles.css` (`--bg`, `--surface`, `--text`, `--accent`, etc.) — altere ali para propagar em todo o site.

## Trocar logo

O logo atual é um SVG inline (losango + triângulo) repetido no `<header>` e no `<footer>` de cada página. Para usar uma logo real, substitua o `<svg>...</svg>` por `<img src="assets/logo.svg" alt="Emrys">` em cada arquivo.

## Dados fictícios

As seções "Painel Emrys", "Enquanto você trabalha" e o dashboard demonstrativo usam dados de exemplo, claramente identificados como demonstração/simulação. Substitua por integrações reais quando disponíveis.

## Pendências / placeholders

Busque por `[INSERIR` no projeto para encontrar campos que precisam de dados reais (CNPJ, e-mail de privacidade, encarregado de dados, WhatsApp).

## Próximos passos sugeridos

- Adicionar imagens/ilustrações reais em `assets/`.
- Conectar `formEndpoint` a um serviço de formulário.
- Preencher dados jurídicos da política de privacidade.
- Configurar analytics.
