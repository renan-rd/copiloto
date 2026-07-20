# Roteiro de entrevista — Listagem e Perfil de Contatos

**Produto:** Base de contatos (listagem + perfil)  
**Duração estimada:** 45–60 minutos  
**Formato:** Teste moderado com tarefas + perguntas de percepção  
**Participantes:** usuários que gerenciam contatos no dia a dia (vendas, CS, marketing, operação)

---

## Objetivos da sessão

- Entender a **primeira impressão** da listagem e do perfil
- Validar se usuários conseguem executar o **fluxo principal**: criar → localizar → visualizar → editar → alterar base legal → excluir
- Identificar **pontos de fricção** em busca, filtros, seleção em lote e navegação entre listagem e perfil
- Comparar os **dois caminhos de visualização** (painel lateral vs. perfil completo)
- Coletar expectativas sobre funcionalidades adjacentes (importação, exportação, negociações, abas do perfil)

---

## Preparação (antes da sessão)

### Ambiente

- [ ] Protótipo ou ambiente de teste acessível
- [ ] Dados de teste pré-carregados (contatos com empresa, tags, negociações, bases legais variadas)
- [ ] Gravação de tela configurada (com consentimento do participante)
- [ ] Moderador + observador (ou moderador que anota em planilha)

### Materiais

- [ ] Planilha de notas (participante, tarefa, sucesso/falha, tempo, citações)
- [ ] Consentimento para gravação
- [ ] Este roteiro impresso ou em segunda tela

### Regras para o moderador

- Peça para o participante **pensar em voz alta**
- **Não corrija** nem dê dicas durante as tarefas
- Use frases neutras: *"O que você faria agora?"*, *"O que você esperava que acontecesse?"*
- Anote hesitações, cliques errados e comentários espontâneos
- Só esclareça dúvidas sobre o **contexto do teste**, não sobre a interface

---

## Script do moderador

### 1. Introdução (3–5 min)

> Olá! Obrigado por participar. Hoje vamos testar uma versão da tela de contatos de um CRM. Não é um teste sobre você — estamos testando a interface. Não existem respostas certas ou erradas.
>
> Vou pedir algumas tarefas simples. Quanto mais você comentar o que está pensando enquanto usa, melhor para nós. Se algo não funcionar ou não fizer sentido, é exatamente isso que queremos saber.
>
> Posso gravar a tela para revisão depois? [aguardar consentimento]

**Perguntas de contexto:**

1. Qual é o seu papel hoje e com que frequência você lida com contatos de clientes ou leads?
2. Como você faz isso hoje? (planilha, CRM, outro sistema)

---

### 2. Primeira impressão — Listagem (5 min)

**Tarefa:** Mostrar a tela de listagem sem explicar nada.

**Perguntas:**

1. Olhando essa tela pela primeira vez, **o que você acha que consegue fazer aqui?**
2. O que chama mais atenção?
3. Tem algo que você **esperava ver** e não viu?
4. *(Observar espontaneamente)* O participante comenta o badge de importação, botões "Importar" / "Adicionar contato", abas, busca ou filtros?

**Critérios de observação:**

| O que observar | Anotar |
|---|---|
| Entende que é uma base/lista de contatos | Sim / Parcial / Não |
| Identifica ação de adicionar contato | Sim / Não |
| Percebe busca e filtros | Sim / Não |
| Comenta importação ou status de importação | Citação |

---

### 3. Adicionar contato (5 min)

**Tarefa:**

> Imagine que você acabou de conhecer um novo contato em um evento. **Adicione esse contato** com nome, e-mail e telefone.

**Dados sugeridos para o participante usar:**

- Nome: `Maria Teste [sobrenome do participante]`
- E-mail: `maria.teste.[participante]@exemplo.com`
- Telefone: `(11) 99999-0000`

**Critérios de sucesso:**

- [ ] Encontrou o botão "Adicionar contato" sem ajuda
- [ ] Preencheu os campos principais
- [ ] Salvou com sucesso
- [ ] Percebeu feedback de confirmação (toast, atualização da lista, etc.)

**Observar:**

- Hesita em campos opcionais vs. obrigatórios?
- Entende labels e placeholders?
- Tenta preencher base legal, tags, empresa ou outros campos?
- Cancela ou erra e consegue se recuperar?

**Pergunta pós-tarefa:**

> Como foi essa experiência? Faltou algum campo que você costuma preencher?

---

### 4. Localizar o contato criado (3–5 min)

**Tarefa:**

> Agora **encontre o contato que você acabou de criar** na listagem.

**Importante:** Não sugira busca, filtro ou scroll. Deixe o participante escolher o caminho.

**Critérios de sucesso:**

- [ ] Localizou o contato em tempo razoável (< 1 min)
- [ ] Usou busca, filtro, paginação ou scroll (anotar qual)

