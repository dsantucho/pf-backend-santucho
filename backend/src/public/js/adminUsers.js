document.addEventListener('DOMContentLoaded', function () {
    let apiUrl = '';
  
    // Obtener la configuración del servidor y luego ejecutar las funciones necesarias
    fetch('/api/config')
      .then(response => response.json())
      .then(config => {
        apiUrl = `http://localhost:${config.apiUrl}`;
        fetchUsers();
      })
      .catch(error => {
        console.error('Error al obtener la configuración del servidor:', error);
      });
  
    function fetchUsers() {
      fetch(`${apiUrl}/api/users`)
        .then(response => response.json())
        .then(data => renderUsers(data))
        .catch(error => console.error('Error fetching users:', error));
    }
  

  });
  function renderUsers(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = users.map(user => {
      const requiredDocuments = ['identificacion', 'comprobante_domicilio', 'estado_cuenta'];
      const userDocuments = user.documents.map(doc => doc.name);
      const hasRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

      return `
        <div class="card m-2 p-3 border">
          <div class="card-body">
            <h5 class="card-title">${user.first_name} ${user.last_name}</h5>
            <p class="card-text"><strong>Email:</strong> ${user.email}</p>
            <p class="card-text"><strong>Rol:</strong> ${user.role}</p>
            <p class="card-text"><strong>Última conexión:</strong> ${new Date(user.last_connection).toLocaleString()}</p>
            <p class="card-text"><strong>Documentos:</strong> ${userDocuments.join(', ')}</p>
            <button onclick="changeUserRole('${user._id}')" class="btn btn-primary" ${!hasRequiredDocuments ? 'disabled' : ''}>Cambiar Rol</button>
            <button onclick="deleteUser('${user._id}')" class="btn btn-danger">Eliminar</button>
          </div>
        </div>
      `;
    }).join('');
  }
  function deleteUser(userId) {
    fetch(`${apiUrl}/api/users/${userId}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        fetch(`${apiUrl}/api/users`)
            .then(response => response.json())
            .then(data => renderUsers(data))
            .catch(error => console.error('Error fetching users:', error));
      })
      .catch(error => console.error('Error deleting user:', error));
  }
  function changeUserRole(userId) {
    fetch(`${apiUrl}/api/users/premium/${userId}`, { method: 'PUT' })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        fetch(`${apiUrl}/api/users`)
            .then(response => response.json())
            .then(data => renderUsers(data))
            .catch(error => console.error('Error fetching users:', error));
      })
      .catch(error => console.error('Error changing user role:', error));
  }