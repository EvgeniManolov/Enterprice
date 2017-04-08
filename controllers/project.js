/**
 * Created by Marian on 27.3.2017 г..
 */
const Project = require('mongoose').model('Project');
const Customer = require('mongoose').model('Customer');
const Team = require('mongoose').model('Team');
const Role = require('mongoose').model('Role');
const User = require('mongoose').model('User');

module.exports = {

    mainGet: (req, res) => {
        Project.find({}).sort('projectDueDate').populate('projectCustomer').populate('projectTeam').then(projects => {

            /*Format projectDueDate property of project and add another property 'date' in format (dd.mm.yyyy)*/

            projects.forEach(function (project) {

                let date = project.projectDueDate.getDate();
                if (date < 10)
                    date = '0' + date;
                let month = project.projectDueDate.getMonth()+1;
                if (month < 10)
                    month = '0' + month;
                let year = project.projectDueDate.getFullYear();

                project.date = '' + date + '.' + month + '.' + year;
            });

            let user = req.user;

            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }

                res.render('./project/list', {projects: projects, isAdmin: isAdmin});
            })


        })
    },

    createGet: (req, res) => {

        Team.find({}).sort('teamName').then(teams => {

            Customer.find({}).sort('customerName').then(customers => {

                res.render('project/create', {customers: customers, teams: teams})
            });
        })
    },

    createPost: (req, res) => {
        let projectArgs = req.body;

        Team.findOne({teamName: projectArgs.projectTeam}).then(team => {
            let teamID = team.id;
            projectArgs.projectTeam = teamID;

            Customer.findOne({customerName: projectArgs.projectCustomer}).then(customer => {
                let customerId = customer.id;
                projectArgs.projectCustomer = customerId;

                Project.create(projectArgs).then(project => {

                Team.findOne({_id: project.projectTeam}).then(team => {

                    project.projectTeamName = team.teamName;

                    customer.customerProjects.push(project.id);

                    customer.save(err => {
                        if (err) {
                            res.redirect('/project/list', {error: err.message});
                        }

                        else {

                            team.projects.push(project.id);
                            team.save(err => {
                                if (err) {
                                    res.redirect('/project/list', {error: err.message});
                                }

                                else {
                                    project.dateAsNumber = Number(project.projectDueDate);

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

            let today = new Date();

            project.projectTasks.forEach(function (task) {
                if (task.taskDeadline <= today) {
                    task.isOverdue = true;

                } else {
                    task.isOverdue = false;
                }
            });


            let commits = 0;
            let actualHours = 0;

            project.projectTasks.forEach(function (task) {
                commits += task.taskComment.length;
                actualHours += task.taskActualHours;
            });

            project.commits = commits;
            project.actualHours = actualHours;
            project.totalCost = project.projectLaborCost + project.projectExpenses;

            let progress = project.projectProgress;
            progress = Math.round(progress/5)*5;
            project.projectProgressRounded = progress;

            let shortDescription = project.projectDescription;
            shortDescription = shortDescription.substr(0, 250);
            project.projectDescriptionShort = shortDescription;

            let user = req.user;
            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }
                res.render('project/details', {project: project, isAdmin: isAdmin});
            });

        });
    }
};
