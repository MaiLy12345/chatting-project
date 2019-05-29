const productController = require('../controlers/product');
const productValidation = require('../validations/product') 
const validation = require('express-validation');


exports.load = function(app) {
    app.post('/api/v1/products', validation(productValidation.createProduct()), productController.create);
    app.get('/api/v1/products', productController.getAll);
    app.put('/api/v1/products/:id', validation(productValidation.updateProduct()), productController.update);
    app.delete('/api/v1/products/:id', validation(productValidation.deleteProduct()), productController.delete);
    app.get('/api/v1/products/:id', validation(productValidation.getOneProduct()), productController.getOneProduct);
}