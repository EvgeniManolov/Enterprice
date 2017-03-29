/**
 * Created by Marian on 27.3.2017 г..
 */

const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const Customer = mongoose.model('Customer');

module.exports = {
    mainGet: (req, res) => {
        Project.find({}).sort('projectDueDate').populate('projectCustomer').then(projects => {
            res.render('userViews/user', {projects: projects});
        })
    }
};
