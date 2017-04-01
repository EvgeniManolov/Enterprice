/**
 * Created by Marian on 1.4.2017 г..
 */


const Task = require('mongoose').model('Task');
const Project = require('mongoose').model('Project');
const Team = require('mongoose').model('Team');

module.exports = {

    taskCreatePost: (req, res) => {

        console.log(req.body);

        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                let item = req.body[key];
                console.log(item);
            }
        }

        let taskArgsArray = req.body;

        taskArgsArray.forEach(function(taskArgs)
        {
            console.log(req.body);

            Team.findOne({teamName: taskArgs.taskTeam}).then(team => {
                taskArgs.taskTeamId = team.id;

                Project.findOne({projectName: taskArgs.taskProject}).then(project => {

                    taskArgs.taskProjectId = project._id;

                    Task.create(taskArgs).then(task => {

                        project.projectTasks.push(task.id);
                        project.save(err => {
                            if (err) {
                                res.redirect('./task/create', {error: err.message});
                            }

                            else {
                                project.projectTeamName = team.teamName;
                                res.render('./task/create', {project: project})
                            }
                        })

                    })
                })

            })
        })

    }
};