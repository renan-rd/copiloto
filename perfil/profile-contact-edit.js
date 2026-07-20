(function() {
  try {
    const drawer = document.getElementById("drawer-add-contact");
    const content = document.querySelector(".content");
    const detailPanel = document.getElementById("detail-panel");
    const titleEl = document.getElementById("drawer-title");
    const closeBtn = document.getElementById("drawer-close-btn");
    const cancelBtn = document.getElementById("drawer-cancel-btn");
    const saveBtn = document.getElementById("drawer-save-btn");
    const form = document.getElementById("add-contact-form");
    const errorEl = document.getElementById("drawer-form-error");
    if (!drawer || !detailPanel || !content || !form || !saveBtn || !errorEl) return;

    const db = window.__sbClient;
    if (!db) return;

    window.__legalBasisPicker?.init(db);
    window.__empresaAutocomplete?.init(db);

    let editContactId = null;

    drawer.classList.remove('open');
    detailPanel.appendChild(drawer);

    // ── Social selector (drawer) ──────────────────────────
    let dcActiveSocial = 'instagram';
    const dcSocialTrigger = document.getElementById('dc-social-trigger');
    const dcSocialIcon    = document.getElementById('dc-social-icon');
    const dcSocialDrop    = document.getElementById('dc-social-dropdown');
    if (!dcSocialTrigger || !dcSocialIcon || !dcSocialDrop) return;

    // Build dropdown from shared data
    dcSocialDrop.innerHTML = (window.__socialNetworks || []).map(n =>
      `<div class="social-dropdown-item${n.key==='instagram'?' active':''}" data-key="${n.key}" data-color="${n.color}">
         <svg viewBox="0 0 24 24" width="20" height="20" fill="${n.color}">${n.svg}</svg>
         ${n.label}
       </div>`).join('');

    function dcSetSocial(key) {
      const net = (window.__socialNetworks || []).find(n => n.key === key) || window.__socialNetworks[0];
      dcActiveSocial = net.key;
      dcSocialIcon.setAttribute('fill', net.color);
      dcSocialIcon.innerHTML = net.svg;
      dcSocialDrop.querySelectorAll('.social-dropdown-item').forEach(i => i.classList.toggle('active', i.dataset.key === net.key));
    }

    dcSocialTrigger.addEventListener('click', e => { e.stopPropagation(); dcSocialDrop.classList.toggle('open'); });
    document.addEventListener('click', e => { if (!dcSocialDrop.contains(e.target) && e.target !== dcSocialTrigger) dcSocialDrop.classList.remove('open'); });
    dcSocialDrop.querySelectorAll('.social-dropdown-item').forEach(item => {
      item.addEventListener('click', () => { dcSetSocial(item.dataset.key); dcSocialDrop.classList.remove('open'); });
    });

    function setField(id, value) {
      const el = document.getElementById(id);
      if (el) el.value = value || '';
    }

    // ── Avatar upload ─────────────────────────────────────
    let dcAvatarData = null; // base64 or existing URL

    const avatarWrap    = document.getElementById('dc-avatar-wrap');
    const avatarPreview = document.getElementById('dc-avatar-preview');
    const avatarInput   = document.getElementById('dc-avatar-input');
    const avatarBtn     = document.getElementById('dc-avatar-btn');

    function renderDrawerAvatar(nome, imageUrl) {
      if (imageUrl) {
        avatarPreview.innerHTML = `<img src="${imageUrl}" alt="${escHtml(nome||'')}">`;
      } else if (nome && nome.trim()) {
        const gi = window.__getInitials || (n => n[0].toUpperCase());
        const gc = window.__getColor    || (() => '#6c63ff');
        const initials = gi(nome.trim());
        const color    = gc(nome.trim());
        avatarPreview.innerHTML = `<svg viewBox="0 0 72 72" width="72" height="72"><circle cx="36" cy="36" r="36" fill="${color}"/><text x="36" y="46" text-anchor="middle" font-size="26" fill="#fff" font-weight="700" font-family="DM Sans,sans-serif">${initials}</text></svg>`;
      } else {
        avatarPreview.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.125 19H3.875C2.83945 19 2 18.1605 2 17.125V5.875C2 4.83945 2.83945 4 3.875 4H20.125C21.1605 4 22 4.83945 22 5.875V17.125C22 18.1605 21.1605 19 20.125 19ZM6.375 6.1875C5.16688 6.1875 4.1875 7.16688 4.1875 8.375C4.1875 9.58312 5.16688 10.5625 6.375 10.5625C7.58312 10.5625 8.5625 9.58312 8.5625 8.375C8.5625 7.16688 7.58312 6.1875 6.375 6.1875ZM4.5 16.5H19.5V12.125L16.0814 8.70645C15.8984 8.5234 15.6016 8.5234 15.4185 8.70645L10.125 14L7.95645 11.8314C7.7734 11.6484 7.4766 11.6484 7.29352 11.8314L4.5 14.625V16.5Z" fill="#596B7A"/></svg>`;
      }
    }

    avatarBtn.addEventListener('click', () => avatarInput.click());

    avatarInput.addEventListener('change', () => {
      const file = avatarInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        dcAvatarData = e.target.result;
        renderDrawerAvatar(document.getElementById('dc-nome').value, dcAvatarData);
      };
      reader.readAsDataURL(file);
      avatarInput.value = ''; // reset so same file can be re-selected
    });

    // Update initials live while typing name (only if no photo chosen)
    document.getElementById('dc-nome').addEventListener('input', e => {
      if (!dcAvatarData) renderDrawerAvatar(e.target.value, null);
    });

    // ── Multi-field helpers ───────────────────────────────
    const emailsContainer = document.getElementById('dc-emails-container');
    const phonesContainer = document.getElementById('dc-phones-container');
    const socialsContainer = document.getElementById('dc-socials-container');

    const removeIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

    function escHtml(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }





    document.querySelectorAll('.overview-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        document.querySelectorAll('.overview-tag').forEach(t => t.classList.remove('is-active'));
        tag.classList.add('is-active');
      });
    });

    function addExtraEmailRow(value) {
      const row = document.createElement('div');
      row.className = 'multi-field-row';
      row.innerHTML = `<input class="drawer-input dc-extra-email" type="email" placeholder="Digite um e-mail" value="${escHtml(value)}"><button type="button" class="remove-field-btn" title="Remover">${removeIcon}</button>`;
      row.querySelector('.remove-field-btn').addEventListener('click', () => row.remove());
      emailsContainer.appendChild(row);
    }

    function addExtraPhoneRow(value) {
      const COUNTRIES = window.__countries || [];
      const row = document.createElement('div');
      row.className = 'multi-field-row dc-extra-phone-row';

      const phoneField = document.createElement('div');
      phoneField.className = 'phone-field';
      phoneField.style.flex = '1';
      phoneField.innerHTML = `
        <div class="phone-field-prefix">
          <button class="phone-country-trigger" type="button" aria-label="Selecionar país" aria-expanded="false">
            <div class="phone-flag">${COUNTRIES[0]?.flag || ''}</div>
            <svg class="phone-caret" viewBox="0 0 24 24"><path d="M8.54 10h6.92c.48 0 .72.639.381 1.012l-3.46 3.814a.504.504 0 01-.761 0l-3.461-3.814c-.34-.373-.1-1.012.38-1.012z"/></svg>
          </button>
          <span class="phone-calling-code">${COUNTRIES[0]?.dial || '+55'}</span>
        </div>
        <div class="phone-divider"></div>
        <input class="phone-input" type="tel" placeholder="${(COUNTRIES[0]?.mask||'## #####-####').replace(/#/g,'9')}" autocomplete="tel">
        <div class="phone-dropdown" role="listbox" aria-label="Selecionar país">
          <div class="phone-dropdown-search"><input type="text" placeholder="Buscar país..." aria-label="Buscar país"></div>
          <div class="phone-dropdown-items"></div>
        </div>`;

      let selectedCountry = COUNTRIES[0];
      let dropOpen = false;
      const trigEl  = phoneField.querySelector('.phone-country-trigger');
      const flagEl2 = phoneField.querySelector('.phone-flag');
      const codeEl2 = phoneField.querySelector('.phone-calling-code');
      const dropEl  = phoneField.querySelector('.phone-dropdown');
      const srchEl  = phoneField.querySelector('.phone-dropdown-search input');
      const lstEl   = phoneField.querySelector('.phone-dropdown-items');
      const inpEl   = phoneField.querySelector('.phone-input');

      function applyMask2(v, mask) {
        const d = v.replace(/\D/g,''); let r='', di=0;
        for(let i=0;i<mask.length&&di<d.length;i++) r += mask[i]==='#' ? d[di++] : mask[i];
        return r;
      }
      function selectCountry2(c) {
        selectedCountry=c; flagEl2.innerHTML=c.flag; codeEl2.textContent=c.dial;
        inpEl.value=applyMask2(inpEl.value,c.mask); inpEl.placeholder=c.mask.replace(/#/g,'9');
        dropEl.classList.remove('open'); trigEl.setAttribute('aria-expanded','false'); dropOpen=false; inpEl.focus();
      }
      function renderList2(q) {
        const f=(q||'').toLowerCase();
        const items=COUNTRIES.filter(c=>c.name.toLowerCase().includes(f)||c.dial.includes(f)||c.code.toLowerCase().includes(f));
        lstEl.innerHTML=items.map(c=>`<div class="phone-dropdown-item${c.code===selectedCountry.code?' active':''}" data-code="${c.code}"><div class="item-flag">${c.flag}</div><span class="item-name">${c.name}</span><span class="item-code">${c.dial}</span></div>`).join('');
        lstEl.querySelectorAll('.phone-dropdown-item').forEach(item=>item.addEventListener('mousedown',e=>{e.preventDefault();const c=COUNTRIES.find(x=>x.code===item.dataset.code);if(c)selectCountry2(c);}));
      }
      trigEl.addEventListener('click', e=>{ e.stopPropagation(); if(dropOpen){dropEl.classList.remove('open');trigEl.setAttribute('aria-expanded','false');dropOpen=false;}else{dropOpen=true;dropEl.classList.add('open');trigEl.setAttribute('aria-expanded','true');srchEl.value='';renderList2('');srchEl.focus();} });
      srchEl.addEventListener('input', ()=>renderList2(srchEl.value));
      inpEl.addEventListener('input', ()=>{ inpEl.value=applyMask2(inpEl.value, selectedCountry.mask); });
      const closeHandler2 = e=>{ if(!dropEl.contains(e.target)&&e.target!==trigEl){dropEl.classList.remove('open');trigEl.setAttribute('aria-expanded','false');dropOpen=false;} };
      document.addEventListener('click', closeHandler2);

      // Pre-fill value
      if (value) {
        const sorted=[...COUNTRIES].sort((a,b)=>b.dial.length-a.dial.length);
        const match=sorted.find(c=>value.startsWith(c.dial));
        const country=match||COUNTRIES[0];
        if(match) selectCountry2(country);
        inpEl.value=applyMask2(value.replace(country.dial,''),country.mask);
      } else {
        selectCountry2(COUNTRIES[0]);
      }

      row._getPhoneValue = () => { const d=inpEl.value.replace(/\D/g,''); return d ? selectedCountry.dial+d : null; };

      const removeBtn = document.createElement('button');
      removeBtn.type='button'; removeBtn.className='remove-field-btn'; removeBtn.title='Remover'; removeBtn.innerHTML=removeIcon;
      removeBtn.addEventListener('click', ()=>{ document.removeEventListener('click',closeHandler2); row.remove(); });

      row.appendChild(phoneField);
      row.appendChild(removeBtn);
      phonesContainer.appendChild(row);
      return row;
    }

    function addExtraSocialRow(rede, usuario) {
      const net = (window.__socialNetworks||[]).find(n=>n.key===rede) || window.__socialNetworks[0];
      let activeSocial = net ? net.key : 'instagram';
      const row = document.createElement('div');
      row.className = 'multi-field-row social-field dc-extra-social-row';
      row.innerHTML = `
        <div class="social-selector">
          <button class="social-trigger dc-extra-social-trigger" type="button" aria-label="Selecionar rede social">
            <svg class="social-icon dc-extra-social-icon" viewBox="0 0 24 24" width="20" height="20" fill="${net.color}">${net.svg}</svg>
            <svg class="caret" viewBox="0 0 24 24" width="16" height="16" fill="#405466"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          <div class="social-dropdown dc-extra-social-dropdown">
            ${(window.__socialNetworks||[]).map(n=>`<div class="social-dropdown-item${n.key===activeSocial?' active':''}" data-key="${n.key}" data-color="${n.color}"><svg viewBox="0 0 24 24" width="20" height="20" fill="${n.color}">${n.svg}</svg>${n.label}</div>`).join('')}
          </div>
        </div>
        <input class="drawer-input dc-extra-social-usuario" type="text" placeholder="Nome na rede social" value="${escHtml(usuario||'')}" style="flex:1">
        <button type="button" class="remove-field-btn" title="Remover">${removeIcon}</button>`;
      const trigger = row.querySelector('.dc-extra-social-trigger');
      const icon    = row.querySelector('.dc-extra-social-icon');
      const drop    = row.querySelector('.dc-extra-social-dropdown');
      trigger.addEventListener('click', e => { e.stopPropagation(); drop.classList.toggle('open'); });
      const closeDropFn = e => { if(!drop.contains(e.target) && e.target!==trigger) drop.classList.remove('open'); };
      document.addEventListener('click', closeDropFn);
      drop.querySelectorAll('.social-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          const n = (window.__socialNetworks||[]).find(n=>n.key===item.dataset.key);
          if(n){ activeSocial=n.key; icon.setAttribute('fill',n.color); icon.innerHTML=n.svg; drop.querySelectorAll('.social-dropdown-item').forEach(i=>i.classList.toggle('active',i.dataset.key===n.key)); }
          drop.classList.remove('open');
        });
      });
      row.querySelector('.remove-field-btn').addEventListener('click', () => { document.removeEventListener('click', closeDropFn); row.remove(); });
      row._getActiveSocial = () => activeSocial;
      socialsContainer.appendChild(row);
      return row;
    }

    function clearExtraRows() {
      emailsContainer.querySelectorAll('.dc-extra-email').forEach(el => el.closest('.multi-field-row').remove());
      phonesContainer.querySelectorAll('.dc-extra-phone-row').forEach(el => el.remove());
      socialsContainer.querySelectorAll('.dc-extra-social-row').forEach(el => el.remove());
    }

    document.getElementById('dc-add-email-btn').addEventListener('click', () => addExtraEmailRow(''));
    document.getElementById('dc-add-phone-btn').addEventListener('click', () => addExtraPhoneRow(''));
    document.getElementById('dc-add-social-btn').addEventListener('click', () => addExtraSocialRow('instagram', ''));
    async function openEditForm(contactId) {
      editContactId = contactId;
      titleEl.textContent = 'Editar contato';
      saveBtn.textContent = 'Salvar alterações';
      form.reset();
      errorEl.style.display = 'none';

      // Show loading state in nome field while fetching
      const nomeEl = document.getElementById('dc-nome');
      nomeEl.placeholder = 'Carregando...';
      nomeEl.disabled = true;
      saveBtn.disabled = true;

      const { data, error } = await db
        .from('claude_contatos')
        .select('*')
        .eq('id', contactId)
        .single();

      nomeEl.disabled = false;
      nomeEl.placeholder = 'Digite um nome';
      saveBtn.disabled = false;

      if (error || !data) {
        errorEl.textContent = 'Erro ao carregar contato: ' + (error?.message || 'não encontrado');
        errorEl.style.display = 'block';
        return;
      }

      // Populate avatar
      dcAvatarData = data.foto_perfil || null;
      renderDrawerAvatar(data.nome, dcAvatarData);

      // Populate all fields
      setField('dc-nome',         data.nome);
      setField('dc-status',       data.status || 'Lead');
      setField('dc-cargo',        data.cargo);
      setField('dc-cpf',          data.cpf);
      setField('dc-rg',           data.rg);
      setField('dc-nascimento',   data.data_nascimento);
      setField('dc-cep',          data.cep);
      setField('dc-rua',          data.rua);
      setField('dc-complemento',  data.complemento);
      setField('dc-bairro',       data.bairro);
      setField('dc-cidade',       data.cidade);
      setField('dc-estado',       data.estado);
      setField('dc-pais',         data.pais || 'Brasil');
      setField('dc-empresa-nome', data.empresa_nome);
      setField('dc-empresa-cnpj', data.empresa_cnpj);

      // Multi-field: emails
      clearExtraRows();
      const emailsArr = Array.isArray(data.emails) && data.emails.length ? data.emails : (data.email ? [data.email] : []);
      setField('dc-email', emailsArr[0] || '');
      emailsArr.slice(1).forEach(e => addExtraEmailRow(e));

      // Multi-field: phones
      const phonesArr = Array.isArray(data.telefones) && data.telefones.length ? data.telefones : (data.telefone ? [data.telefone] : []);
      if (window.__phoneFieldSet) { window.__phoneFieldSet(phonesArr[0] || ''); } else { setField('dc-telefone', phonesArr[0] || ''); }
      phonesArr.slice(1).forEach(p => addExtraPhoneRow(p));

      // Multi-field: social networks
      const redesArr = Array.isArray(data.redes_sociais) && data.redes_sociais.length ? data.redes_sociais : (data.rede_social ? [{ rede: data.rede_social, usuario: data.rede_social_usuario || '' }] : []);
      const primarySocial = redesArr[0];
      dcSetSocial(primarySocial ? primarySocial.rede : 'instagram');
      setField('dc-social-usuario', primarySocial ? primarySocial.usuario : '');
      redesArr.slice(1).forEach(s => addExtraSocialRow(s.rede, s.usuario));

      await window.__legalBasisPicker.loadForContact(contactId);

      nomeEl.focus();
    }
    saveBtn.addEventListener('click', async () => {
      errorEl.style.display = 'none';
      const nome = document.getElementById('dc-nome').value.trim();
      if (!nome) {
        errorEl.textContent = 'O nome completo é obrigatório.';
        errorEl.style.display = 'block';
        document.getElementById('dc-nome').focus();
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = editContactId ? 'Salvando...' : 'Salvando...';

      // Collect multi-field values
      const allEmails = [
        document.getElementById('dc-email').value.trim(),
        ...[...emailsContainer.querySelectorAll('.dc-extra-email')].map(i => i.value.trim())
      ].filter(Boolean);

      const primaryPhone = window.__phoneFieldGet ? window.__phoneFieldGet() : document.getElementById('dc-telefone').value.trim();
      const allPhones = [
        primaryPhone,
        ...[...phonesContainer.querySelectorAll('.dc-extra-phone-row')].map(r => r._getPhoneValue ? r._getPhoneValue() : null)
      ].filter(Boolean);

      const socialsList = [];
      const primaryUsuario = document.getElementById('dc-social-usuario').value.trim();
      if (primaryUsuario) socialsList.push({ rede: dcActiveSocial, usuario: primaryUsuario });
      document.querySelectorAll('.dc-extra-social-row').forEach(row => {
        const usuario = row.querySelector('.dc-extra-social-usuario').value.trim();
        if (usuario) socialsList.push({ rede: row._getActiveSocial(), usuario });
      });

      const payload = {
        nome,
        foto_perfil:          dcAvatarData    || null,
        email:                allEmails[0]    || null,
        emails:               allEmails.length ? allEmails : [],
        telefone:             allPhones[0]    || null,
        telefones:            allPhones.length ? allPhones : [],
        rede_social:          socialsList[0]?.rede    || null,
        rede_social_usuario:  socialsList[0]?.usuario || null,
        redes_sociais:        socialsList.length ? socialsList : [],
        status:          document.getElementById('dc-status').value                 || 'Lead',
        cargo:           document.getElementById('dc-cargo').value.trim()           || null,
        cpf:             document.getElementById('dc-cpf').value.trim()             || null,
        rg:              document.getElementById('dc-rg').value.trim()              || null,
        data_nascimento: document.getElementById('dc-nascimento').value             || null,
        cep:             document.getElementById('dc-cep').value.trim()             || null,
        rua:             document.getElementById('dc-rua').value.trim()             || null,
        complemento:     document.getElementById('dc-complemento').value.trim()     || null,
        bairro:          document.getElementById('dc-bairro').value.trim()          || null,
        cidade:          document.getElementById('dc-cidade').value.trim()          || null,
        estado:          document.getElementById('dc-estado').value.trim()          || null,
        pais:            document.getElementById('dc-pais').value.trim()            || 'Brasil',
        empresa_nome:    document.getElementById('dc-empresa-nome').value.trim()    || null,
        empresa_cnpj:    document.getElementById('dc-empresa-cnpj').value.trim()    || null,
      };

      let error;
      let contactId = editContactId;
      if (editContactId) {
        ({ error } = await db.from('claude_contatos').update(payload).eq('id', editContactId));
      } else {
        const { data: inserted, error: insertError } = await db.from('claude_contatos').insert([payload]).select('id').single();
        error = insertError;
        contactId = inserted?.id || null;
      }

      if (!error && contactId) {
        const legalError = await window.__legalBasisPicker.saveForContact(contactId);
        if (legalError) error = legalError;
      }

      saveBtn.disabled = false;
      saveBtn.textContent = editContactId ? 'Salvar alterações' : 'Salvar contato';

      if (error) {
        errorEl.textContent = 'Erro ao salvar: ' + error.message;
        errorEl.style.display = 'block';
        return;
      }

      const wasEdit = !!editContactId;
      closeProfileContactEdit();
      if (wasEdit) {
        window.__showToast && window.__showToast('Contato atualizado com sucesso');
        if (typeof window.__reloadProfileContact === 'function') {
          window.__reloadProfileContact();
        } else {
          window.location.reload();
        }
        return;
      }
      requestAnimationFrame(() => {
        window.__showToast && window.__showToast('Contato adicionado com sucesso');
      });
    });

    // ─── PHONE FIELD (drawer) ────────────────────────────────
    const COUNTRIES = [
      { code: 'BR', name: 'Brasil',           dial: '+55',  mask: '(##) #####-####', flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><path fill="#009b3a" d="M0 0h513v342H0z"/><path fill="#fedf00" d="M256.5 19.3l204.9 151.4L256.5 322 50.6 170.7z"/><circle fill="#FFF" cx="256.5" cy="171" r="80.4"/><path fill="#002776" d="M215.9 165.7c-13.9 0-27.4 2.1-40.1 6 .6 43.9 36.3 79.3 80.3 79.3 27.2 0 51.3-13.6 65.8-34.3-24.9-31-63.2-51-106-51zm119 20.3c.9-5 1.5-10.1 1.5-15.4 0-44.4-36-80.4-80.4-80.4-33.1 0-61.5 20.1-73.9 48.6 10.9-2.2 22.1-3.4 33.6-3.4 46.8.1 89 19.5 119.2 50.6z"/></svg>' },
      { code: 'US', name: 'Estados Unidos',   dial: '+1',   mask: '(###) ###-####', flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="342" fill="#B22234"/><rect y="26.3" width="513" height="26.3" fill="#fff"/><rect y="78.8" width="513" height="26.3" fill="#B22234"/><rect y="131.3" width="513" height="26.3" fill="#fff"/><rect y="183.8" width="513" height="26.3" fill="#B22234"/><rect y="236.3" width="513" height="26.3" fill="#fff"/><rect y="288.8" width="513" height="26.3" fill="#B22234"/><rect width="205" height="183.8" fill="#3C3B6E"/><g fill="#fff"><polygon points="51.5,13 54.4,22 63.8,22 56.2,27.6 59,36.5 51.5,30.8 44,36.5 46.8,27.6 39.2,22 48.7,22"/></g></svg>' },
      { code: 'AR', name: 'Argentina',        dial: '+54',  mask: '(##) ####-####', flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="114" fill="#74ACDF"/><rect y="114" width="513" height="114" fill="#fff"/><rect y="228" width="513" height="114" fill="#74ACDF"/><circle cx="256.5" cy="171" r="40" fill="#F6B40E" stroke="#85340A" stroke-width="2"/></svg>' },
      { code: 'CL', name: 'Chile',            dial: '+56',  mask: '# ####-####',   flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="171" fill="#fff"/><rect y="171" width="513" height="171" fill="#D52B1E"/><rect width="171" height="171" fill="#0039A6"/><polygon points="85.5,30 100,75 147,75 109,99 123,144 85.5,120 48,144 62,99 24,75 71,75" fill="#fff"/></svg>' },
      { code: 'CO', name: 'Colômbia',         dial: '+57',  mask: '### ###-####',  flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="171" fill="#FCD116"/><rect y="171" width="513" height="85.5" fill="#003893"/><rect y="256.5" width="513" height="85.5" fill="#CE1126"/></svg>' },
      { code: 'MX', name: 'México',           dial: '+52',  mask: '## ####-####',  flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="171" height="342" fill="#006847"/><rect x="171" width="171" height="342" fill="#fff"/><rect x="342" width="171" height="342" fill="#CE1126"/><circle cx="256.5" cy="171" r="40" fill="none" stroke="#8B6914" stroke-width="3"/></svg>' },
      { code: 'PT', name: 'Portugal',         dial: '+351', mask: '### ### ###',   flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="205" height="342" fill="#006600"/><rect x="205" width="308" height="342" fill="#FF0000"/><circle cx="205" cy="171" r="60" fill="#FFD700" stroke="#003399" stroke-width="4"/></svg>' },
      { code: 'ES', name: 'Espanha',          dial: '+34',  mask: '### ### ###',   flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="342" fill="#AA151B"/><rect y="85.5" width="513" height="171" fill="#F1BF00"/></svg>' },
      { code: 'DE', name: 'Alemanha',         dial: '+49',  mask: '#### ########', flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="114" fill="#000"/><rect y="114" width="513" height="114" fill="#D00"/><rect y="228" width="513" height="114" fill="#FFCE00"/></svg>' },
      { code: 'FR', name: 'França',           dial: '+33',  mask: '## ## ## ## ##', flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="171" height="342" fill="#002395"/><rect x="171" width="171" height="342" fill="#fff"/><rect x="342" width="171" height="342" fill="#ED2939"/></svg>' },
      { code: 'GB', name: 'Reino Unido',      dial: '+44',  mask: '#### ######',   flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="342" fill="#012169"/><path d="M0 0l513 342M513 0L0 342" stroke="#fff" stroke-width="68"/><path d="M0 0l513 342M513 0L0 342" stroke="#C8102E" stroke-width="41"/><rect x="205" width="103" height="342" fill="#fff"/><rect y="120" width="513" height="103" fill="#fff"/><rect x="222" width="69" height="342" fill="#C8102E"/><rect y="137" width="513" height="68" fill="#C8102E"/></svg>' },
      { code: 'IT', name: 'Itália',           dial: '+39',  mask: '### #### ####', flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="171" height="342" fill="#009246"/><rect x="171" width="171" height="342" fill="#fff"/><rect x="342" width="171" height="342" fill="#CE2B37"/></svg>' },
      { code: 'UY', name: 'Uruguai',          dial: '+598', mask: '## ### ####',   flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="342" fill="#fff"/><rect y="38" width="513" height="38" fill="#003DA5"/><rect y="114" width="513" height="38" fill="#003DA5"/><rect y="190" width="513" height="38" fill="#003DA5"/><rect y="266" width="513" height="38" fill="#003DA5"/><rect width="171" height="190" fill="#fff"/></svg>' },
      { code: 'PE', name: 'Peru',             dial: '+51',  mask: '### ### ###',   flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="171" height="342" fill="#D91023"/><rect x="171" width="171" height="342" fill="#fff"/><rect x="342" width="171" height="342" fill="#D91023"/></svg>' },
      { code: 'VE', name: 'Venezuela',        dial: '+58',  mask: '### ###-####',  flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="114" fill="#CF142B"/><rect y="114" width="513" height="114" fill="#FFD100"/><rect y="228" width="513" height="114" fill="#00247D"/></svg>' },
      { code: 'BO', name: 'Bolívia',          dial: '+591', mask: '########',       flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="114" fill="#D52B1E"/><rect y="114" width="513" height="114" fill="#F4E400"/><rect y="228" width="513" height="114" fill="#007A3D"/></svg>' },
      { code: 'PY', name: 'Paraguai',         dial: '+595', mask: '### ######',     flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="114" fill="#D52B1E"/><rect y="114" width="513" height="114" fill="#fff"/><rect y="228" width="513" height="114" fill="#0038A8"/></svg>' },
      { code: 'EC', name: 'Equador',          dial: '+593', mask: '## ### ####',    flag: '<svg viewBox="0 0 513 342" xmlns="http://www.w3.org/2000/svg"><rect width="513" height="171" fill="#FFD100"/><rect y="171" width="513" height="85.5" fill="#034EA2"/><rect y="256.5" width="513" height="85.5" fill="#EF3340"/></svg>' },
    ];

    // Expose countries list for dynamic phone fields
    window.__countries = COUNTRIES;

    const trigger = document.getElementById('dc-country-trigger');
    const flagEl  = document.getElementById('dc-flag');
    const codeEl  = document.getElementById('dc-calling-code');
    const dropdown = document.getElementById('dc-phone-dropdown');
    const searchInput = document.getElementById('dc-country-search');
    const listEl = document.getElementById('dc-country-list');
    const phoneInput = document.getElementById('dc-telefone');

    let selectedCountry = COUNTRIES[0]; // Brasil default
    let dropdownOpen = false;

    function applyMask(value, mask) {
      const digits = value.replace(/\D/g, '');
      let result = '';
      let di = 0;
      for (let i = 0; i < mask.length && di < digits.length; i++) {
        if (mask[i] === '#') { result += digits[di++]; }
        else { result += mask[i]; }
      }
      return result;
    }

    function selectCountry(country) {
      selectedCountry = country;
      flagEl.innerHTML = country.flag;
      codeEl.textContent = country.dial;
      const digits = (phoneInput.value || '').replace(/\D/g, '');
      phoneInput.value = applyMask(digits, country.mask);
      const placeDigit = country.mask.replace(/#/g, '9');
      phoneInput.placeholder = placeDigit;
      closeDropdown();
      phoneInput.focus();
    }

    function renderList(filter) {
      const q = (filter || '').toLowerCase();
      const filtered = COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q)
      );
      if (!filtered.length) {
        listEl.innerHTML = '<div class="phone-dropdown-empty">Nenhum país encontrado</div>';
        return;
      }
      listEl.innerHTML = filtered.map(c => `
        <div class="phone-dropdown-item${c.code === selectedCountry.code ? ' active' : ''}" data-code="${c.code}">
          <div class="item-flag">${c.flag}</div>
          <span class="item-name">${c.name}</span>
          <span class="item-code">${c.dial}</span>
        </div>`).join('');
      listEl.querySelectorAll('.phone-dropdown-item').forEach(item => {
        item.addEventListener('mousedown', e => {
          e.preventDefault();
          const c = COUNTRIES.find(x => x.code === item.dataset.code);
          if (c) selectCountry(c);
        });
      });
    }

    function openDropdown() {
      dropdownOpen = true;
      dropdown.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      searchInput.value = '';
      renderList('');
      searchInput.focus();
    }

    function closeDropdown() {
      dropdownOpen = false;
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    // Init
    selectCountry(COUNTRIES[0]);

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      dropdownOpen ? closeDropdown() : openDropdown();
    });

    searchInput.addEventListener('input', () => renderList(searchInput.value));

    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target) && e.target !== trigger) closeDropdown();
    });

    // Phone masking on input
    phoneInput.addEventListener('input', () => {
      const pos = phoneInput.selectionStart;
      const old = phoneInput.value;
      const masked = applyMask(old, selectedCountry.mask);
      phoneInput.value = masked;
    });

    // Expose setter for edit drawer to pre-fill phone field
    window.__phoneFieldSet = (value) => {
      if (!value) { phoneInput.value = ''; return; }
      // Detect country by dial prefix
      const sorted = [...COUNTRIES].sort((a,b) => b.dial.length - a.dial.length);
      const match = sorted.find(c => value.startsWith(c.dial));
      const country = match || COUNTRIES[0];
      if (match) selectCountry(country);
      const rawDigits = value.replace(country.dial, '').replace(/\D/g, '');
      phoneInput.value = applyMask(rawDigits, country.mask);
    };

    window.__phoneFieldGet = () => {
      const digits = phoneInput.value.replace(/\D/g, '');
      if (!digits) return null;
      return selectedCountry.dial + phoneInput.value.replace(/\D/g, '');
    };

    function closeProfileContactEdit() {
      content.classList.remove("detail-open", "detail-edit");
      detailPanel.setAttribute("aria-hidden", "true");
      drawer.classList.remove("open");
      editContactId = null;
      window.__tagPicker?.reset();
      window.__legalBasisPicker?.reset();
      window.__empresaAutocomplete?.close();
    }

    async function openProfileContactEdit(contactId) {
      if (!contactId) return;
      const tagsDrawer = document.getElementById('drawer-edit-tags');
      if (tagsDrawer?.classList.contains('open')) {
        content.classList.remove('detail-open');
        tagsDrawer.classList.remove('open');
      }
      detailPanel.appendChild(drawer);
      content.classList.add("detail-open", "detail-edit");
      detailPanel.setAttribute("aria-hidden", "false");
      drawer.classList.add("open");
      await openEditForm(contactId);
    }

    window.__openProfileContactEdit = openProfileContactEdit;

    closeBtn?.addEventListener("click", closeProfileContactEdit);
    cancelBtn?.addEventListener("click", closeProfileContactEdit);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && content.classList.contains("detail-open") && drawer.classList.contains("open")) {
        closeProfileContactEdit();
      }
    });

    document.getElementById("profile-open-contact-edit")?.addEventListener("click", () => {
      const id = window.__profileContactId || new URLSearchParams(window.location.search).get("id");
      openProfileContactEdit(id);
    });
  } catch (e) {
    console.error("[Profile contact edit]", e.message, e.stack);
  }
})();
