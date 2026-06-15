import Storage from './Storage.js';

const addNewProductBtn = document.querySelector('#add-new-product');
const searchInput = document.querySelector('#search-input');
const selectedSort = document.querySelector('#sort-products');

class Productview {
 constructor() {
  addNewProductBtn.addEventListener('click', (e) => this.addNewProduct(e));
  searchInput.addEventListener('input', (e) => this.searchProducts(e));
  selectedSort.addEventListener('change', (e) => this.sortProducts(e));
  this.products = [];
 }
 addNewProduct(e) {
  e.preventDefault();
  const title = document.querySelector('#product-title').value;
  const quantity = document.querySelector('#product-quantity').value;
  const category = document.querySelector('#product-category').value;
  if (!title || !quantity || !category) return;
  Storage.saveProducts({ title, category, quantity });
  this.products = Storage.getAllProducts();
  this.createProductsList(this.products);
 }
 setApp() {
  this.products = Storage.getAllProducts();
 }
 createProductsList(products) {
  let result = '';

  products.forEach((item) => {
   const selectedCategory = Storage.getAllCategories().find((c) => c.id == item.category);

   result += `
    <div class="flex items-center justify-between pb-4">
     <span class="text-slate-400">${item.title}</span>
     <div class="flex items-center gap-x-3">
      <span class="text-slate-400">${new Date().toLocaleDateString('en-us')}</span>
      <span class="block px-4 py-1 border border-slate-600 rounded-md text-slate-400 text-sm">${selectedCategory.title}</span>
      <span class="flex items-center justify-center text-sm w-7 h-5 rounded-full bg-slate-500 text-slate-300 border border-slate-300"
       >${item.quantity}</span
      >
      <button class="delete-product border px-2 py-1 rounded-md border-red-400 text-red-400 text-sm" data-id=${item.id}>delete</button>
     </div>
    </div>
    `;
  });
  const productsDOM = document.querySelector('#products-list');
  productsDOM.innerHTML = result;

  const deleteBtns = [...document.querySelectorAll('.delete-product')];
  deleteBtns.forEach((item) => {
   item.addEventListener('click', (e) => this.deleteProduct(e));
  });
 }
 searchProducts(e) {
  const value = e.target.value.trim().toLowerCase();
  const filteredProducts = this.products.filter((p) => p.title.toLowerCase().includes(value));
  this.createProductsList(filteredProducts);
 }
 sortProducts(e) {
  const value = e.target.value;
  this.products = Storage.getAllProducts(value);
  this.createProductsList(this.products);
 }
 deleteProduct(e) {
  const productId = e.target.dataset.id;
  Storage.deleteProduct(productId);
  this.products = Storage.getAllProducts();
  this.createProductsList(this.products);
 }
}

export default new Productview();
