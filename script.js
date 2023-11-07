// Datos de productos en formato JSON
const productsData = [
    { id: 1, name: 'iPhone 15', price: 1199, image: 'assets/images/iphone15.webp' },
    { id: 2, name: 'iPhone 15 Pro', price: 1399, image: 'assets/images/iphone15_pro.webp' },
    { id: 3, name: 'iPhone 14', price: 1099, image: 'assets/images/iphone14.webp' },
    { id: 4, name: 'iPhone 14 Plus', price: 1199, image: 'assets/images/iphone14_plus.webp' },
    { id: 5, name: 'iPhone 14 Pro', price: 1299, image: 'assets/images/iphone14_pro.webp' },
    { id: 6, name: 'iPhone 12', price: 699, image: 'assets/images/iphone12.webp' },
    { id: 7, name: 'iPhone 12 mini', price: 699, image: 'assets/images/iphone12_mini.webp' },
    { id: 8, name: 'iPhone 12 Pro', price: 999, image: 'assets/images/iphone12_pro.webp' },
    { id: 9, name: 'MacBook Air', price: 999, image: 'assets/images/macbook_air.webp' },
    { id: 10, name: 'MacBook Pro', price: 1299, image: 'assets/images/macbook_pro.webp' },
    { id: 11, name: 'iPad Pro', price: 799, image: 'assets/images/ipad_pro.webp' },
    { id: 12, name: 'AirPods Max', price: 899, image: 'assets/images/airpods_max.webp' },
    { id: 13, name: 'AirPods Pro (2ª generación)', price: 299, image: 'assets/images/airpods_pro.webp' }
];

// Mostrar notificación
function showNotification(productName) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = `Agregaste "${productName}" al carrito!`;

    notificationContainer.appendChild(notification);

    // Desaparecer la notificación después de 2 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300); // Espera 0.3 segundos antes de eliminarla
    }, 2000);

    // Agrega la clase para mostrar la notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10); // Espera 0.01 segundos antes de mostrarla
}


// Agregar el contenedor de notificaciones al cuerpo del documento
const body = document.querySelector('body');
const notificationContainer = document.createElement('div');
notificationContainer.id = 'notification-container';
body.appendChild(notificationContainer);

// Función para mostrar productos
function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>Precio: $${product.price}</p>
            <img src="${product.image}" alt="${product.name}">
            <button onclick="addToCart(${product.id})">Agregar al Carrito</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Carga inicial de productos
displayProducts(productsData);

// Función para buscar productos
function searchProducts() {
    const searchInput = document.getElementById('search');
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm === '') {
        // Si la barra de búsqueda está vacía, muestra todos los productos
        displayProducts(productsData);
    } else {
        // Filtra los productos basados en la búsqueda
        const filteredProducts = productsData.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );

        displayProducts(filteredProducts);
    }
}


// Función para agregar productos al carrito
function addToCart(productId) {
    const product = productsData.find(item => item.id === productId);

    if (product) {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cartItems.find(item => item.id === productId);

        if (existingItem) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            existingItem.quantity++;
        } else {
            // Si es un producto nuevo en el carrito, inicializa la cantidad en 1
            product.quantity = 1;
            cartItems.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartDisplay();

        // Mostrar notificación
        showNotification(product.name);
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCartDisplay();
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartList.innerHTML = '';

    let total = 0;

    cartItems.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            ${item.name} (X${item.quantity}) - $${item.price}
            <button onclick="removeFromCart(${item.id})">Eliminar</button>
        `;
        cartList.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = `Total del carrito: $${total}`;
}

// Carga inicial de productos
displayProducts(productsData);


// Event listener para búsqueda
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', searchProducts);

// Carga inicial del carrito y actualización de carrito
updateCartDisplay();