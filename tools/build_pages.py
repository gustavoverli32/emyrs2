"""Gera as páginas estáticas do site Vello Solutions.
Uso: python3 tools/build_pages.py  (gera os .html na raiz do repositório)
O repositório recebe apenas HTML pronto; não há build no deploy."""
import json
import sys
from pathlib import Path

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent
BASE = "https://vellosolutions.com.br/"

# --------------------------------------------------------------------------
# Ícones (traço 1.6, 24x24)
# --------------------------------------------------------------------------
def icon(name):
    p = {
        "bank": '<path d="M3 10h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18M12 3l9 5H3z"/>',
        "flow": '<path d="M4 7h10M4 12h16M4 17h7"/><path d="M17 4l3 3-3 3"/>',
        "doc": '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
        "chart": '<path d="M4 20V4M4 20h16"/><path d="M8 16l4-5 3 3 5-6"/>',
        "grid": '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><path d="M13 16.5h7M16.5 13v7"/>',
        "agent": '<rect x="5" y="7" width="14" height="11" rx="2"/><path d="M12 3v4M9 12h.01M15 12h.01M9.5 15h5"/>',
        "log": '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
        "human": '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5"/>',
        "plug": '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>',
        "shield": '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
        "check": '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
        "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
        "store": '<path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>',
        "health": '<path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z"/><path d="M9 12h2l1-2 1.5 4 1-2H17"/>',
        "factory": '<path d="M3 20V10l5 3V10l5 3V6h4l1 14z"/><path d="M3 20h18"/>',
        "truck": '<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
        "calc": '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h4"/>',
        "building": '<path d="M4 21V5l8-2v18M12 21V9l8 2v10M3 21h18M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2"/>',
        "lock": '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
        "pulse": '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
        "spark": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
    }[name]
    return f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{p}</svg>'

ARROW = '<svg class="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

NEW_MARK_SVG = '<rect width="32" height="32" rx="16" fill="#ff5b1f"/><path d="M9 10l7 12.5L23 10" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'
ARROW_SM = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
ATMOS = '<canvas class="atmos" data-mode="fire" aria-hidden="true"></canvas><div class="atmos-glow" aria-hidden="true"></div>'


def split(text):
    """Quebra um título em linhas (separadas por '|') para a animação linha a linha."""
    parts = [x.strip() for x in text.split("|")]
    return "".join(f'<span class="line"><span style="--i:{i}">{x}</span></span>' for i, x in enumerate(parts))


LOGO = '''<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="16" fill="#ff5b1f"/><path d="M9 10l7 12.5L23 10" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'''

NAV = [
    ("solucoes.html", "Soluções"),
    ("segmentos.html", "Segmentos"),
    ("plataforma.html", "Como trabalhamos"),
    ("sobre.html", "Sobre"),
    ("contato.html", "Contato"),
]

ORG = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Vello Solutions",
    "url": BASE,
    "logo": BASE + "assets/vello-logo.svg",
    "description": "Otimização e automação de processos empresariais: rotinas administrativas, financeiras e operacionais recorrentes, conciliação bancária, contas a pagar e receber e processamento de documentos, com menos erro humano.",
    "areaServed": {"@type": "Country", "name": "Brasil"},
    "address": {"@type": "PostalAddress", "addressLocality": "Rio das Ostras", "addressRegion": "RJ", "addressCountry": "BR"},
    "knowsAbout": [
        "Otimização de processos",
        "Automação de processos empresariais",
        "Conciliação bancária automatizada",
        "Automação financeira",
        "Contas a pagar e a receber",
        "RPA",
        "Processamento inteligente de documentos",
        "Integração de sistemas",
    ],
}


def head(title, desc, path, extra_ld=None):
    url = BASE + ("" if path == "index.html" else path)
    lds = [ORG] + (extra_ld or [])
    ld = "\n".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in lds)
    return f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https:; form-action 'self' https:; base-uri 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0d0e0c">
<link rel="canonical" href="{url}">
<link rel="icon" href="assets/vello-logo.svg" type="image/svg+xml">
<meta property="og:site_name" content="Vello Solutions">
<meta property="og:locale" content="pt_BR">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;800&family=Inter:wght@400;500;600;800&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="css/styles.css">
<script>document.documentElement.classList.add("js")</script>
{ld}
</head>'''


def header(active):
    cur = ' aria-current="page"'
    links = "\n".join(
        f'        <a href="{h}"{cur if h == active else ""}>{t}</a>' for h, t in NAV
    )
    return f'''<body>
<a class="skip-link" href="#main">Pular para o conteúdo</a>
<div class="utility-bar">
  <div class="container">
    <span class="mono">Novo</span>
    <a href="solucoes.html#conciliacao-bancaria">Conciliação bancária automatizada: veja como funciona {ARROW_SM}</a>
  </div>
</div>
<header class="site-header">
  <div class="container nav">
    <a class="brand" href="index.html" aria-label="Vello Solutions, página inicial">
      {LOGO}
      <span class="brand-name">Vello<small>Solutions</small></span>
    </a>
    <nav aria-label="Navegação principal">
      <div class="nav-links" id="nav-links">
{links}
        <a class="btn btn-primary nav-links-cta" href="contato.html">Agendar diagnóstico</a>
      </div>
    </nav>
    <div class="nav-actions">
      <a class="btn btn-primary nav-cta" href="contato.html">Agendar diagnóstico</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Abrir menu"><span></span></button>
    </div>
  </div>
</header>
'''


FOOTER = f'''
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand footer-brand" href="index.html">{LOGO}<span class="brand-name">Vello<small>Solutions</small></span></a>
        <p class="footer-about">Otimização e automação de processos para empresas. Menos trabalho manual, menos erro humano, mais controle sobre a operação.</p>
      </div>
      <div class="footer-col">
        <h2>Soluções</h2>
        <ul>
          <li><a href="solucoes.html#conciliacao-bancaria">Conciliação bancária</a></li>
          <li><a href="solucoes.html#contas-a-pagar-e-receber">Contas a pagar e receber</a></li>
          <li><a href="solucoes.html#documentos">Processamento de documentos</a></li>
          <li><a href="solucoes.html#integracao-de-sistemas">Integração de sistemas</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h2>Empresa</h2>
        <ul>
          <li><a href="plataforma.html">Como trabalhamos</a></li>
          <li><a href="segmentos.html">Segmentos</a></li>
          <li><a href="sobre.html">Sobre a Vello</a></li>
          <li><a href="politica-de-privacidade.html">Política de Privacidade</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h2>Contato</h2>
        <ul>
          <li><a href="contato.html">Agendar diagnóstico</a></li>
          <li><a data-email href="#">E-mail</a></li>
          <li><a data-wa href="#" data-keep-text>WhatsApp</a></li>
          <li><a data-linkedin href="#">LinkedIn</a></li>
          <li>Rio das Ostras / RJ</li>
        </ul>
      </div>
    </div>
    <div class="footer-word" aria-hidden="true">Vello</div>
    <div class="footer-bottom">
      <span>© <span data-year>2026</span> Vello Solutions. Todos os direitos reservados.</span>
      <span>Tratamento de dados conforme a LGPD (Lei nº 13.709/2018).</span>
    </div>
  </div>
