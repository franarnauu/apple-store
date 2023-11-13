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
        const productElement = createProductElement(product);
        productsContainer.appendChild(productElement);
    });
}

// Función para crear un elemento de producto
function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.innerHTML = `
        <h3>${product.name}</h3>
        <p>Precio: $${product.price}</p>
        <img src="${product.image}" alt="${product.name}">
        <button class="cssbuttons-io-button" onclick="addToCart(${product.id})">
            Agregar al Carrito
            <div class="icon">
                <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                    d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                    fill="currentColor"
                ></path>
                </svg>
            </div>
        </button>
    `;
    return productElement;
}

// Función para cargar los productos de forma asíncrona
async function loadProducts() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        window.productsData = data;
        displayProducts(data);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

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

// Función para mostrar notificación
function showNotification(message, isRemoval = false) {
    const notification = document.createElement('div');
    notification.classList.add('notification', isRemoval ? 'removal' : 'addition');
    notification.textContent = message;

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
        showNotification(`Agregaste "${product.name}" al carrito!`);
    }
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    updateCartDisplay();

    // Encuentra el producto eliminado por su ID
    const removedProduct = productsData.find(item => item.id === productId);

    // Mostrar notificación
    showNotification(`Eliminaste "${removedProduct.name}" del carrito`, true);
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartList.innerHTML = '';

    let total = 0;

    cartItems.forEach(item => {
        const cartItem = createCartItemElement(item);
        cartList.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = `Total del carrito: $${total}`;
}

// Función para crear un elemento de producto en el carrito
function createCartItemElement(item) {
    const cartItem = document.createElement('li');
    cartItem.classList.add('cart-item');

    const productImage = document.createElement('img');
    productImage.src = item.image;
    productImage.alt = item.name;
    cartItem.appendChild(productImage);

    const productDetails = document.createElement('div');
    productDetails.classList.add('product-details');
    productDetails.innerHTML = `
        <p>${item.name} (X${item.quantity}) - $${item.price}</p>
    `;
    cartItem.appendChild(productDetails);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Eliminar';
    removeButton.onclick = () => removeFromCart(item.id);
    cartItem.appendChild(removeButton);

    return cartItem;
}

// Event listener para búsqueda
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', searchProducts);

// Carga inicial del carrito y actualización de carrito
loadProducts();
updateCartDisplay();


