const userController = require('./../controllers/user');
const projectController = require('./../controllers/project');
const customerController = require('./../controllers/customer');
const teamController = require('./../controllers/team');
const taskController = require('./../controllers/task');
const rateController = require('./../controllers/rate');
const occupationController = require('./../controllers/occupation');


module.exports = (app) => {



    /* PROJECTS */

    /* create */
    app.get('/project/create', projectController.createGet);
    app.post('/project/create', projectController.createPost);

    /* details */
    app.get('/project/details/:id', projectController.projectDetails);

    /* list */
    app.get('/project/list', projectController.mainGet);

    /* cancel */
    app.post('/project/cancel/:id', projectController.projectCancel);

    /* add expenses */
    app.get('/project/expenses/:id', projectController.expensesGet);
    app.post('/project/expenses/create/:id', projectController.expensesCreate);

    /* discard project */
    app.get('/project/discard', projectController.projectDiscard);



    /* USERS */

    /* login */
    app.get('/', userController.loginGet);
    app.post('/', userController.loginPost);

    /* logout */
    app.get('/user/logout', userController.logout);

    /* register */
    app.post('/user/register', userController.registerPost);

    /* list */
    app.get('/userViews/list', userController.usersGet);

    /* own profile */
    app.get('/userViews/profile', userController.profileGet);

    /* details */
    app.get('/userViews/details/:id', userController.userDetailsGet);

    /* upload picture */
    app.post('/picture/upload', userController.pictureUpload);

    /* edit User */
    app.post('/user/edit', userController.editUserData);


    /* RATES */

    /* list */
    app.get('/rate/list', rateController.ratesGet);

    /* edit */
    app.post('/rate/edit', rateController.rateEdit);



    /* CUSTOMERS */

    /* create */
    app.get('/customer/create', customerController.customerCreateGet);
    app.post('/customer/create', customerController.customerCreatePost);

    /*list*/
    app.get('/customer/list', customerController.allCustomersGet);

    /* details*/
    app.get('/customer/details/:id', customerController.customerDetailsGet);

    /* edit */
    app.get('/customer/edit/:id', customerController.customerEditGet);
    app.post('/customer/edit/:id', customerController.customerEditPost);



    /* TEAMS */

    /* create */
    app.get('/team/create', teamController.teamCreateGet);
    app.post('/team/create', teamController.teamCreatePost);

    /* create new*/
    app.post('/team/create/createNew', teamController.teamCreateNewPost);

    /* list */
    app.get('/team/list', teamController.allTeamsGet);

    /* details*/
    app.get('/team/details/:id',teamController.teamDetailsGet);

    /* edit */
    app.get('/team/edit/:id', teamController.teamEditGet);
    app.post('/team/edit/:id', teamController.teamEditPost);

    
    
    /* TASKS */

    /* create */
    app.post('/task/create', taskController.taskCreatePost);

    /* details*/
    app.get('/task/details/:id', taskController.taskDetailsGet);

    /* edit */
    app.post('/task/details/:id', taskController.taskDetailsPost);

    /* complete */
    app.post('/task/complete/:id', taskController.taskCompletePost);



    /* OCCUPATIONS */

    /* create */
    app.get('/occupation/create', occupationController.occupationCreateGet);
    app.post('/occupation/create', occupationController.occupationCreatePost);

    /* list */
    app.get('/occupation/list', occupationController.occupationsGet);

    /* edit */
    app.post('/occupation/edit/:id', occupationController.occupationEditPost);
};

