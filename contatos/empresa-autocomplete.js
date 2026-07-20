(function() {
  function escHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function companyKey(nome, cnpj) {
    return `${String(nome || '').trim().toLowerCase()}::${String(cnpj || '').replace(/\D/g, '')}`;
  }

  window.__empresaAutocomplete = {
    _db: null,
    _debounceTimer: null,
    _pairs: [],
    _suppressNextSearch: false,

    init(db) {
      this._db = db;
      this._pairs = [];
      this._ensureCloseListener();
      this.bindPair({
        nomeInputId: 'dc-empresa-nome',
        cnpjInputId: 'dc-empresa-cnpj',
        nomeDropdownId: 'dc-empresa-nome-dropdown',
        cnpjDropdownId: 'dc-empresa-cnpj-dropdown',
      });
    },

    ensureDb(db) {
      this._db = db;
      this._ensureCloseListener();
    },

    _ensureCloseListener() {
      if (this._closeBound) return;
      document.addEventListener('click', e => {
        if (!e.target.closest('.empresa-autocomplete')) this.close();
      });
      this._closeBound = true;
    },

    bindNomeOnly({ nomeInputId, nomeDropdownId }) {
      const pair = {
        nomeInput: document.getElementById(nomeInputId),
        cnpjInput: null,
        nomeDropdown: document.getElementById(nomeDropdownId),
        cnpjDropdown: null,
      };
      if (!pair.nomeInput || !pair.nomeDropdown) return;
      this._pairs.push(pair);
      this._bindField('nome', pair.nomeInput, pair.nomeDropdown, pair);
    },

    bindPair({ nomeInputId, cnpjInputId, nomeDropdownId, cnpjDropdownId }) {
      const pair = {
        nomeInput: document.getElementById(nomeInputId),
        cnpjInput: document.getElementById(cnpjInputId),
        nomeDropdown: document.getElementById(nomeDropdownId),
        cnpjDropdown: document.getElementById(cnpjDropdownId),
      };
      if (!pair.nomeInput || !pair.cnpjInput || !pair.nomeDropdown || !pair.cnpjDropdown) return;
      this._pairs.push(pair);
      this._bindField('nome', pair.nomeInput, pair.nomeDropdown, pair);
      this._bindField('cnpj', pair.cnpjInput, pair.cnpjDropdown, pair);
    },

    close() {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = null;
      this._pairs.forEach(pair => {
        [pair.nomeDropdown, pair.cnpjDropdown].filter(Boolean).forEach(dropdown => {
          dropdown.hidden = true;
          dropdown.innerHTML = '';
        });
      });
    },

    _bindField(field, input, dropdown, pair) {
      input.setAttribute('autocomplete', 'off');

      input.addEventListener('input', () => {
        if (this._suppressNextSearch) {
          this._suppressNextSearch = false;
          return;
        }
        this._scheduleSearch(field, input, dropdown);
      });

      input.addEventListener('focus', () => {
        const q = input.value.trim();
        if (q.length >= 2) this._scheduleSearch(field, input, dropdown, 0);
      });

      input.addEventListener('keydown', e => {
        if (e.key === 'Escape') this.close();
      });

      dropdown.addEventListener('mousedown', e => {
        const item = e.target.closest('.empresa-autocomplete-item');
        if (!item) return;
        e.preventDefault();
        this._selectCompany(item.dataset.nome || '', item.dataset.cnpj || '', pair);
      });
    },

    _scheduleSearch(field, input, dropdown, delay = 250) {
      clearTimeout(this._debounceTimer);
      const q = input.value.trim();
      if (q.length < 2) {
        dropdown.hidden = true;
        dropdown.innerHTML = '';
        return;
      }
      this._debounceTimer = setTimeout(() => this._search(field, q, dropdown), delay);
    },

    async _search(field, query, dropdown) {
      if (!this._db) return;

      let builder = this._db
        .from('claude_contatos')
        .select('empresa_nome, empresa_cnpj')
        .not('empresa_nome', 'is', null)
        .neq('empresa_nome', '')
        .limit(40);

      if (field === 'nome') {
        builder = builder.ilike('empresa_nome', `%${query}%`);
      } else {
        const digits = query.replace(/\D/g, '');
        builder = builder.ilike('empresa_cnpj', `%${digits.length >= 3 ? digits : query}%`);
      }

      const { data, error } = await builder;
      if (error) {
        dropdown.hidden = true;
        dropdown.innerHTML = '';
        return;
      }

      const seen = new Map();
      (data || []).forEach(row => {
        const nome = (row.empresa_nome || '').trim();
        if (!nome) return;
        const cnpj = (row.empresa_cnpj || '').trim();
        const key = companyKey(nome, cnpj);
        if (!seen.has(key)) seen.set(key, { nome, cnpj });
      });

      const results = [...seen.values()].slice(0, 8);
      this._renderDropdown(dropdown, results);
    },

    _renderDropdown(dropdown, results) {
      if (!results.length) {
        dropdown.hidden = true;
        dropdown.innerHTML = '';
        return;
      }

      dropdown.innerHTML = results.map(company => `
        <button type="button" class="empresa-autocomplete-item" data-nome="${escHtml(company.nome)}" data-cnpj="${escHtml(company.cnpj)}" role="option">
          <span class="empresa-autocomplete-item-main">${escHtml(company.nome)}</span>
          ${company.cnpj ? `<span class="empresa-autocomplete-item-sub">${escHtml(company.cnpj)}</span>` : ''}
        </button>
      `).join('');
      dropdown.hidden = false;
    },

    _selectCompany(nome, cnpj, pair) {
      this._suppressNextSearch = true;
      pair.nomeInput.value = nome;
      if (pair.cnpjInput) pair.cnpjInput.value = cnpj;
      this.close();
      requestAnimationFrame(() => { this._suppressNextSearch = false; });
      pair.nomeInput.focus();
    },
  };
})();
