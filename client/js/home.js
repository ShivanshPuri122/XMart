const productGrid=document.querySelector("#productgrid");
const searchInput = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar button");

/*To store Products */
let allProducts=[];

/* ================================
   FETCH PRODUCTS FROM JSON
================================ */

fetch("../data/products.json")
    .then(function(response){
        return response.json();
    })
    .then(function(products){
        allProducts=products;
        const featured= products.filter(function(p){
            return p.featured===true;
        });
    
        renderProducts(featured);

    });

/* ================================
   RENDER PRODUCTS
================================ */

function renderProducts(products){

    if(products.length===0){
        productGrid.innerHTML=`<p class="no-results">No products found.</p>`;
        return;
    }

    productGrid.innerHTML = products.map(function(product) {
        return `
            <article class="product-card"
                     data-name="${product.name.toLowerCase()}"
                     data-category="${product.category}">
                <img src="${product.image}"
                     alt="${product.name}" />
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">₹${product.price.toLocaleString("en-IN")}</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </article>
        `;
    }).join("");
}

function searchProducts() {
    const query = searchInput.value.trim().toLowerCase();

    const filtered = allProducts.filter(function(product) {
        return product.name.toLowerCase().includes(query);
    });

    renderProducts(filtered);
}

searchInput.addEventListener("input", searchProducts);
searchBtn.addEventListener("click", searchProducts);
    