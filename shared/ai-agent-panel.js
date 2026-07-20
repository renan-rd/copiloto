/**
 * Painel de chat do Agente de IA (navbar → 1º ícone RD Station).
 * Injeta UI + estilos e funciona como side panel (padrão Gemini/Cursor).
 */
(function () {
  const PANEL_ID = 'ai-agent-panel';
  const TRIGGER_ATTR = 'data-ai-agent-trigger';
  const SCRIPT_URL = document.currentScript?.src || window.location.href;
  const ICON_BASE = new URL('../img/svg/', SCRIPT_URL).href;
  const CONNECTOR_ICON_BASE = new URL('../img/conectores/', SCRIPT_URL).href;
  const CONNECTORS_STORAGE_KEY = 'ai-agent-active-connectors';

  const SUGGESTIONS = [
    'Como adicionar um novo contato?',
    'Resuma os contatos desta lista',
    'Quais filtros posso usar?',
    'Ajude-me a editar um contato',
  ];

  const MOCK_REPLIES = [
    'Posso ajudar com contatos, filtros e navegação neste CRM. O que você precisa?',
    'Para adicionar um contato, use o botão **Adicionar contato** no canto superior direito da listagem.',
    'Você pode filtrar por nome, e-mail, empresa, cidade e outros campos no painel de filtros.',
    'Se quiser ver o detalhe de um contato, clique no nome na tabela — o painel lateral abre automaticamente.',
    'Entendi. Me diga um pouco mais sobre o que você quer fazer e eu te oriento no próximo passo.',
  ];

  const CONNECTOR_CATALOG = [
    { id: 'gdrive', name: 'Google Drive', description: 'Pesquise arquivos e documentos no Drive', icon: 'gdrive.svg', category: 'verified' },
    { id: 'rd-marketing', name: 'RD Marketing', description: 'Realize análises sobre sua operação de marketing.', icon: 'rd-symbol.svg', category: 'rd' },
    { id: 'rd-vendas', name: 'RD Vendas', description: 'Analisar e gerenciar cadastros, negociações, vendas, funções e tarefas.', icon: 'rd-symbol.svg', category: 'rd' },
    { id: 'rd-conversas', name: 'RD Conversas', description: 'Análise de dados sobre eficiência operacional, filas e satisfação.', icon: 'rd-symbol.svg', category: 'rd' },
    { id: 'gmail', name: 'Gmail', description: 'Serviço de e-mail gratuito do Google', icon: 'logo-gmail.png', category: 'verified' },
    { id: 'supabase', name: 'Supabase', description: 'Backend como Serviço de código aberto, alternativa ao Firebase', icon: 'logo-supabase.png', category: 'verified' },
    { id: 'stripe', name: 'Stripe', description: 'Infraestrutura financeira para pagamentos online', icon: 'logo-stripe.png', category: 'verified' },
    { id: 'slack', name: 'Slack', description: 'Plataforma de comunicação e colaboração corporativa', icon: 'logo-slack.png', category: 'verified' },
    { id: 'datadog', name: 'Datadog', description: 'Monitoramento e observabilidade para infraestrutura e apps', icon: 'logo-datadog.png', category: 'verified' },
    { id: 'atlassian', name: 'Atlassian', description: 'Ferramentas de colaboração e gestão de projetos', icon: 'logo-atlassian.png', category: 'verified' },
    { id: 'clickup', name: 'ClickUp', description: 'Plataforma tudo-em-um de produtividade e projetos', icon: 'logo-clickup.png', category: 'verified' },
  ];

  const DEFAULT_ACTIVE_CONNECTORS = ['gdrive', 'rd-marketing', 'rd-vendas', 'rd-conversas', 'gmail'];
  const KNOWLEDGE_STORAGE_KEY = 'ai-agent-knowledge-bases';
  const DEFAULT_KNOWLEDGE_BASES = [
    { id: 'docs-comercial', name: 'Documentação comercial', description: 'Playbooks e materiais de vendas' },
    { id: 'central-ajuda', name: 'Central de ajuda', description: 'Artigos e dúvidas frequentes' },
  ];
  const KB_SOURCES = [
    { id: 'file', label: 'Carregar arquivo', icon: 'paperclip.svg' },
    { id: 'qa', label: 'Adicionar perguntas e respostas', icon: 'question.svg' },
    { id: 'site', label: 'Adicionar site e blog', icon: 'desktop.svg' },
    { id: 'pages', label: 'Páginas individuais', icon: 'page.svg' },
    { id: 'youtube', label: 'YouTube', icon: 'youtube.svg' },
    { id: 'audio', label: 'Áudios', icon: 'microphone.svg', soon: true },
  ];
  const DEFAULT_INPUT_PLACEHOLDER = 'Pergunte ao Copiloto...';
  const CREATE_MODES = {
    habilidade: {
      id: 'habilidade',
      tag: 'Nova Habilidade',
      placeholder: 'Me diga qual habilidade deseja criar...',
    },
    agente: {
      id: 'agente',
      tag: 'Novo Agente',
      placeholder: 'Me diga qual agente deseja criar...',
    },
  };

  function loadActiveConnectorIds() {
    try {
      const raw = localStorage.getItem(CONNECTORS_STORAGE_KEY);
      if (!raw) return [...DEFAULT_ACTIVE_CONNECTORS];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...DEFAULT_ACTIVE_CONNECTORS];
    } catch {
      return [...DEFAULT_ACTIVE_CONNECTORS];
    }
  }

  function saveActiveConnectorIds(ids) {
    try {
      localStorage.setItem(CONNECTORS_STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore quota / private mode */
    }
  }

  function getConnectorById(id) {
    return CONNECTOR_CATALOG.find((item) => item.id === id);
  }

  function connectorIconUrl(icon) {
    return `${CONNECTOR_ICON_BASE}${icon}`;
  }

  function loadKnowledgeBases() {
    try {
      const raw = localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
      if (!raw) return DEFAULT_KNOWLEDGE_BASES.map((item) => ({ ...item }));
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length
        ? parsed
        : DEFAULT_KNOWLEDGE_BASES.map((item) => ({ ...item }));
    } catch {
      return DEFAULT_KNOWLEDGE_BASES.map((item) => ({ ...item }));
    }
  }

  function saveKnowledgeBases(items) {
    try {
      localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatText(str) {
    return esc(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function injectStyles() {
    if (document.getElementById('ai-agent-panel-styles')) return;
    const style = document.createElement('style');
    style.id = 'ai-agent-panel-styles';
    style.textContent = `
      .navbar-icon-btn[${TRIGGER_ATTR}] {
        border: none;
        background: transparent;
        padding: 0;
        color: inherit;
      }
      .navbar-icon-btn[${TRIGGER_ATTR}].is-active {
        background: rgba(255,255,255,0.12);
      }
      .navbar-icon-btn[${TRIGGER_ATTR}].is-active:hover {
        background: rgba(255,255,255,0.16);
      }

      .ai-agent-overlay {
        position: fixed;
        inset: 64px 0 0 0;
        background: rgba(0,34,51,0.24);
        z-index: 9400;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .ai-agent-overlay.open {
        opacity: 1;
        pointer-events: all;
      }

      .ai-agent-panel {
        position: fixed;
        top: 64px;
        right: 0;
        bottom: 0;
        width: min(420px, 100vw);
        background: var(--color-surface, #fff);
        border-left: 1px solid var(--color-border, #d6dbde);
        box-shadow: -8px 0 24px rgba(0,34,51,0.12);
        z-index: 9500;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.25s ease;
        font-family: var(--font, 'DM Sans', sans-serif);
      }
      .ai-agent-panel.open {
        transform: translateX(0);
      }

      .ai-agent-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-border, #d6dbde);
        flex-shrink: 0;
        background: var(--color-surface, #fff);
      }
      .ai-agent-header-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #001927;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .ai-agent-header-icon svg {
        width: 24px;
        height: 24px;
      }
      .ai-agent-header-text {
        flex: 1;
        min-width: 0;
      }
      .ai-agent-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--color-text-high, #002233);
        letter-spacing: -0.16px;
        line-height: 1.3;
      }
      .ai-agent-subtitle {
        font-size: 12px;
        color: var(--color-text-low, #405466);
        line-height: 1.3;
        margin-top: 2px;
      }
      .ai-agent-close {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: none;
        cursor: pointer;
        border-radius: 12px;
        flex-shrink: 0;
        color: var(--color-text-high, #002233);
      }
      .ai-agent-close:hover {
        background: var(--color-surface-low, #eceeef);
      }
      .ai-agent-close svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }

      .ai-agent-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        background: var(--color-surface-low, #eceeef);
        min-height: 0;
      }

      .ai-agent-empty {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        margin: auto 0;
        padding: 8px 0;
      }
      .ai-agent-empty-hero {
        text-align: center;
        padding: 8px 12px 4px;
      }
      .ai-agent-empty-hero h3 {
        font-size: 18px;
        font-weight: 700;
        color: var(--color-text-high, #002233);
        letter-spacing: -0.18px;
        margin-bottom: 8px;
      }
      .ai-agent-empty-hero p {
        font-size: 14px;
        color: var(--color-text-low, #405466);
        line-height: 1.45;
      }

      .ai-agent-suggestions {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .ai-agent-suggestion {
        text-align: left;
        border: 1px solid var(--color-border, #d6dbde);
        background: var(--color-surface, #fff);
        color: var(--color-text-high, #002233);
        border-radius: 12px;
        padding: 12px 14px;
        font-size: 13px;
        font-family: inherit;
        font-weight: 500;
        cursor: pointer;
        line-height: 1.4;
        transition: border-color 0.15s, background 0.15s;
      }
      .ai-agent-suggestion:hover {
        border-color: var(--color-primary-border, #00dbff);
        background: var(--color-primary-surface-low, #b2f4ff);
      }

      .ai-agent-msg {
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-width: 92%;
      }
      .ai-agent-msg--user {
        align-self: flex-end;
      }
      .ai-agent-msg--agent {
        align-self: flex-start;
      }
      .ai-agent-msg-bubble {
        padding: 12px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.45;
        color: var(--color-text-high, #002233);
        white-space: pre-wrap;
        word-break: break-word;
      }
      .ai-agent-msg--user .ai-agent-msg-bubble {
        background: #001927;
        color: #fff;
        border-bottom-right-radius: 4px;
      }
      .ai-agent-msg--agent .ai-agent-msg-bubble {
        background: var(--color-surface, #fff);
        border: 1px solid var(--color-border, #d6dbde);
        border-bottom-left-radius: 4px;
      }
      .ai-agent-msg-meta {
        font-size: 11px;
        color: var(--color-text-disabled, #7f8d99);
        padding: 0 4px;
      }
      .ai-agent-msg--user .ai-agent-msg-meta {
        text-align: right;
      }

      .ai-agent-typing {
        display: inline-flex;
        gap: 4px;
        align-items: center;
        padding: 4px 2px;
      }
      .ai-agent-typing span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--color-text-disabled, #7f8d99);
        animation: ai-agent-dot 1.2s infinite ease-in-out;
      }
      .ai-agent-typing span:nth-child(2) { animation-delay: 0.15s; }
      .ai-agent-typing span:nth-child(3) { animation-delay: 0.3s; }
      @keyframes ai-agent-dot {
        0%, 80%, 100% { opacity: 0.35; transform: translateY(0); }
        40% { opacity: 1; transform: translateY(-3px); }
      }

      .ai-agent-composer {
        flex-shrink: 0;
        padding: 16px;
        border-top: 1px solid var(--color-border, #d6dbde);
        background: var(--color-surface, #fff);
      }
      .ai-agent-composer-inner {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        border: 1px solid var(--color-border-interactive, #b2bcc1);
        border-radius: 12px;
        padding: 8px 8px 8px 12px;
        background: var(--color-surface, #fff);
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .ai-agent-composer-inner:focus-within {
        border-color: var(--color-primary-border, #00dbff);
        box-shadow: 0 0 0 3px rgba(0,219,255,0.2);
      }
      .ai-agent-composer-tags {
        display: none;
        flex-wrap: wrap;
        gap: 6px;
        padding-top: 2px;
      }
      .ai-agent-composer-tags.has-tags {
        display: flex;
      }
      .ai-agent-composer-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        max-width: 100%;
        padding: 4px 6px 4px 8px;
        border: 1px solid var(--color-border, #d6dbde);
        border-radius: 4px;
        background: var(--color-surface-low, #eceeef);
        color: var(--color-text-high, #002233);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.3;
        letter-spacing: -0.12px;
      }
      .ai-agent-composer-tag-label {
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ai-agent-composer-tag-remove {
        width: 18px;
        height: 18px;
        border: none;
        border-radius: 4px;
        background: transparent;
        color: var(--color-text-low, #405466);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        flex-shrink: 0;
      }
      .ai-agent-composer-tag-remove:hover {
        background: rgba(0,34,51,0.08);
        color: var(--color-text-high, #002233);
      }
      .ai-agent-composer-tag-remove svg {
        width: 12px;
        height: 12px;
        fill: currentColor;
      }
      .ai-agent-composer-row {
        display: flex;
        align-items: flex-end;
        gap: 8px;
      }
      .ai-agent-add-wrap {
        position: relative;
        flex-shrink: 0;
      }
      .ai-agent-add {
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--color-text-high, #002233);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
      }
      .ai-agent-add:hover,
      .ai-agent-add[aria-expanded="true"] {
        background: var(--color-surface-low, #eceeef);
        color: var(--color-primary-text, #0077b2);
      }
      .ai-agent-add svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
        transition: transform 0.2s ease;
      }
      .ai-agent-add[aria-expanded="true"] svg {
        transform: rotate(45deg);
      }

      .ai-agent-tools-menu {
        position: absolute;
        left: -8px;
        bottom: calc(100% + 12px);
        width: 320px;
        max-width: calc(100vw - 48px);
        max-height: min(480px, calc(100vh - 190px));
        overflow-y: auto;
        padding: 8px;
        border: 1px solid var(--color-border, #d6dbde);
        border-radius: 12px;
        background: var(--color-surface, #fff);
        box-shadow: 0 8px 24px rgba(0,34,51,0.18);
        z-index: 20;
        opacity: 0;
        visibility: hidden;
        transform: translateY(8px) scale(0.98);
        transform-origin: bottom left;
        transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
      }
      .ai-agent-tools-menu.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }
      .ai-agent-tools-view {
        display: none;
      }
      .ai-agent-tools-view.active {
        display: block;
      }
      .ai-agent-tool-item,
      .ai-agent-submenu-back {
        width: 100%;
        min-height: 44px;
        padding: 10px 12px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--color-text-high, #002233);
        font: 500 14px/1.4 var(--font, 'DM Sans', sans-serif);
        text-align: left;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: background 0.12s;
      }
      .ai-agent-tool-item:hover,
      .ai-agent-submenu-back:hover {
        background: var(--color-surface-low, #eceeef);
      }
      .ai-agent-tool-item-icon {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary-text, #0077b2);
      }
      .ai-agent-tool-item-icon img,
      .ai-agent-tool-item-icon svg {
        width: 22px;
        height: 22px;
        display: block;
      }
      .ai-agent-tool-item-icon img:not([src*="-color"]):not([src*="/conectores/"]) {
        filter: invert(41%) sepia(17%) saturate(738%) hue-rotate(165deg) brightness(94%) contrast(87%);
      }
      .ai-agent-tool-item-icon svg {
        fill: currentColor;
      }
      .ai-agent-tool-label {
        flex: 1;
        min-width: 0;
      }
      .ai-agent-tool-chevron {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        fill: var(--color-text-low, #405466);
      }
      .ai-agent-tools-divider {
        height: 1px;
        margin: 8px 4px;
        background: var(--color-border, #d6dbde);
      }
      .ai-agent-submenu-header {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 2px 0 8px;
        border-bottom: 1px solid var(--color-border, #d6dbde);
        margin-bottom: 6px;
      }
      .ai-agent-submenu-back {
        width: 40px;
        min-height: 40px;
        padding: 8px;
        justify-content: center;
      }
      .ai-agent-submenu-back svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }
      .ai-agent-submenu-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--color-text-high, #002233);
      }
      .ai-agent-submenu-entry {
        align-items: flex-start;
      }
      .ai-agent-submenu-entry .ai-agent-tool-item-icon {
        margin-top: 1px;
      }
      .ai-agent-submenu-entry-copy {
        flex: 1;
        min-width: 0;
      }
      .ai-agent-submenu-entry-title {
        display: block;
        font-weight: 700;
        color: var(--color-text-high, #002233);
      }
      .ai-agent-submenu-entry-description {
        display: block;
        margin-top: 2px;
        color: var(--color-text-low, #405466);
        font-size: 12px;
        line-height: 1.35;
      }
      .ai-agent-tool-create {
        color: var(--color-primary-text, #0077b2);
        font-weight: 700;
      }
      .ai-agent-tool-create .ai-agent-tool-item-icon {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--color-primary-surface-low, #b2f4ff);
      }
      .ai-agent-tool-create .ai-agent-tool-item-icon svg {
        width: 14px;
        height: 14px;
      }
      .ai-agent-input {
        flex: 1;
        border: none;
        outline: none;
        resize: none;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.4;
        color: var(--color-text-high, #002233);
        background: transparent;
        max-height: 120px;
        min-height: 24px;
        padding: 6px 0;
      }
      .ai-agent-input::placeholder {
        color: var(--color-text-disabled, #7f8d99);
      }
      .ai-agent-send {
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 8px;
        background: #001927;
        color: #00dbff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: opacity 0.15s;
      }
      .ai-agent-send:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .ai-agent-send:not(:disabled):hover {
        opacity: 0.9;
      }
      .ai-agent-send svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }
      .ai-agent-composer-hint {
        margin-top: 8px;
        font-size: 11px;
        color: var(--color-text-disabled, #7f8d99);
        text-align: center;
      }

      .ai-connector-sheet {
        position: fixed;
        top: 64px;
        right: 0;
        bottom: 0;
        width: min(420px, 100vw);
        background: var(--color-surface, #fff);
        border-left: 1px solid var(--color-border, #d6dbde);
        box-shadow: -8px 0 24px rgba(0,34,51,0.12);
        z-index: 9800;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.25s ease;
        font-family: var(--font, 'DM Sans', sans-serif);
      }
      .ai-connector-sheet.open {
        transform: translateX(0);
      }

      .ai-connector-sheet-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-border, #d6dbde);
        flex-shrink: 0;
        background: var(--color-surface, #fff);
      }
      .ai-connector-sheet-title {
        flex: 1;
        min-width: 0;
        font-size: 16px;
        font-weight: 700;
        color: var(--color-text-high, #002233);
        letter-spacing: -0.16px;
        line-height: 1.3;
      }
      .ai-connector-sheet-close {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: none;
        cursor: pointer;
        border-radius: 12px;
        color: var(--color-text-high, #002233);
        flex-shrink: 0;
      }
      .ai-connector-sheet-close:hover {
        background: var(--color-surface-low, #eceeef);
      }
      .ai-connector-sheet-close svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }

      .ai-connector-sheet-search {
        padding: 16px 24px 8px;
        flex-shrink: 0;
      }
      .ai-connector-search-field {
        display: flex;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--color-border-interactive, #b2bcc1);
        border-radius: 8px;
        padding: 0 12px;
        background: var(--color-surface, #fff);
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .ai-connector-search-field:focus-within {
        border-color: var(--color-primary-border, #00dbff);
        box-shadow: 0 0 0 3px rgba(0,219,255,0.2);
      }
      .ai-connector-search-field svg {
        width: 18px;
        height: 18px;
        fill: var(--color-text-disabled, #7f8d99);
        flex-shrink: 0;
      }
      .ai-connector-search-input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        font: 500 14px/1.4 var(--font, 'DM Sans', sans-serif);
        color: var(--color-text-high, #002233);
        padding: 10px 0;
      }
      .ai-connector-search-input::placeholder {
        color: var(--color-text-disabled, #7f8d99);
      }

      .ai-connector-sheet-body {
        flex: 1;
        overflow-y: auto;
        padding: 8px 16px 24px;
        min-height: 0;
      }
      .ai-connector-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .ai-connector-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--color-border, #d6dbde);
        border-radius: 12px;
        background: var(--color-surface, #fff);
      }
      .ai-connector-card-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: var(--color-surface-low, #eceeef);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
      }
      .ai-connector-card-avatar img {
        width: 28px;
        height: 28px;
        object-fit: contain;
        display: block;
      }
      .ai-connector-card-copy {
        flex: 1;
        min-width: 0;
      }
      .ai-connector-card-title-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .ai-connector-card-name {
        font-size: 14px;
        font-weight: 700;
        color: var(--color-text-high, #002233);
        letter-spacing: -0.14px;
      }
      .ai-connector-status {
        font-size: 11px;
        font-weight: 700;
        color: var(--color-success-text, #00693e);
        background: var(--color-success-surface-low, #d6fae8);
        border-radius: 999px;
        padding: 2px 8px;
        line-height: 1.3;
      }
      .ai-connector-card-desc {
        margin-top: 4px;
        font-size: 12px;
        line-height: 1.4;
        color: var(--color-text-low, #405466);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .ai-connector-card-action {
        flex-shrink: 0;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        font: 700 13px/1.3 var(--font, 'DM Sans', sans-serif);
        cursor: pointer;
        transition: opacity 0.15s, background 0.15s;
      }
      .ai-connector-card-action--connect {
        background: #001927;
        color: #00dbff;
      }
      .ai-connector-card-action--connect:hover {
        opacity: 0.9;
      }
      .ai-connector-card-action--disconnect {
        background: var(--color-surface-low, #eceeef);
        color: var(--color-text-high, #002233);
      }
      .ai-connector-card-action--disconnect:hover {
        background: #dfe3e6;
      }
      .ai-connector-empty {
        padding: 32px 16px;
        text-align: center;
        color: var(--color-text-low, #405466);
        font-size: 14px;
      }

      .ai-kb-sheet-body {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px 24px;
        min-height: 0;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .ai-kb-step[hidden] { display: none !important; }
      .ai-kb-step[data-kb-step="create"]:not([hidden]) {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .ai-kb-description {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.45;
        color: var(--color-text-low, #405466);
      }
      .ai-kb-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .ai-kb-label {
        display: flex;
        gap: 4px;
        font-size: 14px;
        font-weight: 700;
        color: var(--color-text-high, #002233);
        letter-spacing: -0.14px;
      }
      .ai-kb-required { color: #cc0d4d; }
      .ai-kb-input,
      .ai-kb-textarea {
        width: 100%;
        border: 1px solid var(--color-border-interactive, #b2bcc1);
        border-radius: 8px;
        background: var(--color-surface, #fff);
        color: var(--color-text-high, #002233);
        font: 500 14px/1.4 var(--font, 'DM Sans', sans-serif);
        outline: none;
      }
      .ai-kb-input {
        height: 40px;
        padding: 8px 12px;
      }
      .ai-kb-textarea {
        min-height: 88px;
        padding: 8px 12px;
        resize: vertical;
      }
      .ai-kb-input:focus,
      .ai-kb-textarea:focus,
      .ai-kb-access-btn:focus,
      .ai-kb-access-btn[aria-expanded="true"] {
        border-color: var(--color-primary-text, #0077b2);
        box-shadow: 0 0 0 2px rgba(0,119,178,0.16);
      }
      .ai-kb-access-wrap { position: relative; }
      .ai-kb-access-btn {
        width: 100%;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 12px;
        border: 1px solid var(--color-border-interactive, #b2bcc1);
        border-radius: 8px;
        background: var(--color-surface, #fff);
        color: var(--color-text-high, #002233);
        font: 500 14px/1.4 var(--font, 'DM Sans', sans-serif);
        text-align: left;
        cursor: pointer;
      }
      .ai-kb-access-btn.is-placeholder {
        color: var(--color-text-disabled, #7f8d99);
      }
      .ai-kb-access-caret {
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid var(--color-text-low, #405466);
        flex-shrink: 0;
      }
      .ai-kb-access-dropdown {
        position: absolute;
        left: 0;
        right: 0;
        top: calc(100% + 4px);
        z-index: 5;
        display: none;
        flex-direction: column;
        gap: 4px;
        padding: 8px;
        border: 1px solid var(--color-border, #d6dbde);
        border-radius: 8px;
        background: var(--color-surface, #fff);
        box-shadow: 0 4px 12px rgba(0,34,51,0.14);
      }
      .ai-kb-access-wrap.open .ai-kb-access-dropdown { display: flex; }
      .ai-kb-access-option {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        padding: 8px 12px;
        border: none;
        border-radius: 8px;
        background: transparent;
        text-align: left;
        cursor: pointer;
        font-family: inherit;
      }
      .ai-kb-access-option:hover { background: var(--color-surface-low, #eceeef); }
      .ai-kb-access-option-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--color-text-high, #002233);
      }
      .ai-kb-access-option-desc {
        font-size: 12px;
        line-height: 1.35;
        color: var(--color-text-low, #405466);
      }
      .ai-kb-helper {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.45;
        color: var(--color-text-low, #405466);
      }
      .ai-kb-step[data-kb-step="source"]:not([hidden]) {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .ai-kb-step[data-kb-step="detail"]:not([hidden]) {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      #ai-kb-resource-detail:not([hidden]) {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .ai-kb-source-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .ai-kb-source-card {
        width: 100%;
        min-height: 52px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border: 1px solid var(--color-border, #d6dbde);
        border-radius: 12px;
        background: var(--color-surface, #fff);
        color: var(--color-text-high, #002233);
        font: 700 14px/1.4 var(--font, 'DM Sans', sans-serif);
        text-align: left;
        cursor: pointer;
      }
      .ai-kb-source-card:hover { border-color: var(--color-border-interactive, #b2bcc1); }
      .ai-kb-source-card.selected {
        border-color: var(--color-primary-text, #0077b2);
        box-shadow: 0 0 0 2px rgba(0,119,178,0.16);
      }
      .ai-kb-source-card.disabled {
        cursor: not-allowed;
        background: var(--color-surface-low, #eceeef);
        color: var(--color-text-disabled, #7f8d99);
      }
      .ai-kb-source-card.disabled .ai-kb-source-radio,
      .ai-kb-source-card.disabled .ai-kb-source-icon,
      .ai-kb-source-card.disabled .ai-kb-source-label {
        opacity: 0.7;
      }
      .ai-kb-source-radio {
        width: 18px;
        height: 18px;
        border: 1px solid var(--color-border-interactive, #b2bcc1);
        border-radius: 50%;
        flex-shrink: 0;
        position: relative;
      }
      .ai-kb-source-card.selected .ai-kb-source-radio::after {
        content: "";
        position: absolute;
        inset: 4px;
        border-radius: 50%;
        background: var(--color-primary-text, #0077b2);
      }
      .ai-kb-source-icon {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ai-kb-source-icon img {
        width: 22px;
        height: 22px;
        display: block;
        filter: invert(41%) sepia(17%) saturate(738%) hue-rotate(165deg) brightness(94%) contrast(87%);
      }
      .ai-kb-source-label { flex: 1; min-width: 0; }
      .ai-kb-soon {
        margin-left: auto;
        padding: 4px 8px;
        border-radius: 4px;
        background: #8800f7;
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        line-height: 1.3;
        letter-spacing: -0.12px;
        white-space: nowrap;
      }
      .ai-kb-dropzone {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 160px;
        padding: 20px;
        border: 1px dashed var(--color-border-interactive, #b2bcc1);
        border-radius: 12px;
        background: var(--color-surface-low, #eceeef);
        text-align: center;
        cursor: pointer;
      }
      .ai-kb-dropzone:hover,
      .ai-kb-dropzone.is-dragover {
        border-color: var(--color-primary-text, #0077b2);
        background: var(--color-primary-surface-low, #b2f4ff);
      }
      .ai-kb-dropzone-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ai-kb-dropzone-icon img {
        width: 48px;
        height: 48px;
        display: block;
        filter: invert(41%) sepia(17%) saturate(738%) hue-rotate(165deg) brightness(94%) contrast(87%);
      }
      .ai-kb-dropzone-title {
        font-size: 14px;
        font-weight: 700;
        color: var(--color-text-high, #002233);
        line-height: 1.4;
      }
      .ai-kb-dropzone-title span { color: var(--color-primary-text, #0077b2); }
      .ai-kb-dropzone-helper {
        font-size: 12px;
        color: var(--color-text-low, #405466);
      }
      .ai-kb-file-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 8px;
        padding: 4px 8px;
        border: 1px solid var(--color-border, #d6dbde);
        border-radius: 4px;
        background: var(--color-surface, #fff);
        font-size: 12px;
        font-weight: 700;
        color: var(--color-text-high, #002233);
      }
      .ai-kb-sheet-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        padding: 16px 20px;
        border-top: 1px solid var(--color-border, #d6dbde);
        flex-shrink: 0;
        background: var(--color-surface, #fff);
      }
      .ai-kb-sheet-footer .ai-kb-btn-secondary:first-child {
        margin-right: auto;
      }
      .ai-kb-footer-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ai-kb-btn {
        border: none;
        border-radius: 8px;
        padding: 10px 16px;
        font: 700 14px/1.3 var(--font, 'DM Sans', sans-serif);
        cursor: pointer;
      }
      .ai-kb-btn-secondary {
        background: var(--color-surface-low, #eceeef);
        color: var(--color-text-high, #002233);
      }
      .ai-kb-btn-secondary:hover { background: #dfe3e6; }
      .ai-kb-btn-primary {
        background: #001927;
        color: #00dbff;
      }
      .ai-kb-btn-primary:hover { opacity: 0.9; }
      .ai-kb-btn-primary:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .ai-kb-error {
        font-size: 12px;
        color: #c20046;
        display: none;
      }
      .ai-kb-error.visible { display: block; }
      .ai-kb-files-step:not([hidden]) {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .ai-kb-files-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .ai-kb-files-search {
        min-width: 0;
        flex: 1;
        height: 40px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border: 1px solid var(--color-border-interactive, #b2bcc1);
        border-radius: 8px;
        background: var(--color-surface, #fff);
      }
      .ai-kb-files-search:focus-within {
        border-color: var(--color-primary-text, #0077b2);
        box-shadow: 0 0 0 2px rgba(0,119,178,0.16);
      }
      .ai-kb-files-search input {
        min-width: 0;
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        color: var(--color-text-high, #002233);
        font: 500 14px/1.4 var(--font, 'DM Sans', sans-serif);
      }
      .ai-kb-files-search img {
        width: 18px;
        height: 18px;
        filter: invert(41%) sepia(17%) saturate(738%) hue-rotate(165deg) brightness(94%) contrast(87%);
      }
      .ai-kb-add-more {
        min-height: 40px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        border: none;
        border-radius: 8px;
        background: var(--color-surface-low, #eceeef);
        color: var(--color-primary-text, #0077b2);
        font: 700 13px/1.3 var(--font, 'DM Sans', sans-serif);
        cursor: pointer;
        white-space: nowrap;
      }
      .ai-kb-add-more:hover { background: #dfe3e6; }
      .ai-kb-add-more svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }
      .ai-kb-files-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .ai-kb-file-row {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        padding: 10px 12px;
        border: 1px solid var(--color-border, #d6dbde);
        border-radius: 8px;
        background: var(--color-surface, #fff);
      }
      .ai-kb-file-row-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border-radius: 8px;
        background: var(--color-surface-low, #eceeef);
      }
      .ai-kb-file-row-icon img {
        width: 18px;
        height: 18px;
        filter: invert(41%) sepia(17%) saturate(738%) hue-rotate(165deg) brightness(94%) contrast(87%);
      }
      .ai-kb-file-row-copy {
        min-width: 0;
        flex: 1;
      }
      .ai-kb-file-row-name {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--color-primary-text, #0077b2);
        font-size: 13px;
        font-weight: 700;
      }
      .ai-kb-file-row-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 3px;
        color: var(--color-text-low, #405466);
        font-size: 11px;
      }
      .ai-kb-file-type {
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--color-surface-low, #eceeef);
        color: var(--color-text-high, #002233);
        font-weight: 700;
        text-transform: uppercase;
      }
      .ai-kb-file-remove {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--color-text-low, #405466);
        cursor: pointer;
      }
      .ai-kb-file-remove:hover {
        background: var(--color-surface-low, #eceeef);
        color: #c20046;
      }
      .ai-kb-file-remove svg {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }
      .ai-kb-files-empty {
        padding: 32px 16px;
        text-align: center;
        color: var(--color-text-low, #405466);
        font-size: 14px;
      }
      .ai-kb-files-summary {
        color: var(--color-text-low, #405466);
        font-size: 12px;
      }
    `;
    document.head.appendChild(style);
  }

  function buildMarkup() {
    const suggestions = SUGGESTIONS.map(
      (s) => `<button type="button" class="ai-agent-suggestion">${esc(s)}</button>`
    ).join('');

    return `
      <div class="ai-agent-overlay" id="ai-agent-overlay" aria-hidden="true"></div>
      <aside class="ai-agent-panel" id="${PANEL_ID}" role="dialog" aria-modal="true" aria-labelledby="ai-agent-title" aria-hidden="true">
        <header class="ai-agent-header">
          <div class="ai-agent-header-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C12 6.62741 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62744 12 0 12C6.62744 12 12 6.62741 12 0ZM12 5.80645C12 8.36104 8.33148 12 5.71429 12C8.33148 12 12 15.639 12 18.1935C12 15.639 15.6685 12 18.2857 12C15.6685 12 12 8.36104 12 5.80645Z" fill="white"/>
              <path d="M2.28564 13.9852C2.89332 14.1253 3.47973 14.3209 4.03974 14.5659V15.6002L4.04234 15.7378C4.09244 17.0507 4.89237 18.2342 6.12642 18.8039L9.46273 20.344C9.70706 21.0151 9.88155 21.7196 9.97873 22.4488C9.93125 22.4304 9.88404 22.4111 9.83698 22.3914L9.69376 22.329L9.66474 22.3158L9.66176 22.3142L5.37009 20.333C3.54463 19.4903 2.36197 17.739 2.28936 15.7964L2.28899 15.785V15.7737L2.28602 15.6278L2.28564 15.6183V13.9852Z" fill="#00DBFF"/>
            </svg>
          </div>
          <div class="ai-agent-header-text">
            <div class="ai-agent-title" id="ai-agent-title">Copiloto</div>
            <div class="ai-agent-subtitle">Agente de IA</div>
          </div>
          <button type="button" class="ai-agent-close" id="ai-agent-close" title="Fechar" aria-label="Fechar painel do agente">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/></svg>
          </button>
        </header>

        <div class="ai-agent-messages" id="ai-agent-messages">
          <div class="ai-agent-empty" id="ai-agent-empty">
            <div class="ai-agent-empty-hero">
              <h3>Como posso ajudar?</h3>
              <p>Tire dúvidas sobre contatos, filtros e fluxos deste CRM.</p>
            </div>
            <div class="ai-agent-suggestions" id="ai-agent-suggestions">
              ${suggestions}
            </div>
          </div>
        </div>

        <footer class="ai-agent-composer">
          <div class="ai-agent-composer-inner">
            <div class="ai-agent-composer-tags" id="ai-agent-composer-tags" aria-live="polite"></div>
            <div class="ai-agent-composer-row">
            <div class="ai-agent-add-wrap">
              <button type="button" class="ai-agent-add" id="ai-agent-add" title="Adicionar ao chat" aria-label="Adicionar ao chat" aria-haspopup="menu" aria-expanded="false">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"/></svg>
              </button>
              <div class="ai-agent-tools-menu" id="ai-agent-tools-menu" role="menu" aria-label="Adicionar ao chat">
                <div class="ai-agent-tools-view active" data-tools-view="main">
                  <button type="button" class="ai-agent-tool-item" data-tool-action="files" role="menuitem">
                    <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}paperclip.svg" alt=""></span>
                    <span class="ai-agent-tool-label">Enviar arquivos</span>
                  </button>
                  <button type="button" class="ai-agent-tool-item" data-tool-action="drive" role="menuitem">
                    <span class="ai-agent-tool-item-icon"><img src="${CONNECTOR_ICON_BASE}gdrive.svg" alt=""></span>
                    <span class="ai-agent-tool-label">Adicionar do Google Drive</span>
                  </button>
                  <button type="button" class="ai-agent-tool-item" data-open-tools-view="skills" role="menuitem" aria-haspopup="menu">
                    <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}magic-wand.svg" alt=""></span>
                    <span class="ai-agent-tool-label">Habilidades</span>
                    <svg class="ai-agent-tool-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.3 18.7 6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 1 0-1.4 1.4l5.3 5.3-5.3 5.3a1 1 0 0 0 1.4 1.4Z"/></svg>
                  </button>
                  <div class="ai-agent-tools-divider" role="separator"></div>
                  <button type="button" class="ai-agent-tool-item" data-open-tools-view="agents" role="menuitem" aria-haspopup="menu">
                    <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}agent.svg" alt=""></span>
                    <span class="ai-agent-tool-label">Agentes</span>
                    <svg class="ai-agent-tool-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.3 18.7 6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 1 0-1.4 1.4l5.3 5.3-5.3 5.3a1 1 0 0 0 1.4 1.4Z"/></svg>
                  </button>
                  <button type="button" class="ai-agent-tool-item" data-open-tools-view="connectors" role="menuitem" aria-haspopup="menu">
                    <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}plug.svg" alt=""></span>
                    <span class="ai-agent-tool-label">Conectores</span>
                    <svg class="ai-agent-tool-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.3 18.7 6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 1 0-1.4 1.4l5.3 5.3-5.3 5.3a1 1 0 0 0 1.4 1.4Z"/></svg>
                  </button>
                  <button type="button" class="ai-agent-tool-item" data-open-tools-view="knowledge" role="menuitem" aria-haspopup="menu">
                    <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}folder-open.svg" alt=""></span>
                    <span class="ai-agent-tool-label">Base de conhecimento</span>
                    <svg class="ai-agent-tool-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.3 18.7 6-6a1 1 0 0 0 0-1.4l-6-6a1 1 0 1 0-1.4 1.4l5.3 5.3-5.3 5.3a1 1 0 0 0 1.4 1.4Z"/></svg>
                  </button>
                </div>

                <div class="ai-agent-tools-view" data-tools-view="skills">
                  <div class="ai-agent-submenu-header">
                    <button type="button" class="ai-agent-submenu-back" aria-label="Voltar"><svg viewBox="0 0 24 24"><path d="M15.7 18.7a1 1 0 0 0 0-1.4L10.4 12l5.3-5.3a1 1 0 1 0-1.4-1.4l-6 6a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0Z"/></svg></button>
                    <span class="ai-agent-submenu-title">Habilidades</span>
                  </div>
                  <button type="button" class="ai-agent-tool-item ai-agent-submenu-entry" data-select-label="Qualificar contatos">
                    <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}magic-wand.svg" alt=""></span>
                    <span class="ai-agent-submenu-entry-copy"><span class="ai-agent-submenu-entry-title">Qualificar contatos</span><span class="ai-agent-submenu-entry-description">Analisa e classifica contatos</span></span>
                  </button>
                  <button type="button" class="ai-agent-tool-item ai-agent-submenu-entry" data-select-label="Resumir informações">
                    <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}list-alt.svg" alt=""></span>
                    <span class="ai-agent-submenu-entry-copy"><span class="ai-agent-submenu-entry-title">Resumir informações</span><span class="ai-agent-submenu-entry-description">Cria resumos rápidos do contexto</span></span>
                  </button>
                  <div class="ai-agent-tools-divider" role="separator"></div>
                  <button type="button" class="ai-agent-tool-item ai-agent-tool-create" data-create-label="habilidade">
                    <span class="ai-agent-tool-item-icon"><svg viewBox="0 0 24 24"><path d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"/></svg></span>
                    <span class="ai-agent-tool-label">Criar nova habilidade</span>
                  </button>
                </div>

                <div class="ai-agent-tools-view" data-tools-view="agents">
                  <div class="ai-agent-submenu-header">
                    <button type="button" class="ai-agent-submenu-back" aria-label="Voltar"><svg viewBox="0 0 24 24"><path d="M15.7 18.7a1 1 0 0 0 0-1.4L10.4 12l5.3-5.3a1 1 0 1 0-1.4-1.4l-6 6a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0Z"/></svg></button>
                    <span class="ai-agent-submenu-title">Agentes</span>
                  </div>
                  <button type="button" class="ai-agent-tool-item ai-agent-submenu-entry" data-select-label="Agente de vendas">
                    <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}agent.svg" alt=""></span>
                    <span class="ai-agent-submenu-entry-copy"><span class="ai-agent-submenu-entry-title">Agente de vendas</span><span class="ai-agent-submenu-entry-description">Apoia prospecção e follow-ups</span></span>
                  </button>
                  <button type="button" class="ai-agent-tool-item ai-agent-submenu-entry" data-select-label="Agente de atendimento">
                    <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}agent.svg" alt=""></span>
                    <span class="ai-agent-submenu-entry-copy"><span class="ai-agent-submenu-entry-title">Agente de atendimento</span><span class="ai-agent-submenu-entry-description">Responde dúvidas sobre clientes</span></span>
                  </button>
                  <div class="ai-agent-tools-divider" role="separator"></div>
                  <button type="button" class="ai-agent-tool-item ai-agent-tool-create" data-create-label="agente">
                    <span class="ai-agent-tool-item-icon"><svg viewBox="0 0 24 24"><path d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"/></svg></span>
                    <span class="ai-agent-tool-label">Criar novo agente</span>
                  </button>
                </div>

                <div class="ai-agent-tools-view" data-tools-view="connectors">
                  <div class="ai-agent-submenu-header">
                    <button type="button" class="ai-agent-submenu-back" aria-label="Voltar"><svg viewBox="0 0 24 24"><path d="M15.7 18.7a1 1 0 0 0 0-1.4L10.4 12l5.3-5.3a1 1 0 1 0-1.4-1.4l-6 6a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0Z"/></svg></button>
                    <span class="ai-agent-submenu-title">Conectores MCP</span>
                  </div>
                  <div id="ai-agent-connectors-list"></div>
                  <div class="ai-agent-tools-divider" role="separator"></div>
                  <button type="button" class="ai-agent-tool-item ai-agent-tool-create" data-open-connector-sheet role="menuitem">
                    <span class="ai-agent-tool-item-icon"><svg viewBox="0 0 24 24"><path d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"/></svg></span>
                    <span class="ai-agent-tool-label">Adicionar conector</span>
                  </button>
                </div>

                <div class="ai-agent-tools-view" data-tools-view="knowledge">
                  <div class="ai-agent-submenu-header">
                    <button type="button" class="ai-agent-submenu-back" aria-label="Voltar"><svg viewBox="0 0 24 24"><path d="M15.7 18.7a1 1 0 0 0 0-1.4L10.4 12l5.3-5.3a1 1 0 1 0-1.4-1.4l-6 6a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0Z"/></svg></button>
                    <span class="ai-agent-submenu-title">Base de conhecimento</span>
                  </div>
                  <div id="ai-agent-knowledge-list"></div>
                  <div class="ai-agent-tools-divider" role="separator"></div>
                  <button type="button" class="ai-agent-tool-item ai-agent-tool-create" data-open-knowledge-sheet role="menuitem">
                    <span class="ai-agent-tool-item-icon"><svg viewBox="0 0 24 24"><path d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"/></svg></span>
                    <span class="ai-agent-tool-label">Adicionar base de conhecimento</span>
                  </button>
                </div>
              </div>
              <input type="file" id="ai-agent-file-input" multiple hidden>
            </div>
            <textarea
              class="ai-agent-input"
              id="ai-agent-input"
              rows="1"
              placeholder="Pergunte ao Copiloto..."
              aria-label="Mensagem para o agente"
            ></textarea>
            <button type="button" class="ai-agent-send" id="ai-agent-send" title="Enviar" aria-label="Enviar mensagem" disabled>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.4 20.4 20.85 12.92c.7-.31.7-1.53 0-1.84L3.4 3.6a1.1 1.1 0 0 0-1.55 1.26l1.7 6.55a.8.8 0 0 0 .62.6l8.18 1.2-8.18 1.2a.8.8 0 0 0-.62.6l-1.7 6.55a1.1 1.1 0 0 0 1.55 1.26z"/></svg>
            </button>
            </div>
          </div>
          <div class="ai-agent-composer-hint">Protótipo — respostas simuladas</div>
        </footer>
      </aside>

      <aside class="ai-connector-sheet" id="ai-connector-sheet" role="dialog" aria-modal="true" aria-labelledby="ai-connector-sheet-title" aria-hidden="true">
        <header class="ai-connector-sheet-header">
          <div class="ai-connector-sheet-title" id="ai-connector-sheet-title">Adicionar conector</div>
          <button type="button" class="ai-connector-sheet-close" id="ai-connector-sheet-close" title="Fechar" aria-label="Fechar lista de conectores">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/></svg>
          </button>
        </header>
        <div class="ai-connector-sheet-search">
          <label class="ai-connector-search-field" for="ai-connector-search-input">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3.75a6.75 6.75 0 1 0 4.2 12.06l4.24 4.25a.75.75 0 1 0 1.06-1.06l-4.25-4.25A6.75 6.75 0 0 0 10.5 3.75Zm-5.25 6.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Z"/></svg>
            <input class="ai-connector-search-input" id="ai-connector-search-input" type="search" placeholder="Buscar conectores" autocomplete="off">
          </label>
        </div>
        <div class="ai-connector-sheet-body">
          <div class="ai-connector-list" id="ai-connector-sheet-list"></div>
        </div>
      </aside>

      <aside class="ai-connector-sheet" id="ai-knowledge-sheet" role="dialog" aria-modal="true" aria-labelledby="ai-knowledge-sheet-title" aria-hidden="true">
        <header class="ai-connector-sheet-header">
          <div class="ai-connector-sheet-title" id="ai-knowledge-sheet-title">Nova base de conhecimento</div>
          <button type="button" class="ai-connector-sheet-close" id="ai-knowledge-sheet-close" title="Fechar" aria-label="Fechar base de conhecimento">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/></svg>
          </button>
        </header>

        <div class="ai-kb-sheet-body">
          <div class="ai-kb-step" data-kb-step="create">
            <p class="ai-kb-description">Uma base de conhecimento permite que o agente encontre informações relevantes mais rapidamente.</p>

            <label class="ai-kb-field">
              <span class="ai-kb-label">Nome da base de conhecimento <span class="ai-kb-required">*</span></span>
              <input class="ai-kb-input" id="ai-kb-name" type="text" placeholder="Informe um nome para essa base" autocomplete="off">
              <span class="ai-kb-error" id="ai-kb-name-error">Informe um nome para continuar</span>
            </label>

            <label class="ai-kb-field">
              <span class="ai-kb-label">Descrição</span>
              <textarea class="ai-kb-textarea" id="ai-kb-description" placeholder="Adicione a descrição dessa base"></textarea>
            </label>

            <div class="ai-kb-field">
              <span class="ai-kb-label">Quem poderá acessar essa base?</span>
              <div class="ai-kb-access-wrap" id="ai-kb-access-wrap">
                <button type="button" class="ai-kb-access-btn is-placeholder" id="ai-kb-access-btn" aria-haspopup="listbox" aria-expanded="false">
                  <span id="ai-kb-access-label">Selecione quem poderá acessar</span>
                  <span class="ai-kb-access-caret" aria-hidden="true"></span>
                </button>
                <input type="hidden" id="ai-kb-access" value="">
                <div class="ai-kb-access-dropdown" id="ai-kb-access-dropdown" role="listbox">
                  <button type="button" class="ai-kb-access-option" role="option" data-value="publico">
                    <span class="ai-kb-access-option-title">Público</span>
                    <span class="ai-kb-access-option-desc">Todas as pessoas da conta podem encontrar e usar esta base de conhecimento ao criar ou editar agentes de IA.</span>
                  </button>
                  <button type="button" class="ai-kb-access-option" role="option" data-value="privado">
                    <span class="ai-kb-access-option-title">Privado</span>
                    <span class="ai-kb-access-option-desc">Somente você poderá acessar esta base para criar ou editar agentes de IA.</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="ai-kb-step" data-kb-step="source" hidden>
            <p class="ai-kb-helper">Escolha o tipo de arquivo que você deseja enviar</p>
            <div class="ai-kb-source-list" id="ai-kb-source-list" role="radiogroup" aria-label="Tipo de arquivo"></div>
          </div>

          <div class="ai-kb-step" data-kb-step="detail" hidden>
            <p class="ai-kb-helper" id="ai-kb-detail-helper">Adicione arquivos à sua base de conhecimento.</p>

            <div id="ai-kb-file-detail">
              <label class="ai-kb-dropzone" id="ai-kb-dropzone" for="ai-kb-file-input" tabindex="0">
                <span class="ai-kb-dropzone-icon" aria-hidden="true"><img src="${ICON_BASE}import.svg" alt=""></span>
                <span class="ai-kb-dropzone-title">Arraste e solte seu arquivo aqui ou <span>clique para selecionar</span></span>
                <span class="ai-kb-dropzone-helper">Formatos aceitos: .xls .csv .xlsx .pdf .doc .docx .txt</span>
                <span class="ai-kb-file-chip" id="ai-kb-file-chip" hidden></span>
              </label>
              <input type="file" id="ai-kb-file-input" multiple hidden accept=".xls,.csv,.xlsx,.pdf,.doc,.docx,.txt">
            </div>

            <div id="ai-kb-resource-detail" hidden>
              <label class="ai-kb-field">
                <span class="ai-kb-label" id="ai-kb-resource-primary-label">URL</span>
                <input class="ai-kb-input" id="ai-kb-resource-primary" type="text" placeholder="Adicione a URL">
              </label>
              <label class="ai-kb-field">
                <span class="ai-kb-label" id="ai-kb-resource-secondary-label">Nome</span>
                <input class="ai-kb-input" id="ai-kb-resource-secondary" type="text" placeholder="Adicione um nome para exibir na listagem">
              </label>
            </div>
          </div>

          <div class="ai-kb-step ai-kb-files-step" data-kb-step="files" hidden>
            <div class="ai-kb-files-toolbar">
              <label class="ai-kb-files-search">
                <input type="search" id="ai-kb-files-search" placeholder="Buscar" aria-label="Buscar arquivos">
                <img src="${ICON_BASE}loupe.svg" alt="">
              </label>
              <button type="button" class="ai-kb-add-more" id="ai-kb-add-more">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 5a1 1 0 1 0-2 0v6H5a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2h-6V5Z"/></svg>
                Adicionar
              </button>
            </div>
            <div class="ai-kb-files-list" id="ai-kb-files-list"></div>
            <div class="ai-kb-files-summary" id="ai-kb-files-summary"></div>
          </div>
        </div>

        <footer class="ai-kb-sheet-footer">
          <button type="button" class="ai-kb-btn ai-kb-btn-secondary" id="ai-kb-secondary-btn">Cancelar</button>
          <div class="ai-kb-footer-actions">
            <button type="button" class="ai-kb-btn ai-kb-btn-secondary" id="ai-kb-save-exit-btn" hidden>Salvar e sair</button>
            <button type="button" class="ai-kb-btn ai-kb-btn-primary" id="ai-kb-primary-btn">Avançar</button>
          </div>
        </footer>
      </aside>
    `;
  }

  function findTrigger() {
    const existing = document.querySelector(`[${TRIGGER_ATTR}]`);
    if (existing) return existing;

    const firstIcon = document.querySelector('.navbar-icons .navbar-icon-btn');
    return firstIcon || null;
  }

  function init() {
    if (document.getElementById(PANEL_ID)) return;

    const trigger = findTrigger();
    if (!trigger) return;

    injectStyles();

    const wrap = document.createElement('div');
    wrap.innerHTML = buildMarkup();
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    const panel = document.getElementById(PANEL_ID);
    const overlay = document.getElementById('ai-agent-overlay');
    const closeBtn = document.getElementById('ai-agent-close');
    const messagesEl = document.getElementById('ai-agent-messages');
    const emptyEl = document.getElementById('ai-agent-empty');
    const inputEl = document.getElementById('ai-agent-input');
    const sendBtn = document.getElementById('ai-agent-send');
    const suggestionsEl = document.getElementById('ai-agent-suggestions');
    const addBtn = document.getElementById('ai-agent-add');
    const toolsMenu = document.getElementById('ai-agent-tools-menu');
    const fileInput = document.getElementById('ai-agent-file-input');
    const headerIcon = panel.querySelector('.ai-agent-header-icon');
    const triggerIcon = trigger.querySelector('svg');
    const connectorsMenuList = document.getElementById('ai-agent-connectors-list');
    const connectorSheet = document.getElementById('ai-connector-sheet');
    const connectorSheetClose = document.getElementById('ai-connector-sheet-close');
    const connectorSheetList = document.getElementById('ai-connector-sheet-list');
    const connectorSearchInput = document.getElementById('ai-connector-search-input');
    const composerTagsEl = document.getElementById('ai-agent-composer-tags');
    const knowledgeMenuList = document.getElementById('ai-agent-knowledge-list');
    const knowledgeSheet = document.getElementById('ai-knowledge-sheet');
    const knowledgeSheetClose = document.getElementById('ai-knowledge-sheet-close');
    const knowledgeSheetTitle = document.getElementById('ai-knowledge-sheet-title');
    const kbNameInput = document.getElementById('ai-kb-name');
    const kbDescriptionInput = document.getElementById('ai-kb-description');
    const kbNameError = document.getElementById('ai-kb-name-error');
    const kbAccessWrap = document.getElementById('ai-kb-access-wrap');
    const kbAccessBtn = document.getElementById('ai-kb-access-btn');
    const kbAccessLabel = document.getElementById('ai-kb-access-label');
    const kbAccessInput = document.getElementById('ai-kb-access');
    const kbSourceList = document.getElementById('ai-kb-source-list');
    const kbDetailHelper = document.getElementById('ai-kb-detail-helper');
    const kbFileDetail = document.getElementById('ai-kb-file-detail');
    const kbResourceDetail = document.getElementById('ai-kb-resource-detail');
    const kbDropzone = document.getElementById('ai-kb-dropzone');
    const kbFileInput = document.getElementById('ai-kb-file-input');
    const kbFileChip = document.getElementById('ai-kb-file-chip');
    const kbResourcePrimaryLabel = document.getElementById('ai-kb-resource-primary-label');
    const kbResourceSecondaryLabel = document.getElementById('ai-kb-resource-secondary-label');
    const kbResourcePrimary = document.getElementById('ai-kb-resource-primary');
    const kbResourceSecondary = document.getElementById('ai-kb-resource-secondary');
    const kbSecondaryBtn = document.getElementById('ai-kb-secondary-btn');
    const kbSaveExitBtn = document.getElementById('ai-kb-save-exit-btn');
    const kbPrimaryBtn = document.getElementById('ai-kb-primary-btn');
    const kbFilesSearch = document.getElementById('ai-kb-files-search');
    const kbAddMoreBtn = document.getElementById('ai-kb-add-more');
    const kbFilesList = document.getElementById('ai-kb-files-list');
    const kbFilesSummary = document.getElementById('ai-kb-files-summary');

    let replyIndex = 0;
    let isTyping = false;
    let activeConnectorIds = loadActiveConnectorIds();
    let activeCreateMode = null;
    let knowledgeBases = loadKnowledgeBases();
    let kbStep = 'create';
    let kbSelectedSource = 'file';
    let kbSelectedFiles = [];
    let kbPendingItems = [];
    let kbSourceReturnStep = 'create';

    const KB_RESOURCE_COPY = {
      qa: {
        helper: 'Adicione perguntas e respostas à sua base de conhecimento.',
        primary: 'Pergunta',
        primaryPlaceholder: 'Digite a pergunta',
        secondary: 'Resposta',
        secondaryPlaceholder: 'Digite a resposta',
      },
      site: {
        helper: 'Adicione um site ou blog à sua base de conhecimento.',
        primary: 'URL',
        primaryPlaceholder: 'Adicione a URL',
        secondary: 'Nome',
        secondaryPlaceholder: 'Adicione um nome para exibir na listagem',
      },
      pages: {
        helper: 'Adicione páginas individuais à sua base de conhecimento.',
        primary: 'URL da página',
        primaryPlaceholder: 'Adicione a URL',
        secondary: 'Nome',
        secondaryPlaceholder: 'Adicione um nome para exibir na listagem',
      },
      youtube: {
        helper: 'Adicione vídeos do YouTube à sua base de conhecimento.',
        primary: 'URL do YouTube',
        primaryPlaceholder: 'Adicione a URL do vídeo',
        secondary: 'Nome',
        secondaryPlaceholder: 'Adicione um nome para exibir na listagem',
      },
    };

    trigger.setAttribute(TRIGGER_ATTR, '');
    trigger.setAttribute('role', 'button');
    trigger.setAttribute('tabindex', '0');
    if (headerIcon && triggerIcon) headerIcon.innerHTML = triggerIcon.outerHTML;

    trigger.setAttribute('aria-label', 'Abrir Copiloto');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', PANEL_ID);
    trigger.title = 'Copiloto';

    function isOpen() {
      return panel.classList.contains('open');
    }

    function isConnectorSheetOpen() {
      return connectorSheet.classList.contains('open');
    }

    function isKnowledgeSheetOpen() {
      return knowledgeSheet.classList.contains('open');
    }

    function openPanel() {
      panel.classList.add('open');
      overlay.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      trigger.classList.add('is-active');
      trigger.setAttribute('aria-expanded', 'true');
      setTimeout(() => inputEl.focus(), 260);
    }

    function closePanel() {
      closeToolsMenu();
      closeConnectorSheet();
      closeKnowledgeSheet();
      panel.classList.remove('open');
      overlay.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      trigger.classList.remove('is-active');
      trigger.setAttribute('aria-expanded', 'false');
    }

    function togglePanel() {
      if (isOpen()) closePanel();
      else openPanel();
    }

    function showToolsView(name) {
      toolsMenu.querySelectorAll('[data-tools-view]').forEach((view) => {
        view.classList.toggle('active', view.dataset.toolsView === name);
      });
    }

    function openToolsMenu() {
      showToolsView('main');
      toolsMenu.classList.add('open');
      addBtn.setAttribute('aria-expanded', 'true');
    }

    function closeToolsMenu() {
      toolsMenu.classList.remove('open');
      addBtn.setAttribute('aria-expanded', 'false');
      setTimeout(() => {
        if (!toolsMenu.classList.contains('open')) showToolsView('main');
      }, 150);
    }

    function toggleToolsMenu() {
      if (toolsMenu.classList.contains('open')) closeToolsMenu();
      else openToolsMenu();
    }

    function renderConnectorsMenu() {
      if (!connectorsMenuList) return;
      const active = activeConnectorIds
        .map(getConnectorById)
        .filter(Boolean);

      if (!active.length) {
        connectorsMenuList.innerHTML = `
          <div class="ai-agent-submenu-entry-description" style="padding:8px 12px;color:var(--color-text-low,#405466);font-size:12px;">
            Nenhum conector ativo
          </div>
        `;
        return;
      }

      connectorsMenuList.innerHTML = active.map((item) => `
        <button type="button" class="ai-agent-tool-item ai-agent-submenu-entry" data-select-label="${esc(item.name)}">
          <span class="ai-agent-tool-item-icon"><img src="${esc(connectorIconUrl(item.icon))}" alt=""></span>
          <span class="ai-agent-submenu-entry-copy">
            <span class="ai-agent-submenu-entry-title">${esc(item.name)}</span>
            <span class="ai-agent-submenu-entry-description">${esc(item.description)}</span>
          </span>
        </button>
      `).join('');
    }

    function renderConnectorSheetList(query = '') {
      if (!connectorSheetList) return;
      const term = query.trim().toLowerCase();
      const items = CONNECTOR_CATALOG.filter((item) => {
        if (!term) return true;
        return (
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
        );
      });

      if (!items.length) {
        connectorSheetList.innerHTML = `<div class="ai-connector-empty">Nenhum conector encontrado</div>`;
        return;
      }

      connectorSheetList.innerHTML = items.map((item) => {
        const active = activeConnectorIds.includes(item.id);
        return `
          <article class="ai-connector-card" data-connector-id="${esc(item.id)}">
            <div class="ai-connector-card-avatar" aria-hidden="true">
              <img src="${esc(connectorIconUrl(item.icon))}" alt="">
            </div>
            <div class="ai-connector-card-copy">
              <div class="ai-connector-card-title-row">
                <span class="ai-connector-card-name">${esc(item.name)}</span>
                ${active ? '<span class="ai-connector-status">Ativo</span>' : ''}
              </div>
              <p class="ai-connector-card-desc">${esc(item.description)}</p>
            </div>
            <button
              type="button"
              class="ai-connector-card-action ${active ? 'ai-connector-card-action--disconnect' : 'ai-connector-card-action--connect'}"
              data-toggle-connector="${esc(item.id)}"
            >
              ${active ? 'Desativar' : 'Ativar'}
            </button>
          </article>
        `;
      }).join('');
    }

    function openConnectorSheet() {
      closeToolsMenu();
      closeKnowledgeSheet();
      if (connectorSearchInput) connectorSearchInput.value = '';
      renderConnectorSheetList('');
      connectorSheet.classList.add('open');
      connectorSheet.setAttribute('aria-hidden', 'false');
      setTimeout(() => connectorSearchInput?.focus(), 220);
    }

    function closeConnectorSheet() {
      connectorSheet.classList.remove('open');
      connectorSheet.setAttribute('aria-hidden', 'true');
    }

    function toggleConnector(id) {
      const exists = activeConnectorIds.includes(id);
      activeConnectorIds = exists
        ? activeConnectorIds.filter((item) => item !== id)
        : [...activeConnectorIds, id];
      saveActiveConnectorIds(activeConnectorIds);
      renderConnectorsMenu();
      renderConnectorSheetList(connectorSearchInput?.value || '');
    }

    function renderKnowledgeMenu() {
      if (!knowledgeMenuList) return;
      if (!knowledgeBases.length) {
        knowledgeMenuList.innerHTML = `
          <div class="ai-agent-submenu-entry-description" style="padding:8px 12px;color:var(--color-text-low,#405466);font-size:12px;">
            Nenhuma base de conhecimento
          </div>
        `;
        return;
      }

      knowledgeMenuList.innerHTML = knowledgeBases.map((item) => `
        <button type="button" class="ai-agent-tool-item ai-agent-submenu-entry" data-select-label="${esc(item.name)}">
          <span class="ai-agent-tool-item-icon"><img src="${ICON_BASE}folder-open.svg" alt=""></span>
          <span class="ai-agent-submenu-entry-copy">
            <span class="ai-agent-submenu-entry-title">${esc(item.name)}</span>
            <span class="ai-agent-submenu-entry-description">${esc(item.description || 'Base de conhecimento')}</span>
          </span>
        </button>
      `).join('');
    }

    function renderKbSources() {
      if (!kbSourceList) return;
      kbSourceList.innerHTML = KB_SOURCES.map((source) => `
        <button
          type="button"
          class="ai-kb-source-card${kbSelectedSource === source.id ? ' selected' : ''}${source.soon ? ' disabled' : ''}"
          role="radio"
          aria-checked="${kbSelectedSource === source.id ? 'true' : 'false'}"
          ${source.soon ? 'aria-disabled="true"' : ''}
          data-kb-source="${esc(source.id)}"
        >
          <span class="ai-kb-source-radio" aria-hidden="true"></span>
          <span class="ai-kb-source-icon" aria-hidden="true"><img src="${ICON_BASE}${esc(source.icon)}" alt=""></span>
          <span class="ai-kb-source-label">${esc(source.label)}</span>
          ${source.soon ? '<span class="ai-kb-soon">EM BREVE</span>' : ''}
        </button>
      `).join('');
    }

    function setKbAccessDropdown(open) {
      kbAccessWrap?.classList.toggle('open', open);
      kbAccessBtn?.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function showKbStep(step) {
      kbStep = step;
      knowledgeSheet.querySelectorAll('[data-kb-step]').forEach((el) => {
        el.hidden = el.dataset.kbStep !== step;
      });

      if (step === 'create') {
        knowledgeSheetTitle.textContent = 'Nova base de conhecimento';
        kbSecondaryBtn.textContent = 'Cancelar';
        kbSaveExitBtn.hidden = true;
        kbPrimaryBtn.textContent = 'Avançar';
        kbPrimaryBtn.disabled = false;
      } else if (step === 'source') {
        knowledgeSheetTitle.textContent = 'Adicionar arquivos';
        kbSecondaryBtn.textContent = 'Voltar';
        kbSaveExitBtn.hidden = true;
        kbPrimaryBtn.textContent = 'Avançar';
        kbPrimaryBtn.disabled = false;
        renderKbSources();
      } else if (step === 'detail') {
        knowledgeSheetTitle.textContent = 'Adicionar arquivos';
        kbSecondaryBtn.textContent = 'Voltar';
        kbSaveExitBtn.hidden = true;
        kbPrimaryBtn.textContent = 'Adicionar';
        updateKbDetailStep();
      } else {
        knowledgeSheetTitle.textContent = (kbNameInput?.value || '').trim() || 'Arquivos da base';
        kbSecondaryBtn.textContent = 'Voltar';
        kbSaveExitBtn.hidden = false;
        kbPrimaryBtn.textContent = 'Salvar e usar';
        kbPrimaryBtn.disabled = kbPendingItems.length === 0;
        if (kbFilesSearch) kbFilesSearch.value = '';
        renderKbFilesList();
      }
    }

    function updateKbDetailStep() {
      const isFile = kbSelectedSource === 'file';
      kbFileDetail.hidden = !isFile;
      kbResourceDetail.hidden = isFile;

      if (isFile) {
        kbDetailHelper.textContent = 'Adicione arquivos à sua base de conhecimento.';
        kbPrimaryBtn.disabled = kbSelectedFiles.length === 0;
        return;
      }

      const copy = KB_RESOURCE_COPY[kbSelectedSource] || KB_RESOURCE_COPY.site;
      kbDetailHelper.textContent = copy.helper;
      kbResourcePrimaryLabel.textContent = copy.primary;
      kbResourceSecondaryLabel.textContent = copy.secondary;
      kbResourcePrimary.placeholder = copy.primaryPlaceholder;
      kbResourceSecondary.placeholder = copy.secondaryPlaceholder;
      kbPrimaryBtn.disabled = false;
    }

    function formatKbFileSize(bytes) {
      if (!Number.isFinite(bytes) || bytes <= 0) return '-';
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function getKbSourceLabel(sourceId) {
      return KB_SOURCES.find((source) => source.id === sourceId)?.label || 'Arquivo';
    }

    function renderKbFilesList(query = '') {
      if (!kbFilesList) return;
      const term = query.trim().toLowerCase();
      const items = kbPendingItems.filter((item) => (
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term)
      ));

      if (!items.length) {
        kbFilesList.innerHTML = `<div class="ai-kb-files-empty">${
          kbPendingItems.length ? 'Nenhum arquivo encontrado' : 'Nenhum arquivo adicionado'
        }</div>`;
      } else {
        kbFilesList.innerHTML = items.map((item) => `
          <div class="ai-kb-file-row" data-kb-item-id="${esc(item.id)}">
            <span class="ai-kb-file-row-icon" aria-hidden="true">
              <img src="${ICON_BASE}${esc(item.icon || 'file.svg')}" alt="">
            </span>
            <span class="ai-kb-file-row-copy">
              <span class="ai-kb-file-row-name">${esc(item.name)}</span>
              <span class="ai-kb-file-row-meta">
                <span class="ai-kb-file-type">${esc(item.type)}</span>
                <span>${esc(item.size || '-')}</span>
              </span>
            </span>
            <button type="button" class="ai-kb-file-remove" data-remove-kb-item="${esc(item.id)}" title="Remover" aria-label="Remover ${esc(item.name)}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/></svg>
            </button>
          </div>
        `).join('');
      }

      if (kbFilesSummary) {
        const total = kbPendingItems.length;
        kbFilesSummary.textContent = `Exibindo ${items.length} de ${total} ${total === 1 ? 'arquivo' : 'arquivos'}`;
      }
      if (kbStep === 'files') kbPrimaryBtn.disabled = kbPendingItems.length === 0;
    }

    function addCurrentKbItems() {
      const source = KB_SOURCES.find((item) => item.id === kbSelectedSource);

      if (kbSelectedSource === 'file') {
        if (!kbSelectedFiles.length) return false;
        const newItems = kbSelectedFiles.map((file, index) => ({
          id: `kb-item-${Date.now()}-${index}`,
          name: file.name,
          type: (file.name.split('.').pop() || 'Arquivo').toUpperCase(),
          size: formatKbFileSize(file.size),
          source: 'file',
          icon: 'file.svg',
        }));
        kbPendingItems = [...kbPendingItems, ...newItems];
      } else {
        const primary = (kbResourcePrimary?.value || '').trim();
        const secondary = (kbResourceSecondary?.value || '').trim();
        if (!primary) {
          kbResourcePrimary?.focus();
          return false;
        }
        kbPendingItems = [
          ...kbPendingItems,
          {
            id: `kb-item-${Date.now()}`,
            name: secondary || primary,
            type: getKbSourceLabel(kbSelectedSource),
            size: '-',
            source: kbSelectedSource,
            icon: source?.icon || 'page.svg',
            primary,
            secondary,
          },
        ];
      }

      kbSelectedFiles = [];
      if (kbFileInput) kbFileInput.value = '';
      if (kbFileChip) {
        kbFileChip.hidden = true;
        kbFileChip.textContent = '';
      }
      if (kbResourcePrimary) kbResourcePrimary.value = '';
      if (kbResourceSecondary) kbResourceSecondary.value = '';
      return true;
    }

    function resetKnowledgeSheet() {
      kbStep = 'create';
      kbSelectedSource = 'file';
      kbSelectedFiles = [];
      kbPendingItems = [];
      kbSourceReturnStep = 'create';
      if (kbNameInput) kbNameInput.value = '';
      if (kbDescriptionInput) kbDescriptionInput.value = '';
      if (kbAccessInput) kbAccessInput.value = '';
      if (kbAccessLabel) kbAccessLabel.textContent = 'Selecione quem poderá acessar';
      kbAccessBtn?.classList.add('is-placeholder');
      kbNameError?.classList.remove('visible');
      if (kbResourcePrimary) kbResourcePrimary.value = '';
      if (kbResourceSecondary) kbResourceSecondary.value = '';
      if (kbFileInput) kbFileInput.value = '';
      if (kbFileChip) {
        kbFileChip.hidden = true;
        kbFileChip.textContent = '';
      }
      setKbAccessDropdown(false);
      showKbStep('create');
    }

    function openKnowledgeSheet() {
      closeToolsMenu();
      closeConnectorSheet();
      resetKnowledgeSheet();
      knowledgeSheet.classList.add('open');
      knowledgeSheet.setAttribute('aria-hidden', 'false');
      setTimeout(() => kbNameInput?.focus(), 220);
    }

    function closeKnowledgeSheet() {
      knowledgeSheet.classList.remove('open');
      knowledgeSheet.setAttribute('aria-hidden', 'true');
      setKbAccessDropdown(false);
    }

    function createKnowledgeBase(useInChat = true) {
      const name = (kbNameInput?.value || '').trim();
      const description = (kbDescriptionInput?.value || '').trim() || 'Base de conhecimento';
      const access = kbAccessInput?.value || 'privado';
      const id = `kb-${Date.now()}`;

      knowledgeBases = [
        {
          id,
          name,
          description,
          access,
          source: kbPendingItems[0]?.source || kbSelectedSource,
          files: kbPendingItems.map((item) => item.name),
          items: kbPendingItems.map((item) => ({ ...item })),
        },
        ...knowledgeBases,
      ];
      saveKnowledgeBases(knowledgeBases);
      renderKnowledgeMenu();
      closeKnowledgeSheet();
      if (useInChat) setComposerContext(name);
    }

    function handleKbPrimary() {
      if (kbStep === 'create') {
        const name = (kbNameInput?.value || '').trim();
        if (!name) {
          kbNameError?.classList.add('visible');
          kbNameInput?.focus();
          return;
        }
        kbNameError?.classList.remove('visible');
        showKbStep('source');
        return;
      }

      if (kbStep === 'source') {
        showKbStep('detail');
        return;
      }

      if (kbStep === 'detail') {
        if (addCurrentKbItems()) showKbStep('files');
        return;
      }

      createKnowledgeBase(true);
    }

    function handleKbSecondary() {
      if (kbStep === 'create') {
        closeKnowledgeSheet();
        return;
      }
      if (kbStep === 'source') {
        showKbStep(kbSourceReturnStep);
        return;
      }
      if (kbStep === 'detail') {
        showKbStep('source');
        return;
      }
      showKbStep('detail');
    }

    function setComposerContext(label) {
      const prefix = `Usar ${label}: `;
      inputEl.value = inputEl.value.trim() ? `${inputEl.value.trim()} ${prefix}` : prefix;
      autoResize();
      updateSendState();
      closeToolsMenu();
      inputEl.focus();
    }

    function renderComposerTags() {
      if (!composerTagsEl) return;

      if (!activeCreateMode) {
        composerTagsEl.innerHTML = '';
        composerTagsEl.classList.remove('has-tags');
        return;
      }

      composerTagsEl.classList.add('has-tags');
      composerTagsEl.innerHTML = `
        <span class="ai-agent-composer-tag" data-create-mode="${esc(activeCreateMode.id)}">
          <span class="ai-agent-composer-tag-label">${esc(activeCreateMode.tag)}</span>
          <button type="button" class="ai-agent-composer-tag-remove" title="Remover" aria-label="Remover ${esc(activeCreateMode.tag)}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/></svg>
          </button>
        </span>
      `;
    }

    function clearCreateMode() {
      activeCreateMode = null;
      inputEl.placeholder = DEFAULT_INPUT_PLACEHOLDER;
      renderComposerTags();
    }

    function setCreateMode(modeKey) {
      const mode = CREATE_MODES[modeKey];
      if (!mode) {
        setComposerContext(`novo item: ${modeKey}`);
        return;
      }

      activeCreateMode = mode;
      inputEl.placeholder = mode.placeholder;
      renderComposerTags();
      closeToolsMenu();
      inputEl.focus();
    }

    function updateSendState() {
      sendBtn.disabled = !inputEl.value.trim() || isTyping;
    }

    function autoResize() {
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
    }

    function appendMessage(role, text, meta) {
      if (emptyEl) emptyEl.style.display = 'none';

      const msg = document.createElement('div');
      msg.className = `ai-agent-msg ai-agent-msg--${role}`;
      msg.innerHTML = `
        <div class="ai-agent-msg-bubble">${formatText(text)}</div>
        ${meta ? `<div class="ai-agent-msg-meta">${esc(meta)}</div>` : ''}
      `;
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return msg;
    }

    function showTyping() {
      const msg = document.createElement('div');
      msg.className = 'ai-agent-msg ai-agent-msg--agent';
      msg.id = 'ai-agent-typing-msg';
      msg.innerHTML = `
        <div class="ai-agent-msg-bubble">
          <div class="ai-agent-typing" aria-label="Agente digitando">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
      document.getElementById('ai-agent-typing-msg')?.remove();
    }

    function mockReply(userText) {
      const lower = userText.toLowerCase();
      if (lower.includes('adicionar') || lower.includes('novo contato')) {
        return 'Para adicionar um contato, clique em **Adicionar contato** no canto superior direito. Preencha pelo menos o nome e salve.';
      }
      if (lower.includes('filtro')) {
        return 'Abra **Filtrar contatos** na listagem para filtrar por nome, e-mail, empresa, cidade e estado.';
      }
      if (lower.includes('editar')) {
        return 'Clique no nome do contato na tabela para abrir o painel lateral e editar os dados.';
      }
      if (lower.includes('resumo') || lower.includes('lista')) {
        return 'Na listagem você vê nome, e-mail, empresa e outros campos. Use a busca e os filtros para refinar o que aparece.';
      }
      const reply = MOCK_REPLIES[replyIndex % MOCK_REPLIES.length];
      replyIndex += 1;
      return reply;
    }

    function sendMessage(rawText) {
      const text = (rawText || '').trim();
      if (!text || isTyping) return;

      appendMessage('user', text, 'Você');
      inputEl.value = '';
      autoResize();
      updateSendState();

      isTyping = true;
      updateSendState();
      showTyping();

      const delay = 700 + Math.random() * 600;
      setTimeout(() => {
        hideTyping();
        appendMessage('agent', mockReply(text), 'Copiloto');
        isTyping = false;
        updateSendState();
        inputEl.focus();
      }, delay);
    }

    renderConnectorsMenu();
    renderKnowledgeMenu();

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      togglePanel();
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel();
      }
    });

    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', () => {
      if (isConnectorSheetOpen() || isKnowledgeSheetOpen()) return;
      closePanel();
    });

    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleToolsMenu();
    });

    toolsMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const viewButton = e.target.closest('[data-open-tools-view]');
      const backButton = e.target.closest('.ai-agent-submenu-back');
      const actionButton = e.target.closest('[data-tool-action]');
      const selectButton = e.target.closest('[data-select-label]');
      const createButton = e.target.closest('[data-create-label]');
      const openSheetButton = e.target.closest('[data-open-connector-sheet]');
      const openKnowledgeButton = e.target.closest('[data-open-knowledge-sheet]');

      if (viewButton) {
        showToolsView(viewButton.dataset.openToolsView);
        return;
      }
      if (backButton) {
        showToolsView('main');
        return;
      }
      if (actionButton?.dataset.toolAction === 'files') {
        fileInput.click();
        return;
      }
      if (actionButton?.dataset.toolAction === 'drive') {
        setComposerContext('Google Drive');
        return;
      }
      if (openSheetButton) {
        openConnectorSheet();
        return;
      }
      if (openKnowledgeButton) {
        openKnowledgeSheet();
        return;
      }
      if (selectButton) {
        setComposerContext(selectButton.dataset.selectLabel);
        return;
      }
      if (createButton) {
        setCreateMode(createButton.dataset.createLabel);
      }
    });

    composerTagsEl?.addEventListener('click', (e) => {
      if (!e.target.closest('.ai-agent-composer-tag-remove')) return;
      clearCreateMode();
      inputEl.focus();
    });

    connectorSheetClose.addEventListener('click', closeConnectorSheet);

    knowledgeSheetClose.addEventListener('click', closeKnowledgeSheet);
    kbSecondaryBtn?.addEventListener('click', handleKbSecondary);
    kbPrimaryBtn?.addEventListener('click', handleKbPrimary);
    kbSaveExitBtn?.addEventListener('click', () => createKnowledgeBase(false));

    kbAddMoreBtn?.addEventListener('click', () => {
      kbSourceReturnStep = 'files';
      kbSelectedSource = 'file';
      showKbStep('source');
    });

    kbFilesSearch?.addEventListener('input', () => {
      renderKbFilesList(kbFilesSearch.value);
    });

    kbFilesList?.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-remove-kb-item]');
      if (!removeBtn) return;
      kbPendingItems = kbPendingItems.filter((item) => item.id !== removeBtn.dataset.removeKbItem);
      renderKbFilesList(kbFilesSearch?.value || '');
    });

    kbAccessBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      setKbAccessDropdown(!kbAccessWrap.classList.contains('open'));
    });

    kbAccessWrap?.addEventListener('click', (e) => {
      const option = e.target.closest('.ai-kb-access-option');
      if (!option) return;
      const value = option.dataset.value;
      const title = option.querySelector('.ai-kb-access-option-title')?.textContent || '';
      kbAccessInput.value = value;
      kbAccessLabel.textContent = title;
      kbAccessBtn.classList.remove('is-placeholder');
      setKbAccessDropdown(false);
    });

    kbSourceList?.addEventListener('click', (e) => {
      const card = e.target.closest('[data-kb-source]');
      if (!card || card.classList.contains('disabled')) return;
      kbSelectedSource = card.dataset.kbSource;
      renderKbSources();
    });

    kbNameInput?.addEventListener('input', () => {
      if ((kbNameInput.value || '').trim()) kbNameError?.classList.remove('visible');
    });

    function applyKbFiles(files) {
      kbSelectedFiles = Array.from(files || []);
      if (!kbFileChip) return;
      if (!kbSelectedFiles.length) {
        kbFileChip.hidden = true;
        kbFileChip.textContent = '';
      } else {
        kbFileChip.hidden = false;
        kbFileChip.textContent = kbSelectedFiles.length === 1
          ? kbSelectedFiles[0].name
          : `${kbSelectedFiles.length} arquivos selecionados`;
      }
      if (kbStep === 'detail') updateKbDetailStep();
    }

    kbFileInput?.addEventListener('change', () => applyKbFiles(kbFileInput.files));

    ['dragenter', 'dragover'].forEach((eventName) => {
      kbDropzone?.addEventListener(eventName, (e) => {
        e.preventDefault();
        kbDropzone.classList.add('is-dragover');
      });
    });
    ['dragleave', 'drop'].forEach((eventName) => {
      kbDropzone?.addEventListener(eventName, (e) => {
        e.preventDefault();
        kbDropzone.classList.remove('is-dragover');
      });
    });
    kbDropzone?.addEventListener('drop', (e) => {
      applyKbFiles(e.dataTransfer?.files);
    });

    connectorSearchInput?.addEventListener('input', () => {
      renderConnectorSheetList(connectorSearchInput.value);
    });

    connectorSheetList?.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-toggle-connector]');
      if (!toggleBtn) return;
      toggleConnector(toggleBtn.dataset.toggleConnector);
    });

    fileInput.addEventListener('change', () => {
      const files = Array.from(fileInput.files || []);
      if (!files.length) return;
      setComposerContext(files.length === 1 ? `arquivo ${files[0].name}` : `${files.length} arquivos`);
      fileInput.value = '';
    });

    document.addEventListener('click', (e) => {
      if (!toolsMenu.contains(e.target) && !addBtn.contains(e.target)) closeToolsMenu();
      if (kbAccessWrap && !kbAccessWrap.contains(e.target)) setKbAccessDropdown(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (isKnowledgeSheetOpen()) {
        e.preventDefault();
        closeKnowledgeSheet();
        return;
      }
      if (isConnectorSheetOpen()) {
        e.preventDefault();
        closeConnectorSheet();
        return;
      }
      if (isOpen()) {
        e.preventDefault();
        if (toolsMenu.classList.contains('open')) closeToolsMenu();
        else closePanel();
      }
    });

    sendBtn.addEventListener('click', () => sendMessage(inputEl.value));

    inputEl.addEventListener('input', () => {
      updateSendState();
      autoResize();
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value);
      }
    });

    suggestionsEl?.addEventListener('click', (e) => {
      const btn = e.target.closest('.ai-agent-suggestion');
      if (!btn) return;
      sendMessage(btn.textContent);
    });

    window.__aiAgentPanel = {
      open: openPanel,
      close: closePanel,
      toggle: togglePanel,
      openConnectorSheet,
      closeConnectorSheet,
      openKnowledgeSheet,
      closeKnowledgeSheet,
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
