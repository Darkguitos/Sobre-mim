# 🌐 Gabriel Paulino 

Este é um projeto desenvolvido como portfolio pessoal para a disciplina de Frontend Design Engineering, com integração de **3 APIs públicas** para consulta de dados. O projeto foi construído do zero com HTML, CSS e JavaScript puro — sem frameworks ou dependências externas.

---

## 📋 Sobre o Projeto

Landing page pessoal de **Gabriel Paulino de Oliveira**, estudante de Análise e Desenvolvimento de Sistemas na UNIFASIPE (Sinop/MT), com foco em Análise de Dados e Cybersegurança.

A página possui **5 seções navegáveis** por uma barra lateral fixa, cada uma com uma funcionalidade distinta.

---

## 🧭 Navegação

| Seção | Descrição |
|-----------|-----------|
| **Perfil** | Apresentação pessoal com foto, idade, formação e redes sociais (GitHub, LinkedIn, Instagram). |
| **Projetos**| Exibição de outros projetos desenvolvidos e publicados na Vercel. |
| **CNPJ** | Consulta de dados cadastrais de empresas via API pública. |
| **CEP** | Consulta de endereço completo a partir do CEP. |
| **Clima** | Previsão do tempo em tempo real para qualquer cidade do Brasil. |

---

## 🚀 APIs Utilizadas

### ✅ ViaCEP (CEP)
- **Endpoint:** `https://viacep.com.br/ws/{cep}/json/`
- **Documentação:** viacep.com.br
- **Chave necessária:** ❌ Não
- **Limites:** Gratuito e público
- **Retorna:** Logradouro, bairro, cidade, UF, IBGE, DDD

### ✅ Brasil API (CNPJ)
- **Endpoint:** `https://brasilapi.com.br/api/cnpj/v1/{cnpj}`
- **Documentação:** brasilapi.com.br
- **Chave necessária:** ❌ Não
- **Limites:** Gratuito, sem autenticação
- **Retorna:** Razão social, nome fantasia, endereço completo, CNAE, sócios, situação cadastral, data de abertura

### ✅ Open-Meteo (Clima)
- **Endpoint (Geocoding):** `https://geocoding-api.open-meteo.com/v1/search?name={cidade}`
- **Endpoint (Clima):** `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=...`
- **Documentação:** open-meteo.com
- **Chave necessária:** ❌ Não
- **Limites:** 10.000 requisições/dia (uso não comercial)
- **Retorna:** Temperatura, sensação térmica, umidade, vento, precipitação, código do clima com descrição em português

---

## 🛠️ Tecnologias

- **HTML5** — Estrutura semântica
- **CSS3** — Design moderno com variáveis, gradientes, animações e responsividade
- **JavaScript (Vanilla)** — Consumo de APIs com `async/await`, manipulação do DOM e navegação
- **Font Awesome 6** — Ícones para interface e redes sociais
- **Navegação SPA-like** — Troca de seções sem recarregar a página

---

## 🎨 Design

- **Tema escuro** com destaque em roxo (`#8f5cff`) e dourado (`#f2c86b`)
- **Sidebar fixa** com navegação por ícones
- **Animações suaves** de fade-in ao trocar de seção
- **Responsivo** — adapta-se para mobile, com a barra de navegação movida para a parte inferior
- **Cards de vidro (Glassmorphism)** com sombras e bordas arredondadas

---

## ⚠️ Erros e Aprendizados Durante o Desenvolvimento

### 🔴 Problema 1: Consulta de CPF (Brasil API)
**Tentativa:** Usar o endpoint `/api/cpf/v1/{cpf}` da Brasil API.

**Erro:** A API de CPF exige autenticação OAuth2 e não é pública para consultas diretas no front-end. Retornava erro 401/403.

**Solução:** Substituída pela **consulta de CNPJ** (`/api/cnpj/v1/{cnpj}`), que é completamente gratuita, sem autenticação, e retorna dados públicos de pessoas jurídicas.

### 🔴 Problema 2: Segurança da Chave de API
**Tentativa:** Em projetos anteriores, houve a consideração de usar APIs que exigem chaves, como a do Google Gemini.

**Erro:** Colocar uma chave de API diretamente no código JavaScript (`const API_KEY = '...'`) a expõe publicamente. Qualquer pessoa que inspecionar o código fonte no navegador terá acesso à chave, o que pode levar a uso não autorizado, custos inesperados e bloqueio da chave.

**Aprendizado:** Para projetos front-end puros, **é fundamental priorizar APIs que não exigem chave**. Caso seja necessário usar uma API com chave, a prática correta é criar um backend que atue como intermediário (proxy) para fazer a chamada à API de forma segura, ou usar *serverless functions*.

---

## 📁 Estrutura do Projeto

```
/
├── index.html          # Estrutura principal da página
├── styles.css          # Estilos visuais e responsividade
├── script.js           # Lógica de navegação e consumo das APIs
├── avatar.png          # Foto de perfil
└── README.md           # Este arquivo
```

O projeto é modularizado, separando a estrutura (HTML), o estilo (CSS) e a lógica (JavaScript), seguindo as boas práticas de desenvolvimento web.

---

## 🚀 Como Usar

1. **Clone ou baixe** os arquivos do projeto.
2. **Abra o arquivo `index.html`** em qualquer navegador moderno.
3. **Navegue** pelas seções clicando na barra lateral (desktop) ou na barra inferior (mobile).
4. **Teste as APIs:**
   - **CNPJ:** Digite 14 números e clique em "Consultar CNPJ".
   - **CEP:** Digite 8 números e clique em "Buscar endereço".
   - **Clima:** Digite o nome da cidade e UF, e clique em "Buscar clima".

> 💡 **Dica:** A previsão do tempo para a cidade de Sinop/MT já carrega automaticamente ao abrir a página.

---

## 📱 Responsividade

| Tela | Comportamento |
|---------------------|----------------------------------------------------------------|
| **Desktop (>768px)**| Sidebar completa à esquerda com texto e ícones. |
| **Mobile (<768px)** | Sidebar colapsa para uma barra de navegação na parte inferior, contendo apenas ícones. |

---

## 🔗 Redes Sociais

- **GitHub:** github.com/Darkguitos
- **LinkedIn:** linkedin.com/in/darkguitos-undefined-65704223b/
- **Instagram:** instagram.com/darkguitos

---

## 👨‍💻 Autor

**Gabriel Paulino de Oliveira**
- 🎂 20 anos (08/05/2006)
- 📍 Uberlândia, MG → Atualmente em Sinop, MT
- 🎓 ADS - 1º Semestre — UNIFASIPE
- 💼 Foco: Análise de Dados / Cybersegurança