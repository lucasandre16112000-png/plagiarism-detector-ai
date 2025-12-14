# 🔍 Plagiarism Detector AI

**Advanced Plagiarism and AI Content Detection System**

Desenvolvido por **Lucas Andre S**

---

## 📋 Sobre o Projeto

O **Plagiarism Detector AI** é uma plataforma completa e profissional para detecção de plágio e conteúdo gerado por inteligência artificial. Utilizando algoritmos avançados de análise textual e integração com modelos de linguagem de grande escala (LLM), o sistema oferece análises precisas e confiáveis para garantir a integridade acadêmica e profissional de documentos.

### ✨ Principais Funcionalidades

- **Detecção Avançada de Plágio**: Múltiplos algoritmos de similaridade textual (Jaccard, Cosine, N-grams, Semantic)
- **Detecção de Conteúdo Gerado por IA**: Análise com LLM para identificar textos criados por IA com alta precisão
- **Suporte a Múltiplos Formatos**: PDF, DOCX, TXT, PPT/PPTX
- **Dashboard Premium**: Interface moderna e intuitiva com métricas em tempo real
- **Análise de Fontes**: Identificação e rastreamento de fontes de plágio com scores de similaridade
- **Segmentação de IA**: Detecção de trechos específicos gerados por IA com probabilidades
- **Armazenamento Seguro**: Integração com AWS S3 para armazenamento de documentos
- **Autenticação JWT**: Sistema de autenticação seguro com OAuth2

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com TypeScript
- **Express.js** para servidor HTTP
- **tRPC** para comunicação type-safe
- **Drizzle ORM** para acesso ao banco de dados
- **PostgreSQL/MySQL** como banco de dados
- **AWS S3** para armazenamento de arquivos

### Frontend
- **React 19** com TypeScript
- **TailwindCSS 4** para estilização
- **shadcn/ui** para componentes de interface
- **Wouter** para roteamento
- **TanStack Query** para gerenciamento de estado

### Inteligência Artificial
- Integração com **LLM** para detecção de IA
- Algoritmos proprietários de similaridade textual
- Análise de padrões linguísticos e perplexidade

---

## 📊 Arquitetura do Sistema

O sistema é dividido em módulos especializados:

### 1. Módulo de Extração de Texto
Extrai texto de múltiplos formatos de arquivo utilizando:
- `pdftotext` para PDFs
- `python-docx` para DOCX
- `python-pptx` para PPT/PPTX
- Leitura direta para TXT

### 2. Módulo de Detecção de Plágio
Implementa 4 algoritmos de similaridade:
- **Jaccard Similarity**: Baseado em conjuntos de palavras
- **Cosine Similarity**: Vetores de frequência de palavras
- **N-gram Similarity**: Sequências de palavras consecutivas
- **Semantic Similarity**: Análise semântica com LLM

### 3. Módulo de Detecção de IA
Combina 3 métodos de detecção:
- Análise de padrões textuais
- Análise de perplexidade e burstiness
- Detecção com LLM (peso 60%)

---

## 🎯 Como Funciona

1. **Upload**: Usuário faz upload do documento (PDF, DOCX, TXT, PPT)
2. **Extração**: Sistema extrai o texto do arquivo automaticamente
3. **Análise de Plágio**: Execução de múltiplos algoritmos de similaridade
4. **Análise de IA**: Detecção de conteúdo gerado por inteligência artificial
5. **Resultados**: Apresentação de métricas detalhadas com:
   - Percentual de plágio detectado
   - Percentual de conteúdo gerado por IA
   - Score de confiança da análise
   - Fontes encontradas com links
   - Segmentos suspeitos destacados

---

## 📈 Métricas e Interpretação

### Plágio
- **< 15%**: Aceitável (verde)
- **15-40%**: Atenção necessária (amarelo)
- **> 40%**: Crítico (vermelho)

### Conteúdo IA
- **< 20%**: Aceitável (verde)
- **20-50%**: Atenção necessária (amarelo)
- **> 50%**: Crítico (vermelho)

### Score de Confiança
- **> 90%**: Alta confiabilidade
- **70-90%**: Confiabilidade moderada
- **< 70%**: Baixa confiabilidade

