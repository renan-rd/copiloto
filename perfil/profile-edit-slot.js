(function() {
  const SOCIAL_NETWORKS = [
    { key: 'instagram', label: 'Instagram', color: '#E1306C', svg: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>' },
    { key: 'linkedin', label: 'LinkedIn', color: '#0A66C2', svg: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>' },
    { key: 'twitter', label: 'X (Twitter)', color: '#000000', svg: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.845L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>' },
    { key: 'facebook', label: 'Facebook', color: '#1877F2', svg: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' },
    { key: 'tiktok', label: 'TikTok', color: '#000000', svg: '<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.53V6.74a4.85 4.85 0 01-1.01-.05z"/>' },
    { key: 'youtube', label: 'YouTube', color: '#FF0000', svg: '<path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>' },
  ];

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

  const FIELD_DEFS = {
    nome:                { label: 'Nome',                 panel: 'text',  placeholder: 'Digite o nome' },
    cargo:               { label: 'Cargo',                panel: 'text',  placeholder: 'Digite o cargo' },
    email:               { label: 'E-mail',               panel: 'email', placeholder: 'Digite um e-mail' },
    telefone:            { label: 'Telefone',             panel: 'phone' },
    rede_social_usuario: { label: 'Rede social',          panel: 'social' },
    data_nascimento:     { label: 'Data de nascimento',   panel: 'date' },
    rg:                  { label: 'RG',                   panel: 'text',  placeholder: 'Digite o RG' },
    cpf:                 { label: 'CPF',                  panel: 'text',  placeholder: '000.000.000-00' },
    rua:                 { label: 'Endereço',             panel: 'text',  placeholder: 'Digite o endereço' },
    complemento:         { label: 'Complemento',          panel: 'text',  placeholder: 'Digite o complemento' },
    bairro:              { label: 'Bairro',               panel: 'text',  placeholder: 'Digite o bairro' },
    cidade:              { label: 'Cidade',               panel: 'text',  placeholder: 'Digite a cidade' },
    estado:              { label: 'Estado',               panel: 'text',  placeholder: 'Digite o estado' },
    cep:                 { label: 'CEP',                  panel: 'text',  placeholder: '00000-000' },
    pais:                { label: 'País',                 panel: 'text',  placeholder: 'Digite o país' },
    empresa:             { label: 'Empresa',              panel: 'empresa' },
    base_legal:          { label: 'Base legal',           panel: 'privacy' },
  };

  function getSocialAtIndex(index) {
    const socials = window.__profileContactSocials || [];
    const s = socials[index];
    if (index === 0) {
      const data = window.__profileFieldRaw || window.__profileIdentRaw || {};
      return {
        rede: data.rede_social || s?.rede || 'instagram',
        usuario: data.rede_social_usuario ?? s?.usuario ?? '',
      };
    }
    return {
      rede: s?.rede || 'instagram',
      usuario: s?.usuario || '',
    };
  }

  function getFieldRaw(field, socialIndex) {
    const data = window.__profileFieldRaw || window.__profileIdentRaw || {};
    if (field === 'rede_social_usuario') {
      return getSocialAtIndex(socialIndex ?? 0);
    }
    if (field === 'empresa') {
      return data.empresa_nome || '';
    }
    return data[field] ?? '';
  }

  function formatDateDisplay(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  }

  function formatDisplay(field, raw) {
    if (field === 'telefone') {
      return window.__formatProfilePhone ? window.__formatProfilePhone(raw) : (raw || '');
    }
    if (field === 'rede_social_usuario') {
      const u = raw?.usuario || '';
      if (!u) return '';
      return u.startsWith('@') ? u : '@' + u;
    }
    if (field === 'data_nascimento') return formatDateDisplay(raw);
    if (field === 'base_legal') {
      const OPTIONS = window.__legalBasisPicker?.OPTIONS || [];
      return OPTIONS.find(opt => opt.key === raw)?.label || raw || '';
    }
    return raw || '';
  }

  function displayToRaw(field, text) {
    const t = (text || '').trim();
    if (!t || t === '—') return field === 'rede_social_usuario' ? { rede: 'instagram', usuario: '' } : '';
    if (field === 'rede_social_usuario') {
      return { rede: getFieldRaw('rede_social_usuario').rede, usuario: t.replace(/^@/, '') };
    }
    if (field === 'data_nascimento') {
      const m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (m) return `${m[3]}-${m[2]}-${m[1]}`;
      return t;
    }
    return t;
  }

  function valuesEqual(field, a, b) {
    if (field === 'rede_social_usuario') {
      return a.rede === b.rede && a.usuario === b.usuario;
    }
    if (field === 'empresa') {
      return (a || '') === (b || '');
    }
    return (a || '') === (b || '');
  }

  function applyMask(value, mask) {
    const digits = value.replace(/\D/g, '');
    let result = '';
    let di = 0;
    for (let i = 0; i < mask.length && di < digits.length; i++) {
      result += mask[i] === '#' ? digits[di++] : mask[i];
    }
    return result;
  }

  function initPhoneField(root) {
    const trigger = root.querySelector('.phone-country-trigger');
    const flagEl = root.querySelector('.phone-flag');
    const codeEl = root.querySelector('.phone-calling-code');
    const dropdown = root.querySelector('.phone-dropdown');
    const searchInput = root.querySelector('.phone-dropdown-search input');
    const listEl = root.querySelector('.phone-country-list');
    const phoneInput = root.querySelector('.phone-input');
    let selectedCountry = COUNTRIES[0];
    let dropdownOpen = false;

    function closeDropdown() {
      dropdownOpen = false;
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    function selectCountry(country) {
      selectedCountry = country;
      flagEl.innerHTML = country.flag;
      codeEl.textContent = country.dial;
      phoneInput.value = applyMask(phoneInput.value.replace(/\D/g, ''), country.mask);
      phoneInput.placeholder = country.mask.replace(/#/g, '9');
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
      listEl.innerHTML = filtered.map(c =>
        `<div class="phone-dropdown-item${c.code === selectedCountry.code ? ' active' : ''}" data-code="${c.code}">
          <div class="item-flag">${c.flag}</div>
          <span class="item-name">${c.name}</span>
          <span class="item-code">${c.dial}</span>
        </div>`
      ).join('');
      listEl.querySelectorAll('.phone-dropdown-item').forEach(item => {
        item.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();
          const c = COUNTRIES.find(x => x.code === item.dataset.code);
          if (c) selectCountry(c);
        });
      });
    }

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      if (dropdownOpen) closeDropdown();
      else {
        dropdownOpen = true;
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        searchInput.value = '';
        renderList('');
        searchInput.focus();
      }
    });

    searchInput.addEventListener('input', () => renderList(searchInput.value));
    phoneInput.addEventListener('input', () => {
      phoneInput.value = applyMask(phoneInput.value, selectedCountry.mask);
    });

    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target) && !trigger.contains(e.target)) closeDropdown();
    });

    selectCountry(COUNTRIES[0]);

    return {
      setValue(value) {
        if (!value) { phoneInput.value = ''; return; }
        const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length);
        const match = sorted.find(c => value.startsWith(c.dial));
        const country = match || COUNTRIES[0];
        if (match) selectCountry(country);
        else {
          selectedCountry = COUNTRIES[0];
          flagEl.innerHTML = country.flag;
          codeEl.textContent = country.dial;
        }
        const rawDigits = match ? value.replace(country.dial, '').replace(/\D/g, '') : value.replace(/\D/g, '');
        phoneInput.value = applyMask(rawDigits, selectedCountry.mask);
      },
      getValue() {
        const digits = phoneInput.value.replace(/\D/g, '');
        if (!digits) return '';
        return selectedCountry.dial + digits;
      },
      closeDropdown,
      focus() { phoneInput.focus(); },
    };
  }

  function initSocialField(root) {
    const trigger = root.querySelector('.social-trigger');
    const iconEl = root.querySelector('.social-icon');
    const dropdown = root.querySelector('.social-dropdown');
    const usuarioInput = root.querySelector('#profile-slot-social-usuario');
    let activeSocial = 'instagram';

    dropdown.innerHTML = SOCIAL_NETWORKS.map(n =>
      `<div class="social-dropdown-item${n.key === activeSocial ? ' active' : ''}" data-key="${n.key}" data-color="${n.color}">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="${n.color}">${n.svg}</svg>
        ${n.label}
      </div>`
    ).join('');

    function setSocial(key) {
      const net = SOCIAL_NETWORKS.find(n => n.key === key) || SOCIAL_NETWORKS[0];
      activeSocial = net.key;
      iconEl.setAttribute('fill', net.color);
      iconEl.innerHTML = net.svg;
      dropdown.querySelectorAll('.social-dropdown-item').forEach(item => {
        item.classList.toggle('active', item.dataset.key === net.key);
      });
    }

    function closeDropdown() {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    dropdown.querySelectorAll('.social-dropdown-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        setSocial(item.dataset.key);
        closeDropdown();
        usuarioInput.focus();
      });
    });

    document.addEventListener('click', e => {
      if (!root.contains(e.target)) closeDropdown();
    });

    setSocial('instagram');

    return {
      setValue(rede, usuario) {
        setSocial(rede || 'instagram');
        usuarioInput.value = usuario || '';
      },
      getValue() {
        return { rede: activeSocial, usuario: usuarioInput.value.trim() };
      },
      closeDropdown,
      focus() { usuarioInput.focus(); },
    };
  }

  function initPrivacyField(root) {
    const wrap = root?.querySelector('.legal-basis-select');
    const picker = window.__legalBasisPicker;
    if (!wrap || !picker) {
      return {
        setValue() {},
        getValue() { return ''; },
        closeDropdown() {},
      };
    }

    if (!wrap._privacyBound) {
      picker.initLegalSelect(wrap, document.getElementById('profile-edit-slot'));
      wrap._privacyBound = true;
    }

    return {
      setValue(value) {
        picker.setLegalSelectValue(wrap, value);
      },
      getValue() {
        return wrap.querySelector('input[type="hidden"]')?.value || '';
      },
      closeDropdown() {
        picker.closeActiveDropdown();
      },
    };
  }

  function init() {
    const slot = document.getElementById('profile-edit-slot');
    const labelEl = document.getElementById('profile-edit-slot-label');
    const errorEl = document.getElementById('profile-edit-slot-error');
    const cancelBtn = document.getElementById('profile-edit-slot-cancel');
    const saveBtn = document.getElementById('profile-edit-slot-save');
    const emailInput = document.getElementById('profile-edit-slot-input');
    const textInput = document.getElementById('profile-edit-slot-text-input');
    const dateInput = document.getElementById('profile-edit-slot-date-input');
    const empresaNomeInput = document.getElementById('profile-slot-empresa-nome');
    const panels = {
      email: document.getElementById('profile-edit-slot-field-email'),
      phone: document.getElementById('profile-edit-slot-field-phone'),
      social: document.getElementById('profile-edit-slot-field-social'),
      text: document.getElementById('profile-edit-slot-field-text'),
      date: document.getElementById('profile-edit-slot-field-date'),
      empresa: document.getElementById('profile-edit-slot-field-empresa'),
      privacy: document.getElementById('profile-edit-slot-field-privacy'),
    };
    if (!slot || !emailInput || !textInput || !dateInput || !empresaNomeInput) return;

    if (window.__empresaAutocomplete && window.__sbClient) {
      window.__empresaAutocomplete.ensureDb(window.__sbClient);
      window.__empresaAutocomplete.bindNomeOnly({
        nomeInputId: 'profile-slot-empresa-nome',
        nomeDropdownId: 'profile-slot-empresa-nome-dropdown',
      });
    }

    const phoneApi = initPhoneField(document.getElementById('profile-slot-phone-field'));
    const socialApi = initSocialField(document.getElementById('profile-slot-social-field'));
    const privacyApi = initPrivacyField(document.getElementById('profile-slot-privacy-field'));

    let anchorItem = null;
    let anchorEl = null;
    let activeField = null;
    let activeSocialIndex = 0;
    let originalRaw = null;
    let activePanel = null;

    function showPanel(panelKey) {
      activePanel = panelKey;
      Object.entries(panels).forEach(([key, panel]) => {
        if (!panel) return;
        panel.hidden = key !== panelKey;
      });
      const inputMap = {
        email: 'profile-edit-slot-input',
        text: 'profile-edit-slot-text-input',
        date: 'profile-edit-slot-date-input',
      };
      const forId = inputMap[panelKey];
      labelEl.setAttribute('for', forId || '');
    }

    function positionSlot() {
      if (!anchorItem) return;
      const rect = anchorItem.getBoundingClientRect();
      slot.style.width = Math.max(280, Math.min(rect.width, 360)) + 'px';
      slot.classList.add('is-open');
      slot.setAttribute('aria-hidden', 'false');
      slot.style.visibility = 'hidden';
      const slotRect = slot.getBoundingClientRect();
      let top = rect.bottom + 8;
      let left = rect.left;
      if (left + slotRect.width > window.innerWidth - 16) {
        left = window.innerWidth - slotRect.width - 16;
      }
      if (top + slotRect.height > window.innerHeight - 16) {
        top = Math.max(16, rect.top - slotRect.height - 8);
      }
      left = Math.max(16, left);
      slot.style.top = top + 'px';
      slot.style.left = left + 'px';
      slot.style.visibility = '';
    }

    function closeSlot() {
      slot.classList.remove('is-open');
      slot.setAttribute('aria-hidden', 'true');
      if (anchorItem) anchorItem.classList.remove('is-edit-slot-open');
      phoneApi.closeDropdown();
      socialApi.closeDropdown();
      privacyApi.closeDropdown();
      window.__empresaAutocomplete?.close();
      anchorItem = null;
      anchorEl = null;
      activeField = null;
      activeSocialIndex = 0;
      originalRaw = null;
      activePanel = null;
      errorEl.classList.remove('is-visible');
      errorEl.textContent = '';
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar';
    }

    function resolveLabel(item, field) {
      const detailLabel = item.querySelector('.profile-detail-label')?.textContent.trim();
      return detailLabel || FIELD_DEFS[field]?.label || field;
    }

    function populatePanel(field) {
      const def = FIELD_DEFS[field];
      if (!def) return;

      if (def.panel === 'email') {
        originalRaw = getFieldRaw(field, activeSocialIndex);
        if (!originalRaw && anchorEl) originalRaw = displayToRaw(field, anchorEl.textContent);
        emailInput.value = originalRaw || '';
        emailInput.placeholder = def.placeholder || '';
      } else if (def.panel === 'text') {
        originalRaw = getFieldRaw(field, activeSocialIndex);
        if (!originalRaw && anchorEl) originalRaw = displayToRaw(field, anchorEl.textContent);
        textInput.type = 'text';
        textInput.value = originalRaw || '';
        textInput.placeholder = def.placeholder || '';
      } else if (def.panel === 'date') {
        originalRaw = getFieldRaw(field, activeSocialIndex);
        if (!originalRaw && anchorEl) originalRaw = displayToRaw(field, anchorEl.textContent);
        dateInput.value = originalRaw || '';
      } else if (def.panel === 'phone') {
        originalRaw = getFieldRaw(field, activeSocialIndex) || '';
        phoneApi.setValue(originalRaw);
      } else if (def.panel === 'social') {
        originalRaw = getFieldRaw(field, activeSocialIndex);
        if (anchorEl?.textContent.trim() && anchorEl.textContent.trim() !== '—') {
          originalRaw.usuario = originalRaw.usuario || anchorEl.textContent.trim().replace(/^@/, '');
        }
        socialApi.setValue(originalRaw.rede, originalRaw.usuario);
      } else if (def.panel === 'empresa') {
        originalRaw = getFieldRaw('empresa');
        empresaNomeInput.value = originalRaw || '';
      } else if (def.panel === 'privacy') {
        originalRaw = anchorItem?.dataset.baseLegal || '';
        privacyApi.setValue(originalRaw);
      }
    }

    function focusPanel(field) {
      const def = FIELD_DEFS[field];
      if (!def) return;
      if (def.panel === 'email') { emailInput.focus(); emailInput.select(); }
      else if (def.panel === 'text') { textInput.focus(); textInput.select(); }
      else if (def.panel === 'date') { dateInput.focus(); }
      else if (def.panel === 'phone') phoneApi.focus();
      else if (def.panel === 'social') socialApi.focus();
      else if (def.panel === 'empresa') empresaNomeInput.focus();
      else if (def.panel === 'privacy') privacyApi.closeDropdown();
    }

    function openSlot(item, valueEl, field, socialIndex) {
      if (!FIELD_DEFS[field]) return;
      if (slot.classList.contains('is-open') && anchorItem === item && activeField === field) return;

      closeSlot();
      anchorItem = item;
      anchorEl = valueEl;
      activeField = field;
      if (field === 'rede_social_usuario') {
        activeSocialIndex = socialIndex != null
          ? socialIndex
          : (parseInt(item?.dataset.socialIndex || '0', 10) || 0);
      } else {
        activeSocialIndex = 0;
      }

      labelEl.textContent = resolveLabel(item, field);
      showPanel(FIELD_DEFS[field].panel);
      errorEl.classList.remove('is-visible');
      errorEl.textContent = '';
      populatePanel(field);

      item.classList.add('is-edit-slot-open');
      positionSlot();
      requestAnimationFrame(() => positionSlot());
      focusPanel(field);
    }

    function afterSave(field, newRaw) {
      if (field === 'nome' && newRaw) {
        const headerTitle = document.getElementById('page-header-title');
        if (headerTitle) headerTitle.textContent = newRaw;
        document.title = `${newRaw} — RD Station`;
      }
      if (field === 'empresa' && window.__renderProfileCompanies) {
        const data = window.__profileFieldRaw || {};
        window.__renderProfileCompanies({
          empresa_nome: newRaw,
          empresa_cnpj: data.empresa_cnpj,
          cargo: data.cargo || '',
        });
      }
      if (field === 'rede_social_usuario' && window.__refreshProfileSocials) {
        window.__refreshProfileSocials();
      }
      if (field === 'base_legal' && anchorEl && anchorItem) {
        const OPTIONS = window.__legalBasisPicker?.OPTIONS || [];
        const basisLabel = OPTIONS.find(opt => opt.key === newRaw)?.label || newRaw;
        anchorEl.textContent = basisLabel || '—';
        anchorItem.dataset.baseLegal = newRaw || '';
      }
    }

    async function save() {
      const db = window.__profileDb;
      const contactId = window.__profileContactId;
      if (!db || !contactId) {
        errorEl.textContent = 'Não foi possível salvar. Tente novamente.';
        errorEl.classList.add('is-visible');
        return;
      }

      const def = FIELD_DEFS[activeField];
      if (!def) return;

      let payload = {};
      let newRaw = null;

      if (def.panel === 'email') {
        const newValue = emailInput.value.trim();
        if (newValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
          errorEl.textContent = 'Digite um e-mail válido.';
          errorEl.classList.add('is-visible');
          emailInput.focus();
          return;
        }
        if (newValue === (originalRaw || '')) { closeSlot(); return; }
        payload = { email: newValue || null };
        newRaw = newValue;
      } else if (def.panel === 'text') {
        const newValue = textInput.value.trim();
        if (newValue === (originalRaw || '')) { closeSlot(); return; }
        payload = { [activeField]: newValue || null };
        newRaw = newValue;
      } else if (def.panel === 'date') {
        const newValue = dateInput.value || '';
        if (newValue === (originalRaw || '')) { closeSlot(); return; }
        payload = { data_nascimento: newValue || null };
        newRaw = newValue;
      } else if (def.panel === 'phone') {
        const newValue = phoneApi.getValue();
        if (newValue === (originalRaw || '')) { closeSlot(); return; }
        payload = { telefone: newValue || null };
        newRaw = newValue;
      } else if (def.panel === 'social') {
        const { rede, usuario } = socialApi.getValue();
        if (valuesEqual('rede_social_usuario', { rede, usuario }, originalRaw)) { closeSlot(); return; }
        const socials = [...(window.__profileContactSocials || [])];
        while (socials.length <= activeSocialIndex) socials.push({ rede: 'instagram', usuario: '' });
        socials[activeSocialIndex] = { rede, usuario };
        const filtered = socials.filter(s => s && s.usuario);
        payload = {
          rede_social: filtered[0]?.rede || null,
          rede_social_usuario: filtered[0]?.usuario || null,
          redes_sociais: filtered,
        };
        newRaw = { rede, usuario };
      } else if (def.panel === 'empresa') {
        const nome = empresaNomeInput.value.trim();
        if (nome === (originalRaw || '')) { closeSlot(); return; }
        payload = { empresa_nome: nome || null };
        newRaw = nome;
      } else if (def.panel === 'privacy') {
        const canal = anchorItem?.dataset.canal || '';
        const newValue = privacyApi.getValue();
        if (!canal || !newValue) {
          errorEl.textContent = 'Selecione uma base legal.';
          errorEl.classList.add('is-visible');
          return;
        }
        if (newValue === (originalRaw || '')) { closeSlot(); return; }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Salvando...';

        const { error } = await db.from('claude_contato_bases_legais').upsert({
          contato_id: contactId,
          canal,
          base_legal: newValue,
          status: 'opt_in',
          atualizado_em: new Date().toISOString(),
        }, { onConflict: 'contato_id,canal' });

        saveBtn.disabled = false;
        saveBtn.textContent = 'Salvar';

        if (error) {
          errorEl.textContent = 'Erro ao salvar: ' + error.message;
          errorEl.classList.add('is-visible');
          return;
        }

        newRaw = newValue;
        const display = formatDisplay(activeField, newRaw);
        if (anchorEl) anchorEl.textContent = display || '—';
        afterSave(activeField, newRaw);
        closeSlot();
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Salvando...';

      const { error } = await db.from('claude_contatos').update(payload).eq('id', contactId);

      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar';

      if (error) {
        errorEl.textContent = 'Erro ao salvar: ' + error.message;
        errorEl.classList.add('is-visible');
        return;
      }

      if (!window.__profileFieldRaw) window.__profileFieldRaw = {};
      if (activeField === 'rede_social_usuario') {
        window.__profileContactSocials = payload.redes_sociais || [];
        if (activeSocialIndex === 0) {
          window.__profileFieldRaw.rede_social = newRaw.rede;
          window.__profileFieldRaw.rede_social_usuario = newRaw.usuario;
        }
      } else if (activeField === 'empresa') {
        window.__profileFieldRaw.empresa_nome = newRaw;
      } else {
        window.__profileFieldRaw[activeField] = newRaw;
      }
      window.__profileIdentRaw = window.__profileFieldRaw;

      const display = formatDisplay(activeField, newRaw);
      if (anchorEl && activeField !== 'empresa') anchorEl.textContent = display || '—';
      afterSave(activeField, newRaw);
      closeSlot();
    }

    function copyCompanyName(btn) {
      const item = btn.closest('.profile-company-item');
      const text = item?.querySelector('.profile-company-name')?.textContent.trim() || '';
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        const origHTML = btn.innerHTML;
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7.5" fill="#0077B2" class="check-circle-anim"/><path d="M6.1 10.1L8.9 12.95L14.4 7.3" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="check-path-anim"/></svg>`;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = origHTML;
        }, 1500);
      });
    }

    function bindCompanyItem(item) {
      if (!item || item.dataset.bound === '1') return;
      item.dataset.bound = '1';
      const nameEl = item.querySelector('.profile-company-name');
      const open = () => openSlot(item, nameEl, 'empresa');
      nameEl?.addEventListener('click', open);
      item.querySelector('.profile-ident-edit')?.addEventListener('click', e => {
        e.stopPropagation();
        open();
      });
      item.querySelector('.profile-ident-copy')?.addEventListener('click', e => {
        e.stopPropagation();
        copyCompanyName(e.currentTarget);
      });
    }

    window.__bindProfileCompanyItem = bindCompanyItem;

    window.__openProfileEditSlot = openSlot;

    cancelBtn.addEventListener('click', closeSlot);
    saveBtn.addEventListener('click', save);

    [emailInput, textInput].forEach(input => {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); save(); }
        if (e.key === 'Escape') { e.preventDefault(); closeSlot(); }
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && slot.classList.contains('is-open')) closeSlot();
    });

    function closeOpenSlotMenus() {
      let closed = false;
      if (slot.querySelector('.social-dropdown.open')) {
        socialApi.closeDropdown();
        closed = true;
      }
      if (slot.querySelector('.phone-dropdown.open')) {
        phoneApi.closeDropdown();
        closed = true;
      }
      if (slot.querySelector('.empresa-autocomplete-dropdown:not([hidden])')) {
        window.__empresaAutocomplete?.close();
        closed = true;
      }
      if (slot.querySelector('.legal-select-dropdown.open')) {
        privacyApi.closeDropdown();
        closed = true;
      }
      return closed;
    }

    document.addEventListener('click', e => {
      if (!slot.classList.contains('is-open')) return;
      if (slot.contains(e.target)) return;
      if (anchorItem && anchorItem.contains(e.target)) return;
      if (closeOpenSlotMenus()) return;
      closeSlot();
    });

    window.addEventListener('resize', () => {
      if (slot.classList.contains('is-open')) positionSlot();
    });

    function bindField(item, valueEl, field) {
      if (!FIELD_DEFS[field] || !valueEl) return;
      const socialIndex = field === 'rede_social_usuario'
        ? parseInt(item.dataset.socialIndex || '0', 10)
        : undefined;
      const open = () => openSlot(item, valueEl, field, socialIndex);
      valueEl.addEventListener('click', open);
      item.querySelector('.profile-ident-edit, .profile-detail-edit')?.addEventListener('click', e => {
        e.stopPropagation();
        open();
      });
    }

    function bindSocialItem(item) {
      if (!item || item.dataset.socialBound === '1') return;
      item.dataset.socialBound = '1';
      bindField(item, item.querySelector('span'), 'rede_social_usuario');
    }

    function bindPrivacyItem(item) {
      if (!item || item.dataset.privacyBound === '1') return;
      item.dataset.privacyBound = '1';
      bindField(item, item.querySelector('.profile-privacy-value'), 'base_legal');
    }

    window.__bindProfilePrivacyItem = bindPrivacyItem;

    window.__bindProfileSocialItem = bindSocialItem;

    document.querySelectorAll('.profile-ident-item[data-field]').forEach(item => {
      bindField(item, item.querySelector('span'), item.dataset.field);
    });

    document.querySelectorAll('.profile-name-field[data-field]').forEach(item => {
      bindField(item, item.querySelector('.profile-name, .profile-role'), item.dataset.field);
    });

    document.querySelectorAll('.profile-detail-item[data-field]').forEach(item => {
      bindField(item, item.querySelector('.profile-detail-value'), item.dataset.field);
    });
  }

  window.__socialNetworks = SOCIAL_NETWORKS;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
