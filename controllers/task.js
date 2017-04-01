/**
 * Created by Marian on 1.4.2017 г..
 */


const Task = require('mongoose').model('Task');
const Project = require('mongoose').model('Project');

module.exports = {

    taskCreatePost: (req, res) => {
        let taskArgs = req.body;

        console.log(taskArgs.taskProject);

        Project.findOne({projectName: taskArgs.taskProject}).then(project => {

            console.log(project._id);
            taskArgs.taskProjectId = project._id;

            Task.create(taskArgs).then(task => {
            })
        })


    }
};