const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const projectController = require('./../controllers/project');
const userViewsController = require('./../controllers/userViews');

module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/', userController.loginGet);
    app.post('/', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/project/create', projectController.createGet)
    app.post('/project/create', projectController.createPost)

    app.get('/userViews/user', userViewsController.mainGet)


};

