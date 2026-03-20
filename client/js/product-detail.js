const mainImage = document.querySelector("#mainImage");
const thumbnails = document.querySelectorAll(".thumbnail");
const breadcrumb = document.querySelector(".breadcrumb .container");


const params = new URLSearchParams(window.location.search);
const productId =Number(params.get("id"));

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

