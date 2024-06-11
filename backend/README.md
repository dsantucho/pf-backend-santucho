Para inicializar 
2.1 nodemon src/app.js --mode PROD => http://localhost:4080/loggerTest
2.2 nodemon src/app.js --mode DEV  => http://localhost:8080/loggerTest
2 - inicializar tailwindcss = npx tailwindcss -i ./src/input.css -o ./src/public/css/output.css --watch


Link Git= https://github.com/dsantucho/pf-backend-santucho

SWAGGER = http://localhost:8080/apidocs/


Links view:
http://localhost:8080/login-view ==> usar login te lleva a products
http://localhost:8080/register-view ==> una vez registrado te lleva a login
http://localhost:8080/api/session/current => current sessions
http://localhost:8080/api/users => lista de users

USER ADMIN = soledadsantucho@hotmail.com // 123456
PRIMIUM PROFILE = premium@test.com // 123456
USER PROFILE = chimu@test.com // 123456

Test: 
Directorio: backend/test
correr: npm test


Multer:

curl de login user admin 
curl --location 'http://localhost:8080/auth/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: connect.sid=s%3A9GTw9sogannV486ZA3G_PANNg8SSnfe4.draIpBPkSbwqZMW9uS6cqrmMn2xB7uz1U8rIDcwnrvE' \
--data-urlencode 'email=soledadsantucho@hotmail.com' \
--data-urlencode 'password=123456'
Nota: tomar de cookie el connect.sid


- Products imagenes:
    - precondicion: realizar el login [dejo el curl]
    - editar el connect.sid [en header value Cookie]
    - el endpoint esta formado: http://localhost:8080/api/products/image/<idProducto>
    - postman: en body tenemos la key productImage y en value puedes subir una imagen

CURL:
curl --location 'http://localhost:8080/api/products/image/66636f20d618263d6eaafb21' \
--header 'Cookie: connect.sid=s%3A9GTw9sogannV486ZA3G_PANNg8SSnfe4.draIpBPkSbwqZMW9uS6cqrmMn2xB7uz1U8rIDcwnrvE; connect.sid=s%3AufMQCCO6q6x20BUYSJYj_wEK8IGRA0sR.z8ntSlDluRtLwpfqUt0eFFoAW%2BygaoOZICd%2FYY1nd5o' \
--form 'productImage=@"/Users/danielasoledadsantucho/Desktop/modified_image_1080x1080.png"'


- Profile imagenes:
    - precondicion: realizar el login [dejo el curl]
    - editar el connect.sid [en header value Cookie]
    - el endpoint esta formado: url api/user/profile/image/<id de usuario valido>
    - postman: en body tenemos la key productImage y en value puedes subir una imagen

CURL:
curl --location 'http://localhost:8080/api/users/profile/image/66636d834a76643204f42732' \
--header 'Cookie: connect.sid=s%3AqjTeGMiSX41yg-g4QxstJ0orTbd2PDPB.bF0Uqg0tDZOyabkf9rJw7GdWlD1DduimFspF%2FHFyFqA; connect.sid=s%3AqjTeGMiSX41yg-g4QxstJ0orTbd2PDPB.bF0Uqg0tDZOyabkf9rJw7GdWlD1DduimFspF%2FHFyFqA' \
--form 'profileImage=@"/Users/danielasoledadsantucho/Desktop/modified_image_1080x1080.png"'


- DOCUMENT files:
    - precondicion: relazar el login
    - editar el connect.sid [en header value Cookie]
    - endpoint se forma con: url api/document/<id user valido>
    - en postman tenemos la key documents para subir el documento [en body]

Curl ejemplo:
curl --location 'http://localhost:8080/api/documents/66636d834a76643204f42732' \
--header 'Cookie: connect.sid=s%3AqjTeGMiSX41yg-g4QxstJ0orTbd2PDPB.bF0Uqg0tDZOyabkf9rJw7GdWlD1DduimFspF%2FHFyFqA; connect.sid=s%3AqjTeGMiSX41yg-g4QxstJ0orTbd2PDPB.bF0Uqg0tDZOyabkf9rJw7GdWlD1DduimFspF%2FHFyFqA; connect.sid=s%3AqjTeGMiSX41yg-g4QxstJ0orTbd2PDPB.bF0Uqg0tDZOyabkf9rJw7GdWlD1DduimFspF%2FHFyFqA' \
--form 'documents=@"/Users/danielasoledadsantucho/Desktop/Liderazgo y Gestalt.pdf"'