</footer>
<script src="js/main.js" defer></script>
</body>
</html>
'''


def page_hero(crumb, eyebrow, h1, lead, extra=""):
    return f'''<section class="page-hero grain">
  {ATMOS}
  <div class="container">
    <nav class="breadcrumb" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">/</span><span>{crumb}</span></nav>
    <div data-reveal>
      <p class="eyebrow">{eyebrow}</p>
      <h1 class="display" data-split>{split(h1)}</h1>
      <p class="lead">{lead}</p>
    </div>
    {extra}
  </div>
</section>'''


CTA = f'''<section class="cta-band grain" aria-labelledby="cta-title">
  <canvas class="atmos" data-mode="forest" aria-hidden="true"></canvas>
  <div class="atmos-glow atmos-glow--forest" aria-hidden="true"></div>
  <div class="container cta-inner">
    <div>
      <p class="eyebrow" data-reveal>Diagnóstico sem custo</p>
      <h2 id="cta-title" data-split><span class="line"><span style="--i:0">Sua nova operação</span></span><span class="line"><span style="--i:1">começa aqui.</span></span></h2>
    </div>
    <div data-reveal>
      <p class="lead">Mapeamos seus processos recorrentes e mostramos onde a otimização gera mais retorno, com escopo e indicadores definidos antes de qualquer investimento.</p>
      <div class="cta-actions">
      <a class="btn btn-primary" href="contato.html">Agendar diagnóstico {ARROW}</a>
        <a class="btn btn-ghost-dark" href="solucoes.html">Ver soluções</a>
      </div>
    </div>
  </div>
