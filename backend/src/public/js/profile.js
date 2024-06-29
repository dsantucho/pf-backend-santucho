document.addEventListener('DOMContentLoaded', function () {
    let apiUrl = '';
    let userId = '';
    let userEmail = '';
    let documents = [];
    let firstName = '';
    let lastName = '';
    let age = '';
    let role = '';
    let lastConnection = '';
    let profileImage = '';

    fetch('/api/config')
        .then(response => response.json())
        .then(config => {
            apiUrl = `http://localhost:${config.apiUrl}`;

            return fetch(`${apiUrl}/api/session/current`);
        })
        .then(response => response.json())
        .then(data => {
            userId = data._id;
            userEmail = data.email;
            documents = data.documents;
            firstName = data.first_name;
            lastName = data.last_name;
            age = data.age;
            role = data.role;
            lastConnection = new Date(data.last_connection).toLocaleString();
            profileImage = data.profileImage;

            updateProfileInfo(data);
            displayDocumentInputs(documents);
        })
        .catch(error => {
            console.error('Error al obtener la configuración del servidor:', error);
        });

    function updateProfileInfo(userData) {
        document.getElementById('profilePicture').src = userData.profileImage ? `${apiUrl}${userData.profileImage}` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTko38x76BKbf_gARfDc4DuyP_Q30OnRBpT_w&s';
        document.getElementById('userName').textContent = `${userData.first_name} ${userData.last_name}`;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('fullName').value = `${userData.first_name} ${userData.last_name}`;
        document.getElementById('email').value = userData.email;
        document.getElementById('age').value = userData.age;
        document.getElementById('cart').value = userData.cart;
        document.getElementById('role').value = userData.role;
        document.getElementById('lastConnection').value = new Date(userData.last_connection).toLocaleString();
    }

    function displayDocumentInputs(userDocuments) {
        const documentInputs = document.getElementById('documentInputs');
        const documentTypes = ['identificacion', 'comprobante_domicilio', 'estado_cuenta', 'otros'];

        documentInputs.innerHTML = ''; // Clear previous document inputs

        documentTypes.forEach(type => {
            const userDocument = userDocuments.find(doc => doc.name === type); // Renombrado para evitar conflicto con document
            const documentDiv = document.createElement('div');
            documentDiv.className = 'mb-4';

            if (userDocument) {
                documentDiv.innerHTML = `
                    <label class="block text-gray-700">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
                    <p class="text-green-500 font-bold">[CARGADO]</p>
                `;
            } else {
                documentDiv.innerHTML = `
                    <label for="${type}" class="block text-gray-700">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
                    <input type="file" id="${type}" name="${type}" class="w-full p-2 border rounded mb-4">
                `;
            }

            documentInputs.appendChild(documentDiv);
        });
    }

    document.getElementById('uploadProfileImageForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        try {
            const response = await fetch(`${apiUrl}/api/users/profile/image/${userId}`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log('data:', data)
            if (data.success) {
                await fetchUserProfile(); // Refresh profile after upload
            } else {
                alert('Error uploading profile image');
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
        }
    });

    document.getElementById('uploadDocumentForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData();

        const inputs = document.querySelectorAll('#documentInputs input[type="file"]');
        inputs.forEach(input => {
            if (input.files.length > 0) {
                formData.append('documents', input.files[0]);
                formData.append('documentName', input.name); // Add document name to formData
            }
        });

        try {
            const response = await fetch(`${apiUrl}/api/documents/${userId}`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.message === 'Documentos actualizados') {
                await fetchUserProfile(); // Refresh profile after upload
            } else {
                console.error('Error uploading documents:', data.message);
            }
        } catch (error) {
            console.error('Error uploading documents:', error);
        }
    });

    async function fetchUserProfile() {
        try {
            const response = await fetch(`${apiUrl}/api/session/current`);
            const data = await response.json();
            userId = data._id;
            userEmail = data.email;
            documents = data.documents;
            firstName = data.first_name;
            lastName = data.last_name;
            age = data.age;
            role = data.role;
            lastConnection = new Date(data.last_connection).toLocaleString();
            profileImage = data.profileImage;

            updateProfileInfo(data);
            displayDocumentInputs(data.documents);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }
});