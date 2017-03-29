const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const projectController = require('./../controllers/project');
const userViewsController = require('./../controllers/userViews');
const customerController = require('./../controllers/customer');

module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/', userController.loginGet);
    app.post('/', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/project/create', projectController.createGet);
    app.post('/project/create', projectController.createPost);

    app.get('/project/details/:id', projectController.projectDetails);

    app.get('/userViews/user', userViewsController.mainGet);

    app.get('/customer/create', customerController.customerCreateGet);
    app.post('/customer/create', customerController.customerCreatePost);

};

