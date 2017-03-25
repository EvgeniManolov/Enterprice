const homeController = require('./../controllers/home');

module.exports = (app) => {
    app.get('/', homeController.indexGet);
    app.get('/register', homeController.registerGet);
    app.get('/user', homeController.userGet);
};

