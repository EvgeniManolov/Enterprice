/**
 * Created by Marian on 1.4.2017 г..
 */
const formatDate = require('./../utilities/formatDate');

const Task = require('mongoose').model('Task');
const Project = require('mongoose').model('Project');
const Team = require('mongoose').model('Team');
const User = require('mongoose').model('User');
const Role = require('mongoose').model('Role');

module.exports = {

    taskCreatePost: (req, res) => {

        let taskArgs = req.body;

            Team.findOne({teamName: taskArgs.taskTeamId}).then(team => {
                taskArgs.taskTeamId = team.id;

                Project.findOne({projectName: taskArgs.taskProjectId}).then(project => {

                    taskArgs.taskProjectId = project._id;

                    taskArgs.taskComment = [];

                    Task.create(taskArgs).then(task => {

                        project.projectTasks.push(task.id);
                        project.save(err => {
                            if (err) {
                                res.redirect('./task/create', {error: err.message});
                            }

                            else {

                                team.tasks.push(task.id);
                                team.save(err => {
                                    if (err) {
                                        res.redirect('./task/create', {error: err.message});
                                    }

                                    else {
                                        project.projectTeamName = team.teamName;
                                        res.render('./task/create', {project: project})
                                    }
                                })
                            }
                        })

                    })
                })

            })

    },

    taskDetailsGet: (req, res) => {
        let currentTaskID = req.params.id;

        Task.findOne({_id: currentTaskID}).populate('taskProjectId').populate('taskTeamId').then(task => {

            let commentsCount = task.taskComment.length;
            let isThereComments = false;

            if(commentsCount > 0) {
                isThereComments = true;
            }

            task.date = formatDate.formatDate(task.taskDeadline); //uses function formatDate to convert date to dd/MM/yyyy

            task.taskProjectId.date = formatDate.formatDate(task.taskProjectId.projectDueDate); //uses function formatDate to convert date to dd/MM/yyyy

            let user = req.user;
            let isAdmin = true;

            Role.findOne({name: 'Admin'}).then(role => {

                if(user.roles.indexOf(role._id) == -1) {
                    isAdmin = false;
                }
                res.render('./task/details', {task: task, isThereComments: isThereComments, isAdmin: isAdmin})
            });
        });
    },

    taskDetailsPost: (req, res) => {
        let currentTaskID = req.params.id;
        let currentUser = req.user.id;
        let taskArgs = req.body;
        let comment = taskArgs.comment;
        let hoursSpent = Number(taskArgs.hoursSpent);

        let currentDate = formatDate.formatDate(new Date());

        User.findOne({_id: currentUser}).then(user => {
            Task.findOne({_id: currentTaskID}).then(task => {
                Project.findOne({_id: task.taskProjectId}).then(project => {
                    let currentComment = {
                        user: user,
                        name: user.fullName,
                        comment: comment,
                        date: currentDate
                    };
                    let totalHours = task.taskActualHours;
                    totalHours += hoursSpent;
                    task.taskActualHours = totalHours;

                    let laborCost = project.projectLaborCost;
                    laborCost += user.rate * hoursSpent;
                    project.projectLaborCost = laborCost;
                    project.save();

                    task.taskComment.push(currentComment);
                    task.save(

                        res.redirect('/task/details/' + currentTaskID)
                    );
                })

            })
        })
    },

    taskCompletePost: (req, res) => {
        let taskId = req.params.id;

        Task.findOne({_id: taskId}).then(task => {
            task.taskActive = false;
            task.save();

            Project.findOne({_id: task.taskProjectId}).then(project => {
                let progress = project.projectProgress;
                progress += task.taskWeight;
                project.projectProgress = progress;

                if(project.projectProgress == 100) {
                    project.projectActive = false;

                    let today = new Date();

                    project.projectDueDate = today;
                }
                project.save();
            })
        })
    }
};