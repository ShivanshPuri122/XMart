const cartItemsContainer = document.querySelector(".cart-items");
const checkoutBtn = document.querySelector(".btn-checkout");
const couponInput = document.querySelector(".coupon-wrap input");
const couponBtn = document.querySelector(".btn-coupon");
const cartHeaderCount = document.querySelector(".page-header p");
const subtotalEl = document.querySelector(".summary-rows .summary-row:first-child span:last-child");
const totalEl = document.querySelector(".summary-total span:last-child");
const discountEl = document.querySelector(".discount-amount");
const orderSummary = document.querySelector(".order-summary");

let discount = 0;

/* ================================
   LOAD CART
================================ */

function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty.</p>
                <a href="./products.html" class="btn-shop-now">
                    Start Shopping
                </a>
            </div>
        `;
        cartHeaderCount.textContent = "0 items in your cart";
        orderSummary.style.display = "none";
        // ↑ hide order summary when empty
        return;
    }

    orderSummary.style.display = "block";
    // ↑ show when items exist
    cartHeaderCount.textContent = `${cart.length} items in your cart`;
    renderCartItems(cart);
    updateTotals(cart);
}

loadCart();

/* ================================
   RENDER CART ITEMS
================================ */
function renderCartItems(cart) {
    const cartTableHeader = `
        <div class="cart-table-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
        </div>
    `;

    const cartItemsHTML = cart.map(function(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-product">
                    <img src="${item.image}" alt="${item.name}" />
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <a href="./product-detail.html?id=${item.id}"
                           class="cart-item-link">View Product</a>
                    </div>
                </div>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
                <div class="quantity-control">
                    <button class="qty-btn qty-minus">−</button>
                    <input type="number"
                           value="${item.quantity}"
                           min="1" max="10" readonly />
                    <button class="qty-btn qty-plus">+</button>
                </div>
                <p class="cart-item-total">
                    ${formatPrice(item.price * item.quantity)}
                </p>
                <button class="btn-remove">✕</button>
            </div>
        `;
    }).join("");

    const cartActionsHTML = `
        <div class="cart-actions">
            <a href="./products.html" class="btn-continue">← Continue Shopping</a>
            <button class="btn-clear">Clear Cart</button>
        </div>
    `;

    cartItemsContainer.innerHTML = cartTableHeader + cartItemsHTML + cartActionsHTML;
}

/* ================================
   CART ITEM CLICKS
================================ */
cartItemsContainer.addEventListener("click", function(event) {
    const cartItem = event.target.closest(".cart-item");
    if (!cartItem) return;

    const productId = Number(cartItem.dataset.id);

    if (event.target.classList.contains("btn-remove")) {
        removeFromCart(productId);
    }
    if (event.target.classList.contains("qty-minus")) {
        updateQuantity(productId, -1);
    }
    if (event.target.classList.contains("qty-plus")) {
        updateQuantity(productId, 1);
    }

    // clear cart button
    if (event.target.classList.contains("btn-clear")) {
        localStorage.removeItem("cart");
        loadCart();
        updateCartCount();
    }
});

/* ================================
   REMOVE FROM CART
================================ */
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const filtered = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(filtered));
    loadCart();
    updateCartCount();
}

/* ================================
   UPDATE QUANTITY
================================ */
function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = cart.find(function(item) {
        return item.id === productId;
    });

    if (!item) return;

    item.quantity += change;

    if (item.quantity < 1) {
        removeFromCart(productId);
        return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

/* ================================
   UPDATE TOTALS
================================ */
function updateTotals(cart) {
    const subtotal = cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);

    const delivery = subtotal > 499 ? 0 : 89;

    const total = subtotal + delivery - discount;

    document.querySelector(".summary-rows .summary-row:first-child span:first-child").textContent
        = `Subtotal (${cart.length} items)`;

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(total);
}

/* ================================
   CHECKOUT
================================ */
checkoutBtn.addEventListener("click", function() {
    window.location.href = "./checkout.html";
});
