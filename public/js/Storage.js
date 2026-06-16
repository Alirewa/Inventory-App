export default class Storage {
  static initDefaults() {
    if (Storage.getAllCategories().length > 0) return;
    const now = Date.now();
    const defaults = [
      { id: now + 1, title: 'الکترونیک',          description: 'لوازم الکترونیکی و دیجیتال',   createdAt: new Date().toISOString() },
      { id: now + 2, title: 'لوازم خانگی',         description: 'وسایل مورد نیاز خانه',          createdAt: new Date().toISOString() },
      { id: now + 3, title: 'پوشاک',               description: 'پوشاک و اکسسوری',              createdAt: new Date().toISOString() },
      { id: now + 4, title: 'خوراکی و نوشیدنی',    description: 'مواد غذایی و نوشیدنی',         createdAt: new Date().toISOString() },
      { id: now + 5, title: 'بهداشت و آرایشی',     description: 'لوازم بهداشتی و آرایشی',       createdAt: new Date().toISOString() },
    ];
    localStorage.setItem('categories', JSON.stringify(defaults));
    localStorage.setItem('defaultCategory', String(defaults[0].id));
  }

  static setDefaultCategory(id) {
    localStorage.setItem('defaultCategory', String(id));
  }

  static getDefaultCategoryId() {
    return localStorage.getItem('defaultCategory');
  }

  static clearAll() {
    localStorage.removeItem('products');
    localStorage.removeItem('categories');
    localStorage.removeItem('defaultCategory');
  }

  static getAllCategories() {
    return JSON.parse(localStorage.getItem('categories')) || [];
  }

  static saveCategory(categoryToSave) {
    const categories = Storage.getAllCategories();
    const existing = categories.find((c) => c.id == categoryToSave.id);
    if (existing) {
      existing.title = categoryToSave.title;
      existing.description = categoryToSave.description;
    } else {
      categoryToSave.id = Date.now();
      categoryToSave.createdAt = new Date().toISOString();
      categories.push(categoryToSave);
    }
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  static deleteCategory(id) {
    const numId = Number(id);
    const categories = Storage.getAllCategories().filter((c) => c.id !== numId);
    localStorage.setItem('categories', JSON.stringify(categories));
    if (Storage.getDefaultCategoryId() == id) {
      const remaining = Storage.getAllCategories();
      localStorage.setItem('defaultCategory', remaining.length ? String(remaining[0].id) : '');
    }
  }

  static getAllProducts(sort = 'newest') {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    return products.sort((a, b) => {
      if (sort === 'newest')   return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest')   return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'qty-asc')  return Number(a.quantity) - Number(b.quantity);
      if (sort === 'qty-desc') return Number(b.quantity) - Number(a.quantity);
      return 0;
    });
  }

  static saveProducts(productToSave) {
    const products = Storage.getAllProducts();
    const existing = products.find((p) => p.id == productToSave.id);
    if (existing) {
      existing.title    = productToSave.title;
      existing.quantity = productToSave.quantity;
      existing.category = productToSave.category;
      existing.price    = productToSave.price || '';
    } else {
      productToSave.id = Date.now();
      productToSave.createdAt = new Date().toISOString();
      products.push(productToSave);
    }
    localStorage.setItem('products', JSON.stringify(products));
  }

  static deleteProduct(id) {
    const numId = Number(id);
    const products = Storage.getAllProducts().filter((p) => p.id !== numId);
    localStorage.setItem('products', JSON.stringify(products));
  }
}