**Observar:**

- Usa a busca global?
- Usa filtro rápido ("Adicionados hoje")?
- Abre filtros avançados?
- Fica perdido com paginação ou volume de dados?

**Pergunta pós-tarefa:**

> Se você tivesse milhares de contatos, como faria para achar alguém específico?

---

### 5. Visualizar detalhes do contato (5 min)

**Tarefa:**

> Você quer **conferir os dados** desse contato. Mostre como faria.

**Importante:** Não indique se deve clicar no nome, no ícone ou em outro lugar.

**Dois caminhos possíveis na interface:**

| Caminho | Ação |
|---|---|
| Painel lateral | Botão "Ver detalhes" (ícone) na linha |
| Perfil completo | Clique no nome do contato |

**Critérios de observação:**

| O que observar | Anotar |
|---|---|
| Caminho escolhido | Painel / Perfil / Outro |
| Entende diferença entre os dois | Sim / Não / N/A |
| Consegue fechar/voltar | Sim / Não |
| Satisfação com a quantidade de informação | Alta / Média / Baixa |

**Pergunta pós-tarefa:**

> Esse jeito de ver os detalhes atende o que você precisaria no dia a dia? Por quê?

---

### 6. Editar um campo do contato (5 min)

**Tarefa:**

> O telefone desse contato está errado. **Corrija o telefone** para `(11) 98888-7777`.

**Observar:**

- Edita no painel lateral, no perfil completo ou no drawer de edição?
- Encontra o ícone de lápis / botão "Editar dados do contato"?
- Salva e percebe que a alteração foi aplicada?
- A alteração aparece na listagem após salvar?

**Pergunta pós-tarefa:**

> Onde você preferiria editar dados de contato: na listagem ou no perfil? Por quê?

---

### 7. Alterar a base legal (individual) (5 min)

**Tarefa:**

> Por questões de privacidade, você precisa **alterar a base legal** desse contato. Faça essa alteração.

**Critérios de sucesso:**

- [ ] Encontrou onde alterar base legal (listagem, perfil ou drawer)
- [ ] Entendeu as opções disponíveis
- [ ] Salvou a alteração

**Observar:**

- Compreende o conceito de "base legal"?
- Hesita diante das opções?
- Busca ajuda ou documentação?

**Pergunta pós-tarefa:**

> Ficou claro o que cada base legal significa? O que melhoraria?

---

### 8. Busca e filtros *(opcional — se houver tempo)* (5 min)

**Tarefa A:**

> Encontre **todos os contatos adicionados hoje** (ou nesta semana).

**Tarefa B:**

> Encontre contatos de uma **cidade ou empresa específica** que exista nos dados de teste.

**Observar:**

- Descobre filtro rápido vs. filtros avançados?
- Percebe badge de filtros ativos?
- Sabe limpar filtros?
- Usa ou descobre filtros salvos?

---

### 9. Personalizar a listagem *(opcional)* (3 min)

**Tarefa:**

> Deixe essa tabela **do jeito que você usaria no dia a dia** — mostre só o que importa para você.

**Observar:**

- Descobre "Editar colunas"?
- Muda quantidade por página (10/25/50)?
- Tenta ordenar colunas?

---

### 10. Ações em lote — base legal, exportar e excluir (10 min)

#### 10.1 Seleção múltipla

**Tarefa:**

> Selecione **3 contatos** na listagem (pode incluir o que você criou).

**Observar:**

- Usa checkbox individual ou "selecionar todos"?
- Percebe a barra de ações em lote?
- Entende o contador "X selecionado(s)"?

#### 10.2 Editar base legal em lote *(escolher uma)*

**Tarefa:**

> Altere a **base legal dos 3 contatos selecionados** de uma vez.

**OU**

#### 10.3 Exportar em lote

**Tarefa:**

> **Exporte** os 3 contatos selecionados.

#### 10.4 Excluir em lote

**Tarefa:**

> Agora **exclua os 3 contatos selecionados**.

**Observar no modal de exclusão:**

- Lê o aviso antes de confirmar?
- Entende a necessidade de marcar o checkbox de confirmação?
- Hesita ou cancela?
- Diferencia tipos de exclusão (se aplicável)?

**Pergunta pós-tarefa:**

> Você se sentiu seguro para excluir? O que te deixaria mais confortável?

---

### 11. Perfil completo (10 min)

**Tarefa de abertura:**

> Abra o **perfil completo** de um contato (qualquer um com dados mais completos).

#### 11.1 Navegação e estrutura

**Perguntas enquanto explora:**

1. O que você entende que consegue fazer nesta tela?
2. Onde você **editaria a empresa** desse contato?
3. Onde você **editaria as tags**?
4. Onde veria o **histórico de interações** ou atividades?

