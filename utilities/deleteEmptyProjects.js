/**
 * Created by Marian on 21.4.2017 г..
 */

const Project = require('mongoose').model('Project');

module.exports = {
    deleteEmptyProjects: function(){
        Project.find().then(projects => {
            projects.forEach(function (project) {
                if (project.projectTasks.length == 0) {
                    project.remove();
                    console.log('Empty project ' + project.projectName + ' has been deleted!' )
                }
            })
        })
    }
};
