import Storage from './Storage.js';
import { showToast } from './Toast.js';

const categoryTitleEl = document.querySelector('#category-title');
const categoryDescEl = document.querySelector('#category-description');
const addNewCategoryBtn = document.querySelector('#add-new-category');
const toggleBtn = document.querySelector('#toggle-add-category');
const categoryWrapper = document.querySelector('#category-wrapper');
const cancelBtn = document.querySelector('#cancel-add-category');
const chevron = document.querySelector('#category-chevron');
const categoryListSection = document.querySelector('#category-list-section');
const categoryListEl = document.querySelector('#category-list');

const CAT_COLORS = ['cat-0','cat-1','cat-2','cat-3','cat-4','cat-5','cat-6','cat-7'];

class CategoryView {
  constructor() {
    this.categories = [];
    this.isOpen = false;
    addNewCategoryBtn.addEventListener('click', () => this.addNewCategory());
    toggleBtn.addEventListener('click', () => this.toggle());
    cancelBtn.addEventListener('click', () => this.close());
  }

  setApp() {
    this.categories = Storage.getAllCategories();
  }

  addNewCategory() {
    const title = categoryTitleEl.value.trim();
    const description = categoryDescEl.value.trim();
    if (!title) {
      categoryTitleEl.classList.add('error', 'shake');
      categoryTitleEl.addEventListener('animationend', () => categoryTitleEl.classList.remove('shake'), { once: true });
      return;
    }
    if (!description) {
      categoryDescEl.classList.add('error', 'shake');
      categoryDescEl.addEventListener('animationend', () => categoryDescEl.classList.remove('shake'), { once: true });
      return;
    }
    Storage.saveCategory({ title, description });
    this.categories = Storage.getAllCategories();
    categoryTitleEl.value = '';
    categoryDescEl.value = '';
    categoryTitleEl.classList.remove('error');
    categoryDescEl.classList.remove('error');
    this.close();
    this.createCategoriesList();
    showToast(`دسته‌بندی «${title}» اضافه شد`, 'success');
  }

  createCategoriesList() {
    // Update add-product select
    const productCatSelect = document.getElementById('product-category');
    const editCatSelect = document.getElementById('edit-product-category');
    const filterCatSelect = document.getElementById('filter-category');

    let addOptions = `<option value="" style="color:#64748b;">انتخاب دسته‌بندی</option>`;
    let editOptions = `<option value="" style="color:#64748b;">انتخاب دسته‌بندی</option>`;
    let filterOptions = `<option value="">همه دسته‌ها</option>`;

    this.categories.forEach((item) => {
      addOptions += `<option value="${item.id}" style="background:#020617;color:#e2e8f0;">${item.title}</option>`;
      editOptions += `<option value="${item.id}" style="background:#020617;color:#e2e8f0;">${item.title}</option>`;
      filterOptions += `<option value="${item.id}" style="background:#020617;color:#e2e8f0;">${item.title}</option>`;
    });

    if (productCatSelect) productCatSelect.innerHTML = addOptions;
    if (editCatSelect) editCatSelect.innerHTML = editOptions;
    if (filterCatSelect) filterCatSelect.innerHTML = filterOptions;

    // Update stat
    const statEl = document.getElementById('stat-categories');
    if (statEl) statEl.textContent = toFa(this.categories.length);

    // Render category list in sidebar
    if (!categoryListSection || !categoryListEl) return;

    if (this.categories.length === 0) {
      categoryListSection.classList.add('hidden');
      return;
    }

    categoryListSection.classList.remove('hidden');
    const allProducts = Storage.getAllProducts();

    categoryListEl.innerHTML = this.categories
      .map((cat, i) => {
        const count = allProducts.filter((p) => p.category == cat.id).length;
        const colorClass = CAT_COLORS[i % CAT_COLORS.length];
        return `
          <div class="cat-item">
            <div class="flex items-center gap-2 min-w-0">
              <span class="badge ${colorClass}">${cat.title}</span>
              <span class="text-xs text-slate-500">${toFa(count)} محصول</span>
            </div>
            <button
              class="delete-category w-7 h-7 rounded-lg border border-transparent text-slate-600
                hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10
                flex items-center justify-center transition-all shrink-0"
              data-id="${cat.id}" title="حذف دسته‌بندی">
              <svg class="w-3.5 h-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        `;
      })
      .join('');

    categoryListEl.querySelectorAll('.delete-category').forEach((btn) => {
      btn.addEventListener('click', (e) => this.deleteCategory(e.currentTarget.dataset.id));
    });
  }

  deleteCategory(id) {
    const cat = this.categories.find((c) => c.id == id);
    if (!cat) return;
    Storage.deleteCategory(id);
    this.categories = Storage.getAllCategories();
    this.createCategoriesList();
    // Refresh product list
    import('./ProductView.js').then((m) => {
      m.default.products = Storage.getAllProducts();
      m.default.createProductsList(m.default.products);
    });
    showToast(`دسته‌بندی «${cat.title}» حذف شد`, 'warning');
  }

  open() {
    categoryWrapper.classList.remove('hidden');
    chevron.classList.add('rotate-180');
    this.isOpen = true;
    categoryTitleEl.focus();
  }

  close() {
    categoryWrapper.classList.add('hidden');
    chevron.classList.remove('rotate-180');
    this.isOpen = false;
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }
}

export default new CategoryView();

function toFa(n) {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
}
