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

        Project.create(projectArgs).then(article => {
            res.redirect('/userViews/user')
        });
    }
};
