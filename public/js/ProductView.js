import Storage from './Storage.js';
import { showToast } from './Toast.js';

const addBtn = document.querySelector('#add-new-product');
const searchInput = document.querySelector('#search-input');
const sortSelect = document.querySelector('#sort-products');
const filterCatSelect = document.querySelector('#filter-category');

const editModal = document.querySelector('#edit-modal');
const closeEditBtn = document.querySelector('#close-edit-modal');
const cancelEditBtn = document.querySelector('#cancel-edit-modal');
const saveEditBtn = document.querySelector('#save-edit-product');

const deleteModal = document.querySelector('#delete-modal');
const cancelDeleteBtn = document.querySelector('#cancel-delete');
const confirmDeleteBtn = document.querySelector('#confirm-delete');

const CAT_COLORS = ['cat-0','cat-1','cat-2','cat-3','cat-4','cat-5','cat-6','cat-7'];

function toFa(n) {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

function formatPrice(price) {
  if (!price || price === '0') return null;
  return Number(price).toLocaleString('fa-IR') + ' تومان';
}

class ProductView {
  constructor() {
    this.products = [];
    this._pendingDeleteId = null;

    addBtn.addEventListener('click', () => this.addNewProduct());
    searchInput.addEventListener('input', () => this.applyFilters());
    sortSelect.addEventListener('change', () => {
      this.products = Storage.getAllProducts(sortSelect.value);
      this.applyFilters();
    });
    filterCatSelect.addEventListener('change', () => this.applyFilters());

    // Edit modal
    closeEditBtn.addEventListener('click', () => this.closeEditModal());
    cancelEditBtn.addEventListener('click', () => this.closeEditModal());
    saveEditBtn.addEventListener('click', () => this.saveEdit());
    editModal.addEventListener('click', (e) => { if (e.target === editModal) this.closeEditModal(); });

    // Delete modal
    cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
    confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
    deleteModal.addEventListener('click', (e) => { if (e.target === deleteModal) this.closeDeleteModal(); });
  }

  setApp() {
    this.products = Storage.getAllProducts();
  }

  addNewProduct() {
    const titleEl = document.querySelector('#product-title');
    const quantityEl = document.querySelector('#product-quantity');
    const categoryEl = document.querySelector('#product-category');
    const priceEl = document.querySelector('#product-price');

    const title = titleEl.value.trim();
    const quantity = quantityEl.value;
    const category = categoryEl.value;
    const price = priceEl.value;

    let valid = true;
    [titleEl, quantityEl, categoryEl].forEach((el) => el.classList.remove('error'));

    if (!title) { this.shake(titleEl); valid = false; }
    if (!quantity) { this.shake(quantityEl); valid = false; }
    if (!category) { this.shake(categoryEl); valid = false; }
    if (!valid) return;

    Storage.saveProducts({ title, category, quantity, price });
    this.products = Storage.getAllProducts(sortSelect.value);
    this.applyFilters();

    titleEl.value = '';
    quantityEl.value = '';
    priceEl.value = '';
    categoryEl.value = '';
    titleEl.focus();

    showToast(`محصول «${title}» اضافه شد`, 'success');
  }

  applyFilters() {
    const search = searchInput.value.trim().toLowerCase();
    const catFilter = filterCatSelect.value;

    let filtered = this.products;
    if (search) filtered = filtered.filter((p) => p.title.toLowerCase().includes(search));
    if (catFilter) filtered = filtered.filter((p) => String(p.category) === String(catFilter));
    this.createProductsList(filtered);
  }

  updateStats() {
    const products = Storage.getAllProducts();
    const categories = Storage.getAllCategories();
    const lowStock = products.filter((p) => Number(p.quantity) < 5).length;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = toFa(val); };
    set('total-products', products.length);
    set('stat-products', products.length);
    set('stat-categories', categories.length);
    set('stat-low-stock', lowStock);

    const lowCard = document.getElementById('low-stock-card');
    if (lowCard) {
      if (lowStock > 0) {
        lowCard.style.borderColor = 'rgba(245,158,11,0.35)';
        lowCard.style.background = 'rgba(120,53,15,0.05)';
      } else {
        lowCard.style.borderColor = '';
        lowCard.style.background = '';
      }
    }
  }

  createProductsList(products) {
    const listEl = document.querySelector('#products-list');
    const emptyEl = document.querySelector('#empty-state');
    const noResultsEl = document.querySelector('#no-results-state');

    this.updateStats();

    const allProducts = Storage.getAllProducts();
    const hasAny = allProducts.length > 0;
    const hasResults = products.length > 0;

    emptyEl.classList.toggle('hidden', hasAny);
    noResultsEl.classList.toggle('hidden', !hasAny || hasResults);

    if (!hasResults) {
      listEl.innerHTML = '';
      return;
    }

    const allCategories = Storage.getAllCategories();

    listEl.innerHTML = products
      .map((item, index) => {
        const cat = allCategories.find((c) => c.id == item.category);
        const qty = Number(item.quantity);
        const isLow = qty > 0 && qty < 5;
        const isEmpty = qty === 0;
        const date = new Date(item.createdAt).toLocaleDateString('fa-IR');
        const catIndex = cat ? allCategories.indexOf(cat) % CAT_COLORS.length : 0;
        const priceStr = formatPrice(item.price);

        const qtyClass = isEmpty ? 'qty-empty' : isLow ? 'qty-low' : 'qty-ok';

        return `
          <div class="product-card card p-4 flex items-center gap-3 fade-in"
            style="animation-delay: ${index * 40}ms;">
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 mb-1.5">
                <span class="font-semibold text-slate-100 truncate">${item.title}</span>
                ${cat ? `<span class="badge ${CAT_COLORS[catIndex]}">${cat.title}</span>` : ''}
                ${isLow ? '<span class="badge" style="background:rgba(245,158,11,0.12);color:#fbbf24;border-color:rgba(245,158,11,0.3);">موجودی کم</span>' : ''}
                ${isEmpty ? '<span class="badge" style="background:rgba(239,68,68,0.12);color:#f87171;border-color:rgba(239,68,68,0.3);">ناموجود</span>' : ''}
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                <span>${date}</span>
                ${priceStr ? `<span class="text-slate-400">${priceStr}</span>` : ''}
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <div class="text-center">
                <div class="text-xs text-slate-600 mb-1">موجودی</div>
                <div class="qty-badge ${qtyClass}">${toFa(qty)}</div>
              </div>
              <div class="flex flex-col gap-1.5">
                <button class="action-btn edit-btn edit-product"
                  data-id="${item.id}" title="ویرایش">
                  <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button class="action-btn del-btn delete-product"
                  data-id="${item.id}" title="حذف">
                  <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    listEl.querySelectorAll('.edit-product').forEach((btn) => {
      btn.addEventListener('click', (e) => this.openEditModal(e.currentTarget.dataset.id));
    });
    listEl.querySelectorAll('.delete-product').forEach((btn) => {
      btn.addEventListener('click', (e) => this.openDeleteModal(e.currentTarget.dataset.id));
    });
  }

  // ── Edit Modal ───────────────────────────────────────────
  openEditModal(id) {
    const product = Storage.getAllProducts().find((p) => p.id == id);
    if (!product) return;

    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-title').value = product.title;
    document.getElementById('edit-product-quantity').value = product.quantity;
    document.getElementById('edit-product-price').value = product.price || '';

    // Populate category select
    const categories = Storage.getAllCategories();
    const catSelect = document.getElementById('edit-product-category');
    catSelect.innerHTML = `<option value="" style="color:#64748b;">انتخاب دسته‌بندی</option>`;
    categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.title;
      opt.style.background = '#020617';
      opt.style.color = '#e2e8f0';
      if (c.id == product.category) opt.selected = true;
      catSelect.appendChild(opt);
    });

    editModal.classList.add('open');
    document.getElementById('edit-product-title').focus();
  }

  closeEditModal() {
    editModal.classList.remove('open');
  }

  saveEdit() {
    const id = document.getElementById('edit-product-id').value;
    const title = document.getElementById('edit-product-title').value.trim();
    const quantity = document.getElementById('edit-product-quantity').value;
    const price = document.getElementById('edit-product-price').value;
    const category = document.getElementById('edit-product-category').value;

    if (!title || !quantity || !category) {
      showToast('لطفاً تمام فیلدهای ضروری را پر کنید', 'error');
      return;
    }

    Storage.saveProducts({ id: Number(id), title, quantity, price, category });
    this.products = Storage.getAllProducts(sortSelect.value);
    this.applyFilters();
    this.closeEditModal();
    showToast(`محصول «${title}» ویرایش شد`, 'success');
  }

  // ── Delete Modal ─────────────────────────────────────────
  openDeleteModal(id) {
    this._pendingDeleteId = id;
    deleteModal.classList.add('open');
  }

  closeDeleteModal() {
    deleteModal.classList.remove('open');
    this._pendingDeleteId = null;
  }

  confirmDelete() {
    if (!this._pendingDeleteId) return;
    const product = Storage.getAllProducts().find((p) => p.id == this._pendingDeleteId);
    Storage.deleteProduct(this._pendingDeleteId);
    this.products = Storage.getAllProducts(sortSelect.value);
    this.applyFilters();
    this.closeDeleteModal();
    showToast(product ? `«${product.title}» حذف شد` : 'محصول حذف شد', 'warning');
  }

  // ── Helpers ──────────────────────────────────────────────
  shake(el) {
    el.classList.add('error', 'shake');
    el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
  }
}

export default new ProductView();
