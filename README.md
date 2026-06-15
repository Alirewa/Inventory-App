<div align="center">

# Inventory App — سامانه انبارداری

> A modern, fully responsive Persian (RTL) inventory management web app built with Vanilla JavaScript and Tailwind CSS. No backend required — all data persists in `localStorage`.

[![Live Demo](https://img.shields.io/badge/Live_Demo-%E2%86%92-4ade80?style=for-the-badge)](https://alirewa.github.io/Inventory-App/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**[View Live Demo →](https://alirewa.github.io/Inventory-App/)**

</div>

---

## Overview

**Inventory App** is a lightweight, client-side inventory management system designed for Persian-speaking users. The entire app runs in the browser with no server, no database, and no build step — just open and use. Data is persisted across sessions using the browser's `localStorage` API.

---

## Features

- **Add, edit & delete** products and categories
- **Price field** for products (optional, displayed in Tomans)
- **Real-time search** across product names
- **Category filter** to view products by group
- **Multiple sort options** — newest, oldest, quantity low-to-high / high-to-low
- **Low-stock alerts** — products with fewer than 5 units highlighted automatically
- **Edit modal** for updating product details without page reload
- **Confirmation dialog** before any delete action
- **Toast notifications** for all actions (add, edit, delete)
- **Dashboard stats** — total products, categories, and low-stock count
- **Fully RTL** — designed and tested for right-to-left Persian layout
- **Fully responsive** — works on mobile, tablet and desktop
- **Zero dependencies** — no frameworks, no npm packages at runtime
- **Offline-ready** — works without an internet connection (fonts/CDN cached by browser)

---

## Tech Stack

| Technology | Role |
|---|---|
| JavaScript ES6+ (Modules) | Core application logic, CRUD, modals |
| Tailwind CSS (CDN) | Responsive UI, dark theme, utility classes |
| HTML5 | Semantic markup, RTL support |
| `localStorage` API | Client-side data persistence |
| Vazirmatn Font | Persian typography |

---

## Getting Started

No build step needed. Clone the repo and open `public/index.html` in your browser:

```bash
git clone https://github.com/Alirewa/Inventory-App.git
cd Inventory-App
# Open public/index.html in your browser
```

Or use the **[live demo](https://alirewa.github.io/Inventory-App/)** directly — no installation required.

---

## Project Structure

```
public/
├── index.html          # App entry point
├── js/
│   ├── app.js          # Initializes the app
│   ├── CategoryView.js # Category add/delete/list logic
│   ├── ProductView.js  # Product CRUD, search, filter, modals
│   ├── Storage.js      # localStorage abstraction layer
│   └── Toast.js        # Toast notification utility
src/
├── css/
│   └── main.css        # Tailwind source (for local builds)
```

---

## Local Development

To use the Tailwind PostCSS build pipeline instead of the CDN:

```bash
npm install
npm run dev   # watches src/css/main.css → public/build/tailwind.css
```

Then swap the CDN `<script>` tag in `index.html` for:
```html
<link rel="stylesheet" href="./build/tailwind.css" />
```

---

## License

Distributed under the **MIT License** — free to use, modify, and distribute.

---

<div align="center">

Made with ❤️ by [Alirewa](https://github.com/Alirewa)

</div>