</section>'''

# --------------------------------------------------------------------------
# Conteúdo compartilhado
# --------------------------------------------------------------------------
SOLUTIONS = [
    {
        "id": "conciliacao-bancaria", "icon": "bank", "tag": "Financeiro",
        "title": "Conciliação bancária automatizada",
        "short": "Cruzamento automático entre extratos, ERP e adquirentes, com divergências identificadas no mesmo dia.",
        "bullets": ["Múltiplos bancos, contas e adquirentes", "Regras de correspondência para casos ambíguos", "Divergências enviadas para revisão humana"],
        "long": "A conciliação bancária é uma das rotinas mais repetitivas e sensíveis do financeiro. Automatizamos a leitura dos extratos, a normalização dos lançamentos e o cruzamento com o ERP, as vendas em cartão e os recebíveis. O que bate é conciliado sozinho; o que não bate chega para sua equipe já explicado.",
        "flow": ["Extratos e OFX/CNAB", "Normalização", "Cruzamento com ERP", "Conciliado ou exceção"],
        "do": ["Captura diária de extratos de todas as contas", "Correspondência por valor, data, documento e histórico", "Classificação de tarifas, juros e lançamentos recorrentes", "Relatório de pendências com motivo provável"],
        "gain": ["Fechamento diário em vez de mensal", "Fim da conferência linha a linha", "Menos erros de baixa e de classificação", "Visão confiável do caixa a qualquer momento"],
    },
    {
        "id": "contas-a-pagar-e-receber", "icon": "flow", "tag": "Financeiro",
        "title": "Contas a pagar e a receber",
        "short": "Captura de boletos e notas, validação, agendamento, baixa e cobrança com conferências automáticas.",
        "bullets": ["Leitura de boletos, NF-e e faturas", "Validação de fornecedor, valor e vencimento", "Baixas e lembretes de cobrança automáticos"],
        "long": "Do recebimento do documento até a baixa no sistema, cada etapa é executada e validada automaticamente. Pagamentos duplicados, valores divergentes e vencimentos esquecidos passam a ser detectados antes de virar problema.",
        "flow": ["Boleto, NF-e ou fatura", "Leitura automática", "Validação e aprovação", "Lançamento e baixa no ERP"],
        "do": ["Leitura de documentos recebidos por e-mail ou portal", "Conferência com pedido de compra e cadastro do fornecedor", "Fluxo de aprovação por alçada", "Régua de cobrança e baixa automática de recebimentos"],
        "gain": ["Prevenção de pagamentos duplicados ou indevidos", "Menos atrasos, multas e juros", "Redução da inadimplência", "Equipe dedicada à análise, não à digitação"],
    },
    {
        "id": "documentos", "icon": "doc", "tag": "Documentos",
        "title": "Processamento inteligente de documentos",
        "short": "Extração de dados de notas fiscais, contratos, comprovantes e e-mails, direto para o seu sistema.",
        "bullets": ["Leitura de PDFs, imagens e XML", "Classificação automática por tipo de documento", "Validação cruzada com dados existentes"],
        "long": "Nossas automações leem documentos estruturados e não estruturados, identificam o que importa e entregam os dados prontos para uso. Cada campo extraído vem com um nível de confiança; abaixo do limite definido, uma pessoa confirma.",
        "flow": ["E-mail, portal ou pasta", "Classificação", "Extração de campos", "Validação e envio ao sistema"],
        "do": ["Notas fiscais, boletos, recibos e comprovantes", "Contratos, propostas e documentos cadastrais", "Leitura de caixas de e-mail compartilhadas", "Arquivamento organizado e pesquisável"],
        "gain": ["Fim da digitação manual de documentos", "Dados padronizados entre áreas", "Rastreabilidade de cada informação", "Escala sem aumentar a equipe"],
    },
    {
        "id": "fechamento-e-relatorios", "icon": "chart", "tag": "Gestão",
        "title": "Fechamento e relatórios gerenciais",
        "short": "Consolidação de dados de diferentes fontes e relatórios recorrentes gerados e distribuídos automaticamente.",
        "bullets": ["Consolidação entre sistemas e planilhas", "DRE, fluxo de caixa e indicadores", "Envio programado para gestores"],
        "long": "Relatórios que hoje dependem de exportar, copiar e colar passam a ser gerados sozinhos, sempre com a mesma lógica. A gestão recebe números consistentes no dia certo, e a equipe deixa de montar planilhas.",
        "flow": ["ERP, bancos e planilhas", "Consolidação", "Cálculo de indicadores", "Relatório distribuído"],
        "do": ["Consolidação de várias empresas ou unidades", "Apuração de indicadores financeiros e operacionais", "Alertas quando um número foge do esperado", "Distribuição por e-mail ou painel"],
        "gain": ["Fechamento mais rápido e previsível", "Uma única versão dos números", "Decisões com dados atualizados", "Menos horas extras no fim do mês"],
    },
    {
        "id": "rotinas-administrativas", "icon": "grid", "tag": "Administrativo",
        "title": "Rotinas administrativas e back-office",
        "short": "Cadastros, atualizações, conferências e preenchimento de sistemas executados por robôs de software.",
        "bullets": ["Cadastros e atualizações em sistemas", "Conferências entre bases de dados", "Execução programada, 24 horas por dia"],
        "long": "Robôs de software (RPA) executam no seu sistema exatamente o que uma pessoa faria: acessar, conferir, preencher e salvar. Com regras bem definidas, eles lidam com variações e exceções que antes exigiam intervenção manual.",
        "flow": ["Gatilho ou agenda", "Robô executa a rotina", "Regras tratam variações", "Registro e notificação"],
        "do": ["Cadastro de clientes, produtos e fornecedores", "Atualização de preços, estoques e status", "Emissão de documentos e guias recorrentes", "Conferências entre sistemas que não se integram"],
        "gain": ["Tarefas concluídas fora do horário comercial", "Padronização de processos", "Eliminação de erros de digitação", "Equipe realocada para atividades estratégicas"],
    },
    {
        "id": "integracao-de-sistemas", "icon": "plug", "tag": "Integração",
        "title": "Integração entre sistemas",
        "short": "Sistemas, bancos e planilhas conversando entre si, sem exportar, copiar e colar informações.",
        "bullets": ["ERP, CRM, bancos e planilhas conectados", "Dados sincronizados automaticamente", "Fim da digitação dupla entre áreas"],
        "long": "Boa parte do retrabalho nasce de sistemas que não conversam. Conectamos as ferramentas que sua empresa já usa para que cada informação seja registrada uma única vez e chegue sozinha aonde precisa estar, com regras e verificações em cada etapa.",
        "flow": ["Sistema de origem", "Validação dos dados", "Transformação", "Sistema de destino"],
        "do": ["Integração por API quando o sistema oferece", "Robôs de software quando não há integração", "Sincronização de cadastros, pedidos e lançamentos", "Monitoramento e alertas de falha"],
        "gain": ["Uma única versão das informações", "Fim da digitação em dois sistemas", "Menos erros de transcrição", "Processos que atravessam áreas sem atrito"],
    },
]

FAQ = [
    ("O que significa implementar IA no meu negócio?",
     "É colocar a inteligência artificial para trabalhar dentro dos processos da sua empresa, e não apenas usá-la como ferramenta de pesquisa. Identificamos as tarefas que mais consomem tempo ou geram erros e construímos soluções que executam, conferem e organizam esse trabalho no dia a dia da operação."),
    ("Por que não usar apenas o ChatGPT ou outra ferramenta pronta?",
     "Ferramentas prontas são genéricas: não conhecem seus processos, seus sistemas nem as regras do seu negócio. Uma implementação personalizada conecta a IA aos seus dados e fluxos de trabalho, com controles e revisão humana, para gerar resultado consistente em vez de respostas avulsas."),
    ("Como vocês identificam onde a IA pode ajudar a minha empresa?",
     "Pelo diagnóstico. Conversamos com quem executa os processos, entendemos volumes, sistemas e pontos de erro, e priorizamos as oportunidades com maior retorno. Você recebe um mapa claro do que faz sentido implementar primeiro, e do que não faz."),
    ("A solução é feita sob medida para a minha empresa?",
     "Sempre. Partimos da dor do seu negócio, não de um produto pronto. Trabalhamos lado a lado com a sua equipe em todas as etapas, do diagnóstico ao acompanhamento depois da entrega, para que a solução se encaixe na sua rotina e resolva o problema certo."),
    ("Preciso trocar meu ERP ou meus sistemas atuais?",
     "Não. A implementação se conecta aos sistemas que sua empresa já utiliza, por API quando existe e por robôs de software quando não existe. O objetivo é melhorar a forma como sua equipe trabalha, não criar um novo sistema para ela aprender."),
    ("Minha equipe precisa entender de IA?",
     "Não. Desenhamos as soluções para se encaixarem na rotina que sua equipe já conhece e acompanhamos a adoção de perto. As pessoas continuam no controle das decisões; a IA assume o trabalho repetitivo e de conferência."),
    ("E se a IA cometer um erro?",
     "Toda implementação tem regras de verificação. Quando um caso foge do padrão ou não há certeza suficiente, ele é encaminhado para uma pessoa da sua equipe com o contexto necessário para decidir. Cada ação fica registrada e pode ser auditada."),
    ("Meus dados ficam seguros?",
     "Sim. Trabalhamos com acesso mínimo necessário, comunicação criptografada, registro de todas as operações e tratamento de dados conforme a LGPD. As regras de acesso são definidas junto com a sua empresa no início do projeto."),
    ("Quanto tempo leva para ver resultado?",
     "Depende da complexidade do processo e das integrações envolvidas. Processos bem definidos costumam entrar em operação em poucas semanas. O prazo, o escopo e os indicadores de sucesso são apresentados ao final do diagnóstico, antes de qualquer contratação."),
]


def faq_html():
    items = []
    for i, (q, a) in enumerate(FAQ):
        items.append(f'''      <div class="faq-item">
        <h3><button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-{i}">{q}<span class="faq-icon" aria-hidden="true"></span></button></h3>
        <div class="faq-a" id="faq-{i}" role="region"><div><p>{a}</p></div></div>
      </div>''')
    return "\n".join(items)


FAQ_LD = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ],
}

STEPS = [
    ("Diagnóstico", "Mapeamos os processos, volumes, sistemas envolvidos e pontos onde o erro humano acontece. Priorizamos o que gera mais retorno.", "Entrega: mapa de processos e priorização"),
    ("Desenho da solução", "Definimos regras, integrações, exceções e indicadores de sucesso. Tudo validado com a sua equipe antes de começar.", "Entrega: escopo, prazos e indicadores"),
    ("Implementação", "Desenvolvemos, integramos e testamos com dados reais, em paralelo à operação atual, sem interromper o dia a dia.", "Entrega: automação validada em produção"),
    ("Operação e evolução", "Monitoramos, damos suporte e ajustamos. Novos processos entram conforme a operação amadurece.", "Entrega: relatórios de desempenho"),
]


def steps_html():
    s = "\n".join(
        f'''      <li class="step"><span class="step-node">0{i+1}</span><h3>{t}</h3><p>{d}</p><span class="step-time">{e}</span></li>'''
        for i, (t, d, e) in enumerate(STEPS)
    )
    return f'''<ol class="steps" data-observe>
      <li class="steps-track" aria-hidden="true"><i></i></li>
{s}
    </ol>'''


# --------------------------------------------------------------------------
# Páginas
# --------------------------------------------------------------------------
def index():
    rows = [
        ("02/11", "PIX recebido · Cliente 4471", "12.480,00", "ok"),
        ("02/11", "Boleto · Fornecedor Alfa Ltda", "−3.215,90", "ok"),
        ("02/11", "TED · Folha complementar", "−8.900,00", "ok"),
        ("01/11", "Tarifa de pacote de serviços", "−89,90", "ok"),
        ("01/11", "Depósito sem identificação", "1.750,00", "warn"),
        ("01/11", "Recebíveis de cartão · Lote 22", "22.364,12", "ok"),
    ]
    rows_html = "\n".join(
        f'''          <div class="console-row" role="row" data-result="{r}"><span role="cell" class="mono">{d}</span><span role="cell" class="desc">{t}</span><span role="cell" class="num">{v}</span><span role="cell"><span class="status status--pending">Na fila</span></span></div>'''
        for d, t, v, r in rows
    )
    audit = [
        ("08:00:02", "info", "INÍCIO", "Lote diário · 4 contas · 1.312 lançamentos"),
        ("08:00:41", "ok", "OK", "1.284 conciliados automaticamente"),
        ("08:00:43", "info", "REGRA", "22 casos resolvidos por histórico"),
        ("08:00:44", "warn", "EXCEÇÃO", "6 lançamentos sem correspondência"),
        ("08:00:44", "human", "HUMANO", "Exceções enviadas ao Financeiro"),
        ("09:12:10", "human", "DECISÃO", "R$ 1.750,00 vinculado ao pedido 88213"),
        ("09:12:11", "ok", "OK", "Baixa registrada no ERP · trilha arquivada"),
    ]
    audit_html = "\n".join(
        f'        <div class="audit-line"><time>{t}</time><span class="tag tag--{k}">{l}</span><span>{m}</span></div>'
        for t, k, l, m in audit
    )
    arrow_svg = icon("arrow").replace("viewBox", 'width="18" height="18" viewBox')
    sol_rows = "\n".join(
        f'''      <article class="sol-row" data-reveal>
        <span class="sol-num">{i+1:02d}</span>
        <h3><a href="solucoes.html#{s["id"]}">{s["title"]}</a></h3>
        <p>{s["short"]}</p>
        <span class="sol-go" aria-hidden="true">{arrow_svg}</span>
      </article>'''
        for i, s in enumerate(SOLUTIONS)
    )
    kpis = [
        ("Produtividade", "Horas recuperadas", "Horas de trabalho manual liberadas por mês, em cada processo automatizado.", "78%"),
        ("Qualidade", "Taxa de erro", "Divergências, retrabalho e correções antes e depois da automação.", "62%"),
        ("Velocidade", "Tempo de ciclo", "Do recebimento do documento ao lançamento concluído no sistema.", "70%"),
        ("Eficiência", "Custo por transação", "Custo operacional de cada conciliação, lançamento ou documento.", "55%"),
    ]
    kpi_html = "\n".join(
        f'''      <div class="kpi" data-reveal><span class="kpi-label">{a}</span><h3 class="kpi-title">{b}</h3><p>{c}</p><div class="kpi-bar" aria-hidden="true"><i style="--to:{d}"></i></div></div>'''
        for a, b, c, d in kpis
    )

    body = f'''
