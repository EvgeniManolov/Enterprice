/**
 * Created by Marian on 27.3.2017 г..
 */
const Project = require('mongoose').model('Project')
const Customer = require('mongoose').model('Customer');
const Team = require('mongoose').model('Team');

module.exports = {
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
                            res.redirect('/userViews/user', {error: err.message});
                        }

                        else {

                            team.projects.push(project.id);
                            team.save(err => {
                                if (err) {
                                    res.redirect('/userViews/user', {error: err.message});
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

            res.render('project/details', project)
        });
    }
};
