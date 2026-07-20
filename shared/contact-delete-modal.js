(function() {
  const overlay = document.getElementById('delete-modal-overlay');
  if (!overlay) return;

  const countEl = document.getElementById('delete-modal-count');
  const confirmEl = document.getElementById('delete-modal-confirm');
  const closeBtn = document.getElementById('delete-modal-close');
  const trashBtn = document.getElementById('delete-modal-trash-btn');
  const permanentBtn = document.getElementById('delete-modal-permanent-btn');

  let pendingContactIds = null;
  let onDeleteSuccess = null;

  function getDb() {
    return window.__profileDb || window.__sbClient;
  }

  function getContactIdsForDelete() {
    if (pendingContactIds?.length) return [...pendingContactIds];
    return window.__getSelectedContactIds?.() || [];
  }

  function clearPendingState() {
    pendingContactIds = null;
    onDeleteSuccess = null;
  }

  function updateDeletePermanentBtn() {
    if (!permanentBtn) return;
    permanentBtn.disabled = !confirmEl?.checked;
  }

  function closeDeleteModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    if (confirmEl) confirmEl.checked = false;
    if (permanentBtn) {
      permanentBtn.disabled = true;
      permanentBtn.textContent = 'Excluir permanentemente';
    }
    clearPendingState();
  }

  function openDeleteModal(contactIds, options = {}) {
    const ids = (contactIds || []).filter(Boolean);
    if (!ids.length) return;

    pendingContactIds = [...ids];
    onDeleteSuccess = typeof options.onSuccess === 'function' ? options.onSuccess : null;

    if (countEl) countEl.textContent = ids.length;
    if (confirmEl) confirmEl.checked = false;
    updateDeletePermanentBtn();

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn?.focus();
  }

  async function performPermanentDelete(contactIds) {
    const db = getDb();
    if (!db) return new Error('Banco de dados indisponível');
    const { error } = await db.from('claude_contatos').delete().in('id', contactIds);
    return error;
  }

  async function handlePermanentDelete() {
    const contactIds = getContactIdsForDelete();
    if (!contactIds.length) return;

    const successCb = onDeleteSuccess;

    if (permanentBtn) {
      permanentBtn.disabled = true;
      const originalLabel = permanentBtn.textContent;
      permanentBtn.textContent = 'Excluindo...';

      const error = await performPermanentDelete(contactIds);

      permanentBtn.textContent = originalLabel;
      updateDeletePermanentBtn();

      if (error) {
        closeDeleteModal();
        requestAnimationFrame(() => {
          window.__showToast?.('Não foi possível excluir o contato', {
            kind: 'error',
            action: {
              label: 'Tentar novamente',
              onClick: () => {
                pendingContactIds = [...contactIds];
                onDeleteSuccess = successCb;
                handlePermanentDelete();
              },
            },
          });
        });
        return;
      }
    } else {
      const error = await performPermanentDelete(contactIds);
      if (error) {
        requestAnimationFrame(() => {
          window.__showToast?.('Não foi possível excluir o contato', {
            kind: 'error',
            action: {
              label: 'Tentar novamente',
              onClick: () => {
                pendingContactIds = [...contactIds];
                onDeleteSuccess = successCb;
                handlePermanentDelete();
              },
            },
          });
        });
        return;
      }
    }

    clearPendingState();
    closeDeleteModal();

    if (successCb) {
      successCb();
    } else {
      document.getElementById('bulk-clear')?.click();
      window.__contactsReload?.();
    }

    requestAnimationFrame(() => {
      window.__showToast?.('Contato excluído com sucesso');
    });
  }

  window.__openDeleteContactModal = openDeleteModal;
  window.__closeDeleteContactModal = closeDeleteModal;

  closeBtn?.addEventListener('click', closeDeleteModal);
  confirmEl?.addEventListener('change', updateDeletePermanentBtn);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeDeleteModal();
  });

  overlay.querySelector('.delete-modal')?.addEventListener('click', e => {
    e.stopPropagation();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeDeleteModal();
    }
  });

  trashBtn?.addEventListener('click', () => {
    // Caso de uso será implementado posteriormente
  });

  permanentBtn?.addEventListener('click', async () => {
    if (permanentBtn.disabled) return;
    await handlePermanentDelete();
  });
})();
