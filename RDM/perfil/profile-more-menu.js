(function() {
  const scriptBase = (document.currentScript?.src || '').replace(/\/[^/]+$/, '/');
  const TRASH_ICON = `<img src="${scriptBase}icons/trash.svg" width="24" height="24" alt="" aria-hidden="true">`;

  const MENU_ITEMS = [
    { key: 'criar-negociacao', label: 'Criar negociação' },
    { key: 'iniciar-atendimento', label: 'Iniciar atendimento' },
    { key: 'mover-funil', label: 'Mover estágio do funil' },
  ];

  const TRIGGER_IDS = [
    'page-header-more-btn',
    'profile-overview-more-btn',
    'profile-quick-more-btn',
    'detail-panel-more-btn',
  ];

  let activeMenu = null;

  function getContactId() {
    return window.__profileContactId || window.__selectedContactId || null;
  }

  function closeMenu() {
    if (!activeMenu) return;
    if (activeMenu._anchor) {
      activeMenu._anchor.setAttribute('aria-expanded', 'false');
    }
    activeMenu.remove();
    activeMenu = null;
  }

  function positionMenu() {
    if (!activeMenu || !activeMenu._anchor) return;
    const rect = activeMenu._anchor.getBoundingClientRect();
    const menuW = activeMenu.offsetWidth;
    const menuH = activeMenu.offsetHeight;
    const gap = 4;
    let top = rect.bottom + gap;
    let left = rect.right - menuW;

    if (left < 8) left = 8;
    if (left + menuW > window.innerWidth - 8) {
      left = window.innerWidth - menuW - 8;
    }
    if (top + menuH > window.innerHeight - 8) {
      top = Math.max(8, rect.top - menuH - gap);
    }

    activeMenu.style.top = top + 'px';
    activeMenu.style.left = left + 'px';
  }

  function buildMenuHtml() {
    const items = MENU_ITEMS.map(item =>
      `<button type="button" class="profile-more-dropdown-item" role="menuitem" data-action="${item.key}">${item.label}</button>`
    ).join('');

    return `
      <div class="profile-more-dropdown-group">Opções</div>
      ${items}
      <div class="profile-more-dropdown-divider" role="separator"></div>
      <button type="button" class="profile-more-dropdown-item profile-more-dropdown-item--danger" role="menuitem" data-action="excluir-contato">
        ${TRASH_ICON}
        <span>Excluir contato</span>
      </button>
    `;
  }

  async function handleAction(key) {
    if (key === 'criar-negociacao') {
      document.querySelector('.profile-quick-actions .profile-quick-wrap:nth-child(4) .profile-quick-btn')?.click();
      return;
    }

    if (key === 'excluir-contato') {
      const contactId = getContactId();
      if (!contactId || !window.__openDeleteContactModal) return;

      const onDetailPanel = typeof window.__closeDetailPanel === 'function';
      window.__openDeleteContactModal([contactId], {
        onSuccess: () => {
          if (onDetailPanel) {
            window.__closeDetailPanel();
            window.__contactsReload?.();
          } else {
            window.location.href = '../contatos/index.html';
          }
        },
      });
      return;
    }

    const labels = {
      'iniciar-atendimento': 'Iniciar atendimento',
      'mover-funil': 'Mover estágio do funil',
    };
    if (labels[key]) {
      window.alert(`${labels[key]} — em breve.`);
    }
  }

  function closeOtherMenus() {
    document.querySelectorAll('.profile-status-dropdown, .actions-options-dropdown, .status-dropdown').forEach(el => el.remove());
    window.__empresaAutocomplete?.close();
    window.__closeActionsOptionsDropdown?.();
  }

  function openMenu(anchor) {
    closeOtherMenus();

    if (activeMenu && activeMenu._anchor === anchor) {
      closeMenu();
      return;
    }

    closeMenu();

    const menu = document.createElement('div');
    menu.className = 'profile-more-dropdown';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = buildMenuHtml();

    document.body.appendChild(menu);
    activeMenu = menu;
    activeMenu._anchor = anchor;
    anchor.setAttribute('aria-expanded', 'true');
    positionMenu();

    menu.querySelectorAll('[data-action]').forEach(item => {
      item.addEventListener('click', async e => {
        e.stopPropagation();
        const action = item.dataset.action;
        closeMenu();
        await handleAction(action);
      });
    });
  }

  function bindTrigger(btn) {
    if (!btn || btn.dataset.moreMenuBound) return;
    btn.dataset.moreMenuBound = '1';
    btn.setAttribute('aria-haspopup', 'menu');
    if (!btn.hasAttribute('aria-expanded')) {
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openMenu(btn);
    });
  }

  document.addEventListener('click', e => {
    if (!e.target.closest('.profile-more-dropdown') && !e.target.closest('[data-more-menu-bound]')) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', positionMenu, true);
  window.addEventListener('resize', positionMenu);

  TRIGGER_IDS.forEach(id => bindTrigger(document.getElementById(id)));

  window.__contactMoreMenu = { open: openMenu, close: closeMenu, bindTrigger };
})();
