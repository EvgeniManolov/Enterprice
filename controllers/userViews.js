/**
 * Created by Marian on 27.3.2017 г..
 */

const mongoose = require('mongoose');
const Project = mongoose.model('Project');

module.exports = {
    mainGet: (req, res) => {
        Project.find({}).sort('projectDueDate').then(projects => {
            res.render('userViews/user', {projects: projects});
        })
    }
};
