/* ShopEasy - Beginner E-Commerce JavaScript */

/* INITIAL PRODUCTS */
let products = JSON.parse(localStorage.getItem("products"));

if (!products) {
    products = [
        {
            id: 1,
            name: "Wireless Headphones",
            price: 1499,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            description: "High quality wireless headphones."
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 2499,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            description: "Modern smartwatch with fitness tracking."
        },
        {
            id: 3,
            name: "Running Shoes",
            price: 1999,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            description: "Comfortable running shoes."
        },
        {
            id: 4,
            name: "Backpack",
            price: 999,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
            description: "Stylish backpack for college and travel."
        }
    ];

    localStorage.setItem("products", JSON.stringify(products));
}

/* REGISTER */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.find(user => user.email === email)) {
            alert("User already exists!");
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful!");
        window.location.href = "login.html";
    });
}

/* LOGIN */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            user => user.email === email && user.password === password
        );

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            alert("Login successful!");
            window.location.href = "products.html";
        } else {
            alert("Invalid email or password!");
        }
    });
}

/* DISPLAY PRODUCTS */
const productContainer = document.getElementById("productContainer");

if (productContainer) {
    products = JSON.parse(localStorage.getItem("products")) || [];
    productContainer.innerHTML = "";

    products.forEach(product => {
        productContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
                <p>${product.description}</p>
                <button onclick="viewProduct(${product.id})">
                    View Product
                </button>
            </div>
        `;
    });
}

/* VIEW PRODUCT */
function viewProduct(id) {
    localStorage.setItem("selectedProduct", id);
    window.location.href = "product.html";
}

/* PRODUCT DETAILS */
const productDetails = document.getElementById("productDetails");

if (productDetails) {
    const id = localStorage.getItem("selectedProduct");
    const product = products.find(product => product.id == id);

    if (product) {
        productDetails.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h1>${product.name}</h1>
                <h2>₹${product.price}</h2>
                <p>${product.description}</p>
                <br>
                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
    }
}

/* ADD TO CART */
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = products.find(product => product.id == id);

    if (product) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart!");
    }
}

/* DISPLAY CART */
const cartContainer = document.getElementById("cartContainer");

if (cartContainer) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML =
            "<h2 style='text-align:center'>Your cart is empty.</h2>";
    } else {
        let total = 0;
        cartContainer.innerHTML = "";

        cart.forEach((product, index) => {
            total += Number(product.price);

            cartContainer.innerHTML += `
                <div class="cart-item">
                    <div>
                        <h3>${product.name}</h3>
                        <p>₹${product.price}</p>
                    </div>
                    <button onclick="removeFromCart(${index})">
                        Remove
                    </button>
                </div>
            `;
        });

        cartContainer.innerHTML += `
            <div class="cart-total">
                <h2>Total: ₹${total}</h2>
                <button onclick="placeOrder()">
                    Place Order - Cash on Delivery
                </button>
            </div>
        `;
    }
}

/* REMOVE FROM CART */
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}

/* PLACE ORDER */
function placeOrder() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    let total = 0;

    cart.forEach(product => total += Number(product.price));

    const order = {
        id: Date.now(),
        userEmail: user.email,
        userName: user.name,
        products: cart,
        total: total,
        payment: "Cash on Delivery",
        status: "Order Placed"
    };

    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");

    alert("Order placed successfully! 🎉");
    window.location.href = "orders.html";
}

/* MY ORDERS */
const ordersContainer = document.getElementById("ordersContainer");

if (ordersContainer) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (!user) {
        ordersContainer.innerHTML =
            "<h2 style='text-align:center'>Please login to view orders.</h2>";
    } else {
        const myOrders = orders.filter(
            order => order.userEmail === user.email
        );

        if (myOrders.length === 0) {
            ordersContainer.innerHTML =
                "<h2 style='text-align:center'>No orders found.</h2>";
        } else {
            myOrders.forEach(order => {
                ordersContainer.innerHTML += `
                    <div class="order-card">
                        <h2>Order #${order.id}</h2>
                        <p>Customer: ${order.userName}</p>
                        <p>Payment: ${order.payment}</p>
                        <p>Status: ${order.status}</p>
                        <h3>Total: ₹${order.total}</h3>
                    </div>
                `;
            });
        }
    }
}

/* USER LOGOUT */
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

/* ADMIN LOGIN */
const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("adminUsername").value;
        const password = document.getElementById("adminPassword").value;

        if (username === "admin" && password === "admin123") {
            localStorage.setItem("adminLoggedIn", "true");
            window.location.href = "admin.html";
        } else {
            alert("Invalid admin credentials!");
        }
    });
}

/* ADMIN DASHBOARD */
if (document.getElementById("productCount")) {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {
        window.location.href = "admin-login.html";
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    document.getElementById("productCount").innerText = products.length;
    document.getElementById("customerCount").innerText = users.length;
    document.getElementById("orderCount").innerText = orders.length;

    const customers = document.getElementById("customers");

    users.forEach(user => {
        customers.innerHTML += `
            <div class="order-card">
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </div>
        `;
    });

    const adminOrders = document.getElementById("adminOrders");

    orders.forEach(order => {
        adminOrders.innerHTML += `
            <div class="order-card">
                <h3>Order #${order.id}</h3>
                <p>Customer: ${order.userName}</p>
                <p>Total: ₹${order.total}</p>
                <p>Payment: ${order.payment}</p>
                <p>Status: ${order.status}</p>
            </div>
        `;
    });
}

/* ADD PRODUCT */
const productForm = document.getElementById("productForm");

if (productForm) {
    productForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const products = JSON.parse(localStorage.getItem("products")) || [];

        const newProduct = {
            id: Date.now(),
            name: document.getElementById("productName").value,
            price: Number(document.getElementById("productPrice").value),
            image: document.getElementById("productImage").value,
            description: document.getElementById("productDescription").value
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        alert("Product added successfully!");
        productForm.reset();
        location.reload();
    });
}

/* ADMIN LOGOUT */
function adminLogout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "admin-login.html";
}
