# Vello Solutions — Site institucional

Site estático (HTML, CSS e JavaScript puro, sem dependências) da **Vello Solutions**, empresa de otimização e automação de processos empresariais.

Visual editorial inspirado em mechanical-orchard.com: papel quente, tinta quase preta, acento laranja (#ff5b1f), seções escuras com campo de brasas animado em canvas (`.atmos`), tipografia Inter Tight + Inter + JetBrains Mono.

Publicado pelo GitHub Pages a partir da branch `main`.

## Estrutura

```
index.html                    Início
solucoes.html                 Soluções (conciliação bancária, contas a pagar/receber, documentos, relatórios, back-office, agentes de IA)
segmentos.html                Segmentos atendidos
plataforma.html               Como trabalhamos (metodologia e tecnologia)
sobre.html                    Sobre a Vello
contato.html                  Formulário de diagnóstico
politica-de-privacidade.html  Política de Privacidade (LGPD)
css/styles.css                Design system: tokens (cores, tipografia, espaçamento, movimento) e componentes
js/main.js                    Comportamento: animações, console de conciliação, formulário, menu
tools/build_pages.py          Gerador das páginas (cabeçalho, rodapé e conteúdo compartilhados)
assets/vello-logo.svg          Marca / favicon
```

## Editando o conteúdo

Os textos ficam em `tools/build_pages.py`. Depois de editar, rode:

```
python3 tools/build_pages.py
```

e faça commit dos `.html` gerados. Também é possível editar os `.html` diretamente, mas a próxima geração sobrescreve essas mudanças.

## Configuração (js/main.js → `VELLO_CONFIG`)

| Campo | Para quê |
|---|---|
| `formEndpoint` | URL do Formspree/Web3Forms que recebe o formulário. **Necessário para o formulário enviar.** |
| `whatsappNumber` | Número com DDI e DDD (ex.: `5522999999999`). Ativa os links de WhatsApp. |
| `contactEmail` | E-mail exibido no rodapé e usado como alternativa de envio. |
| `linkedinUrl` | Link do LinkedIn no rodapé. |
| `analyticsId` | Só com ele preenchido o aviso de cookies aparece. |

Links de e-mail, WhatsApp e LinkedIn ficam ocultos até serem configurados.

## Endereço

O site é servido no domínio próprio `velosolutions.com.br` (arquivo `CNAME`). Os links canônicos e o `sitemap.xml` usam esse domínio; para mudar, ajuste `BASE` em `tools/build_pages.py` e gere as páginas de novo.
