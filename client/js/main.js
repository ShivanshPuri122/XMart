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