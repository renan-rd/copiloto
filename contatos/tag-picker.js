(function() {
  const TAG_COLORS = ['#E60F57','#0077B2','#FF9800','#6C63FF','#00897B','#9C27B0','#D32F2F','#43A047','#00ACC1','#FFB300','#795548','#3F51B5','#607D8B'];

  function escHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function normalizeLabel(label) {
    return String(label || '').trim().toLowerCase();
  }

  window.__tagPicker = {
    _db: null,
    _allTags: [],
    _selected: new Map(),
    _loaded: false,

    init(db) {
      this._db = db;
      this._bindEvents();
    },

    async ensureTagsLoaded() {
      if (this._loaded || !this._db) return;
      const { data, error } = await this._db.from('claude_tags').select('id,label,color').order('label');
      if (!error && data) {
        this._allTags = data;
        this._loaded = true;
      }
    },

    reset() {
      this._selected.clear();
      this._renderChips();
      const input = document.getElementById('dc-tag-input');
      if (input) input.value = '';
      this._closeDropdown();
    },

    setSelected(tags) {
      this._selected.clear();
      (tags || []).forEach(tag => {
        if (tag && tag.id) {
          const id = String(tag.id);
          this._selected.set(id, { id, label: tag.label, color: tag.color });
        }
      });
      this._renderChips();
    },

    getSelectedIds() {
      return [...this._selected.keys()];
    },

    getSelectedTags() {
      return [...this._selected.values()];
    },

    async loadForContact(contactId) {
      await this.ensureTagsLoaded();
      if (!contactId || !this._db) {
        this.reset();
        return;
      }
      const { data, error } = await this._db
        .from('claude_contato_tags')
        .select('tag_id, claude_tags(id, label, color)')
        .eq('contato_id', contactId);
      if (error) {
        this.reset();
        return;
      }
      const tags = (data || []).map(row => row.claude_tags).filter(Boolean);
      this.setSelected(tags);
    },

    async saveForContact(contactId) {
      if (!contactId || !this._db) return null;
      const tagIds = this.getSelectedIds();
      const { error: delError } = await this._db.from('claude_contato_tags').delete().eq('contato_id', contactId);
      if (delError) return delError;
      if (!tagIds.length) return null;
      const { error: insError } = await this._db.from('claude_contato_tags').insert(
        tagIds.map(tag_id => ({ contato_id: contactId, tag_id }))
      );
      return insError;
    },

    _bindEvents() {
      const input = document.getElementById('dc-tag-input');
      const dropdown = document.getElementById('dc-tag-dropdown');
      const createBtn = document.getElementById('dc-tag-create-btn');
      const optionsEl = document.getElementById('dc-tag-options');
      if (!input || !dropdown || !createBtn || !optionsEl) return;

      input.addEventListener('focus', async () => {
        await this.ensureTagsLoaded();
        this._openDropdown();
        this._renderDropdown();
      });

      input.addEventListener('input', () => {
        this._renderDropdown();
        this._openDropdown();
      });

      input.addEventListener('keydown', async e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          await this._createFromQuery();
        }
      });

      createBtn.addEventListener('click', async e => {
        e.preventDefault();
        await this._createFromQuery();
      });

      optionsEl.addEventListener('change', e => {
        const inputEl = e.target.closest('.tag-picker-check');
        if (!inputEl) return;
        const id = String(inputEl.dataset.tagId || '');
        const tag = this._allTags.find(t => String(t.id) === id);
        if (!tag) return;
        if (inputEl.checked) this._selected.set(id, { id, label: tag.label, color: tag.color });
        else this._selected.delete(id);
        this._renderChips();
      });

      optionsEl.addEventListener('click', e => {
        if (e.target.closest('.tag-picker-check')) return;
        const label = e.target.closest('.tg-checkbox-label');
        if (!label) return;
        const cb = label.querySelector('.tag-picker-check');
        if (!cb || e.target.closest('.tg-checkbox-box')) return;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      });

      document.addEventListener('click', e => {
        if (e.target.closest('#dc-tag-picker')) return;
        this._closeDropdown();
      });
    },

    _openDropdown() {
      const dropdown = document.getElementById('dc-tag-dropdown');
      if (dropdown) dropdown.classList.add('open');
    },

    _closeDropdown() {
      const dropdown = document.getElementById('dc-tag-dropdown');
      if (dropdown) dropdown.classList.remove('open');
    },

    _getQuery() {
      return (document.getElementById('dc-tag-input')?.value || '').trim();
    },

    _filteredTags() {
      const q = normalizeLabel(this._getQuery());
      if (!q) return this._allTags;
      return this._allTags.filter(t => normalizeLabel(t.label).includes(q));
    },

    _renderChips() {
      const chipsEl = document.getElementById('dc-tag-chips');
      if (!chipsEl) return;
      if (!this._selected.size) {
        chipsEl.innerHTML = '';
        return;
      }
      chipsEl.innerHTML = [...this._selected.values()].map(tag => `
        <span class="tag-picker-chip">
          <span class="tag-picker-chip-dot" style="background:${escHtml(tag.color || '#405466')}"></span>
          <span>${escHtml(tag.label)}</span>
          <button type="button" class="tag-picker-chip-remove" data-tag-id="${tag.id}" title="Remover" aria-label="Remover tag">&times;</button>
        </span>`).join('');

      chipsEl.querySelectorAll('.tag-picker-chip-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          this._selected.delete(String(btn.dataset.tagId || ''));
          this._renderChips();
          this._renderDropdown();
        });
      });
    },

    _renderDropdown() {
      const createBtn = document.getElementById('dc-tag-create-btn');
      const optionsEl = document.getElementById('dc-tag-options');
      if (!createBtn || !optionsEl) return;

      const query = this._getQuery();
      const filtered = this._filteredTags();

      createBtn.disabled = !query;
      createBtn.innerHTML = query
        ? `Criar nova tag <span class="tag-picker-create-label">"${escHtml(query)}"</span>`
        : 'Criar nova tag';

      if (!filtered.length) {
        optionsEl.innerHTML = `<div class="tag-picker-empty">Nenhuma tag encontrada</div>`;
        return;
      }

      optionsEl.innerHTML = filtered.map(tag => {
        const checked = this._selected.has(String(tag.id)) ? ' checked' : '';
        const uid = `tag-pick-${tag.id}`;
        return `
          <label class="tg-checkbox-label tag-picker-option" for="${uid}">
            <input class="tg-checkbox-input tag-picker-check" type="checkbox" id="${uid}" data-tag-id="${tag.id}"${checked}>
            <span class="tg-checkbox-box">
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.114 18.16l-5.85-5.85a.9.9 0 010-1.274l1.272-1.272a.9.9 0 011.273 0l3.941 3.94 8.44-8.44a.9.9 0 011.274 0l1.272 1.272a.9.9 0 010 1.273L9.752 18.16a.9.9 0 01-1.273 0z"/>
              </svg>
            </span>
            <span class="tg-checkbox-text tag-picker-option-text">
              <span class="tag-picker-option-dot" style="background:${escHtml(tag.color || '#405466')}"></span>
              ${escHtml(tag.label)}
            </span>
          </label>`;
      }).join('');
    },

    async _createFromQuery() {
      const label = this._getQuery();
      if (!label || !this._db) return;

      await this.ensureTagsLoaded();

      const existing = this._allTags.find(t => normalizeLabel(t.label) === normalizeLabel(label));
      if (existing) {
        this._selected.set(String(existing.id), { id: String(existing.id), label: existing.label, color: existing.color });
        this._renderChips();
        this._renderDropdown();
        document.getElementById('dc-tag-input').value = '';
        return;
      }

      const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
      const { data, error } = await this._db
        .from('claude_tags')
        .insert([{ label, color }])
        .select('id, label, color')
        .single();

      if (error || !data) return;

      this._allTags.push(data);
      this._allTags.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
      this._selected.set(String(data.id), { id: String(data.id), label: data.label, color: data.color });
      document.getElementById('dc-tag-input').value = '';
      this._renderChips();
      this._renderDropdown();
    },
  };
})();
