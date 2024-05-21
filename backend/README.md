Para inicializar 
2.1 nodemon src/app.js --mode PROD => http://localhost:4080/loggerTest
2.2 nodemon src/app.js --mode DEV  => http://localhost:8080/loggerTest
2 - inicializar tailwindcss = npx tailwindcss -i ./src/input.css -o ./src/public/css/output.css --watch


Link Git= https://github.com/dsantucho/pf-backend-santucho



Links view:
http://localhost:8080/login-view ==> usar login te lleva a products
http://localhost:8080/register-view ==> una vez registrado te lleva a login
http://localhost:8080/api/session/current => current sessions
http://localhost:8080/api/users => lista de users

USER ADMIN = dsantucho@hotmail.com // 123456
PRIMIUM PROFILE = premium@test.com // 123456
USER PROFILE = chimu@test.com // 123456

TEST cambio de user a premium : 
curl login admin
curl --location 'http://localhost:8080/auth/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: connect.sid=s%3Ai3f6SpXJ14_xhThxWqzsAbI6eW2aHgu0.PSjLeq%2BuSvvCSCvjUcSQjXHBcb34oTwtzZzNuQlTAOY' \
--data-urlencode 'email=dsantucho@hotmail.com' \
--data-urlencode 'password=123456'

get users 
curl --location 'http://localhost:8080/api/users' \
--header 'Cookie: connect.sid=s%3Ai3f6SpXJ14_xhThxWqzsAbI6eW2aHgu0.PSjLeq%2BuSvvCSCvjUcSQjXHBcb34oTwtzZzNuQlTAOY'

put premium
curl --location --request PUT 'http://localhost:8080/api/users/premium/65e8b1969f745eaa1f07ab9b' \
--header 'Cookie: connect.sid=s%3A0PLtqxinUQWz49jNmjIibfpOaVg6mKlG.KU%2F6omneb5zNLfCWEk9ulIZmhfV2T0LjaxXIEyEE%2FCI; connect.sid=s%3Ai3f6SpXJ14_xhThxWqzsAbI6eW2aHgu0.PSjLeq%2BuSvvCSCvjUcSQjXHBcb34oTwtzZzNuQlTAOY'