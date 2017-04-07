const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const projectController = require('./../controllers/project');
const userViewsController = require('./../controllers/userViews');
const customerController = require('./../controllers/customer');
const teamController = require('./../controllers/team');
const taskController = require('./../controllers/task');
const profileController = require('./../controllers/profile');
const allUsersController = require('./../controllers/allUsers');

module.exports = (app) => {
    app.get('/', homeController.index);

    app.get('/', userController.loginGet);
    app.post('/', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.post('/user/register', userController.registerPost);

    app.get('/project/create', projectController.createGet);
    app.post('/project/create', projectController.createPost);

    app.get('/project/details/:id', projectController.projectDetails);

    app.get('/userViews/user', userViewsController.mainGet);

    app.get('/customer/create', customerController.customerCreateGet);
    app.post('/customer/create', customerController.customerCreatePost);

    app.get('/team/create', teamController.teamCreateGet);
    app.post('/team/create', teamController.teamCreatePost);
    app.get('/team/edit/:id', teamController.editGet);

    app.post('/task/create', taskController.taskCreatePost);
	
	app.get('/userViews/userProfile', profileController.profileGet);
	
	app.get('/userViews/allUsers', allUsersController.usersGet);
	
	app.get('/userViews/rates', userViewsController.ratesGet);
	
	app.get('/userViews/userProfile/:id', allUsersController.userDetailsGet);
};

