import Storage from "./Storage.js";

const addNewProductBtn = document.getElementById("add-new-product");
const searchInput = document.querySelector("#search-input");
const selectedSort = document.querySelector("#sort-products");
class ProductView {
     constructor() {
          addNewProductBtn.addEventListener("click" , (e) => this.addNewProductBtn(e));
          searchInput.addEventListener("input" , e => this.searchProducts(e));
          selectedSort.addEventListener("change" , e => this.sortProducts(e));
          this.products = [];
     }

     setApp() {
          this.products = Storage.getAllProducts();
     }

     addNewProductBtn(e) {
          e.preventDefault();
          const title = document.querySelector("#product-title").value;
          const quantity = document.querySelector("#product-quantity").value;
          const category = document.querySelector("#product-category").value;

          if(!title || !category || !quantity) return;
          Storage.saveProducts({title , category , quantity});
          this.products = Storage.getAllProducts();
          this.createProductsList(this.products);
     }
     createProductsList(products) {
          let option = "";
          products.forEach((item) => {
               const options = { weekday: "long" , year: "numeric" , month: "long" , day: "numeric"};
               const selectedCategory = Storage.getAllCategories().find((c) => c.id == item.category);
               option += `
               <div class="flex items-center justify-between mb-4">
               <span class="text-slate-400">${item.title}</span>
               <div class="flex items-center gap-x-4">
                 <span class="text-slate-400">${new Date().toLocaleDateString("fa-IR" , options)}</span>
                 <span class="block px-3 py-0.5 text-slate-400 border border-slate-400 rounded-2xl text-sm">${selectedCategory.title}</span>
                 <span class="flex items-center justify-center w-7 h-7 rounded-full bg-slate-500 text-slate-300 border-2 border-slate-300">${item.quantity}</span>
                   <button class="deleteProduct border px-2 py-0.5 rounded-2xl border-red-500 text-red-400" data-id=${item.id}> Delete </button>
               </div>
             </div>`;
          });
          const productsDOM = document.getElementById("products-list");
          productsDOM.innerHTML = option;

          const deleteBtns = [...document.querySelectorAll(".deleteProduct")];
          deleteBtns.forEach((item) => {
               item.addEventListener("click" , (e) => this.deleteProducts(e));

          })
     }
     searchProducts(e) {
          const value = e.target.value.trim().toLowerCase();
          const filteredProducts = this.products.filter(p => p.title.toLowerCase().includes(value));
          this.createProductsList(filteredProducts);
     }
     sortProducts(e) {
          const value = e.target.value;
          this.products = Storage.getAllProducts(value);
          this.createProductsList(this.products);
     }
     deleteProducts(e) {
          const ProductId = e.target.dataset.id;
          Storage.deleteProducts(ProductId);
          this.products = Storage.getAllProducts();
          this.createProductsList(this.products);
     }
}
export default new ProductView();