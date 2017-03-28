/**
 * Created by Marian on 27.3.2017 г..
 */
const Project = require('mongoose').model('Project')

module.exports = {
    createGet: (req, res) => {
        res.render('project/create')
    },

    createPost: (req, res) => {
        let projectArgs = req.body;

        Project.create(projectArgs).then(project => {
            res.redirect('/userViews/user')
        });
    },

    projectDetails: (req, res) => {
        let id = req.params.id;

        Project.findOne({'_id' : id }).then(project => {
            res.render('project/details', project)
        });
    }
};
