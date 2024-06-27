document.addEventListener('DOMContentLoaded', function () {
    let apiUrl = '';
    let userId = '';
    let userEmail = '';

    fetch('/api/config')
        .then(response => response.json())
        .then(config => {
            apiUrl = `http://localhost:${config.apiUrl}`;

            fetch(`${apiUrl}/api/session/current`)
                .then(response => response.json())
                .then(data => {
                    const cartId = data.cart;
                    userId = data._id; // Obtener el ID del usuario
                    userEmail = data.email; // Obtener el email del usuario
                    fetchCartProducts(cartId);
                })
                .catch(error => {
                    console.error('Error al obtener la configuración del servidor:', error);
                });
        })
        .catch(error => {
            console.error('Error al obtener la configuración del servidor:', error);
        });

    function fetchCartProducts(cartId) {
        fetch(`${apiUrl}/api/carts/${cartId}`)
            .then(response => response.json())
            .then(data => {
                render(data.products);
                renderPurchaseDetails(cartId, data.products);
                seguirComprando();
            })
            .catch(error => {
                console.error('Error al obtener productos del carrito:', error);
            });
    }

    function render(data) {
        const cartListElement = document.getElementById('cartList');

        if (data.length === 0) {
            cartListElement.innerHTML = `
                <div class="text-center">
                    <p class="text-xl font-bold">No hay productos en tu carrito</p>
                    <button onclick="window.location.href = '${apiUrl}/products'" class="my-4 py-2 px-4 rounded bg-blue-500 text-white font-bold">Explora productos</button>
                </div>`;
        } else {
            const itemsHtml = data.map(elem => {
                const totalItemPrice = (elem.product.price * elem.quantity).toFixed(2);
                return `
                    <div class="flex items-center bg-white shadow rounded-lg p-4 mb-4">
                        <img src="${elem.product.thumbnails || '/assets/default-thumbnail.jpg'}" alt="${elem.product.title}" class="w-16 h-16 object-cover rounded mr-4">
                        <div class="flex-1">
                            <h3 class="font-bold text-xl mb-2">${elem.product.title}</h3>
                            <p class="text-gray-700">
                                <strong>Precio:</strong> $${elem.product.price}<br>
                                <strong>Categoría:</strong> ${elem.product.category}<br>
                            </p>
                        </div>
                        <div class="flex items-center">
                            <input type="number" id="quantity_${elem.product._id}" min="1" max="${elem.product.stock}" value="${elem.quantity}" class="px-2 py-1 border rounded w-16 text-center mr-2">
                            <p class="text-gray-700 font-bold mx-2" id="total_${elem.product._id}">$${totalItemPrice}</p>
                            <button onclick="updateQuantity('${elem.product._id}')" class="bg-blue-500 text-white font-bold py-1 px-3 rounded mx-2">Actualizar</button>
                            <button onclick="removeFromCart('${elem.product._id}')" class="bg-red-500 text-white font-bold py-1 px-3 rounded">Eliminar</button>
                        </div>
                        <p id="error_${elem.product._id}" class="text-red-500 text-sm mt-2" style="display: none;">La cantidad deseada excede el stock disponible</p>
                    </div>
                `;
            }).join('');

            cartListElement.innerHTML = itemsHtml;
        }
    }

    async function createPaymentIntent(totalAmount) {
        const amountInCents = Math.round(totalAmount * 100); // Convertir a centavos
        const response = await fetch(`${apiUrl}/api/payments/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: amountInCents })
        });

        return await response.json();
    }

    async function handlePayment(cartId, totalAmount, stripe, elements, userId, userEmail) {
        const paymentIntent = await createPaymentIntent(totalAmount);

        const cardElement = elements.getElement('card');

        const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
                card: cardElement
            }
        });

        if (error) {
            alert('Payment failed: ' + error.message);
        } else {
            realizarCompra(cartId, totalAmount, userId, userEmail);
        }
    }


    function renderPurchaseDetails(cartId, products) {
        const totalItems = products.reduce((acc, item) => acc + item.quantity, 0);
        const totalPrice = products.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2);

        const purchaseDetailsElement = document.getElementById('purchaseDetails');
        purchaseDetailsElement.innerHTML = `
          <div class="bg-white shadow rounded-lg p-4">
            <div class="flex justify-between mb-4">
              <span>Mi Carrito:</span>
              <span>${cartId}</span>
            </div>

            <div class="flex justify-between mb-4">
              <span>Total Items:</span>
              <span>${totalItems}</span>
            </div>
            <div class="flex justify-between mb-4">
              <span>Total a Pagar:</span>
              <span>$${totalPrice}</span>
            </div>
            <form id="paymentForm">
              <div class="mb-4">
                <label for="cardNumber" class="block text-gray-700">Card number</label>
                <div id="card-element" class="w-full p-2 border rounded mb-4"></div> <!-- Aquí se monta el elemento de la tarjeta -->
              </div>
              <button type="button" id="payButton" class="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded" disabled>Pay $${totalPrice}</button>
            </form>
          </div>
        `;

        const stripe = Stripe(window.STRIPE_PUBLISHABLE_KEY);
        const elements = stripe.elements();
        const cardElement = elements.create('card'); // Crear el elemento de tarjeta
        cardElement.mount('#card-element'); // Montar el elemento de tarjeta en el div con id "card-element"

        cardElement.on('change', function (event) {
            const payButton = document.getElementById('payButton');
            if (event.complete) {
                payButton.disabled = false;
                payButton.classList.remove('bg-gray-500');
                payButton.classList.add('bg-green-500');
            } else {
                payButton.disabled = true;
                payButton.classList.remove('bg-green-500');
                payButton.classList.add('bg-gray-500');
            }
        });

        const payButton = document.getElementById('payButton');
        payButton.addEventListener('click', () => handlePayment(cartId, parseFloat(totalPrice), stripe, elements, userId, userEmail));
    }

    async function updateQuantity(productId) {
        const quantityInput = document.getElementById(`quantity_${productId}`);
        const newQuantity = parseInt(quantityInput.value);
        const errorMessage = document.getElementById(`error_${productId}`);
        const userResponse = await fetch(`${apiUrl}/api/session/current`);
        const userData = await userResponse.json();
        const cartId = userData.cart;

        try {
            const productResponse = await fetch(`${apiUrl}/api/products/${productId}`);
            const productData = await productResponse.json();

            if (newQuantity > productData.stock) {
                quantityInput.classList.add('border-red-500');
                errorMessage.style.display = 'block';
            } else {
                quantityInput.classList.remove('border-red-500');
                errorMessage.style.display = 'none';

                await fetch(`${apiUrl}/api/carts/${cartId}/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: newQuantity })
                });

                const totalItemPrice = (productData.price * newQuantity).toFixed(2);
                document.getElementById(`total_${productId}`).textContent = `$${totalItemPrice}`;

                fetchCartProducts(cartId);
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error);
        }
    }

    async function removeFromCart(productId) {
        const userResponse = await fetch(`${apiUrl}/api/session/current`);
        const userData = await userResponse.json();
        const cartId = userData.cart;

        try {
            await fetch(`${apiUrl}/api/carts/${cartId}/product/${productId}`, {
                method: 'DELETE'
            });
            fetchCartProducts(cartId);
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    }

    async function realizarCompra(cartId, totalAmount, userId, userEmail) {
        try {
            const response = await fetch(`${apiUrl}/api/carts/${cartId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    userId: userId,
                    userEmail: userEmail,
                    notes: ""
                })
            });

            if (response.ok) {
                const data = await response.json();
                mostrarMensajeCompra(data);
            } else {
                const errorData = await response.json();
                alert(`Error al realizar la compra: ${errorData.error}`);
            }
        } catch (error) {
            alert(`Error al realizar la compra: ${error.message}`);
        }
    }


    // Actualiza la función createTicket para incluir el email del usuario
    async function createTicket(cartId, totalAmount, userId, userEmail) {
        const response = await fetch(`${apiUrl}/api/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartId: cartId,
                amount: totalAmount,
                purchaser: userEmail, // Pasar el email del usuario
                userId: userId
            })
        });

        if (response.ok) {
            console.log('Ticket created successfully');
        } else {
            console.error('Error creating ticket');
        }
    }


    function mostrarMensajeCompra(data) {
        const bannerElement = document.getElementById('bannerCompra');
        bannerElement.innerHTML = '';

        if (data.message) {
            const cartListElement = document.getElementById('cartList');
            cartListElement.innerHTML = '';
            bannerElement.innerHTML = `
                <div class="bg-green-500 text-white font-bold text-center p-4 rounded mb-4">
                    <h2 class="text-2xl">${data.message}</h2>
                    <p class="text-xl">Código de compra: ${data.data.code}</p>
                    <p class="text-xl">Fecha de compra: ${data.data.purchase_datetime}</p>
                    <p class="text-xl">A nombre de: ${data.data.purchaser}</p>
                    <button onclick="window.location.href = '${apiUrl}/products'" class="my-4 py-2 px-4 rounded bg-blue-500 text-white font-bold">Explora productos</button>
                </div>
            `;
            // Ocultar la sección de detalles de la compra
            const purchaseDetailsElement = document.getElementById('detalleCompra');
            purchaseDetailsElement.style.display = 'none';
        } else if (data.error) {
            bannerElement.innerHTML = `<h2 class="text-red-500">${data.error}</h2>`;
        }
    }

    function seguirComprando() {
        bannerSeguirComprando = document.getElementById('seguirComprando');
        bannerSeguirComprando.innerHTML = '';
        bannerSeguirComprando.innerHTML = `
        <h2> Quiero seguir comprando</h2>
      <button onclick="window.location.href = '${apiUrl}/products'" class="my-4 py-2 px-4 rounded bg-blue-500 text-white font-bold">Explora productos</button>`;
    }

    window.explorarProductos = function () {
        window.location.href = `${apiUrl}/products`;
    };

    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
    window.realizarCompra = realizarCompra;
});
