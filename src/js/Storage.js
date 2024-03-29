const products = [
     {
          id: 1,
          title: "React.js",
          category: "frontend",
          createdAt: '2024-03-26T18:09:16.267Z',

     },
     {
          id: 2,
          title: "Node.js",
          description: "backend",
          createdAt: '2024-02-26T18:09:16.267Z',
     },
     {
          id: 3,
          title: "Vue.js",
          description: "frontend",
          createdAt: '2024-01-26T18:09:16.267Z',
     },
]
const categories = [
     {
          id: 1,
          title: "frontend",
          description: "frontend of app",
          createdAt: '2024-03-26T18:09:16.267Z',

     },
     {
          id: 2,
          title: "backend",
          description: "backend of app",
          createdAt: '2024-02-26T18:09:16.267Z',
     },
]
export default class Storage {
     static getAllCategories() {
          // save: products / categories = localStorage =
          const savedCategories = JSON.parse(localStorage.getItem("category")) || [];
          // sort = نزولی // decendig
          const sortedCategories = savedCategories.sort((a,b) => {
               return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1; // sort decending
          });
          return sortedCategories;
     }
     static saveCategory(categoryToSave) {
          const savedCategories = Storage.getAllCategories();
          const existedItem = savedCategories.find((c) => c.id === categoryToSave.id);
          if(existedItem) {
               // edit
               existedItem.title = categoryToSave.title;
               existedItem.description = categoryToSave.description;
          } else {
               // new
               categoryToSave.id = new Date().getTime();
               categoryToSave.createdAt = new Date().toISOString();
               savedCategories.push(categoryToSave);
          }
          localStorage.setItem("category" , JSON.stringify(savedCategories));
     }
     static getAllProducts(sort = "newest") {
          const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
          return savedProducts.sort((a,b) => {
               if(sort === "newest") {
               return new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1; // sort decending
          } else if(sort === "oldest") {
               return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;

          }
          });
     }
     static saveProducts(productToSave) {
          const savedProducts = Storage.getAllProducts();
          const existedItem = savedProducts.find((c) => c.id === productToSave.id);
          if(existedItem) {
               // edit
               existedItem.title = productToSave.title;
               existedItem.quantity = productToSave.quantity;
               existedItem.category = productToSave.category;

          } else {
               // new
               productToSave.id = new Date().getTime();
               productToSave.createdAt = new Date().toISOString();
               savedProducts.push(productToSave);
          }
          localStorage.setItem("products" , JSON.stringify(savedProducts));
     }
     static deleteProducts (id) {
          const savedProducts = Storage.getAllProducts();
          const filteredProducts = savedProducts.filter((p) => p.id != id); // bayad true bashe
          localStorage.setItem("products" , JSON.stringify(filteredProducts));
     }
}