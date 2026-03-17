/* ================================
   DECLARATIONS — always at top
================================ */
const searchBarWrap = document.querySelector(".search-bar-wrap");
const searchInput = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar button");
const dropdown = document.querySelector(".search-dropdown");
const productGrid = document.querySelector("#productgrid");
const loadMore = document.querySelector(".btn-load-more");

let allProducts = [];
let currentProducts = [];
let currentLimit = 8;
const additive = 8;

/* ================================
   FETCH PRODUCTS
================================ */
fetch("../data/products.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(products) {
        allProducts = products;
        const featured = products.filter(function(p) {
            return p.featured === true;
        });
        renderProducts(featured);
    });

/* ================================
   RENDER PRODUCTS
================================ */
function renderProducts(products) {
    currentProducts = products;

    if (products.length === 0) {
        productGrid.innerHTML = `<p class="no-results">No products found.</p>`;
        loadMore.disabled = true;
        return;
    }

    productGrid.innerHTML = products.slice(0, currentLimit).map(function(product) {
        return `
            <article class="product-card"
                     data-name="${product.name.toLowerCase()}"
                     data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}" />
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">₹${product.price.toLocaleString("en-IN")}</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </article>
        `;
    }).join("");

    if (products.length <= currentLimit) {
        loadMore.disabled = true;
    } else {
        loadMore.disabled = false;
    }
}

/* ================================
   SEARCH DROPDOWN
================================ */
searchInput.addEventListener("input", function() {
    const query = searchInput.value.trim().toLowerCase();

    if (query === "") {
        dropdown.style.display = "none";
        return;
    }

    const results = allProducts.filter(function(product) {
        return product.name.toLowerCase().includes(query);
    }).slice(0, 5);

    if (results.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    dropdown.innerHTML = results.map(function(product) {
        return `
            <div class="dropdown-item" data-name="${product.name}">
                <span class="dropdown-item-name">${product.name}</span>
                <span class="dropdown-item-category">${product.category}</span>
            </div>`
    }).join("");

    dropdown.style.display = "block";
});

/* Dropdown item click */
dropdown.addEventListener("click", function(event) {
    const clicked = event.target.closest(".dropdown-item");
    if (!clicked) return;
    const query = clicked.dataset.name.toLowerCase();
    window.location.href = `./products.html?search=${query}`;
});

/* Search button click */
searchBtn.addEventListener("click", function() {
    currentLimit = 8;
    const query = searchInput.value.trim().toLowerCase();
    if (query === "") return;
    window.location.href = `./products.html?search=${query}`;
});

/* Outside click closes dropdown */
document.addEventListener("click", function(event) {
    if (!searchBarWrap.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

/* ================================
   LOAD MORE
================================ */
loadMore.addEventListener("click", function() {
    currentLimit += additive;
    renderProducts(currentProducts);
    loadMore.scrollIntoView({ behavior: "smooth" });
});
