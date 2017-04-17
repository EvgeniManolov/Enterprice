/**
 * Created by Marian on 27.3.2017 г..
 */
const Project = require('mongoose').model('Project');
const Customer = require('mongoose').model('Customer');
const Team = require('mongoose').model('Team');
const Role = require('mongoose').model('Role');
const User = require('mongoose').model('User');
const Task = require('mongoose').model('Task');

module.exports = {

    mainGet: (req, res) => {

        let userID = req.user.id;
        let selectedProjects = []; //these are the projects for a specific user

        Project.find({}).sort('projectDueDate').populate('projectCustomer').populate('projectTeam').then(projects => {

            /* filter only projects where current user is a member of the team */
            for (let i=0; i<projects.length; i++) {
                for (let j=0; j<projects[i].projectTeam.userID.length; j++) {
                    if (projects[i].projectTeam.userID[j] == userID) {
                        selectedProjects.push(projects[i]);
                    }
                }
            }
            /* end */

            /* Format data for an array of projects and also introducing projectStatus property - either canceled or completed */
            function formatData (projectsList) {
                projectsList.forEach(function (project) {

                    let date = project.projectDueDate.getDate();
                    if (date < 10)
                        date = '0' + date;
                    let month = project.projectDueDate.getMonth()+1;
                    if (month < 10)
                        month = '0' + month;
                    let year = project.projectDueDate.getFullYear();

                    project.date = '' + date + '.' + month + '.' + year;

                    let status = '';

                    if (project.projectActive == false) {
                        if (project.projectProgress < 100) {
                            status = 'Cancelled'
                        } else {
                            status = 'Completed'
                        }
                    }

                    project.projectStatus = status;
                });
            }
            /* end */

            formatData(projects);
            formatData(selectedProjects);

            /* Check if user is Admin*/
            let user = req.user;
            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }

                res.render('./project/list', {projects: projects, isAdmin: isAdmin, selectedProjects: selectedProjects});
            })


        })
    },

    createGet: (req, res) => {

        let user = req.user;
        let isAdmin = true;

        Role.findOne({name: 'Admin'}).then(role => {

            if(user.roles.indexOf(role._id) == -1) {
                isAdmin = false;
            }
            if (isAdmin) {
                Team.find({}).sort('teamName').then(teams => {

                    Customer.find({}).sort('customerName').then(customers => {

                        res.render('project/create', {customers: customers, teams: teams})
                    });
                })
            } else {
                res.render('home/index', {error: 'Access denied!'})
            }
        })
    },

    createPost: (req, res) => {
        let projectArgs = req.body;

        Team.findOne({teamName: projectArgs.projectTeam}).then(team => {
            let teamID = team.id;
            projectArgs.projectTeam = teamID; //Replace teamName with teamID which will be saved in project DB

            Customer.findOne({customerName: projectArgs.projectCustomer}).then(customer => {
                let customerId = customer.id;
                projectArgs.projectCustomer = customerId; //Replace customerName with customerID which will be saved in project DB

                Project.create(projectArgs).then(project => {

                Team.findOne({_id: project.projectTeam}).then(team => {

                    project.projectTeamName = team.teamName; //A new local temp property with teamName

                    customer.customerProjects.push(project.id); //Add current project to customer's list with projects
                    customer.save(err => {
                        if (err) {
                            res.redirect('/project/list', {error: err.message});
                        }

                        else {

                            team.projects.push(project.id); //Add current project to team's list with projects
                            team.save(err => {
                                if (err) {
                                    res.redirect('/project/list', {error: err.message});
                                }

                                else {
                                    project.dateAsNumber = Number(project.projectDueDate); //Convert projectDueDate to a number in order to check if task date is later or earlier than projectDueDate

                                    res.render('./task/create', {project: project});
                                }
                            });
                        }
                    });
                })
                });
            });
        })
    },

    projectDetails: (req, res) => {
        let id = req.params.id; //take user id, then populate 'team (as object => this.team.name)'

        Project.findOne({'_id' : id }).populate('projectTeam').populate('projectCustomer').populate('projectTasks').then(project => {

            /* Format projectDueDate dd.mm.yyyy*/
            let date = project.projectDueDate.getDate();
            if (date < 10)
                date = '0' + date;
            let month = project.projectDueDate.getMonth()+1;
            if (month < 10)
                month = '0' + month;
            let year = project.projectDueDate.getFullYear();
            
            project.date = '' + date + '.' + month + '.' + year;
            project.day = '' + date;
            project.month = '' + month;
            project.year = '' + year;

            /* Format taskDeadline date dd.mm.yyyy*/
            project.projectTasks.forEach(function (task) {
                let date = task.taskDeadline.getDate();
                if (date < 10)
                    date = '0' + date;
                let month = task.taskDeadline.getMonth()+1;
                if (month < 10)
                    month = '0' + month;
                let year = task.taskDeadline.getFullYear();

                task.date = '' + date + '.' + month + '.' + year;
                task.day = '' + date;
                task.month = '' + month;
                task.year = '' + year;
            });

            /* New temp properties for taskOverdue or not*/
            let today = new Date();
            project.projectTasks.forEach(function (task) {
                if (task.taskDeadline <= today) {
                    task.isOverdue = true;

                } else {
                    task.isOverdue = false;
                }
            });


            /* Calculate project commits and progress by looping thru all tasks in the project */
            let commits = 0;
            let actualHours = 0;

            project.projectTasks.forEach(function (task) {
                commits += task.taskComment.length;
                actualHours += task.taskActualHours;
            });

            project.commits = commits;
            project.actualHours = actualHours;

            /* Calculate rounded to 5 progress in order to pass it to circle progress bar */
            let progress = project.projectProgress;
            progress = Math.round(progress/5)*5;
            project.projectProgressRounded = progress;

            /* Extracts short description - 250 chars*/
            let shortDescription = project.projectDescription;
            shortDescription = shortDescription.substr(0, 250);
            project.projectDescriptionShort = shortDescription;

            /* Calculate labour cost planned which is derived by multiplying average rate for the team and planned working hours*/
            User.find().then(users => {

                let projectUsers = [];
                for (let i = 0; i < users.length; i++) {

                    if(users[i].team.indexOf(project.projectTeam.id) != -1) { //check if the user is part of a team to which is assigned the current project
                        projectUsers.push(users[i]);
                    }
                }

                let usersCount = projectUsers.length;

                let tempRate = 0;
                projectUsers.forEach(user => {
                    tempRate += user.rate;
                });

                let averageRate = tempRate / usersCount;

                project.labourCostPlanned = averageRate * project.projectWorkingHours;

                /* Introducing a new temp property taskCount*/
                let taskCount = project.projectTasks.length;
                project.taskCount = taskCount;

                /* Calculate project actual expenses*/
                project.actualExpenses = 0;
                for (let j=0; j < project.projectExpensesActual.length; j++) {
                    project.actualExpenses += project.projectExpensesActual[j].amount;
                }

                /* Calculate project actual total cost*/
                project.totalCost = project.projectLaborCost + project.actualExpenses;

                /* Check if user is Admin*/
                let user = req.user;
                let isAdmin = true;

                Role.findOne({name: 'Admin'}).then(role => {

                    if(user.roles.indexOf(role._id) == -1) {
                        isAdmin = false;
                    }
                    res.render('project/details', {project: project, isAdmin: isAdmin});
                });

            });
        });
    },

    projectCancel: (req, res) => {


        let user = req.user;
        let isAdmin = true;

        Role.findOne({name: 'Admin'}).then(role => {

            if(user.roles.indexOf(role._id) == -1) {
                isAdmin = false;
            }
            if (isAdmin) {
                let projectId = req.params.id;

                Project.findOne({_id: projectId}).then(project => {
                    Task.find({taskProjectId: projectId}).then(tasks => {

                        for (var i=0; i < tasks.length; i++) {
                            tasks[i].taskActive = false; // Sets all tasks part of the project inactive
                            tasks[i].save();
                        }
                    });

                    let today = new Date();
                    project.projectDueDate = today; //set projectDueDate for a cancelled project to be current date

                    project.projectActive = false; //sets project inactive
                    project.save();
                })
            } else {
                res.render('home/index', {error: 'Access denied!'})
            }
        })
    },

    expensesGet: (req, res) => {

        let projectId = req.params.id;

        Project.findOne({_id: projectId}).then(project => {

            res.render('project/expenses', {project: project})
        });

    },

    expensesCreate: (req, res) => {
        let expenseArgs = req.body;
        let projectId = req.params.id;

        let newExpense = {
            date: expenseArgs.date,
            description: expenseArgs.description,
            amount: expenseArgs.amount
        };

        Project.findOne({_id: projectId}).then(project => {

            project.projectExpensesActual.push(newExpense);
            project.save();

            res.render('project/expenses', {project: project})
        });

    }
};