<main id="main">

<section class="hero grain" aria-labelledby="hero-title">
  {ATMOS}
  <span class="hero-scroll" aria-hidden="true">Role</span>
  <div class="container">
    <p class="eyebrow" data-hero style="--i:0">Vello Solutions · Implementação de IA sob medida</p>
    <h1 class="display" id="hero-title">
      <span class="line"><span style="--i:1">Processos inteligentes.</span></span>
      <span class="line"><span style="--i:2">Equipes mais estratégicas.</span></span>
    </h1>
    <div class="hero-bottom" data-hero style="--i:4">
      <p class="lead">A Vello implementa IA nos processos da sua empresa de forma personalizada. Rotinas administrativas, financeiras e operacionais que se repetem todos os dias passam a funcionar com mais precisão, menos erros e mais controle, sem trocar os sistemas que você já usa.</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="contato.html">Agendar diagnóstico gratuito {ARROW}</a>
        <a class="btn btn-ghost-dark" href="solucoes.html">Ver soluções</a>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="persp-title">
  <div class="container perspective">
    <div>
      <p class="eyebrow" data-reveal>Perspectiva</p>
      <h2 id="persp-title" data-split><span class="line"><span style="--i:0">Otimizar não é</span></span><span class="line"><span style="--i:1">só automatizar</span></span><span class="line"><span style="--i:2" class="muted">tarefas.</span></span></h2>
    </div>
    <div class="perspective-body" data-reveal>
      <p>Automatizar um processo ruim só faz o erro acontecer mais rápido. Antes de qualquer automação, é preciso entender onde estão os gargalos, onde nascem os erros e o que realmente precisa de uma pessoa.</p>
      <p>É assim que a Vello trabalha: mapeamos, redesenhamos e só então automatizamos, com regras claras, verificação de cada resultado e pessoas no controle das exceções.</p>
      <a class="link-arrow" href="plataforma.html">Conheça nosso método {arrow_svg.replace('width="18" height="18"', 'width="16" height="16"')}</a>
    </div>
  </div>
</section>

<section class="section section--dark" aria-labelledby="proof-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div>
        <p class="eyebrow" data-reveal>Na prática</p>
        <h2 class="h2" id="proof-title" data-split><span class="line"><span style="--i:0">Automação é um problema</span></span><span class="line"><span style="--i:1">de verificação.</span></span></h2>
      </div>
      <p class="lead" data-reveal style="max-width:44ch">Cada lançamento é conferido. Cada exceção chega explicada para quem decide. Veja uma conciliação bancária rodando.</p>
    </div>
    <div class="proof">
      <div class="console" data-console data-reveal="scale" role="img" aria-label="Demonstração de uma conciliação bancária automatizada: lançamentos sendo conciliados e uma exceção enviada para revisão humana.">
        <div class="console-bar">
          <span class="console-title"><span class="console-dot"></span>Conciliação bancária · lote diário</span>
          <span class="console-chip">Demonstração</span>
        </div>
        <div class="console-progress"><i></i></div>
        <div role="table" aria-hidden="true">
          <div class="console-head" role="row"><span>Data</span><span>Descrição</span><span>Valor (R$)</span><span>Status</span></div>
{rows_html}
        </div>
        <dl class="console-foot" aria-hidden="true">
          <div class="console-stat"><dt>Conciliados</dt><dd data-stat="matched">1.284</dd></div>
          <div class="console-stat"><dt>Exceções</dt><dd data-stat="flagged">0</dd></div>
          <div class="console-stat"><dt>Tempo</dt><dd data-stat="time">0,0 s</dd></div>
        </dl>
      </div>
      <div class="audit" data-audit data-reveal="scale" role="img" aria-label="Exemplo de trilha de auditoria de uma conciliação automatizada">
        <div class="audit-bar"><span>Trilha de auditoria</span><span>Exemplo</span></div>
        <div class="audit-body" aria-hidden="true">
{audit_html}
          <div class="audit-line is-in"><time></time><span></span><span><span class="audit-cursor"></span></span></div>
        </div>
      </div>
    </div>
    <div class="proof-notes" data-reveal-group>
      <div data-reveal><h3>Trilha de auditoria</h3><p>Quem fez, o que foi feito, quando e com base em qual regra.</p></div>
      <div data-reveal><h3>Pessoas nas exceções</h3><p>Casos fora do padrão vão para o responsável, com contexto para decidir.</p></div>
      <div data-reveal><h3>Sem trocar de sistema</h3><p>Integração com ERP, bancos e planilhas por API ou robôs de software.</p></div>
      <div data-reveal><h3>Dados protegidos</h3><p>Acesso mínimo, comunicação criptografada e conformidade com a LGPD.</p></div>
    </div>
  </div>
