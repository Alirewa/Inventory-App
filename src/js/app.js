// targets:
// 1. create category
// 2. create product based on select category
// 3. edit product
// 4. remove product
// 5. save products in local storgae
// 6. storage class for handle application methods
// 7. productView class
// 8. categoryView class
// 9. main and app class
import categoryView from "./CategoryView.js";
import ProductView from "./ProductView.js";

document.addEventListener("DOMContentLoaded" , () => {
     // setApp => categories : OK
     categoryView.setApp();
     // setApp => products : OK
     ProductView.setApp();
     console.log(ProductView);
     // create categories options
     categoryView.createCategoriesList();
     ProductView.createProductsList(ProductView.products);
     
})