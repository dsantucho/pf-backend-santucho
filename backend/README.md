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

------ ENTREGA 13-06-26 ------
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
    - en postman body vas a ver:
        - documentName = tiene que ir un nombre correcto entre ['identificacion', 'comprobante_domicilio', 'estado_cuenta', 'otros'];
        - documents = subir el documento, aqui puede ser cualquiera y puede tener cualquier nombre. Lo importante es el documentName este dentro de la categoria. 

Curl ejemplo:
curl --location 'http://localhost:8080/api/documents/66636d834a76643204f42732' \
--header 'Cookie: connect.sid=s%3Ac7gelTCcdi9d5qjYG8AiIIQUmwx_PsIG.ldwBELYBxATmSaoJJCk6kPRiIpeaJSRqF7cjPw0%2BYlw; connect.sid=s%3Ac7gelTCcdi9d5qjYG8AiIIQUmwx_PsIG.ldwBELYBxATmSaoJJCk6kPRiIpeaJSRqF7cjPw0%2BYlw' \
--form 'documentName="identificacion"' \
--form 'documents=@"/Users/danielasoledadsantucho/Desktop/comprobante_domicilio.pdf"'

En Mongo se esta guardando en users>
documents
    >Object
        >name: "comprobante_domicilio"
        >reference"/Users/danielasoledadsantucho/Desktop/repos/pf-backend/backend/src/pub…"
        >_id: 666af53c3d0178ec0649f0b6"

Cambio de usuario a premium: 
1 - Test User sin documentos: 
curl --location --request PUT 'http://localhost:8080/api/users/premium/666b3cd687c6a10211d0f0c0' \
--header 'Cookie: connect.sid=s%3Ac7gelTCcdi9d5qjYG8AiIIQUmwx_PsIG.ldwBELYBxATmSaoJJCk6kPRiIpeaJSRqF7cjPw0%2BYlw; connect.sid=s%3Ac7gelTCcdi9d5qjYG8AiIIQUmwx_PsIG.ldwBELYBxATmSaoJJCk6kPRiIpeaJSRqF7cjPw0%2BYlw'

2 - User que le falta 1 documento
curl --location --request PUT 'http://localhost:8080/api/users/premium/666b3ac3634f329fbed17437' \
--header 'Cookie: connect.sid=s%3Ac7gelTCcdi9d5qjYG8AiIIQUmwx_PsIG.ldwBELYBxATmSaoJJCk6kPRiIpeaJSRqF7cjPw0%2BYlw; connect.sid=s%3Ac7gelTCcdi9d5qjYG8AiIIQUmwx_PsIG.ldwBELYBxATmSaoJJCk6kPRiIpeaJSRqF7cjPw0%2BYlw'

3 - User con todos los documentos cargados. 
curl --location --request PUT 'http://localhost:8080/api/users/premium/666b3d1887c6a10211d0f0c6' \
--header 'Cookie: connect.sid=s%3Ac7gelTCcdi9d5qjYG8AiIIQUmwx_PsIG.ldwBELYBxATmSaoJJCk6kPRiIpeaJSRqF7cjPw0%2BYlw; connect.sid=s%3Ac7gelTCcdi9d5qjYG8AiIIQUmwx_PsIG.ldwBELYBxATmSaoJJCk6kPRiIpeaJSRqF7cjPw0%2BYlw'

----- ENTREGA FINAL -----

/DELETE USER: 

curl:
curl --location --request DELETE 'http://localhost:8080/api/users' \
--header 'Cookie: connect.sid=s%3AGCYtEaN9LxjB12pbfBw1OdrF_nL-Opkp.T1LQBrCJzLIsUHYMC8xHxrtTB4EK7fff%2FVqNS9OtTqw; connect.sid=s%3AGCYtEaN9LxjB12pbfBw1OdrF_nL-Opkp.T1LQBrCJzLIsUHYMC8xHxrtTB4EK7fff%2FVqNS9OtTqw'