**Observar:**

- Explora acordeões da coluna esquerda (Dados, Informações, Empresa, Tags, Campos personalizados, Privacidade)?
- Navega pelas abas (Visão geral, Atividades, Pré-vendas, Negociações, Atendimentos)?
- Encontra o botão "Voltar" para a listagem?

#### 11.2 Edição no perfil

**Tarefa:**

> Altere o **cargo** desse contato para `Gerente Comercial`.

**Observar:**

- Usa edição inline (ícone de lápis)?
- Entende feedback visual de edição/salvamento?

#### 11.3 Menu "Mais opções"

**Tarefa:**

> Esse contato virou um lead quente. **O que você faria a partir daqui?**

**Observar:**

- Descobre o menu "Mais opções" (⋯)?
- Menciona criar negociação, iniciar atendimento ou mover funil?
- Tenta excluir contato a partir do perfil?

#### 11.4 Voltar para a listagem

**Tarefa:**

> Volte para a **lista de contatos**.

**Observar:**

- Usa botão voltar, breadcrumb ou navegação do browser?
- Mantém contexto (filtros, busca, página)?

---

### 12. Validação e cancelamento *(opcional)* (3 min)

**Tarefa A — Erro de validação:**

> Tente **adicionar um contato sem e-mail** (ou sem campo obrigatório).

**Observar:** mensagem de erro é clara? sabe o que corrigir?

**Tarefa B — Cancelamento:**

> Comece a editar um contato e **cancele** no meio. O que você espera que aconteça?

---

### 13. Encerramento (5 min)

**Perguntas finais:**

1. De tudo que você viu, **o que foi mais fácil**?
2. **O que mais te travou** ou gerou dúvida?
3. Se pudesse **mudar uma coisa**, qual seria?
4. De 1 a 7, o quanto você se sentiria **confiante usando isso no dia a dia**? Por quê?
5. Tem algo que você **esperava encontrar** e não viu?

> Muito obrigado! Suas observações vão ajudar muito a melhorar a experiência.

---

## Checklist de tópicos cobertos

### Must have (prioridade alta)

- [ ] Percepção da listagem
- [ ] Adicionar contato
- [ ] Localizar contato criado
- [ ] Visualizar detalhes (painel vs. perfil)
- [ ] Editar campo
- [ ] Alterar base legal (individual)
- [ ] Selecionar 3 contatos
- [ ] Excluir 3 contatos em lote

### Nice to have (se houver tempo)

- [ ] Busca e filtros (rápido + avançado)
- [ ] Editar base legal em lote
- [ ] Exportar selecionados
- [ ] Editar colunas / paginação
- [ ] Abas e seções do perfil
- [ ] Menu "Mais opções" no perfil
- [ ] Validação e cancelamento
- [ ] Percepção de importação / visualizações

---

## Planilha de registro (modelo)

| # | Tarefa | Sucesso | Tempo | Caminho usado | Dificuldade (1–5) | Citações / notas |
|---|---|---|---|---|---|---|
| 1 | Primeira impressão | — | | | | |
| 2 | Adicionar contato | ☐ | | | | |
| 3 | Localizar contato | ☐ | | Busca / Filtro / Scroll | | |
| 4 | Ver detalhes | ☐ | | Painel / Perfil | | |
| 5 | Editar campo | ☐ | | | | |
| 6 | Base legal (1) | ☐ | | | | |
| 7 | Selecionar 3 | ☐ | | | | |
| 8 | Excluir 3 | ☐ | | | | |
| 9 | Perfil — explorar | ☐ | | | | |
| 10 | Voltar p/ listagem | ☐ | | | | |

**Escala de dificuldade:** 1 = muito fácil · 5 = não conseguiu sem ajuda

---

## Versão curta (30 min)

Se o tempo for limitado, use apenas:

1. Introdução + contexto (3 min)
2. Primeira impressão (3 min)
3. Adicionar contato (5 min)
4. Localizar contato (3 min)
5. Ver detalhes — observar caminho (5 min)
6. Editar campo (5 min)
7. Alterar base legal (3 min)
8. Excluir 3 contatos (5 min)
9. Encerramento (3 min)

---

## Notas para síntese pós-sessões

Após 5+ sessões, agrupar achados em:

- **Problemas de descoberta** — usuário não encontra a funcionalidade
- **Problemas de compreensão** — encontra, mas não entende o que faz
- **Problemas de fluxo** — entende, mas o caminho é longo ou confuso
- **Problemas de confiança** — especialmente em exclusão e base legal
- **Divergência de caminhos** — painel lateral vs. perfil completo

Priorizar correções pelo impacto: quantos usuários afetados × frequência da tarefa no dia a dia.
