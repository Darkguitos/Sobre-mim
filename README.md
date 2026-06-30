# 🌐 Gabriel Paulino 

Este é um projeto desenvolvido como portfolio pessoal para disciplina de Frontend Design Engenharing, com integração de **3 APIs públicas** para consulta de dados. O projeto foi construído do zero com HTML, CSS e JavaScript puro — sem frameworks ou dependências externas.

---

## 📋 Sobre o Projeto

Landing page pessoal de **Gabriel Paulino de Oliveira**, estudante de Análise e Desenvolvimento de Sistemas na Fasipe (Sinop/MT), com foco em Análise de Dados e Cybersegurança.

A página possui **4 seções navegáveis** por uma barra lateral fixa, cada uma com uma funcionalidade distinta.

---

## 🧭 Navegação

| Seção | Descrição |
|-------|-----------|
| **Perfil** | Apresentação pessoal com foto, idade, formação, redes sociais (GitHub, LinkedIn, Instagram) |
| **CNPJ** | Consulta de dados cadastrais de empresas via API pública |
| **CEP** | Consulta de endereço completo a partir do CEP |
| **Clima** | Previsão do tempo em tempo real para qualquer cidade do Brasil |

---

## 🚀 APIs Utilizadas

### ✅ ViaCEP (CEP)
- **Endpoint:** `https://viacep.com.br/ws/{cep}/json/`
- **Documentação:** [viacep.com.br](https://viacep.com.br)
- **Chave necessária:** ❌ Não
- **Limites:** Gratuito e público
- **Retorna:** Logradouro, bairro, cidade, UF, IBGE, DDD

### ✅ Brasil API (CNPJ)
- **Endpoint:** `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`
- **Documentação:** [brasilapi.com.br](https://brasilapi.com.br)
- **Chave necessária:** ❌ Não
- **Limites:** Gratuito, sem autenticação
- **Retorna:** Razão social, nome fantasia, endereço completo, CNAE, sócios, situação cadastral, data de abertura

### ✅ Open-Meteo (Clima)
- **Endpoint (Geocoding):** `https://geocoding-api.open-meteo.com/v1/search?name={cidade}`
- **Endpoint (Clima):** `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=...`
- **Documentação:** [open-meteo.com](https://open-meteo.com)
- **Chave necessária:** ❌ Não
- **Limites:** 10.000 requisições/dia (uso não comercial)
- **Retorna:** Temperatura, sensação térmica, umidade, vento, precipitação, código do clima com descrição em português

---

## 🛠️ Tecnologias

- **HTML5** — Estrutura semântica
- **CSS3** — Design moderno com gradientes, animações e responsividade
- **JavaScript (Vanilla)** — Consumo de APIs, manipulação do DOM, máscaras de input
- **Font Awesome 6** — Ícones para redes sociais e interface
- **Navegação SPA-like** — Troca de seções sem recarregar a página

---

## 🎨 Design

- **Tema escuro** com destaque em azul ciano (`#00d4ff`) e roxo (`#7b2ff7`)
- **Sidebar fixa** com navegação por ícones
- **Animações suaves** de fade-in ao trocar de seção e ao receber respostas das APIs
- **Responsivo** — adapta-se para mobile (sidebar colapsa para ícones)
- **Cards estilizados** com sombras e bordas arredondadas

---

## ⚠️ Erros e Aprendizados Durante o Desenvolvimento

### 🔴 Problema 1: Consulta de CPF (Brasil API)
**Tentativa:** Usar o endpoint `/api/cpf/v1/{cpf}` da Brasil API

**Erro:** A API de CPF exige autenticação OAuth2 e não é pública. Retornava erro 401/403.

**Solução:** Substituída por **consulta de CNPJ** (`/api/cnpj/v1/{cnpj}`), que é completamente gratuita, sem autenticação, e retorna dados completos de pessoas jurídicas.

---

### 🔴 Problema 2: Chatbot Gemini API
**Tentativa:** Integrar o Google Gemini via API REST com chave fornecida

**Erro:** A chave da API expirou ou foi bloqueada (chave exposta publicamente no código). Além disso, a Gemini API gratuita tem cotas diárias restritas e requer cadastro no Google AI Studio.

**Solução:** Substituída por **API de Clima Open-Meteo**, que:
- Não exige chave alguma
- Não requer cadastro
- Retorna dados reais e úteis (temperatura, umidade, vento)
- Possui geocoding integrado para buscar cidades

---

### 🔴 Problema 3: Segurança da Chave de API
**Tentativa:** Colocar a chave da Gemini diretamente no JavaScript (`const GEMINI_API_KEY = '...'`)

**Erro:** Qualquer pessoa que inspecionar o código fonte terá acesso à chave. Isso pode levar a uso não autorizado e bloqueio.

**Aprendizado:** Para projetos front-end puro, **prefira APIs que não exigem chave**. Caso precise usar APIs com chave, o ideal é criar um backend intermediário (proxy) ou usar serverless functions.

---

## 📁 Estrutura do Projeto

```
/
├── index.html          # Página principal (tudo em um único arquivo)
├── README.md           # Este arquivo
└── avatar.png          # (opcional) Foto de perfil
```

O projeto é **monoarquivo** — toda a estrutura (HTML + CSS + JS) está em um único `index.html`. Basta abrir no navegador.

---

## 🚀 Como Usar

1. **Baixe o arquivo** `index.html`
2. **Abra no navegador** (funciona direto, sem servidor)
3. **Navegue** pelas seções clicando na barra lateral
4. **Teste as APIs:**
   - **CNPJ:** Digite 14 números e clique em "Consultar CNPJ"
   - **CEP:** Digite 8 números e clique em "Buscar Endereço"
   - **Clima:** Digite o nome da cidade e UF, clique em "Buscar Clima"

> 💡 **Dica:** A cidade de Sinop/MT já carrega automaticamente ao abrir a página.

---

## 📱 Responsividade

| Tela | Comportamento |
|------|---------------|
| **Desktop (>768px)** | Sidebar completa com texto e ícones |
| **Mobile (<768px)** | Sidebar colapsada (apenas ícones), conteúdo em coluna única |

---

## 🔗 Redes Sociais

- **GitHub:** [github.com/Darkguitos](https://github.com/Darkguitos)
- **LinkedIn:** [linkedin.com/in/darkguitos](https://www.linkedin.com/in/darkguitos-undefined-65704223b/)
- **Instagram:** [instagram.com/darkguitos](https://www.instagram.com/darkguitos/)

---

## 📄 Licença

Este projeto é open-source e foi desenvolvido para fins educacionais e de apresentação profissional.

---

## 👨‍💻 Autor

**Gabriel Paulino de Oliveira**
- 🎂 20 anos (08/05/2006)
- 📍 Uberlândia, MG → Atualmente em Sinop, MT
- 🎓 ADS - 1º Semestre — Fasipe
- 💼 Foco: Análise de Dados / Cybersegurança