</section>

<section class="section" id="solucoes" aria-labelledby="sol-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div>
        <p class="eyebrow" data-reveal>Soluções</p>
        <h2 class="h2" id="sol-title" data-split><span class="line"><span style="--i:0">O que automatizamos</span></span><span class="line"><span style="--i:1" class="muted">na sua operação.</span></span></h2>
      </div>
      <a class="btn btn-secondary" href="solucoes.html" data-reveal>Todas as soluções {ARROW}</a>
    </div>
    <div class="sol-list" data-reveal-group>
{sol_rows}
    </div>
  </div>
</section>

<section class="quote-band" aria-label="Como implementamos IA">
  <span class="quote-mark" aria-hidden="true">&ldquo;</span>
  <div class="container">
    <figure data-reveal>
      <blockquote>Implementar IA não é usar um chat para pesquisar. <span class="dim">É colocar a inteligência para trabalhar dentro da sua operação, sob medida para a dor do seu negócio.</span></blockquote>
      <figcaption>A forma certa de implementar IA na sua empresa</figcaption>
    </figure>
  </div>
</section>

<section class="section section--alt" id="sob-medida" aria-labelledby="custom-title">
  <div class="container">
    <div class="split">
      <div>
        <p class="eyebrow" data-reveal>Implementação personalizada</p>
        <h2 class="h2" id="custom-title" data-split><span class="line"><span style="--i:0">Sob medida para</span></span><span class="line"><span style="--i:1">a dor do</span></span><span class="line"><span style="--i:2" class="muted">seu negócio.</span></span></h2>
        <p class="lead mt-5" data-reveal>Não vendemos uma ferramenta pronta. Cada implementação nasce do problema real da sua empresa e é construída lado a lado com a sua equipe.</p>
        <a class="btn btn-primary mt-6" href="contato.html" data-reveal>Conte qual é a sua dor {ARROW}</a>
      </div>
      <ol class="custom-list" data-reveal-group>
        <li data-reveal><span class="custom-num">01</span><div><h3>Partimos do seu problema</h3><p>Ouvimos quem vive o processo no dia a dia para entender onde estão o retrabalho, os gargalos e os erros que mais custam.</p></div></li>
        <li data-reveal><span class="custom-num">02</span><div><h3>Desenhamos a solução com você</h3><p>Cada regra, exceção e integração é definida junto com a sua equipe. Nada é imposto; tudo é validado antes de ser construído.</p></div></li>
        <li data-reveal><span class="custom-num">03</span><div><h3>Implementamos lado a lado</h3><p>Construímos, testamos com dados reais e colocamos em operação no seu ritmo, nos seus sistemas e sem interromper a rotina.</p></div></li>
        <li data-reveal><span class="custom-num">04</span><div><h3>Seguimos juntos depois da entrega</h3><p>Acompanhamos os resultados, ajustamos o que for preciso e evoluímos a solução conforme o negócio cresce.</p></div></li>
      </ol>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="metodo-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div>
        <p class="eyebrow" data-reveal>Como trabalhamos</p>
        <h2 class="h2" id="metodo-title" data-split><span class="line"><span style="--i:0">Do diagnóstico</span></span><span class="line"><span style="--i:1" class="muted">à operação.</span></span></h2>
      </div>
      <p class="lead" data-reveal style="max-width:44ch">Cada projeto começa entendendo o processo como ele é hoje. Só depois definimos o que automatizar, como medir e quando entregar.</p>
    </div>
    {steps_html()}
  </div>
</section>

<section class="section section--alt" id="resultados" aria-labelledby="res-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div>
        <p class="eyebrow" data-reveal>Resultados</p>
        <h2 class="h2" id="res-title" data-split><span class="line"><span style="--i:0">Medidos,</span></span><span class="line"><span style="--i:1" class="muted">não prometidos.</span></span></h2>
      </div>
      <p class="lead" data-reveal style="max-width:44ch">Antes de começar, definimos com a sua equipe os indicadores de sucesso de cada processo e os acompanhamos desde a primeira semana.</p>
    </div>
    <div class="grid grid-4 grid--ruled" data-reveal-group data-observe>
{kpi_html}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="faq-title">
  <div class="container split">
    <div>
      <p class="eyebrow" data-reveal>Perguntas frequentes</p>
      <h2 class="h2" id="faq-title" data-split><span class="line"><span style="--i:0">Antes de</span></span><span class="line"><span style="--i:1">implementar IA.</span></span></h2>
      <p class="lead mt-5" data-reveal>Não encontrou sua dúvida? <a class="link-arrow" href="contato.html">Fale com um especialista</a></p>
    </div>
    <div class="faq" data-reveal>
{faq_html()}
    </div>
  </div>
</section>

{CTA}

</main>'''
    return (head("Vello Solutions | Otimização e automação de processos para empresas",
                 "Otimização e automação de processos para empresas: rotinas administrativas, financeiras e operacionais, conciliação bancária automatizada, contas a pagar e receber e documentos, com menos erro humano.",
                 "index.html", [FAQ_LD])
            + header("") + body + FOOTER)


def solucoes():
    anchors = "".join(f'<a href="#{s["id"]}">{s["title"]}</a>' for s in SOLUTIONS)
    blocks = []
    for i, s in enumerate(SOLUTIONS):
        flow = ' <i aria-hidden="true">→</i> '.join(f"<span>{f}</span>" for f in s["flow"])
        blocks.append(f'''    <article class="solution" id="{s["id"]}">
      <div data-reveal>
        <span class="solution-tag">{i+1:02d} · {s["tag"]}</span>
        <h2>{s["title"]}</h2>
        <p class="lead">{s["short"]}</p>
      </div>
      <div class="solution-body" data-reveal>
        <p>{s["long"]}</p>
        <div class="flow" aria-label="Fluxo da automação">{flow}</div>
        <div class="solution-cols">
          <div><h3>O que automatizamos</h3><ul class="card-list">{"".join(f"<li>{x}</li>" for x in s["do"])}</ul></div>
          <div><h3>O que sua empresa ganha</h3><ul class="card-list">{"".join(f"<li>{x}</li>" for x in s["gain"])}</ul></div>
        </div>
      </div>
    </article>''')
    body = f'''
