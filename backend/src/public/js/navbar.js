let apiUrl = '';
document.addEventListener('DOMContentLoaded', function() {
// Obtener la configuración del servidor y luego ejecutar las funciones necesarias
fetch('/api/config')
    .then(response => response.json())
    .then(config => {
        apiUrl = `http://localhost:${config.apiUrl}`;
    })
    .catch(error => {
        console.error('Error al obtener la configuración del servidor:', error);
    });

// Fetch user data and render the navbar
fetch(`${apiUrl}/api/session/current`).then(response => response.json()).then(user => {
    renderNavbar(user);
  });

function renderNavbar(user) {
    const navbar = document.getElementById('navbar');
    navbar.innerHTML = `
        <div class="container mx-auto flex justify-between bg-gray-800 p-4 text-white">
            <div>
                <h1 class="text-2xl">Bienvenida, ${user.first_name} ${user.last_name}!</h1>
                <p><strong>Mail:</strong> ${user.email}</p>
                <p><strong>Rol:</strong> ${user.role}</p>
                <p><strong>Cart:</strong> ${user.cart}</p>
                <p><strong>Última conexión:</strong> ${new Date(user.last_connection).toLocaleString()}</p>
            </div>
            <div>
                <a href="/auth/logout" class="ml-4 p-2 bg-red-600 rounded text-white">Logout</a>
                <a href="/profile-view" class="ml-4 p-2 bg-green-600 rounded text-white">Profile</a>
                <a href="/products" class="ml-4 p-2 bg-violet-950 rounded text-white">HOME</a>
                ${user.role === 'admin' || user.role === 'premium' ? `<a href="/admin-view" class="ml-4 p-2 bg-yellow-600 rounded text-white">Admin Productos</a>` : ''}
                ${user.role === 'admin' ? `<a href="/admin/users" class="ml-4 p-2 bg-orange-600 rounded text-white">Admin Usuarios</a>` : ''}
            </div>
        </div>
    `;
}


});