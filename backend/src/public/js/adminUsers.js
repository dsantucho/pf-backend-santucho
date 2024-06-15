document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:8080'; // Ajusta esto según tu configuración

    function fetchUsers() {
        fetch(`${apiUrl}/api/users`)
            .then(response => response.json())
            .then(data => renderUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }

    function renderUsers(users) {
        const userList = document.getElementById('userList');
        userList.innerHTML = users.map(user => `
            <div class="card m-2 p-3 border">
                <div class="card-body">
                    <h5 class="card-title">${user.first_name} ${user.last_name}</h5>
                    <p class="card-text"><strong>Email:</strong> ${user.email}</p>
                    <p class="card-text"><strong>Rol:</strong> ${user.role}</p>
                    <p class="card-text"><strong>Última conexión:</strong> ${new Date(user.last_connection).toLocaleString()}</p>
                    <button onclick="changeUserRole('${user._id}')" class="btn btn-primary">Cambiar Rol</button>
                    <button onclick="deleteUser('${user._id}')" class="btn btn-danger">Eliminar</button>
                </div>
            </div>
        `).join('');
    }

    function changeUserRole(userId) {
        fetch(`${apiUrl}/api/users/premium/${userId}`, { method: 'PUT' })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                fetchUsers(); // Refrescar la lista de usuarios después de cambiar el rol
            })
            .catch(error => console.error('Error changing user role:', error));
    }

    function deleteUser(userId) {
        fetch(`${apiUrl}/api/users/${userId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                fetchUsers(); // Refrescar la lista de usuarios después de eliminar
            })
            .catch(error => console.error('Error deleting user:', error));
    }

    fetchUsers();
});