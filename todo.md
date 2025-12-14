# Plagiarism Detector AI - TODO List

## Backend & Database
- [x] Criar schema completo do banco de dados (users, documents, analyses, plagiarism_sources)
- [x] Implementar sistema de upload de arquivos (PDF, DOCX, TXT, PPT)
- [x] Desenvolver extração de texto de múltiplos formatos
- [x] Implementar algoritmos de detecção de plágio (similaridade textual)
- [x] Integrar detecção de conteúdo gerado por IA com LLM
- [x] Criar sistema de comparação com base de dados própria
- [x] Implementar busca e comparação com fontes da internet
- [x] Desenvolver processamento assíncrono de análises
- [x] Criar API tRPC para todas as funcionalidades

## Frontend & Dashboard
- [x] Criar página de upload de documentos com drag-and-drop
- [x] Desenvolver dashboard premium com design profissional
- [x] Implementar visualização de métricas em tempo real
- [x] Criar gráficos interativos (% plágio, % IA, score de confiança)
- [x] Desenvolver visualização de fontes encontradas
- [x] Implementar destacamento de trechos suspeitos no texto
- [ ] Criar sistema de exportação de relatórios
- [x] Desenvolver página de histórico de análises
- [x] Implementar sistema de autenticação com JWT

## Integração & Storage
- [x] Configurar armazenamento S3 para documentos
- [x] Implementar metadata de documentos no PostgreSQL
- [x] Criar sistema de cache para análises
- [x] Desenvolver API para processamento em background

## Testes & Qualidade
- [x] Escrever testes unitários para detecção de plágio
- [x] Criar testes para detecção de IA
- [x] Testar upload de múltiplos formatos
- [x] Validar dashboard e métricas

## Documentação
- [ ] Criar documentação técnica completa
- [ ] Gerar PDF explicativo do sistema
- [ ] Documentar APIs e endpoints
