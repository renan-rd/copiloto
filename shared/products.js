(function () {
  const PRODUCT_FOLDERS = {
    vendas: '',
    marketing: 'RDM/',
    conversas: 'RDA/',
  };

  const PRODUCT_LABELS = {
    vendas: 'RD Vendas',
    marketing: 'RD Marketing',
    conversas: 'RD Atendimento',
  };

  function getMenuEl() {
    return document.getElementById('products-menu');
  }

  function getBasePath() {
    const menu = getMenuEl();
    return menu?.dataset.base || '../';
  }

  function getCurrentProduct() {
    const menu = getMenuEl();
    return menu?.dataset.currentProduct || 'vendas';
  }

  function getPageType() {
    const menu = getMenuEl();
    return menu?.dataset.page || 'contatos';
  }

  function buildProductUrl(productId, pageType) {
    const base = getBasePath();
    const folder = PRODUCT_FOLDERS[productId] || '';
    const pageFolder = pageType === 'perfil' ? 'perfil/' : 'contatos/';
    return `${base}${folder}${pageFolder}index.html`;
  }

  function navigateToProduct(productId) {
    if (productId === getCurrentProduct()) return;

    const pageType = getPageType();
    let url = buildProductUrl(productId, pageType);

    if (pageType === 'perfil') {
      const id = new URLSearchParams(window.location.search).get('id');
      if (id) url += `?id=${encodeURIComponent(id)}`;
    }

    window.location.href = url;
  }

  function closeMenu() {
    const menu = getMenuEl();
    const trigger = document.getElementById('products-menu-trigger');
    const drop = document.getElementById('products-dropdown');
    if (!menu || !trigger || !drop) return;
    drop.classList.remove('open');
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function initProductsMenu() {
    const menu = getMenuEl();
    const trigger = document.getElementById('products-menu-trigger');
    const drop = document.getElementById('products-dropdown');
    if (!menu || !trigger || !drop) return;

    const current = getCurrentProduct();

    menu.querySelectorAll('[data-product-id]').forEach(item => {
      if (item.dataset.productId === current) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'true');
      }

      item.addEventListener('click', e => {
        e.stopPropagation();
        navigateToProduct(item.dataset.productId);
      });
    });

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = drop.classList.toggle('open');
      trigger.classList.toggle('open', isOpen);
      trigger.setAttribute('aria-expanded', String(isOpen));

      const accountDrop = document.getElementById('account-dropdown');
      if (isOpen && accountDrop) accountDrop.classList.remove('open');
    });

    document.addEventListener('click', e => {
      if (!menu.contains(e.target)) closeMenu();
    });

    const accountMenu = document.getElementById('account-menu');
    const accountDrop = document.getElementById('account-dropdown');
    if (accountMenu && accountDrop) {
      accountMenu.addEventListener('click', e => {
        if (e.target.closest('#logout-btn')) return;
        const isOpen = accountDrop.classList.toggle('open');
        if (isOpen) closeMenu();
      });
      document.addEventListener('click', e => {
        if (!accountMenu.contains(e.target)) accountDrop.classList.remove('open');
      });
    }
  }

  window.__products = {
    PRODUCT_FOLDERS,
    PRODUCT_LABELS,
    buildProductUrl,
    navigateToProduct,
    initProductsMenu,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductsMenu);
  } else {
    initProductsMenu();
  }
})();
