# gemini.md — Constituição do Projeto Emrys

## 📋 Visão Geral & Escopo
- **Projeto**: Emrys (Landing Page e Plataforma de Inteligência Artificial para PMEs)
- **Repositório**: [gustavoverli32/emyrs2](https://github.com/gustavoverli32/emyrs2)
- **Protocolo**: V.L.A.E.G. (Visão, Link, Arquitetura, Estilo, Gatilho)

---

## 📐 Data Schemas & Payload de Entrega

### Formulário de Contato & Leads (Payload de Entrada)
```json
{
  "nome": "string (obrigatório)",
  "email": "string email (obrigatório)",
  "empresa": "string (obrigatório)",
  "telefone": "string (obrigatório)",
  "mensagem": "string (opcional)",
  "origem": "contato_principal | footer",
  "consent": "boolean (obrigatório)"
}
```

### Métricas de Impacto & Exibição (Payload de Saída)
```json
{
  "clientes_satisfeitos": "120+",
  "reducao_erros": "99%",
  "aumento_conversoes": "140%",
  "operacoes_otimizadas": "310+"
}
```

---

## 🏛️ Invariantes Arquiteturais & Regras Comportamentais
1. **Identidade Visual**: Tema escuro moderno (`#000000` / `#0A0A0A`), tipografia Satoshi + Instrument Serif, acentos em laranja/dourado (`#FFA260`) e brilhos em azul frio (`#398FFF`).
2. **Animações e Transições**: GSAP 3 + ScrollTrigger para revelação de seções, levitação em loop do Hero, botão magnético no hover e cards com glow.
3. **LGPD & Segurança**: Formatações com suporte a consentimento de cookies, campos honeypot anti-bot e validações rigorosas de entradas.
4. **Deploy**: Sincronização contínua com a branch `main` no GitHub.