<main id="main">
{page_hero("Soluções", "Soluções", "Processos otimizados, | do financeiro ao administrativo.",
           "Seis frentes de automação para as rotinas que mais consomem tempo e mais geram erros. Cada uma pode ser implantada sozinha ou combinada com as outras.",
           f'<nav class="anchor-nav" aria-label="Soluções nesta página" data-reveal>{anchors}</nav>')}
<section class="section">
  <div class="container">
{chr(10).join(blocks)}
  </div>
</section>
{CTA}
</main>'''
    return (head("Soluções | Conciliação bancária, automação financeira e RPA | Vello Solutions",
                 "Conciliação bancária automatizada, contas a pagar e receber, processamento inteligente de documentos, relatórios, rotinas administrativas e integração de sistemas para empresas.",
                 "solucoes.html")
            + header("solucoes.html") + body + FOOTER)


def segmentos():
    segs = [
        ("calc", "Contabilidade e BPO financeiro", "Escritórios que processam o financeiro de muitos clientes e precisam ganhar escala sem aumentar a equipe na mesma proporção.",
         ["Conciliação de várias empresas em paralelo", "Importação e classificação de documentos", "Fechamentos mensais padronizados"]),
        ("store", "Comércio e distribuição", "Operações com alto volume de vendas, recebíveis de cartão, notas fiscais de entrada e muitos fornecedores.",
         ["Conciliação de vendas e recebíveis de cartão", "Entrada de NF-e e conferência com pedidos", "Atualização de preços e estoques"]),
        ("health", "Saúde e serviços", "Clínicas, laboratórios e empresas de serviços com faturamento recorrente, convênios e grande volume de cobranças.",
         ["Conferência de repasses e glosas", "Faturamento e cobrança recorrente", "Agendamentos e cadastros sem digitação"]),
        ("factory", "Indústria", "Empresas com cadeias de suprimento complexas, muitos lançamentos e necessidade de informação confiável para decidir.",
         ["Contas a pagar e conferência de compras", "Apuração de custos e relatórios gerenciais", "Integração entre ERP e planilhas de produção"]),
        ("truck", "Logística e transporte", "Operações com grande fluxo de documentos (CT-e, comprovantes de entrega) e cobranças pulverizadas.",
         ["Leitura de CT-e e comprovantes", "Conciliação de fretes e recebimentos", "Acompanhamento automático de pendências"]),
        ("building", "Grupos empresariais e holdings", "Empresas com várias razões sociais, contas bancárias e sistemas que precisam de uma visão consolidada.",
         ["Consolidação financeira entre empresas", "Conciliação intercompany", "Relatórios gerenciais unificados"]),
    ]
    cards = "\n".join(f'''      <article class="card" data-reveal>
        <div class="card-icon">{icon(ic)}</div>
        <h2 class="card-title">{t}</h2>
        <p class="card-body">{d}</p>
        <ul class="card-list">{"".join(f"<li>{x}</li>" for x in l)}</ul>
      </article>''' for ic, t, d, l in segs)
    body = f'''
<main id="main">
{page_hero("Segmentos", "Segmentos", "Processos diferentes. | O mesmo problema de fundo.",
           "Em todo setor existe trabalho manual, repetitivo e sujeito a erro. Adaptamos as automações à realidade de cada operação, aos seus sistemas e às suas regras.")}
<section class="section">
  <div class="container">
    <div class="grid grid-3" data-reveal-group>
{cards}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container split">
    <div data-reveal>
      <p class="eyebrow">Seu setor não está na lista?</p>
      <h2 class="h2">Se a tarefa é recorrente e segue regras, ela pode ser automatizada.</h2>
    </div>
    <div data-reveal>
      <p class="lead">O critério não é o setor, é o processo. No diagnóstico avaliamos volume, frequência, regras envolvidas e custo do erro para indicar onde a automação faz sentido e onde não faz.</p>
      <a class="btn btn-primary mt-6" href="contato.html">Avaliar meus processos {ARROW}</a>
    </div>
  </div>
</section>
{CTA}
</main>'''
    return (head("Segmentos atendidos | Otimização de processos por setor | Vello Solutions",
                 "Automação de processos financeiros e administrativos para contabilidade e BPO, comércio, saúde, indústria, logística e grupos empresariais.",
                 "segmentos.html")
            + header("segmentos.html") + body + FOOTER)


def plataforma():
    tech = [
        ("flow", "Automação robótica de processos (RPA)", "Robôs de software que operam sistemas como uma pessoa faria, inclusive os que não têm integração."),
        ("spark", "IA e agentes de IA como apoio", "Usamos inteligência artificial e agentes de IA para acelerar a análise, a construção e os testes das soluções. A IA apoia o trabalho da equipe; ela não substitui o desenho do processo nem a validação humana."),
        ("doc", "Processamento inteligente de documentos", "Leitura de PDFs, imagens e XML com extração de campos e nível de confiança por informação."),
        ("plug", "Integrações via API", "Conexão direta com ERPs, bancos, Open Finance, CRMs e planilhas, sempre que o sistema permite."),
        ("pulse", "Orquestração e monitoramento", "Agendamento, filas, alertas e painéis que mostram o que cada automação está fazendo."),
        ("lock", "Segurança e governança", "Controle de acesso, registro de operações, ambientes separados e tratamento conforme a LGPD."),
    ]
    cells = "\n".join(f'''      <div class="cell" data-reveal><div class="card-icon">{icon(ic)}</div><h3>{t}</h3><p>{d}</p></div>''' for ic, t, d in tech)
    body = f'''
<main id="main">
{page_hero("Como trabalhamos", "Como trabalhamos", "Do processo manual | à operação automatizada.",
           "Não vendemos uma ferramenta pronta. Entendemos como sua empresa trabalha, desenhamos a automação certa para cada processo e acompanhamos os resultados depois da entrega.")}
<section class="section section--dark">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">Metodologia</p>
      <h2 class="h2">Quatro etapas, com entregas claras em cada uma.</h2>
    </div>
    {steps_html()}
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="eyebrow">Tecnologia</p>
      <h2 class="h2">A combinação certa de tecnologias para cada processo.</h2>
      <p class="lead">Cada processo pede uma combinação diferente de ferramentas. A inteligência artificial entra onde acelera o trabalho e melhora o resultado, ao lado de regras, integrações e robôs de software. Escolhemos a abordagem pelo problema, não pela moda.</p>
    </div>
    <div class="grid grid-3 grid--ruled" data-reveal-group>
{cells}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container split">
    <div data-reveal>
      <p class="eyebrow">Princípios</p>
      <h2 class="h2">O que não negociamos em nenhum projeto.</h2>
    </div>
    <div class="feature-list" data-reveal style="margin-top:0">
      <div class="feature"><div class="feature-icon">{icon("chart")}</div><div><h3>Indicadores antes do código</h3><p>Todo projeto começa com metas mensuráveis: horas recuperadas, taxa de erro, tempo de ciclo ou custo por transação.</p></div></div>
      <div class="feature"><div class="feature-icon">{icon("human")}</div><div><h3>Pessoas no controle</h3><p>A automação executa; as decisões fora do padrão continuam com quem conhece o negócio.</p></div></div>
      <div class="feature"><div class="feature-icon">{icon("log")}</div><div><h3>Transparência total</h3><p>Cada ação é registrada e pode ser auditada. Você sabe exatamente o que foi feito e por quê.</p></div></div>
      <div class="feature"><div class="feature-icon">{icon("check")}</div><div><h3>Entrega em etapas</h3><p>Começamos pelo processo de maior retorno e evoluímos a partir de resultados comprovados.</p></div></div>
    </div>
  </div>