---

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 22+
- PostgreSQL/MySQL/TiDB
- Python 3.11+ (para extração de texto)
- AWS S3 ou compatível

### Instalação

```bash
# Clone o repositório
git clone https://github.com/lucasandre16112000-png/plagiarism-detector-ai.git

# Entre no diretório
cd plagiarism-detector-ai

# Instale as dependências
pnpm install

# Instale dependências Python
sudo pip3 install python-docx python-pptx

# Configure as variáveis de ambiente
# (DATABASE_URL, JWT_SECRET, etc.)

# Execute as migrações do banco
pnpm db:push

# Inicie o servidor de desenvolvimento
pnpm dev
```

### Comandos Disponíveis

```bash
pnpm dev      # Inicia servidor de desenvolvimento
pnpm build    # Compila para produção
pnpm start    # Inicia servidor de produção
pnpm test     # Executa testes unitários
pnpm db:push  # Aplica migrações do banco de dados
```

---

## 🎨 Interface do Usuário

### Landing Page
- Hero section com gradiente moderno
- Grid de features destacando funcionalidades
- Seção "Como Funciona" com 3 etapas
- Call-to-action para registro

### Dashboard
- Cards de estatísticas (documentos, análises, médias)
- Botão de ação rápida para upload
- Lista de análises recentes com métricas
- Design responsivo e profissional

### Upload
- Interface drag-and-drop intuitiva
- Validação de tipo e tamanho de arquivo
- Preview de arquivo selecionado
- Suporte para múltiplos formatos

### Análise
- Métricas principais com progress bars
- Tabs para fontes de plágio e segmentos de IA
- Badges de severidade coloridos
- Links para fontes externas

---

## 🔒 Segurança

- **Autenticação OAuth2** com Manus
- **JWT** para gerenciamento de sessões
- **Cookies HTTP-only** e secure
- **Arquivos criptografados** no S3
- **Validação de inputs** e sanitização
- **Acesso restrito** por usuário

---

## 📊 Banco de Dados

### Tabelas Principais

- **users**: Informações dos usuários
- **documents**: Metadados dos documentos
- **analyses**: Resultados das análises
- **plagiarism_sources**: Fontes de plágio identificadas
- **ai_detection_results**: Resultados da detecção de IA

---

## 🧪 Testes

O sistema inclui testes unitários completos:

```bash
pnpm test
```

Cobertura de testes:
- Autenticação e logout
- Operações de documentos
- Criação e listagem de análises
- Estatísticas do dashboard

---

## 📚 Documentação

A documentação técnica completa está disponível em:
- **DOCUMENTATION.md**: Documentação em Markdown
- **Plagiarism_Detector_AI_Documentation.pdf**: Documentação em PDF

---

## 🚀 Roadmap Futuro

### Funcionalidades Planejadas
- ✅ Detecção de plágio com múltiplos algoritmos
- ✅ Detecção de conteúdo gerado por IA
- ✅ Dashboard premium interativo
- ⏳ Exportação de relatórios em PDF
- ⏳ Integração com APIs acadêmicas (Google Scholar)
- ⏳ Suporte para mais formatos (ODT, RTF, HTML)
- ⏳ Análise de imagens e gráficos
- ⏳ API pública para integração
- ⏳ Comparação entre múltiplos documentos

---

## 👨‍💻 Desenvolvedor

**Lucas Andre S**

Desenvolvedor Full Stack especializado em:
- TypeScript, React, Node.js
- Python, Machine Learning
- PostgreSQL, AWS
- Sistemas de IA e detecção de plágio

---

## 📄 Licença

Este projeto é proprietário e foi desenvolvido por Lucas Andre S.

---

## 🤝 Contribuições

Este é um projeto de portfólio profissional. Para sugestões ou feedback, entre em contato através do GitHub.

---

## 📞 Contato

- **GitHub**: [@lucasandre16112000-png](https://github.com/lucasandre16112000-png)
- **Portfolio**: Plagiarism Detector AI

---

**⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!**

---

*Desenvolvido com ❤️ por Lucas Andre S*
*Última atualização: Dezembro 2024*
