(function() {
  const OPTIONS = [
    {
      key: 'consentimento',
      label: 'Consentimento',
      description: 'Quando uma pessoa consente o tratamento dos seus dados, de forma livre, inequívoca e informada.',
    },
    {
      key: 'legitimo_interesse',
      label: 'Legítimo interesse',
      description: 'O uso de dados pessoais é alinhado às expectativas da pessoa, sem a necessidade de consentimento.',
    },
    {
      key: 'contrato_pre_existente',
      label: 'Contrato pré-existente',
      description: 'O processamento de dados pessoais é feito por obrigação contratual ou para validar e iniciar um acordo.',
    },
    {
      key: 'obrigacao_legal',
      label: 'Obrigação Legal',
      description: 'O uso de dados pessoais é justificável por lei em casos de obrigação legal, processo judicial ou proteção ao crédito.',
    },
    {
      key: 'interesse_vital',
      label: 'Interesse vital ou Tutela da saúde',
      description: 'O uso de dados pessoais é feito com intuito de proteger a vida, seja do titular do dado ou de outra pessoa.',
    },
    {
      key: 'interesse_publico',
      label: 'Interesse público',
      description: 'O uso de dados pessoais é assegurado pelo interesse público ou por necessidade de autoridade oficial.',
    },
    {
      key: 'comunicacao_direta',
      label: 'Comunicação direta',
      description: 'O uso de dados pessoais é voltado para estabelecer contato direto com a pessoa, para fins de suporte, avisos importantes ou atualizações.',
    },
    {
      key: 'nao_possuo',
      label: 'Não sei dizer / Não possuo Base Legal',
      dividerBefore: true,
    },
  ];

  const CHANNELS = [
    { key: 'email', label: 'Comunicação via E-mail' },
    { key: 'whatsapp', label: 'Comunicação via WhatsApp' },
    { key: 'sms', label: 'Comunicação via SMS' },
    { key: 'telegram', label: 'Comunicação via Telegram' },
    { key: 'facebook', label: 'Comunicação via Facebook' },
    { key: 'messenger', label: 'Comunicação via Messenger' },
    { key: 'comunicacao_direta', label: 'Comunicações direta' },
  ];

  const removeIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

  let activeDropdown = null;
  let dropdownMaxHeight = null;

  function buildDropdownHtml() {
    return OPTIONS.map(opt => {
      const divider = opt.dividerBefore ? '<div class="legal-select-divider" role="separator"></div>' : '';
      const desc = opt.description ? `<div class="legal-select-item-desc">${opt.description}</div>` : '';
      const richClass = opt.description ? ' legal-select-item--rich' : '';
      return `${divider}<div class="legal-select-item${richClass}" role="option" data-value="${opt.key}" tabindex="-1">
        <div class="legal-select-item-title">${opt.label}</div>${desc}
      </div>`;
    }).join('');
  }

  function buildCanalDropdownHtml(selectedCanal, usedCanals) {
    return CHANNELS.map(ch => {
      const disabled = ch.key !== selectedCanal && usedCanals.has(ch.key);
      const disabledClass = disabled ? ' legal-select-item--disabled' : '';
      const ariaDisabled = disabled ? ' aria-disabled="true"' : '';
      return `<div class="legal-select-item${disabledClass}" role="option" data-value="${ch.key}" tabindex="-1"${ariaDisabled}>
        <div class="legal-select-item-title">${ch.label}</div>
      </div>`;
    }).join('');
  }

  function measureDropdownMaxHeight(scrollEl) {
    const richItem = scrollEl.querySelector('.legal-select-item--rich');
    if (!richItem) return 200;
    return Math.ceil(richItem.offsetHeight * 2.5);
  }

  function measureCanalDropdownMaxHeight(scrollEl) {
    const item = scrollEl.querySelector('.legal-select-item');
    if (!item) return 280;
    return Math.ceil(item.offsetHeight * CHANNELS.length);
  }

  function closeActiveDropdown() {
    if (!activeDropdown) return;
    activeDropdown.dropdown.classList.remove('open');
    activeDropdown.trigger.setAttribute('aria-expanded', 'false');
    activeDropdown = null;
  }

  function ensureDropdownMaxHeight(rootEl) {
    if (dropdownMaxHeight) return dropdownMaxHeight;
    const firstScroll = rootEl?.querySelector('.legal-select:not(.legal-canal-select) .legal-select-dropdown-scroll');
    if (!firstScroll) return 200;
    const dropdown = firstScroll.parentElement;
    dropdown.classList.add('open');
    dropdown.style.visibility = 'hidden';
    dropdownMaxHeight = measureDropdownMaxHeight(firstScroll) || 200;
    dropdown.classList.remove('open');
    dropdown.style.visibility = '';
    rootEl.querySelectorAll('.legal-select:not(.legal-canal-select) .legal-select-dropdown-scroll').forEach(el => {
      el.style.maxHeight = dropdownMaxHeight + 'px';
    });
    return dropdownMaxHeight;
  }

  function setLegalSelectValue(wrap, value) {
    const trigger = wrap.querySelector('.legal-select-trigger');
    const valueEl = wrap.querySelector('.legal-select-value');
    const hidden  = wrap.querySelector('input[type="hidden"]');
    const option  = OPTIONS.find(o => o.key === value);

    if (hidden) hidden.value = value || '';
    if (option) {
      valueEl.textContent = option.label;
      valueEl.classList.remove('is-placeholder');
    } else {
      valueEl.textContent = 'Selecione uma opção';
      valueEl.classList.add('is-placeholder');
    }
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function setCanalSelectValue(wrap, value) {
    const trigger = wrap.querySelector('.legal-select-trigger');
    const valueEl = wrap.querySelector('.legal-select-value');
    const hidden  = wrap.querySelector('.dc-legal-canal');
    const channel = CHANNELS.find(c => c.key === value);

    if (hidden) hidden.value = value || '';
    if (channel) {
      valueEl.textContent = channel.label;
      valueEl.classList.remove('is-placeholder');
    } else {
      valueEl.textContent = 'Selecione um canal';
      valueEl.classList.add('is-placeholder');
    }
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  function initLegalSelect(wrap, rootEl) {
    const trigger  = wrap.querySelector('.legal-select-trigger');
    const dropdown = document.createElement('div');
    dropdown.className = 'legal-select-dropdown';
    dropdown.setAttribute('role', 'listbox');
    dropdown.innerHTML = `<div class="legal-select-dropdown-scroll">${buildDropdownHtml()}</div>`;
    wrap.appendChild(dropdown);

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      ensureDropdownMaxHeight(rootEl || document);
      const isOpen = activeDropdown && activeDropdown.wrap === wrap;
      closeActiveDropdown();
      if (!isOpen) {
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        activeDropdown = { wrap, trigger, dropdown };
      }
    });

    dropdown.querySelectorAll('.legal-select-item').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        setLegalSelectValue(wrap, item.dataset.value);
        dropdown.classList.remove('open');
        activeDropdown = null;
      });
    });
  }

  function bindCanalDropdownItems(canalWrap, row, picker) {
    const dropdown = canalWrap.querySelector('.legal-select-dropdown');
    if (!dropdown || dropdown._canalBound) return;

    dropdown.addEventListener('mousedown', e => {
      const item = e.target.closest('.legal-select-item:not(.legal-select-item--disabled)');
      if (!item || !dropdown.contains(item)) return;
      e.preventDefault();
      setCanalSelectValue(canalWrap, item.dataset.value);
      dropdown.classList.remove('open');
      activeDropdown = null;
      const basisWrap = row.querySelector('.legal-basis-select');
      if (basisWrap) basisWrap.dataset.canal = item.dataset.value;
      picker._refreshCanalOptions();
    });
    dropdown._canalBound = true;
  }

  function renderCanalDropdown(canalWrap, row, usedCanals) {
    const current = canalWrap.querySelector('.dc-legal-canal')?.value || '';
    let dropdown = canalWrap.querySelector('.legal-select-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'legal-select-dropdown';
      dropdown.setAttribute('role', 'listbox');
      canalWrap.appendChild(dropdown);
    }

    dropdown.innerHTML = `<div class="legal-select-dropdown-scroll">${buildCanalDropdownHtml(current, usedCanals)}</div>`;
    const scroll = dropdown.querySelector('.legal-select-dropdown-scroll');
    if (scroll) {
      dropdown.classList.add('open');
      dropdown.style.visibility = 'hidden';
      scroll.style.maxHeight = measureCanalDropdownMaxHeight(scroll) + 'px';
      dropdown.classList.remove('open');
      dropdown.style.visibility = '';
    }
    return dropdown;
  }

  function initCanalSelect(canalWrap, row, rootEl, picker) {
    const trigger = canalWrap.querySelector('.legal-select-trigger');
    renderCanalDropdown(canalWrap, row, picker._getUsedCanals(row));
    bindCanalDropdownItems(canalWrap, row, picker);

    if (!trigger._canalBound) {
      trigger.addEventListener('click', e => {
        e.stopPropagation();
        picker._refreshCanalDropdown(canalWrap, row);
        const dropdown = canalWrap.querySelector('.legal-select-dropdown');
        const isOpen = activeDropdown && activeDropdown.wrap === canalWrap;
        closeActiveDropdown();
        if (!isOpen) {
          dropdown.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
          activeDropdown = { wrap: canalWrap, trigger, dropdown };
        }
      });
      trigger._canalBound = true;
    }
  }

  window.__legalBasisPicker = {
    OPTIONS,
    CHANNELS,
    buildDropdownHtml,
    measureDropdownMaxHeight,
    closeActiveDropdown,
    ensureDropdownMaxHeight,
    setLegalSelectValue,
    setCanalSelectValue,
    initLegalSelect,
    initCanalSelect,

    _db: null,
    _container: null,
    _addBtn: null,
    _bound: false,

    init(db) {
      this._db = db;
      this._container = document.getElementById('dc-legal-basis-container');
      this._addBtn = document.getElementById('dc-add-legal-basis-btn');
      if (!this._container) return;
      if (!this._bound) {
        this._bindEvents();
        this._bound = true;
      }
      this.reset();
    },

    _bindEvents() {
      if (this._addBtn) {
        this._addBtn.addEventListener('click', () => this.addRow());
      }
      document.addEventListener('click', e => {
        if (!e.target.closest('.legal-select')) closeActiveDropdown();
      });
    },

    _getUsedCanals(excludeRow) {
      const used = new Set();
      this._container.querySelectorAll('.legal-basis-card').forEach(row => {
        if (row === excludeRow) return;
        const canal = row.querySelector('.dc-legal-canal')?.value;
        if (canal) used.add(canal);
      });
      return used;
    },

    _refreshCanalDropdown(canalWrap, row) {
      const wasOpen = activeDropdown && activeDropdown.wrap === canalWrap;
      renderCanalDropdown(canalWrap, row, this._getUsedCanals(row));
      bindCanalDropdownItems(canalWrap, row, this);
      if (wasOpen) {
        const dropdown = canalWrap.querySelector('.legal-select-dropdown');
        const trigger = canalWrap.querySelector('.legal-select-trigger');
        dropdown?.classList.add('open');
        trigger?.setAttribute('aria-expanded', 'true');
        activeDropdown = { wrap: canalWrap, trigger, dropdown };
      }
    },

    _refreshCanalOptions() {
      this._container.querySelectorAll('.legal-basis-card').forEach(row => {
        const canalWrap = row.querySelector('.legal-canal-select');
        if (!canalWrap) return;
        const current = canalWrap.querySelector('.dc-legal-canal')?.value || '';
        this._refreshCanalDropdown(canalWrap, row);
        const basisWrap = row.querySelector('.legal-basis-select');
        if (basisWrap) basisWrap.dataset.canal = current;
      });
      this._updateAddButton();
    },

    _updateAddButton() {
      if (!this._addBtn) return;
      const count = this._container.querySelectorAll('.legal-basis-card').length;
      this._addBtn.style.display = count >= CHANNELS.length ? 'none' : '';
    },

    _createRow(canal, baseLegal, removable) {
      const row = document.createElement('div');
      row.className = 'legal-basis-card';
      row.innerHTML = `
        <div class="legal-select legal-canal-select">
          <button type="button" class="legal-select-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Canal de comunicação">
            <span class="legal-select-value is-placeholder">Selecione um canal</span>
            <svg class="legal-select-caret" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          <input type="hidden" class="dc-legal-canal" value="">
        </div>
        <div class="legal-select legal-basis-select" data-canal="">
          <button type="button" class="legal-select-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Base legal">
            <span class="legal-select-value is-placeholder">Selecione uma opção</span>
            <svg class="legal-select-caret" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          <input type="hidden" value="">
        </div>
        ${removable ? `<button type="button" class="legal-basis-remove-btn" title="Remover" aria-label="Remover canal">${removeIcon}<span>Remover</span></button>` : ''}`;

      const canalWrap = row.querySelector('.legal-canal-select');
      initCanalSelect(canalWrap, row, this._container, this);

      if (removable) {
        row.querySelector('.legal-basis-remove-btn').addEventListener('click', () => {
          row.remove();
          this._refreshCanalOptions();
        });
      }

      const legalWrap = row.querySelector('.legal-basis-select');
      initLegalSelect(legalWrap, this._container);

      if (canal) {
        setCanalSelectValue(canalWrap, canal);
        legalWrap.dataset.canal = canal;
      }
      if (baseLegal) setLegalSelectValue(legalWrap, baseLegal);

      return row;
    },

    addRow(canal, baseLegal) {
      const row = this._createRow(canal, baseLegal, true);
      this._container.appendChild(row);
      this._refreshCanalOptions();
      return row;
    },

    reset() {
      closeActiveDropdown();
      if (!this._container) return;
      this._container.innerHTML = '';
      this._container.appendChild(this._createRow('', '', false));
      this._refreshCanalOptions();
    },

    setRows(rows) {
      closeActiveDropdown();
      if (!this._container) return;
      this._container.innerHTML = '';
      const items = (rows || []).filter(r => r && r.canal);
      if (!items.length) {
        this._container.appendChild(this._createRow('', '', false));
      } else {
        items.forEach(item => {
          this._container.appendChild(this._createRow(item.canal, item.base_legal || '', items.length > 1));
        });
      }
      this._refreshCanalOptions();
    },

    _getContainer() {
      return document.getElementById('dc-legal-basis-container') || this._container;
    },

    collectRows() {
      const container = this._getContainer();
      if (!container) return [];
      const rows = [];
      container.querySelectorAll('.legal-basis-card').forEach(row => {
        const canal = row.querySelector('.dc-legal-canal')?.value || '';
        const baseLegal = row.querySelector('.legal-basis-select input[type="hidden"]')?.value || '';
        if (canal && baseLegal) rows.push({ canal, base_legal: baseLegal });
      });
      return rows;
    },

    async loadForContact(contactId) {
      const db = this._db || window.__sbClient;
      if (!contactId || !db) {
        this.reset();
        return;
      }
      const { data, error } = await db
        .from('claude_contato_bases_legais')
        .select('canal, base_legal, status')
        .eq('contato_id', contactId)
        .eq('status', 'opt_in');

      if (error) {
        this.reset();
        return;
      }

      const rows = (data || [])
        .filter(r => r.base_legal)
        .sort((a, b) => {
          const ai = CHANNELS.findIndex(c => c.key === a.canal);
          const bi = CHANNELS.findIndex(c => c.key === b.canal);
          return ai - bi;
        });

      this.setRows(rows);
    },

    async saveForContact(contactId) {
      const db = this._db || window.__sbClient;
      if (!contactId || !db) return null;

      const rows = this.collectRows();
      const canalKeys = new Set(rows.map(r => r.canal));
      const now = new Date().toISOString();

      const { data: existing, error: fetchError } = await db
        .from('claude_contato_bases_legais')
        .select('canal')
        .eq('contato_id', contactId);
      if (fetchError) return fetchError;

      const toRemove = (existing || [])
        .map(r => r.canal)
        .filter(canal => !canalKeys.has(canal));

      for (const canal of toRemove) {
        const { error: delError } = await db
          .from('claude_contato_bases_legais')
          .delete()
          .eq('contato_id', contactId)
          .eq('canal', canal);
        if (delError) return delError;
      }

      if (!rows.length) return null;

      const { error: upsertError } = await db
        .from('claude_contato_bases_legais')
        .upsert(
          rows.map(r => ({
            contato_id: contactId,
            canal: r.canal,
            status: 'opt_in',
            base_legal: r.base_legal,
            atualizado_em: now,
          })),
          { onConflict: 'contato_id,canal' }
        );
      return upsertError;
    },
  };
})();
