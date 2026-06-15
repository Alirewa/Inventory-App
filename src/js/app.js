import Categoryview from './Categoryview.js';
import Productview from './Productview.js';

document.addEventListener('DOMContentLoaded', () => {
 Categoryview.setApp();
 Productview.setApp();

 Categoryview.createCategoriesList();
 Productview.createProductsList(Productview.products);
});