</section>
{CTA}
</main>'''
    return (head("Como trabalhamos | Metodologia e tecnologia de automação | Vello Solutions",
                 "Metodologia da Vello Solutions para otimização de processos: diagnóstico, desenho da solução, implementação e operação, com RPA, integrações, IA como apoio e governança.",
                 "plataforma.html")
            + header("plataforma.html") + body + FOOTER)


def sobre():
    body = f'''
<main id="main">
{page_hero("Sobre", "Sobre a Vello Solutions", "Tecnologia a serviço de | operações mais precisas.",
           "A Vello Solutions nasceu para resolver um problema comum a quase toda empresa: pessoas qualificadas presas a tarefas repetitivas, e erros que custam caro surgindo justamente nessas tarefas.")}
<section class="section">
  <div class="container split">
    <div data-reveal><p class="eyebrow">Posicionamento</p></div>
    <div data-reveal>
      <p class="statement">Otimizamos e automatizamos os processos que sustentam a empresa, para que ela <em>opere com mais precisão, mais velocidade e menos esforço manual.</em></p>
      <p class="lead mt-6">Atuamos principalmente nas áreas financeira e administrativa, onde o volume é alto, as regras são claras e o custo do erro é real. Nosso trabalho vai do diagnóstico à operação: entendemos o processo, desenhamos a automação, integramos aos sistemas existentes e acompanhamos os resultados.</p>
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    <div class="grid grid-3 grid--ruled" data-reveal-group>
      <div class="cell" data-reveal><span class="cell-index">Missão</span><h3>Eliminar o trabalho manual repetitivo das empresas brasileiras.</h3><p>Devolver tempo às equipes e reduzir erros operacionais com automação confiável e acessível.</p></div>
      <div class="cell" data-reveal><span class="cell-index">Visão</span><h3>Ser referência em otimização de processos no Brasil.</h3><p>Reconhecida pela qualidade técnica, pela transparência e pelos resultados mensuráveis que entrega.</p></div>
      <div class="cell" data-reveal><span class="cell-index">Valores</span><h3>Precisão, transparência e responsabilidade.</h3><p>Fazemos o que dissemos que faríamos, medimos o que entregamos e tratamos os dados dos clientes como se fossem nossos.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="container split">
    <div data-reveal>
      <p class="eyebrow">Por que a Vello</p>
      <h2 class="h2">Uma parceira de operação, não apenas um fornecedor de tecnologia.</h2>
    </div>
    <div class="feature-list" data-reveal style="margin-top:0">
      <div class="feature"><div class="feature-icon">{icon("grid")}</div><div><h3>Foco no processo</h3><p>Começamos pelo seu fluxo de trabalho real, não por uma ferramenta pronta que obriga a empresa a se adaptar.</p></div></div>
      <div class="feature"><div class="feature-icon">{icon("chart")}</div><div><h3>Resultado mensurável</h3><p>Cada automação tem indicadores definidos antes de começar e acompanhados depois da entrega.</p></div></div>
      <div class="feature"><div class="feature-icon">{icon("shield")}</div><div><h3>Segurança como requisito</h3><p>Acesso mínimo, registro de operações e conformidade com a LGPD fazem parte de todo projeto.</p></div></div>
      <div class="feature"><div class="feature-icon">{icon("human")}</div><div><h3>Acompanhamento próximo</h3><p>Suporte contínuo e evolução das automações conforme o negócio cresce. Sede em Rio das Ostras/RJ, atendimento em todo o Brasil.</p></div></div>
    </div>
  </div>
</section>
{CTA}
</main>'''
    return (head("Sobre a Vello Solutions | Otimização e automação de processos",
                 "Conheça a Vello Solutions: empresa de otimização e automação de processos para as áreas administrativa, financeira e operacional. Missão, visão, valores e forma de trabalho.",
                 "sobre.html")
            + header("sobre.html") + body + FOOTER)


def contato():
    options = ["Conciliação bancária", "Contas a pagar e a receber", "Processamento de documentos", "Fechamento e relatórios",
               "Rotinas administrativas", "Integração de sistemas", "Ainda não sei, quero um diagnóstico"]
    opts = "\n".join(f'                <option>{o}</option>' for o in options)
    body = f'''
<main id="main">
{page_hero("Contato", "Diagnóstico sem custo", "Converse com um | especialista em automação.",
           "Conte um pouco sobre a sua operação. Retornamos para agendar uma conversa de diagnóstico e entender quais processos podem ser automatizados.")}
