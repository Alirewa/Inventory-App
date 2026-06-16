import Storage from './Storage.js';
import CategoryView from './CategoryView.js';
import ProductView from './ProductView.js';
import { showToast } from './Toast.js';

document.addEventListener('DOMContentLoaded', () => {
  Storage.initDefaults();

  CategoryView.setApp();
  ProductView.setApp();
  CategoryView.createCategoriesList();
  ProductView.createProductsList(ProductView.products);

  // ── Clear All ─────────────────────────────────────────────
  const clearAllBtn     = document.getElementById('clear-all-btn');
  const clearModal      = document.getElementById('clear-modal');
  const cancelClearBtn  = document.getElementById('cancel-clear');
  const confirmClearBtn = document.getElementById('confirm-clear');

  clearAllBtn.addEventListener('click', () => clearModal.classList.add('open'));
  cancelClearBtn.addEventListener('click', () => clearModal.classList.remove('open'));
  clearModal.addEventListener('click', (e) => { if (e.target === clearModal) clearModal.classList.remove('open'); });

  confirmClearBtn.addEventListener('click', () => {
    Storage.clearAll();
    Storage.initDefaults();
    CategoryView.categories = Storage.getAllCategories();
    ProductView.products    = Storage.getAllProducts();
    CategoryView.createCategoriesList();
    ProductView.createProductsList(ProductView.products);
    clearModal.classList.remove('open');
    showToast('همه داده‌ها پاک و دسته‌بندی‌های پیش‌فرض بازگردانده شدند', 'warning');
  });
});
