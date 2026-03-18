//Declaration of Variable
const productGrid = document.querySelector(".product-grid");
const loadMoreBtn = document.querySelector(".btn-load-more");
const applyFiltersBtn = document.querySelector(".btn-apply-filters");
const checkboxgroup = document.querySelector(".checkbox-group");
const resultsCount = document.querySelector(".results-count span");

let allProducts = [];
let allCategories = [];
let currentProducts = [];
let currentLimit = 6;
const additive = 6;
//CheckBox
//fetch category from categories.json
fetch("../data/categories.json")
    .then(function(response){
        return response.json();
    })
    .then(function(category){
        allCategories=category;
        renderCategories(allCategories);
    });

//Render Categories
function renderCategories(categories){
    console.log(categories);
    if(categories.length===0){
        checkboxgroup.innerHTML=`<p class="no-result">No Category Found.</p>`
        return;
    }
    checkboxgroup.innerHTML= categories.map(function(category){
        return `
        <div class="checkbox-item" data-category="${category.category}">
            <input type="checkbox" id="${category.category}" name="${category.category}" value="${category.category}" />
            <label for="${category.category}">${category.name}</label>
        </div>
        `
    }).join("");
}

//Click Event
//Fetch product data
fetch("../data/products.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(products) {
        allProducts = products;
        const params = new URLSearchParams(window.location.search);
        const categoryParam = params.get("category");
        const searchParam = params.get("search");

        if (categoryParam) {
            const filtered = products.filter(function(p) {
                return p.category === categoryParam;
            });
            renderProducts(filtered);

        } else if (searchParam) {
            const filtered = products.filter(function(p) {
                return p.name.toLowerCase().includes(searchParam.toLowerCase());
            });
            renderProducts(filtered);

        } else {
            renderProducts(allProducts);
        }
    });
//Render products
function renderProducts(products) {
    currentProducts = products;

    // update results count in topbar
    resultsCount.textContent = products.length;
    // ← shows "Showing X products" dynamically

    if (products.length === 0) {
        productGrid.innerHTML = `<p class="no-results">No products found.</p>`;
        loadMoreBtn.disabled = true;
        return;
    }

    productGrid.innerHTML = products.slice(0, currentLimit).map(function(product) {
        return `
            <article class="product-card" data-name="${product.name.toLowerCase()}"
            data-category="${product.category}">
                <img src="${product.image}" alt="${product.name}" />
                <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <p class="product-price">₹${product.price.toLocaleString("en-IN")}</p>
                <button class="add-to-cart">Add to Cart</button>
                </div>
            </article>
        `;
    }).join("");

    if (products.length <= currentLimit) {
        loadMoreBtn.disabled = true;
    } else {
        loadMoreBtn.disabled = false;
    }
}

/* Load More */
loadMoreBtn.addEventListener("click", function() {
    currentLimit += additive;
    renderProducts(currentProducts);
    loadMoreBtn.scrollIntoView({ behavior: "smooth" });
});
//Rating Helper function

function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    // remaining empty stars to make 5 total

    return "⭐".repeat(full) + (half ? "✨" : "") + "☆".repeat(empty);

}

//Apply Filter Buton
applyFiltersBtn.addEventListener("click",function(){
    currentLimit=6;
    const checked = document.querySelectorAll(".checkbox-group input:checked");
    const selectedCategories = Array.from(checked).map(function(input){
        return input.value;
    });
    if (selectedCategories.length === 0) {
        renderProducts(allProducts);
        return;
    }
    const filtered = allProducts.filter(function(p) {
        return selectedCategories.includes(p.category);
    });
    renderProducts(filtered);
});