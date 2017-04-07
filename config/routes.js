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



    /* PROJECTS */

    /* create */
    app.get('/project/create', projectController.createGet);
    app.post('/project/create', projectController.createPost);

    /* details */
    app.get('/project/details/:id', projectController.projectDetails);

    /* list */
    app.get('/project/list', projectController.mainGet);



    /* USERS */

    /* login */
    app.get('/', userController.loginGet);
    app.post('/', userController.loginPost);

    /* logout */
    app.get('/user/logout', userController.logout);

    /* register */
    app.post('/user/register', userController.registerPost);

    /* list */
    app.get('/userViews/allUsers', allUsersController.usersGet);

    /* own profile */
    app.get('/userViews/userProfile', profileController.profileGet);

    /* details*/
    app.get('/userViews/userProfile/:id', allUsersController.userDetailsGet);



    /* RATES */

    /* list */
    app.get('/userViews/rates', userViewsController.ratesGet);



    /* CUSTOMERS */

    /* create */
    app.get('/customer/create', customerController.customerCreateGet);
    app.post('/customer/create', customerController.customerCreatePost);



    /* TEAMS */

    /* create */
    app.get('/team/create', teamController.teamCreateGet);
    app.post('/team/create', teamController.teamCreatePost);

    /* edit */
    app.get('/team/edit/:id', teamController.editGet);



    /* TASKS */

    /* create */
    app.post('/task/create', taskController.taskCreatePost);
	

	

	

	

};

