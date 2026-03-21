/* ================================
   FORMAT PRICE
================================ */
function formatPrice(price) {
    return `₹${price.toLocaleString("en-IN")}`;
}

/* ================================
   GET STARS
================================ */
function getStars(rating) {
    const full = Math.floor(rating);

    const half = rating % 1 >= 0.5 ? 1 : 0;

    const empty = 5 - full - half;
    return "⭐".repeat(full) + (half ? "✨" : "") + "☆".repeat(empty);
}

/* ================================
   CREATE PRODUCT CARD
================================ */
function createProductCard(product) {
    return `
        <article class="product-card"
                 data-id="${product.id}"
                 data-name="${product.name.toLowerCase()}"
                 data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" />
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${getStars(product.rating)}</span>
                    <span class="review-count">(${product.reviews})</span>
                </div>
                <div class="product-pricing">
                    <p class="product-price">${formatPrice(product.price)}</p>
                    ${product.originalPrice !== product.price
                        ? `<p class="original-price">${formatPrice(product.originalPrice)}</p>`
                        : ""
                    }
                    ${product.badge
                        ? `<span class="product-badge">${product.badge}</span>`
                        : ""
                    }
                </div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </article>
    `;
}

/* ================================
   PRODUCT CARD CLICK
================================ */
document.addEventListener("click", function(event) {
    const card = event.target.closest(".product-card");
    if (!card) return;

    if (event.target.classList.contains("add-to-cart")) return;

    const productId = card.dataset.id;
    window.location.href = `./product-detail.html?id=${productId}`;
});

/* ================================
   ACTIVE NAV LINK
================================ */
function setActiveNav() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach(function(link) {
        const linkPath = link.getAttribute("href");
        if (currentPage.includes(linkPath.replace("./", ""))) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

setActiveNav();

/* ================================
   CART COUNT
================================ */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = document.querySelector(".cart-count");
    if (!cartCount) return;
    cartCount.textContent = cart.length;
}
updateCartCount();

/* ================================
   CAPITALIZE
================================ */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/*==============================
    Add To Cart
===============================*/    
function addToCart(product, quantity) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(function(item) {
        return item.id === product.id;
    });

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showCartFeedback(product.name);
}
//Cart Event Listener
document.addEventListener("click", function(event) {
    const card = event.target.closest(".product-card");
    if (!card) return;

    // add to cart button clicked
    if (event.target.classList.contains("add-to-cart")) {
        const productId = Number(card.dataset.id);

        // need product data — fetch it
        fetch("../data/products.json")
            .then(r => r.json())
            .then(function(products) {
                const product = products.find(p => p.id === productId);
                if (product) addToCart(product, 1);
                // add 1 item when clicked from card
            });
        return;
        // stop here — don't redirect to detail page
    }

    // card clicked but not add to cart button
    const productId = card.dataset.id;
    window.location.href = `./product-detail.html?id=${productId}`;
});
/* ================================
   CART FEEDBACK
================================ */
function showCartFeedback(productName) {
    // create toast notification
    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.textContent = `${productName} added to cart!`;
    // better than alert() ✅

    document.body.appendChild(toast);
    // add to page

    setTimeout(function() {
        toast.remove();
        // remove after 2 seconds
    }, 2000);
}