<section class="section">
  <div class="container split">
    <aside class="contact-aside" data-reveal>
      <div>
        <p class="eyebrow">Como funciona</p>
        <h2>Do primeiro contato à proposta.</h2>
      </div>
      <ol class="contact-steps">
        <li><div><h3>Você nos conta sobre a operação</h3><p>Preencha o formulário com os processos que mais consomem tempo da equipe.</p></div></li>
        <li><div><h3>Conversa de diagnóstico</h3><p>Um especialista entende volumes, sistemas e pontos de erro, sem compromisso.</p></div></li>
        <li><div><h3>Proposta objetiva</h3><p>Você recebe escopo, prazos e indicadores de sucesso antes de qualquer contratação.</p></div></li>
      </ol>
      <p class="muted" style="font-size:var(--fs-sm)"><a class="link-arrow" data-wa href="#" data-keep-text>Prefere WhatsApp? Fale direto conosco</a></p>
    </aside>

    <div class="form-shell" data-reveal>
      <form id="contact-form" class="form" novalidate>
        <div class="hp-field" aria-hidden="true">
          <label for="hp_check">Não preencha este campo</label>
          <input type="text" id="hp_check" name="hp_check" tabindex="-1" autocomplete="off">
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label" for="f-nome">Nome <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="f-nome" name="nome" type="text" autocomplete="name" required aria-describedby="err-nome">
            <span class="field-error" id="err-nome" aria-live="polite"></span>
          </div>
          <div class="field">
            <label class="field-label" for="f-empresa">Empresa <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="f-empresa" name="empresa" type="text" autocomplete="organization" required aria-describedby="err-empresa">
            <span class="field-error" id="err-empresa" aria-live="polite"></span>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label" for="f-email">E-mail corporativo <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="err-email">
            <span class="field-error" id="err-email" aria-live="polite"></span>
          </div>
          <div class="field">
            <label class="field-label" for="f-telefone">Telefone ou WhatsApp <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="f-telefone" name="telefone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(22) 99999-9999" required aria-describedby="err-telefone">
            <span class="field-error" id="err-telefone" aria-live="polite"></span>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label class="field-label" for="f-cargo">Cargo</label>
            <input class="input" id="f-cargo" name="cargo" type="text" autocomplete="organization-title">
          </div>
          <div class="field">
            <label class="field-label" for="f-interesse">Principal interesse</label>
            <select class="select" id="f-interesse" name="interesse">
              <option value="">Selecione</option>
{opts}
            </select>
          </div>
        </div>
        <div class="field">
          <label class="field-label" for="f-mensagem">Quais processos você gostaria de automatizar?</label>
          <textarea class="textarea" id="f-mensagem" name="mensagem" placeholder="Ex.: conciliamos 6 contas bancárias manualmente todos os dias no Excel."></textarea>
        </div>
        <div>
          <div class="check">
            <input type="checkbox" id="f-consent" name="consent" required aria-describedby="err-consent">
            <label for="f-consent">Concordo com a <a href="politica-de-privacidade.html">Política de Privacidade</a> e autorizo a Vello Solutions a entrar em contato sobre esta solicitação.</label>
          </div>
          <span class="field-error" id="err-consent" aria-live="polite"></span>
        </div>
        <button class="btn btn-primary btn-block" type="submit">Solicitar diagnóstico</button>
        <p class="form-note">Seus dados são usados apenas para responder a esta solicitação.</p>
      </form>

      <div id="form-success" class="form-result" hidden tabindex="-1">
        <div class="form-result-icon">{icon("check").replace('viewBox', 'width="26" height="26" viewBox')}</div>
        <h2>Solicitação recebida.</h2>
        <p>Obrigado. Um especialista da Vello Solutions entrará em contato em breve para agendar o diagnóstico.</p>
      </div>

      <div id="form-fallback" class="form-result" hidden tabindex="-1">
        <div class="form-result-icon form-result-icon--info">{icon("arrow").replace('viewBox', 'width="26" height="26" viewBox')}</div>
        <h2>Falta só um passo.</h2>
        <p>Para concluir, envie sua solicitação pelo canal abaixo. As informações que você preencheu já seguem na mensagem.</p>
        <a class="btn btn-primary" data-fallback-action href="#" hidden>Enviar</a>
      </div>
    </div>
  </div>
</section>
</main>'''
    return (head("Contato | Agende um diagnóstico de automação | Vello Solutions",
                 "Agende um diagnóstico sem custo com a Vello Solutions e descubra quais processos financeiros e administrativos da sua empresa podem ser otimizados e automatizados.",
                 "contato.html")
            + header("contato.html") + body + FOOTER)


def politica():
    body = f'''
<main id="main">
{page_hero("Política de Privacidade", "Privacidade e LGPD", "Política de Privacidade.",
           "Como a Vello Solutions coleta, utiliza e protege os dados pessoais enviados por este site, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).")}
<section class="section">
  <div class="container">
    <div class="prose" data-reveal>
      <p class="muted">Última atualização: novembro de 2026.</p>
      <h2>1. Quem somos</h2>
      <p>A Vello Solutions desenvolve e implementa soluções de otimização e automação de processos para empresas, com sede em Rio das Ostras/RJ. Para os fins desta política, a Vello Solutions é a controladora dos dados pessoais coletados por este site.</p>
      <h2>2. Dados que coletamos</h2>
      <p>Coletamos apenas os dados que você informa voluntariamente no formulário de contato:</p>
      <ul><li>nome, empresa e cargo;</li><li>e-mail corporativo e telefone;</li><li>área de interesse e a descrição que você escrever sobre seus processos.</li></ul>
      <p>Este site não utiliza cookies de publicidade. Caso ferramentas de análise de navegação sejam ativadas, elas só funcionarão após o seu consentimento.</p>
      <h2>3. Finalidade e base legal</h2>
      <p>Os dados são utilizados exclusivamente para responder à sua solicitação, agendar o diagnóstico e apresentar propostas comerciais relacionadas. O tratamento se baseia no seu consentimento (art. 7º, I, da LGPD) e no procedimento preliminar a um possível contrato (art. 7º, V).</p>
      <h2>4. Compartilhamento</h2>
      <p>Não vendemos nem compartilhamos seus dados para fins publicitários. Eles podem ser processados por prestadores de serviço de infraestrutura (como hospedagem e envio de formulários) estritamente para viabilizar o contato, sob obrigações de confidencialidade.</p>
      <h2>5. Armazenamento e segurança</h2>
      <p>Adotamos comunicação criptografada, controle de acesso restrito e boas práticas de segurança da informação. Os dados são mantidos pelo tempo necessário ao atendimento da solicitação ou até que você peça a exclusão.</p>
      <h2>6. Seus direitos</h2>
      <p>Você pode, a qualquer momento, solicitar confirmação da existência de tratamento, acesso, correção, anonimização, portabilidade ou eliminação dos seus dados, além de revogar o consentimento.</p>
      <h2>7. Como exercer seus direitos</h2>
      <p>Envie sua solicitação pela <a href="contato.html">página de contato</a>, informando no campo de mensagem que se trata de um pedido relacionado à LGPD. Responderemos nos prazos previstos em lei.</p>
      <h2>8. Alterações</h2>
      <p>Esta política pode ser atualizada para refletir mudanças legais ou nos nossos serviços. A data da última atualização está sempre indicada no início da página.</p>
    </div>
  </div>
</section>
</main>'''
    return (head("Política de Privacidade | Vello Solutions",
                 "Política de Privacidade da Vello Solutions: como coletamos, usamos e protegemos dados pessoais, conforme a LGPD.",
                 "politica-de-privacidade.html")
            + header("") + body + FOOTER)


PAGES = {
    "index.html": index, "solucoes.html": solucoes, "segmentos.html": segmentos, "plataforma.html": plataforma,
    "sobre.html": sobre, "contato.html": contato, "politica-de-privacidade.html": politica,
}
for name, fn in PAGES.items():
    (OUT / name).write_text(fn(), encoding="utf-8")

(OUT / "assets" / "vello-logo.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' + NEW_MARK_SVG + '</svg>\n', encoding="utf-8")
(OUT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f'  <url><loc>{BASE}{"" if p == "index.html" else p}</loc></url>\n' for p in PAGES)
    + "</urlset>\n", encoding="utf-8")
(OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n", encoding="utf-8")
print("ok", len(PAGES))
