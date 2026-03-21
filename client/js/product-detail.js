const mainImage = document.querySelector("#mainImage");
const thumbnails = document.querySelectorAll(".thumbnail");
const breadcrumb = document.querySelector(".breadcrumb .container");


const params = new URLSearchParams(window.location.search);
const productId =Number(params.get("id"));
let currentProduct = null;

fetch("../data/products.json")
    .then(function(response){
        return response.json();
    })
    .then(function(products){
        const product=products.find(function(p){
            return p.id===productId;
        });
        if(!product){
            window.location.href="./products.html";
            return;
        }
        currentProduct = product;
        const related = products.filter(function(p) {
        return p.category === product.category && p.id !== product.id;
        });
        renderProduct(product);
        renderRelatedProducts(related);

    });

function renderProduct(product){
    document.title = `${product.name} — XMart`;
    const category = product.category;
    const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
    //Breadcrumbs
    breadcrumb.innerHTML = `
        <a href="./index.html">Home</a>
        <span>/</span>
        <a href="./products.html?category=${product.category}">${capitalized}</a>
        <span>/</span>
        <p>${product.name}</p>
    `;

    //Product Image and Thumbnails
    mainImage.src = product.image;
    mainImage.alt = product.name;

    thumbnails.forEach(function(thumb) {
        thumb.src = product.image;
        thumb.alt = product.name;
    });

     // text content updates
    document.querySelector(".product-category").textContent = capitalize(product.category);
    document.querySelector(".product-title").textContent = product.name;
    document.querySelector(".detail-price").textContent = formatPrice(product.price);
    document.querySelector(".product-description").textContent = product.description;

    // rating
    document.querySelector(".stars").innerHTML = getStars(product.rating);
    document.querySelector(".rating-count").textContent = `(${product.reviews} reviews)`;

    // only show original price if different
    const originalPrice = document.querySelector(".original-price");
    if (product.originalPrice !== product.price) {
        originalPrice.textContent = formatPrice(product.originalPrice);
    } else {
        originalPrice.style.display = "none";
    }

    const badge = document.querySelector(".discount-badge");
    if (product.badge) {
        badge.textContent = product.badge;
    } else {
        badge.style.display = "none";
        // hide if no badge
    }

    // stock status
    const stockEl = document.querySelector(".meta-value.in-stock");
    if (product.inStock) {
        stockEl.textContent = "● In Stock";
        stockEl.style.color = "var(--green)";
    } else {
        stockEl.textContent = "● Out of Stock";
        stockEl.style.color = "var(--red)";
    }

    document.querySelector(".brand-value").textContent = product.brand;
    document.querySelector(".sku-value").textContent = product.sku;

    document.querySelector(".about-text").innerHTML = `<p>${product.longDescription}</p>`;
    const specsList = document.querySelector(".specs-list");
    specsList.innerHTML = `
        <h3>Specifications</h3>
        ${Object.entries(product.specs).map(function([key, value]) {
            return `
                <div class="spec-item">
                    <span class="spec-label">${key}</span>
                    <span class="spec-value">${value}</span>
                </div>
            `;
        }).join("")}
    `;
}

/* ================================
   QUANTITY BUTTONS
================================ */
const qtyMinus = document.querySelector("#qtyMinus");
const qtyPlus = document.querySelector("#qtyPlus");
const qtyInput = document.querySelector("#quantity");

qtyMinus.addEventListener("click", function() {
    let current = Number(qtyInput.value);
    if (current > 1) {
        qtyInput.value = current - 1;
    }
});

qtyPlus.addEventListener("click", function() {
    let current = Number(qtyInput.value);
    if (current < 10) {
        qtyInput.value = current + 1;
    }
});

/* ================================
   ADD TO CART
================================ */
const addToCartBtn = document.querySelector(".btn-add-to-cart");
const buyNowBtn = document.querySelector(".btn-buy-now");

addToCartBtn.addEventListener("click", function() {
    const quantity = Number(qtyInput.value);
    addToCart(currentProduct, quantity);
});

buyNowBtn.addEventListener("click", function() {
    // add to cart first
    addToCartBtn.click();
    // then redirect to cart
    window.location.href = "./cart.html";
});

/* ================================
   Related Products
================================ */

function renderRelatedProducts(related){
    const relatedGrid = document.querySelector(".related-products .product-grid");
    const relatedSection = document.querySelector(".related-products");
    if(related.length===0){
        relatedSection.style.display="none";
        return;
    }
    relatedGrid.innerHTML = related
    .slice(0, 4)
    .map(createProductCard)
    .join("");
}