const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'documents'; // Carpeta por defecto
        if (req.baseUrl.includes('users')) {
            folder = 'profiles';
        } else if (req.baseUrl.includes('product')) {
            folder = 'products';
        }
        cb(null, path.join(__dirname, `../public/uploads/${folder}`));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;